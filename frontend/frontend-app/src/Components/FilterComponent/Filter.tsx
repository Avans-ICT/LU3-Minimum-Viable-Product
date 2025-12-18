import React from 'react';

interface FilterState {
    searchTerm: string;
    location: string;
    level: string;
    credits: number;
}

interface FiltersProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

function Filters({ filters, setFilters }: FiltersProps) {
    
    const handleLocationChange = (location: string) => {
        setFilters(prev => ({
            ...prev,
            location: prev.location === location ? '' : location
        }));
    };

    const handleLevelChange = (level: string) => {
        setFilters(prev => ({
            ...prev,
            level: prev.level === level ? '' : level
        }));
    };

    const handleCreditsChange = (credits: number) => {
        setFilters(prev => ({
            ...prev,
            credits: prev.credits === credits ? 0 : credits
        }));
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            location: '',
            level: '',
            credits: 0
        });
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Filters</h1>
                <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={clearFilters}
                >
                    Clear
                </button>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <h4>EC</h4>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="ec15"
                            checked={filters.credits === 15}
                            onChange={() => handleCreditsChange(15)}
                        />
                        <label className="form-check-label" htmlFor="ec15">15 EC</label>
                    </div>
                </li>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="ec30"
                            checked={filters.credits === 30}
                            onChange={() => handleCreditsChange(30)}
                        />
                        <label className="form-check-label" htmlFor="ec30">30 EC</label>
                    </div>
                </li>
                
                <h4 className="mt-3">Locatie</h4>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="locBreda"
                            checked={filters.location === 'Breda'}
                            onChange={() => handleLocationChange('Breda')}
                        />
                        <label className="form-check-label" htmlFor="locBreda">Breda</label>
                    </div>
                </li>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="locDenBosch"
                            checked={filters.location === 'Den Bosch'}
                            onChange={() => handleLocationChange('Den Bosch')}
                        />
                        <label className="form-check-label" htmlFor="locDenBosch">Den Bosch</label>
                    </div>
                </li>
                
                <h4 className="mt-3">Level</h4>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="levelNLQF5"
                            checked={filters.level === 'NLQF5'}
                            onChange={() => handleLevelChange('NLQF5')}
                        />
                        <label className="form-check-label" htmlFor="levelNLQF5">NLQF5</label>
                    </div>
                </li>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="levelNLQF6"
                            checked={filters.level === 'NLQF6'}
                            onChange={() => handleLevelChange('NLQF6')}
                        />
                        <label className="form-check-label" htmlFor="levelNLQF6">NLQF6</label>
                    </div>
                </li>
            </ul>
        </>
    );
}

export default Filters;
export type { FilterState }