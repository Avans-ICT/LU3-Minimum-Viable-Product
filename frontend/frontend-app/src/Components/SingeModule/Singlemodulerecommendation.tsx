import React from "react";
import type RecommendationModule from "../../domain/entities/recommendation.module";
import type Module from "../../domain/entities/module.entity";

interface Props {
  recommendation: RecommendationModule;
  moduleDetails: Module;
}

const SingleModuleRecommendation: React.FC<Props> = ({ recommendation, moduleDetails }) => {
  const { rank, score, reasons } = recommendation;
  const { name, shortdescription, studycredit, location } = moduleDetails;

  return (
    <div className="card shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{studycredit} EC | {location}</h6>
        <p className="card-text flex-grow-1">{shortdescription}</p>

        {reasons && Object.keys(reasons).length > 0 && (
          <div className="mb-2 d-flex flex-wrap gap-2">
            {Object.entries(reasons).map(
              ([key, value]) =>
                value && (
                  <span key={key} className="badge bg-primary">
                    {key}: {value}
                  </span>
                )
            )}
          </div>
        )}

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark fs-6">
              Rank #{rank}
            </span>
            <small className="text-muted">Match: {(score * 100).toFixed(1)}%</small>
          </div>

          <a href={`/module/${moduleDetails.id}`} className="btn btn-sm btn-outline-primary">
            Bekijk Module
          </a>
        </div>
      </div>
    </div>
  );
};

export default SingleModuleRecommendation;