import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
    const { profile, loading, logout } = useAuth();
    
    if (!loading)
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-gray5">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        Avans KeuzeCompas
                    </Link>

                    <div className="collapse navbar-collapse show">
                        <ul className="navbar-nav ms-auto">
                            {profile ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/home">
                                            Home
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/allmodules">
                                            Modules
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/recommendations">
                                            Recommendations
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            className="btn btn-outline-light ms-2"
                                            to="/profile"
                                        >
                                            Profiel bewerken
                                        </Link>
                                    </li>
                                    
                                    <li className="nav-item">
                                        <button
                                            className="btn btn-outline-light ms-2"
                                            onClick={logout}
                                        >
                                            {profile.firstName} {profile.lastName}
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            Login
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
}
