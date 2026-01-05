import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
    const { user, loading, logout } = useAuth();
    
    return (
        <header>
            <h1 style={{ margin: 0 }}>Mijn App</h1>
            <nav>
                {user ? (
                    <>
                        <Link to="/home">Home</Link>
                        <Link to="/allmodules">Modules</Link>
                        <Link to="/">Home</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}



// export default function Header() {
//     return (


//         <nav className="navbar navbar-expand-lg bg-body-tertiary">
//             <div className="container-fluid">
//                 <a className="navbar-brand" href="#">Navbar</a>
//                 <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
//                     <span className="navbar-toggler-icon"></span>
//                 </button>
//                 <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
//                     <div className="navbar-nav">
//                         <a className="nav-link active" aria-current="page" href="/home">Home</a>
//                         <a className="nav-link active" href="/allmodules">Modules</a>
//                         <a className="nav-link active" href="#">Favorites</a>
  
//                     </div>
//                 </div>
//             </div>
//         </nav>


//     );
// }