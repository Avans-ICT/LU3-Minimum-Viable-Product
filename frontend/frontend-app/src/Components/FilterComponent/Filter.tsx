import React from 'react';
import { Tooltip, OverlayTrigger} from "react-bootstrap";


interface FilterState {
    searchTerm: string;
    location: string[];
    level: string[];
    credits: number[];
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
            credits: []
        });
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
                <div className="d-flex align-items-center mb-2">
                <h4 className="me-2">EC</h4>
                
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip id="tooltip-right">Aantal studiepunten die te behalen zijn in de module</Tooltip>}
                >
                    <button className="btn btn-sm btn-outline-secondary">?</button>
                </OverlayTrigger>
                </div>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="ec15"
                            checked={filters.credits.includes(15)}
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
                            checked={filters.credits.includes(30)}
                            onChange={() => handleCreditsChange(30)}
                        />
                        <label className="form-check-label" htmlFor="ec30">30 EC</label>
                    </div>
                </li>
                
                <div className="d-flex align-items-center mb-2">
                <h4 className="me-2">Locatie</h4>
                
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip id="tooltip-right">Locatie van de vestiging waar de module wordt aangeboden</Tooltip>}
                >
                    <button className="btn btn-sm btn-outline-secondary">?</button>
                </OverlayTrigger>
                </div>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="locBreda"
                            checked={filters.location.includes('Breda')}
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
                            checked={filters.location.includes('Den Bosch')}
                            onChange={() => handleLocationChange('Den Bosch')}
                        />
                        <label className="form-check-label" htmlFor="locDenBosch">Den Bosch</label>
                    </div>
                </li>
                                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="locDenBosch"
                            checked={filters.location.includes('Tilburg')}
                            onChange={() => handleLocationChange('Tilburg')}
                        />
                        <label className="form-check-label" htmlFor="locTilburg">Tilburg</label>
                    </div>
                </li>
                <div className="d-flex align-items-center mb-2">
                <h4 className="me-2">Level</h4>
                
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip id="tooltip-right">Niveau van de modules, ookal bekent als NLQF5 en NLQF6</Tooltip>}
                >
                    <button className="btn btn-sm btn-outline-secondary">?</button>
                </OverlayTrigger>
                </div>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="levelNLQF5"
                            checked={filters.level.includes('NLQF5')}
                            onChange={() => handleLevelChange('NLQF5')}
                        />
                        <label className="form-check-label" htmlFor="levelNLQF5">Level 5</label>
                    </div>
                </li>
                <li>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="levelNLQF6"
                            checked={filters.level.includes('NLQF6')}
                            onChange={() => handleLevelChange('NLQF6')}
                        />
                        <label className="form-check-label" htmlFor="levelNLQF6">Level 6</label>
                    </div>
                </li>
            </ul>
        </>
    );
}

export default Filters;
export type { FilterState }