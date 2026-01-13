import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiFetch } from "../utils/api";
import type Module from "../domain/entities/module.entity"


export default function ModulePage() {
    const { id } = useParams<{ id: string }>();
    const [module, setModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [toggling, setToggling] = useState<boolean>(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await apiFetch('/favorite');
                if (!res.ok) return;
                const favs: string[] = await res.json();
                setFavorites(favs);
            } catch (e) {
                console.error('Failed to load favorites', e);
            }
        };

        fetchFavorites();

        const fetchModule = async () => {
            try {
                setLoading(true);
                setError(null);


                const response = await apiFetch(`/modules/${id}`);

                if (!response.ok) {
                    throw new Error('Module not found');
                }

                const data: Module = await response.json();
                setModule(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchModule();
        }
    }, [id]);

    const toggleFavorite = async (moduleId: string) => {
        if (toggling) return;
        setToggling(true);
        const isFav = favorites.includes(moduleId);
        const method = isFav ? 'DELETE' : 'POST';

        try {
            const res = await apiFetch('/favorite', {
                method,
                body: JSON.stringify({ moduleID: moduleId }),
            });

            if (!res.ok) return;

            setFavorites(prev =>
                isFav ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
            );
        } catch (err) {
            console.error('Toggle favorite failed', err);
        } finally {
            setToggling(false);
        }
    };

    if (loading) {
        return (
            <div className="container min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="fs-5">Loading module...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container min-vh-100 d-flex align-items-center justify-content-center">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="container min-vh-100 d-flex align-items-center justify-content-center">
                <div className="alert alert-warning" role="alert">
          Module not found
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-10 col-xl-8 mx-auto">

                    <div className="mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h1 className="display-5 fw-bold mb-0">{module.name}</h1>
                            <button
                                className={favorites.includes(module.id) ? 'btn btn-danger btn-sm' : 'btn btn-outline-danger btn-sm'}
                                onClick={() => toggleFavorite(module.id)}
                                disabled={toggling}
                            >
                                {favorites.includes(module.id) ? 'Favoriet' : 'Voeg toe aan favorieten'}
                            </button>
                        </div>
                        <p className="text-muted lead">{module.shortdescription}</p>
                    </div>


                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Beschrijving</h5>
                            <p className="card-text">{module.description}</p>
                        </div>
                    </div>


                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Module Details</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Level:</strong> 
                                        <span className="badge bg-primary ms-2">{module.level}</span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Studie Punten:</strong> {module.studycredit}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Locatie:</strong> {module.location}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Beschikbare Plekken:</strong> 
                                        <span className={"ms-2"}>
                                            {module.available_spots}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Start Datum:</strong> {new Date(module.start_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Moeilijkheid:</strong> 
                                        <span className="ms-2">{module.estimated_difficulty}/10</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {module.content && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Inhoud</h5>
                                <p className="card-text">{module.content}</p>
                            </div>
                        </div>
                    )}


                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Leeruitkomsten</h5>
                            <p className="card-text">{module.learningoutcomes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}