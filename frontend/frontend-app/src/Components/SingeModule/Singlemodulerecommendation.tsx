import React from "react";
import type RecommendationModule from "../../domain/entities/recommendation.module";
import type Module from "../../domain/entities/module.entity";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

interface Props {
  recommendation: RecommendationModule;
  moduleDetails: Module;
  eventId: string;
  isFavorite: boolean;
  onToggleFavorite: (moduleId: string) => void;
}

const SingleModuleRecommendation: React.FC<Props> = ({ recommendation, moduleDetails, eventId, isFavorite, onToggleFavorite, }) => {
    const { rank, score, reasons } = recommendation;
    const { name, shortdescription, studycredit, location } = moduleDetails;
    const navigate = useNavigate();

    const handleViewModule = async () => {
        try {
            await apiFetch(`/recommendation-events/${eventId}/feedback`, {
                method: "POST",
                body: JSON.stringify({
                    items: [
                        {
                            moduleId: moduleDetails.id,
                            feedbackType: "LIKE",
                            value: 1,
                        },
                    ],
                }),
            });
        } catch (err) {
            // bewust stil falen: navigatie mag nooit blokkeren
            console.warn("Feedback submit failed", err);
        } finally {
            navigate(`/module/${moduleDetails.id}`);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{studycredit} EC | {location}</h6>
                <p className="card-text flex-grow-1">{shortdescription}</p>

                {reasons && (
                    <div className="mb-2">
                        {/* Constraints */}
                        {reasons.constraints && Object.entries(reasons.constraints)
                            .filter(([_, value]) => value)
                            .map(([key, value]) => (
                                <span key={`constraints-${key}`} className="badge bg-primary me-1 mb-1">
                                    {key}: {value}
                                </span>
                            ))}

                        {/* Content */}
                        {reasons.content && (
                            <div className="mt-2 p-2 bg-info bg-opacity-25 rounded">
                                <strong>
                                    {reasons.content.type.replace(/_/g, ' ')}
                                </strong>
                                {reasons.content.keywords && reasons.content.keywords.length > 0 && (
                                    <div className="mt-1 mb-1">
                                        <em>Keywords:</em>{" "}
                                        {reasons.content.keywords.map((kw) => (
                                            <span key={kw} className="badge bg-secondary me-1">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {reasons.content.explanation && (
                                    <div className="text-dark">{reasons.content.explanation}</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning text-dark fs-6">
                            Rank #{rank}
                        </span>
                        <small className="text-muted">
                            Match: {(score * 100).toFixed(1)}%
                        </small>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className={
                                isFavorite
                                    ? 'btn btn-danger btn-sm'
                                    : 'btn btn-outline-danger btn-sm'
                            }
                            onClick={() => onToggleFavorite(moduleDetails.id)}
                        >
                            {isFavorite ? 'Favoriet' : 'Voeg toe aan favorieten'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleViewModule}
                        >
                            Bekijk Module
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleModuleRecommendation;