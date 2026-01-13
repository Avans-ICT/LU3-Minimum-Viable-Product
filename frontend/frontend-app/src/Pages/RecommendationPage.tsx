import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";
import { useAuth } from "../auth/AuthContext";
import ProfileForm from "../Components/Profile/ProfileForm";
import SingleModuleRecommendation from "../Components/SingeModule/Singlemodulerecommendation";
import type RecommendationModule from "../domain/entities/recommendation.module";
import type Module from "../domain/entities/module.entity";
import RecommendationFeedback from "../Components/Feedback";

function generateUUID(): string {
  return crypto.randomUUID();
}

function RecommendationPage() {
    const { profile, loading: authLoading, sessionId } = useAuth();
    const [recommendations, setRecommendations] = useState<RecommendationModule[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [eventId, setEventId] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [k] = useState<number>(5);
    const effectRan = useRef(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);

    if (authLoading) return <div>Loading profile...</div>;
    if (!profile) return <div>Profile not found</div>;

    const hasProfile = typeof profile.interests === "string" && profile.interests.trim() !== "";

    // Fetch recommendations
    useEffect(() => {
        if (!hasProfile || effectRan.current) return;
        effectRan.current = true;

        const fetchRecommendations = async () => {
            try {
                setLoading(true);

                const requestBody = {
                    requestId: generateUUID(),
                    sessionId,
                    k,
                    inputInterestsText: profile.interests,
                    constraintsLocation: profile.location ?? "",
                    constraintsLevel: profile.level ?? "",
                    constraintsStudycreditsMin: profile.studycredits ?? 0,
                    constraintsStudycreditsMax: profile.studycredits ?? 0,
                };

                const postRes = await apiFetch("/recommendation-events/request", {
                    method: "POST",
                    body: JSON.stringify(requestBody),
                });
                if (!postRes.ok) throw new Error("Failed to request recommendations.");
                const postData: { eventId: string; status: string } = await postRes.json();
                setEventId(postData.eventId);

                const feedbackRes = await apiFetch(`/recommendation-events/${postData.eventId}/feedback`);
                if (feedbackRes.ok) {
                    const feedbackData = await feedbackRes.json();
                    if (feedbackData && feedbackData.length > 0) {
                        setFeedbackSent(true);
                    }
                }

                const maxAttempts = 10;
                let attempt = 0;
                let eventData: { status: string; results?: RecommendationModule[]; error_message?: string } | null = null;

                while (attempt < maxAttempts) {
                    const getRes = await apiFetch(`/recommendation-events/${postData.eventId}`);
                    if (!getRes.ok) throw new Error("Failed to fetch recommendations.");

                    eventData = await getRes.json();

                    if (!eventData) throw new Error("AI model is still processing.");
                    if (eventData.status === "COMPLETED") break;
                    if (eventData.status === "FAILED") throw new Error(eventData.error_message ?? "AI model failed.");

                    await new Promise((res) => setTimeout(res, 1000));
                    attempt++;
                }

                if (!eventData || eventData.status !== "COMPLETED" || !eventData.results || eventData.results.length === 0) {
                    throw new Error(eventData?.error_message ?? "AI model is still processing.");
                }

                const sortedRecommendations = eventData.results.sort((a, b) => a.rank - b.rank);
                setRecommendations(sortedRecommendations);

                const moduleIds = sortedRecommendations.map((r) => r.module_id);
                const batchRes = await apiFetch("/modules/batch", {
                    method: "POST",
                    body: JSON.stringify({ ids: moduleIds }),
                });
                if (!batchRes.ok) throw new Error("Failed to fetch module details.");

                const modulesData: Module[] = await batchRes.json();
                setModules(modulesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [hasProfile, profile, k, sessionId]);

    // Fetch favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await apiFetch("/favorite");
                if (!res.ok) return;
                const favs: string[] = await res.json();
                setFavorites(favs);
            } catch (e) {
                console.error("Failed to load favorites", e);
            }
        };

        fetchFavorites();
    }, []);

    const toggleFavorite = async (moduleId: string) => {
        const isFav = favorites.includes(moduleId);
        const method = isFav ? "DELETE" : "POST";

        try {
            const res = await apiFetch("/favorite", {
                method,
                body: JSON.stringify({ moduleID: moduleId }),
            });
            if (!res.ok) return;

            setFavorites((prev) => (isFav ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
        } catch (err) {
            console.error("Toggle favorite failed", err);
        }
    };

    if (!hasProfile) {
        return (
            <div className="container mt-5">
                <h2 className="mb-4">Vertel ons iets over jezelf</h2>
                <p className="mb-0">
                    Door dit formulier in te vullen geef je het AI model gegevens om aanbevelingen op te baseren. Voor betere aanbevelingen is het handig steekwoorden te gebruiken in het profiel.
                </p>
                <p>
                    Als je geen gebruik wilt maken van de AI om je te helpen de juiste module te kiezen hoef je dit formulier niet in te vullen en kan je doorgaan naar de <a href="/allmodules">modules</a>.
                </p>
                <ProfileForm />
            </div>
        );
    }

    if (loading) return <div>Loading recommendations...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    // Type-safe mapping
    const recommendationsWithModules = recommendations
        .map((rec) => ({
            recommendation: rec,
            moduleDetails: modules.find((m) => m.id === rec.module_id),
        }))
        .filter(
            (r): r is { recommendation: RecommendationModule; moduleDetails: Module } =>
                r.moduleDetails !== undefined
        );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Aanbevolen modules</h2>

                {recommendationsWithModules.length > 0 && !feedbackSent && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowFeedback(true)}
                    >
                        Geef feedback
                    </button>
                )}
            </div>

            <div className="d-flex flex-column gap-3">
                {recommendationsWithModules.length > 0 ? (
                    recommendationsWithModules.map(({ recommendation, moduleDetails }) => (
                        <SingleModuleRecommendation
                            key={recommendation.module_id}
                            recommendation={recommendation}
                            moduleDetails={moduleDetails}
                            eventId={eventId!}
                            isFavorite={favorites.includes(moduleDetails.id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))
                ) : (
                    <div className="alert alert-info">Geen aanbevelingen gevonden.</div>
                )}
            </div>

            {showFeedback && eventId && (
                <RecommendationFeedback
                    eventId={eventId}
                    recommendations={recommendationsWithModules}
                    onClose={() => {
                        setShowFeedback(false);
                        setFeedbackSent(true);
                    }}
                />
            )}
        </div>
    );
}

export default RecommendationPage;