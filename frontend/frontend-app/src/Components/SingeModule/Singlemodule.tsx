import { Link } from "react-router-dom";
import React from 'react';
import type Module from "../../domain/entities/module.entity"

interface SingleModuleProps extends Module {
    isFavorite?: boolean;
    onToggleFavorite?: (moduleId: string) => void | Promise<void>;
}

const SingleModule: React.FC<SingleModuleProps> = ({ 
    name, 
    studycredit, 
    shortdescription, 
    id, 
    location,
    isFavorite = false,
    onToggleFavorite
}) => {
    const handleToggle = () => {
        if (onToggleFavorite) onToggleFavorite(id);
    };
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{studycredit} EC</h6>
                <p className="card-text flex-grow-1">{shortdescription}</p>
                <div className="mt-auto">
                    <span className="card-text mb-2">
                        <div className="text-muted">
                            <i className="bi bi-geo-alt"></i> {location}
                        </div>
                    </span>
                    <div className="row gx-2">
                        <div className="col-6">
                            <Link to={`/module/${id}`} className="btn bg-Blauw btn-sm w-100">
                                Bekijk Module
                            </Link>
                        </div>

                        <div className="col-6">
                            <button
                                type="button"
                                className={(isFavorite ? 'btn btn-danger ' : 'btn btn-outline-danger ') + 'btn-sm w-100'}
                                onClick={handleToggle}
                            >
                                {isFavorite ? 'Favoriet verwijderen' : 'Voeg toe aan favorieten'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleModule;