import { useState } from "react";
import { apiFetch } from "../utils/api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { refreshAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Login mislukt");
            }

            const data = await response.json();
            console.log("Ingelogd:", data);
            await refreshAuth();
            navigate("/"); 
            return;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Onbekende fout")
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Inloggen</button>

            {error ? <p>{error}</p> : null}
        </form>
    );
}

export default Login;