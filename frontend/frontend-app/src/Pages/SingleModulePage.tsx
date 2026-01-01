import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Define your module type based on your backend response
interface Module {
  _id: string;
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
        
                const response = await fetch(`http://localhost:3000/modules/${id}`);
        
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading module...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Module not found</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{module.name}</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-700 mb-4">{module.description}</p>
        
                <div className="space-y-2">
                    <p><strong>ID:</strong> {module.id}</p>
                    {/* Add other module properties here */}
                </div>
            </div>
        </div>
    );
}