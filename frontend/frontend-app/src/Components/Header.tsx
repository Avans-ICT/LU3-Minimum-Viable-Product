import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
    const { user, loading, logout } = useAuth();
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-gray5">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Avans KeuzeCompas
                </Link>

                <div className="collapse navbar-collapse show">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
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
                                    <button
                                        className="btn btn-outline-light ms-2"
                                        onClick={logout}
                                    >
                                        Logout
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
