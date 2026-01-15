import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Header() {
    const { profile, loading, logout } = useAuth();
    const location = useLocation();

    const navClass = (path: string, favValue?: string) => {
        let active = false;
        if (path.startsWith('/allmodules')) {
            if (!location.pathname.startsWith('/allmodules')) {
                active = false;
            } else {
                const params = new URLSearchParams(location.search);
                const val = params.get('showFavorites');
                if (favValue !== undefined) {
                    active = val === favValue;
                } else {
                    active = val === null || val === '0';
                }
            }
        } else {
            active = location.pathname === path;
        }

        return 'nav-link' + (active ? ' bg-white rounded text-dark' : '');
    }
    
    if (!loading)
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-gray5">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        Avans Keuzekompas
                    </Link>

                    <div className="collapse navbar-collapse show">
                        <ul className="navbar-nav ms-auto">
                            {profile ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink className={() => navClass('/home')} to="/home">
                                            Home
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink className={() => navClass('/allmodules','0')} to="/allmodules?showFavorites=0">
                                            Modules
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink className={() => navClass('/allmodules','1')} to="/allmodules?showFavorites=1">
                                            Favorieten
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink className={() => navClass('/recommendations')} to="/recommendations">
                                            Suggesties
                                        </NavLink>
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
                                                <NavLink className={() => 'dropdown-item text-dark'} to="/profile">
                                                    {(!profile.interests || profile.interests === "")
                                                        ? "Profiel maken"
                                                        : "Profiel bewerken"}
                                                </NavLink>
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
                                        <NavLink className={() => navClass('/login')} to="/login">
                                            Login
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink className={() => navClass('/register')} to="/register">
                                            Register
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
}
