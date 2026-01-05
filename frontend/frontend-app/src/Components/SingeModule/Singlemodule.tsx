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

const SingleModule: React.FC<singleModuleProps> = ({ name, studycredit,shortdescription, id,}) => {
    return (
        <div className="card" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{studycredit} EC</h6>
                <p className="card-text">{shortdescription}</p>
                <a href={`/module/${id}`} className="card-link">Bekijk</a>
            </div>
        </div>
    );
};

export default SingleModule;