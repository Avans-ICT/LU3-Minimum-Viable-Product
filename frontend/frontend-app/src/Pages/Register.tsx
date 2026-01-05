import { useState } from "react";
import { apiFetch } from "../utils/api"; // fetch helper met credentials
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { refreshAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError("Wachtwoorden komen niet overeen");
            return;
        }
        
        const validationError = validateCredentials(firstName, lastName, email, password);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const response = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Registratie mislukt");
            }

            const data = await response.json();
            console.log("Gebruiker geregistreerd:", data);
            setSuccess(true);
            await refreshAuth();
            navigate("/");
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "Onbekende fout");
        } finally {
            setLoading(false);
        }
    };

    function validateCredentials(firstName: string, lastName: string, email: string, password: string): string | null {
        if (!firstName.trim()) {
            return 'Email is verplicht';
        }

        if (!lastName.trim()) {
            return 'Email is verplicht';
        }
        
        if (!email.trim()) {
            return 'Email is verplicht';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Ongeldig emailadres';
        }

        if (!password) {
            return 'Wachtwoord is verplicht';
        }

        if (password.length < 8) {
            return 'Wachtwoord moet minimaal 8 tekens bevatten';
        }

        return null;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>

            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
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
            <input
                type="password"
                placeholder="Herhaal Wachtwoord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? "Registreren..." : "Registreren"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Registratie succesvol!</p>}
        </form>
    );
}

export default Register;