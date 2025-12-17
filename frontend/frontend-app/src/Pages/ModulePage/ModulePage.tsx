import { useState, useEffect } from "react";
import axios from "axios";
import "./modulepage.css";
import SingleModule from "../../Components/SingeModule/Singlemodule";

interface Module {
  Id: number;
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

  if (loading) return <div>Loading modules...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="modules-container">
      {modules.map((module) => (
        <SingleModule
          key={module.Id}
          name={module.name}
          location={module.location}
          studycredit={module.studycredit}
          level={module.level}
        />
      ))}
    </div>
  );
}

export default ModulePage