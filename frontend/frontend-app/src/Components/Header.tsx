import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import 'bootstrap/dist/js/bootstrap.bundle.min';

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

                                    <li className="nav-item dropdown ms-2">
                                        <button
                                            className="btn btn-outline-light dropdown-toggle"
                                            type="button"
                                            id="userDropdown"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            {profile.firstName} {profile.lastName}
                                        </button>

                                        <ul
                                            className="dropdown-menu dropdown-menu-end"
                                            aria-labelledby="userDropdown"
                                        >
                                            <li>
                                                <Link className="dropdown-item" to="/profile">
                                                    Profiel bewerken
                                                </Link>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={logout}
                                                >
                                                    Uitloggen
                                                </button>
                                            </li>
                                        </ul>
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
