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

    useEffect(() => {
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
                        <h1 className="display-5 fw-bold mb-2">{module.name}</h1>
                        <p className="text-muted lead">{module.shortdescription}</p>
                    </div>


                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Description</h5>
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
                                        <strong>Study Credits:</strong> {module.studycredit}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Location:</strong> {module.location}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Available Spots:</strong> 
                                        <span className={"ms-2"}>
                                            {module.available_spots}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Start Date:</strong> {new Date(module.start_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Difficulty:</strong> 
                                        <span className="ms-2">{module.estimated_difficulty}/10</span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Popularity Score:</strong> {module.popularity_score}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {module.content && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Content</h5>
                                <p className="card-text">{module.content}</p>
                            </div>
                        </div>
                    )}


                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Learning Outcomes</h5>
                            <p className="card-text">{module.learningoutcomes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}