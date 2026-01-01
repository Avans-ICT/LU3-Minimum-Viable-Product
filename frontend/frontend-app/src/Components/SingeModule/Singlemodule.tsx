import React from 'react';

interface singleModuleProps {
    name: string;
    studycredit: number;
    location: string;
    level: string;
    shortdescription: string
    id: number
}

const SingleModule: React.FC<singleModuleProps> = ({ name, studycredit, location, level, shortdescription, id }) => {
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