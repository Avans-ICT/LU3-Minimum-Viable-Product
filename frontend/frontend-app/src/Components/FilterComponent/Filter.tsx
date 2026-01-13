import React from 'react';
import { Tooltip, OverlayTrigger } from "react-bootstrap";


interface FilterState {
    searchTerm: string;
    location: string[];
    level: string[];
    credits: number[];
    favorites: string[];
    showFavorites: boolean;
}

interface FiltersProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

function Filters({ filters, setFilters }: FiltersProps) {
    
    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            location: [],
            level: [],
            credits: [],
            favorites: filters.favorites,
            showFavorites: false
        });
    };

    const toggleShowFavorites = () => {
        setFilters(prev => ({ ...prev, showFavorites: !prev.showFavorites }));
    };

    const toggleValue = <T,>(array: T[], value: T): T[] => {
        return array.includes(value)
            ? array.filter(v => v !== value)
            : [...array, value];
    };

    const handleCreditsChange = (value: number) => {
        setFilters(prev => ({
            ...prev,
            credits: toggleValue(prev.credits, value)
        }));
    };

    const handleLocationChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            location: toggleValue(prev.location, value)
        }));
    };

    const handleLevelChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            level: toggleValue(prev.level, value)
        }));
    };

    const hasActiveFilters = filters.credits.length > 0 || 
                            filters.location.length > 0 || 
                            filters.level.length > 0;

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Filters</h4>
                    <div>
                        {hasActiveFilters && (
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={clearFilters}
                            >
                                Wis alles
                            </button>
                        )}
                    </div>

                </div>
                <hr />

                <div className="mb-3 p-2">
                    <h5 className="mb-2">Favorieten</h5>
                    <button 
                        className={filters.showFavorites ? 'btn btn-success shadow' : 'btn btn-danger shadow'} 
                        onClick={toggleShowFavorites}
                    >
                        {filters.showFavorites ? '✓ Actief' : 'Toon favorieten'}
                    </button>
                </div>
                <hr />



                
                {/* EC Section */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <h5 className="mb-0 me-2">Studiepunten (EC)</h5>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id="tooltip-ec">
                                    Aantal studiepunten die te behalen zijn in de module
                                </Tooltip>
                            }
                        >
                            <button className="btn btn-sm btn-outline-secondary rounded-circle p-0" style={{ width: '24px', height: '24px' }}>
                                <small>?</small>
                            </button>
                        </OverlayTrigger>
                    </div>
                    <div className="ms-2">
                        <div className="form-check form-switch mb-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="ec15"
                                checked={filters.credits.includes(15)}
                                onChange={() => handleCreditsChange(15)}
                            />
                            <label className="form-check-label" htmlFor="ec15">15 EC</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="ec30"
                                checked={filters.credits.includes(30)}
                                onChange={() => handleCreditsChange(30)}
                            />
                            <label className="form-check-label" htmlFor="ec30">30 EC</label>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Location Section */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <h5 className="mb-0 me-2">Locatie</h5>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id="tooltip-location">
                                    Locatie van de vestiging waar de module wordt aangeboden
                                </Tooltip>
                            }
                        >
                            <button className="btn btn-sm btn-outline-secondary rounded-circle p-0" style={{ width: '24px', height: '24px' }}>
                                <small>?</small>
                            </button>
                        </OverlayTrigger>
                    </div>
                    <div className="ms-2">
                        <div className="form-check form-switch mb-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="locBreda"
                                checked={filters.location.includes('Breda')}
                                onChange={() => handleLocationChange('Breda')}
                            />
                            <label className="form-check-label" htmlFor="locBreda">Breda</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="locDenBosch"
                                checked={filters.location.includes('Den Bosch')}
                                onChange={() => handleLocationChange('Den Bosch')}
                            />
                            <label className="form-check-label" htmlFor="locDenBosch">Den Bosch</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="locTilburg"
                                checked={filters.location.includes('Tilburg')}
                                onChange={() => handleLocationChange('Tilburg')}
                            />
                            <label className="form-check-label" htmlFor="locTilburg">Tilburg</label>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Level Section */}
                <div className="mb-2">
                    <div className="d-flex align-items-center mb-3">
                        <h5 className="mb-0 me-2">Niveau</h5>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id="tooltip-level">
                                    Niveau van de modules, ook wel bekend als NLQF5 en NLQF6
                                </Tooltip>
                            }
                        >
                            <button className="btn btn-sm btn-outline-secondary rounded-circle p-0" style={{ width: '24px', height: '24px' }}>
                                <small>?</small>
                            </button>
                        </OverlayTrigger>
                    </div>
                    <div className="ms-2">
                        <div className="form-check form-switch mb-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="levelNLQF5"
                                checked={filters.level.includes('NLQF5')}
                                onChange={() => handleLevelChange('NLQF5')}
                            />
                            <label className="form-check-label" htmlFor="levelNLQF5">Niveau 5</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="levelNLQF6"
                                checked={filters.level.includes('NLQF6')}
                                onChange={() => handleLevelChange('NLQF6')}
                            />
                            <label className="form-check-label" htmlFor="levelNLQF6">Niveau 6</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filters;
export type { FilterState };