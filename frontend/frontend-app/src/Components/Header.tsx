import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
    const { user, loading, logout } = useAuth();
    
    return (
        <header style={styles.header}>
            <h1 style={{ margin: 0 }}>Mijn App</h1>
            <nav>
                {user ? (
                    <>
                        <Link style={styles.link} to="/">Home</Link>
                        <button style={styles.link} onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link style={styles.link} to="/login">Login</Link>
                        <Link style={styles.link} to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#282c34",
        color: "white",
    },
    link: {
        color: "white",
        textDecoration: "none",
        marginLeft: "15px",
    },
};