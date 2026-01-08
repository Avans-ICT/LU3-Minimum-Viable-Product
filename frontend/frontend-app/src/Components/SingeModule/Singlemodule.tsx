import React from 'react';
import type Module from "../../domain/entities/module.entity"

const SingleModule: React.FC<Module> = ({ 
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