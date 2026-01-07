import React from 'react';

interface singleModuleProps {
    id: string;
    name: string;
    shortdescription: string;
    description: string;
    content: string;
    studycredit: number;
    location: string;
    contact_id: number;
    level: string;
    learningoutcomes: string;
    module_tags: string[];
    popularity_score: number;
    estimated_difficulty: number;
    available_spots: number;
    start_date: string;
}

const SingleModule: React.FC<singleModuleProps> = ({ 
    name, 
    studycredit, 
    shortdescription, 
    id, 
    location 
}) => {
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{studycredit} EC</h6>
                <p className="card-text flex-grow-1">{shortdescription}</p>
                <div className="mt-auto">
                    <p className="card-text mb-2">
                        <small className="text-muted">
                            <i className="bi bi-geo-alt"></i> {location}
                        </small>
                    </p>
                    <a href={`/module/${id}`} className="btn btn-primary btn-sm w-100">
                        Bekijk Module
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SingleModule;