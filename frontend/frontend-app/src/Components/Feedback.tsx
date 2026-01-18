import React, { useState } from "react";
import { apiFetch } from "../utils/api";
import type RecommendationModule from "../domain/entities/recommendation.module";
import type Module from "../domain/entities/module.entity";

interface Props {
    eventId: string;
    recommendations: {
        recommendation: RecommendationModule;
        moduleDetails: Module;
    }[];
    onClose: () => void;
}

const RecommendationFeedback: React.FC<Props> = ({
    eventId,
    recommendations,
    onClose,
}) => {
    const [feedback, setFeedback] = useState<Record<string, number>>({});
    const [submitting, setSubmitting] = useState(false);

    const setModuleFeedback = (moduleId: string, value: number) => {
        setFeedback(prev => ({ ...prev, [moduleId]: value }));
    };

    const submitFeedback = async () => {
        try {
            setSubmitting(true);

            await apiFetch(`/recommendation-events/${eventId}/feedback`, {
                method: "POST",
                body: JSON.stringify({
                    items: Object.entries(feedback).map(
                        ([moduleId, value]) => ({
                            moduleId,
                            feedbackType: "RELEVANCE",
                            value,
                        })
                    ),
                }),
            });

            onClose();
        } catch (err) {
            console.error("Feedback submit failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    const allRated =
        Object.keys(feedback).length === recommendations.length;

    return (
        <>
            <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                style={{ zIndex: 1040 }}
                onClick={onClose}
            />

            <div
                className="position-fixed top-50 start-50 translate-middle"
                style={{ zIndex: 1050, width: "100%", maxWidth: 600 }}
            >
                <div className="card shadow-lg">
                    <div className="card-header bg-danger text-white">
                        <h5 className="mb-0">
                            Feedback op aanbevelingen
                        </h5>
                    </div>

                    <div className="card-body">
                        <p className="text-muted mb-3">
                            Hoe relevant waren deze modules voor jou? *1 Slecht - 5 Super goed
                        </p>

                        {recommendations.map(({ recommendation, moduleDetails }) => (
                            <div key={moduleDetails.id} className="mb-3">
                                <div className="fw-semibold">
                                    #{recommendation.rank} – {moduleDetails.name}
                                </div>

                                <div className="d-flex gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button
                                            key={n}
                                            type="button"
                                            className={`btn btn-sm ${
                                                feedback[moduleDetails.id] === n
                                                    ? "btn-primary"
                                                    : "btn-outline-primary"
                                            }`}
                                            onClick={() =>
                                                setModuleFeedback(moduleDetails.id, n)
                                            }
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card-footer d-flex justify-content-between">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Annuleren
                        </button>

                        <button
                            className="btn btn-primary"
                            disabled={!allRated || submitting}
                            onClick={submitFeedback}
                        >
                            Verstuur feedback
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecommendationFeedback;