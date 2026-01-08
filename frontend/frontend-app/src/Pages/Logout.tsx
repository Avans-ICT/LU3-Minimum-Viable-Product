import { useState } from "react";
import { apiFetch } from "../utils/api";

function Logout() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await apiFetch("/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Logout mislukt");
            }

            const data = await response.json();
            setMessage(data.message || "Uitgelogd!");
            console.log("Logout response:", data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Onbekende fout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Logout</h1>
            <button onClick={handleLogout} disabled={loading}>
                {loading ? "Uitloggen..." : "Uitloggen"}
            </button>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Logout;