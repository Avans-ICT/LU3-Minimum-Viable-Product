import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SingleModule from "../Components/SingeModule/Singlemodule";
import Filters from "../Components/FilterComponent/Filter"
import type { FilterState } from "../Components/FilterComponent/Filter"
import { apiFetch } from "../utils/api";
import type Module from "../domain/entities/module.entity"

function ModulePage() {
    
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Move filters state here (before early returns)
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        location: [],
        level: [],
        credits: [],
        favorites: [],
        showFavorites: false
    });

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await apiFetch('/favorite');
                const favoriteIds: string[] = await response.json();
                setFilters(prev => ({ ...prev, favorites: favoriteIds }));
            } catch (err) {
                console.error('Failed to fetch favorites:', err);
            }
        };

        fetchFavorites();
    }, []);

    // Activate 'showFavorites' when query param is present
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const show = searchParams.get('showFavorites');
        if (show === '1') {
            setFilters(prev => ({ ...prev, showFavorites: true }));
        } else if ( show === "0") {
            setFilters(prev => ({ ...prev, showFavorites: false }));
        }

    }, [searchParams]);

    const handleToggleFavorite = async (moduleId: string) => {
        try {
            const isFav = filters.favorites.includes(moduleId);
            const method = isFav ? 'DELETE' : 'POST';

            const res = await apiFetch('/favorite', {
                method,
                body: JSON.stringify({ moduleID: moduleId }),
            });

            if (!res.ok) {
                console.error('Failed to toggle favorite');
                return;
            }

            setFilters(prev => ({
                ...prev,
                favorites: isFav
                    ? prev.favorites.filter(id => id !== moduleId)
                    : [...prev.favorites, moduleId],
            }));
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                const response = await apiFetch('/modules');
                const data: Module[] = await response.json();
                setModules(data);
                setLoading(false);
            } catch (err) {
                if (err instanceof TypeError && err.message === "Failed to fetch") {
                    setError(
                        "We kunnen op dit moment geen verbinding maken met de server. Controleer uw internetverbinding of probeer het later opnieuw."
                    );
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Er is iets misgegaan. Probeer het later opnieuw.");
                }
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    const Modulefilter = modules.filter((module) => {
        // Zoek filter
        if (filters.searchTerm && !module.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false;
        }

        // Location filter
        if (filters.location.length > 0 && !filters.location.includes(module.location)) {
            if (module.location === "Den Bosch en Tilburg" &&  (filters.location.includes("Tilburg") || filters.location.includes("Den Bosch"))) {

            } else if (module.location === "Breda en Den Bosch" &&  (filters.location.includes("Breda") || filters.location.includes("Den Bosch"))) {

            } else{
                return false; 
            }
        }

        // Level filter
        if (filters.level.length > 0 && !filters.level.includes(module.level)) {
            return false;
        }

        // Credits filter
        if (filters.credits.length > 0 && !filters.credits.includes(module.studycredit)) {
            return false;
        }

        // If 'showFavorites' is enabled, ensure module is in favorites
        if (filters.showFavorites && !filters.favorites.includes(module.id)) {
            return false;
        }

        return true;
    });

    if (loading) return <div>Modules inladen...</div>;
    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-warning" role="alert">
                <h5 className="mb-2">Modules niet beschikbaar</h5>
                <p className="mb-0">{error}</p>
            </div>
        </div>
    );

    return (
        <> 
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-2">
                        <Filters filters={filters} setFilters={setFilters} />
                    </div>
                    <div className="col-md-10">
                        <div className="mb-3 mt-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Zoeken op naam ..."
                                value={filters.searchTerm}
                                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                            />
                        </div>
                        
                        <h5 className="mb-3">
                            {Modulefilter.length} van de {modules.length} modules worden getoont
                        </h5>
                        <div className="row">
                            {Modulefilter.map((module) => (
                                <div className="col-md-4 mb-3" key={module.id}>
                                    <SingleModule
                                        name={module.name}
                                        location={module.location}
                                        studycredit={module.studycredit}
                                        level={module.level}
                                        shortdescription={module.shortdescription}
                                        description={module.description}
                                        id={module.id}
                                        content={module.content}
                                        contact_id={module.contact_id}
                                        learningoutcomes={module.learningoutcomes}
                                        popularity_score={module.popularity_score}
                                        module_tags={module.module_tags}
                                        estimated_difficulty={module.estimated_difficulty}
                                        available_spots={module.available_spots}
                                        start_date={module.start_date}
                                        isFavorite={filters.favorites.includes(module.id)}
                                        onToggleFavorite={handleToggleFavorite}
                                    />
                                </div>
                            ))}
                        </div>
                        {Modulefilter.length === 0 && (
                            <div className="alert alert-info">
                                Geen modules gevonden die voldoen aan uw eisen.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModulePage;