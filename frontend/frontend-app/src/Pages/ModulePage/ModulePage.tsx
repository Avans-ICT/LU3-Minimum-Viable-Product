import { useState, useEffect } from "react";
import axios from "axios";
import "./modulepage.css";
import SingleModule from "../../Components/SingeModule/Singlemodule";
import Filters from "../../Components/FilterComponent/Filter"
import type { FilterState } from "../../Components/FilterComponent/Filter"

interface Module {
  id: number;
  name: string;
  shortdescription: string;
  description: string;
  content: string;
  studycredit: number;
  location: string;
  contact_id: number;
  level: string;
  learningoutcomes: string;
}

function ModulePage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Move filters state here (before early returns)
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        location: '',
        level: '',
        credits: 0
    });

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Module[]>('http://localhost:3000/modules/');
                setModules(response.data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    // Filter logic
    const Modulefilter = modules.filter((module) => {
        // Location filter
        if (filters.location && module.location !== filters.location) {
            return false;
        }
        
        // Level filter
        if (filters.level && module.level !== filters.level) {
            return false;
        }
        
        // Credits filter
        if (filters.credits && module.studycredit === filters.credits) {
            return false;
        }
        
        return true;
    });

    if (loading) return <div>Loading modules...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <> 
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-2">
                        {/* Pass filters and setFilters as props */}
                        <Filters filters={filters} setFilters={setFilters} />
                    </div>
                    <div className="col-md-10">
                        <h5 className="mb-3">
                            Showing {Modulefilter.length} of {modules.length} modules
                        </h5>
                        <div className="row">
                            {/* Use Modulefilter instead of modules */}
                            {Modulefilter.map((module) => (
                                <div className="col-md-4 mb-3" key={module.id}>
                                    <SingleModule
                                        name={module.name}
                                        location={module.location}
                                        studycredit={module.studycredit}
                                        level={module.level}
                                        shortdescription={module.shortdescription}
                                        id={module.id}
                                    />
                                </div>
                            ))}
                        </div>
                        {Modulefilter.length === 0 && (
                            <div className="alert alert-info">
                                No modules found matching your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModulePage;
