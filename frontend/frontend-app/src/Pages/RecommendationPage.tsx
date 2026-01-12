import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";
import { useAuth } from "../auth/AuthContext";
import ProfileForm from "../Components/Profile/ProfileForm";
import SingleModuleRecommendation from "../Components/SingeModule/Singlemodulerecommendation";
import type RecommendationModule from "../domain/entities/recommendation.module";
import type Module from "../domain/entities/module.entity";

function generateUUID(): string {
  return crypto.randomUUID();
}

function RecommendationPage() {
    const { profile, loading: authLoading } = useAuth();
    const [recommendations, setRecommendations] = useState<RecommendationModule[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [k, setK] = useState<number>(5);
    const effectRan = useRef(false);

    if (authLoading) return <div>Loading profile...</div>;
    if (!profile) return <div>Profile not found</div>;

    const hasProfile = typeof profile.interests === "string" && profile.interests.trim() !== "";

    useEffect(() => {
        if (!hasProfile || effectRan.current) return;
        effectRan.current = true;

        const fetchRecommendations = async () => {
            try {
                setLoading(true);

                const requestBody = {
                    requestId: generateUUID(),
                    sessionId: generateUUID(),
                    k: k,
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
                const eventId = postData.eventId;

                const maxAttempts = 10;
                let attempt = 0;
                let eventData: { status: string; results?: RecommendationModule[]; error_message?: string } | null = null;

                while (attempt < maxAttempts) {
                    const getRes = await apiFetch(`/recommendation-events/${eventId}`);
                    if (!getRes.ok) throw new Error("Failed to fetch recommendations.");
                    eventData = await getRes.json();

                    if (!eventData) throw new Error("AI model is still processing.");
                    if (eventData.status === "COMPLETED") break;
                    if (eventData.status === "FAILED") throw new Error(eventData.error_message ?? "AI model failed.");

                    await new Promise(res => setTimeout(res, 1000));
                    attempt++;
                }

                if (!eventData || eventData.status !== "COMPLETED" || !eventData.results || eventData.results.length === 0) {
                    throw new Error(eventData?.error_message ?? "AI model is still processing.");
                }

                const sortedRecommendations = eventData.results.sort((a, b) => a.rank - b.rank);
                setRecommendations(sortedRecommendations);

                const moduleIds = sortedRecommendations.map(r => r.module_id);
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
    }, [hasProfile, profile]);

    if (!hasProfile) {
        return (
            <div className="container mt-5">
                <h2 className="mb-4">Vertel ons iets over jezelf</h2>
                <ProfileForm />
            </div>
        );
    }

    if (loading) return <div>Loading recommendations...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    const recommendationsWithModules = recommendations.map(rec => ({
        recommendation: rec,
        moduleDetails: modules.find(m => m.id === rec.module_id),
    })).filter(r => r.moduleDetails !== undefined); // filter out missing modules

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Aanbevolen modules</h2>
            <div className="d-flex flex-column gap-3">
                {recommendationsWithModules.length > 0 ? (
                    recommendationsWithModules.map(({ recommendation, moduleDetails }) => (
                        <SingleModuleRecommendation
                            key={recommendation.module_id}
                            recommendation={recommendation}
                            moduleDetails={moduleDetails!}
                        />
                    ))
                ) : (
                    <div className="alert alert-info">Geen aanbevelingen gevonden.</div>
                )}
            </div>
        </div>
    );
}

export default RecommendationPage;