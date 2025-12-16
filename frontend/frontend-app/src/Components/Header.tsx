import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={styles.header}>
      <h1 style={{ margin: 0 }}>Mijn App</h1>
      <nav>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/login">Login</Link>
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