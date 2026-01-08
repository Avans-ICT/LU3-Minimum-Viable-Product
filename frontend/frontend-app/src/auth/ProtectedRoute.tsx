import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type {JSX} from "react"

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading…</div>;

    if (!user) return <Navigate to="/login" replace />;

    return children;
}