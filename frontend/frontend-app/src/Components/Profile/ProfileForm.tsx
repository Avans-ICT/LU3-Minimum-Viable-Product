import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

function ProfileForm() {
    const { profile, refreshAuth } = useAuth();

    // initialiseren met profielwaarden of default
    const [interests, setInterests] = useState(profile?.interests?.trim() || "");
    const [location, setLocation] = useState(profile?.location || "Breda");
    const [level, setLevel] = useState(profile?.level || "NLQF5");
    const [studycredits, setStudycredits] = useState<number | "">(profile?.studycredits || 15);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false); // nieuwe state
    const navigate = useNavigate();
    const hadProfileRef = useRef(
        !!profile?.interests && profile.interests.trim() !== ""
    );

    // synchroniseren als profile later laadt
    useEffect(() => {
        setInterests(profile?.interests?.trim() || "");
        setLocation(profile?.location || "");
        setLevel(profile?.level || "");
        setStudycredits(profile?.studycredits || 0);
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false); // reset success bij nieuwe submit

        if (!interests.trim()) {
            setError("Interesses zijn verplicht");
            return;
        }

        if (interests.length > 1000) {
            setError("Interesses mogen maximaal 1000 tekens bevatten");
            return;
        }
        console.log(level)

        setLoading(true);

        try {
            const res = await apiFetch("/auth/profile", {
                method: "PUT",
                
                body: JSON.stringify({ interests, location, level, studycredits }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Opslaan mislukt");
            }

            await refreshAuth();
            setSuccess(true);

            if (!hadProfileRef.current) {
                navigate("/recommendations");
            }
        } catch (err) {
            setError("Profiel opslaan mislukt, kom later terug om het nog eens te proberen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow">
            <div className="card-body">
                <h4 className="mb-4">Vul je profiel in</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Interesses</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            required
                        />
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <label className="form-label">Locatie</label>
                            <select
                                className="form-select"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="">-</option>
                                <option value="Breda">Breda</option>
                                <option value="Den Bosch">Den Bosch</option>
                                <option value="Tilburg">Tilburg</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">NLQF Level</label>
                            <select
                                className="form-select"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                            >
                                <option value="">-</option>
                                <option value="NLQF5">NLQF5</option>
                                <option value="NLQF6">NLQF6</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Studiepunten</label>
                            <select
                                className="form-select"
                                value={studycredits}
                                onChange={(e) => setStudycredits(Number(e.target.value))}
                            >
                                <option value={0}>-</option>
                                <option value={15}>15</option>
                                <option value={30}>30</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Profiel succesvol opgeslagen!</div>}

                    <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-primary w-25" disabled={loading}>
                            {loading ? "Opslaan..." : "Opslaan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfileForm;