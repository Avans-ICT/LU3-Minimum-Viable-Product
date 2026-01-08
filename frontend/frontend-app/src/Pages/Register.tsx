import { useState } from "react";
import { apiFetch } from "../utils/api"; // fetch helper met credentials
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { setCSRFToken } from "../auth/csrf";

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
            setCSRFToken(data.csrfToken);
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
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h1 className="card-title text-center mb-4">Register</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName" className="form-label">Voornaam</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            placeholder="Voornaam"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">Achternaam</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            placeholder="Achternaam"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Wachtwoord</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Wachtwoord"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Herhaal Wachtwoord</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        placeholder="Herhaal Wachtwoord"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        Registratie succesvol!
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Registreren...
                                        </>
                                    ) : (
                                        "Registreren"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;