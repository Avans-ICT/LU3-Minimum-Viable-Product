import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../utils/api";

type AuthState = {
  user: any | null;      
  loading: boolean;      
};

type AuthContextType = {
  user: any | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({ user: null, loading: true });

    // Functie om auth status bij te werken via backend
    const refreshAuth = async () => {
        try {
            let res = await apiFetch("/auth/me", { method: "GET" });

            if (res.status === 401) {
                const refreshRes = await apiFetch("/auth/refresh", { method: "POST" });

                if (!refreshRes.ok) {
                    setState({ user: null, loading: false });
                    return;
                }

                res = await apiFetch("/auth/me");
            }
            
            if (!res.ok) {
                setState({ user: null, loading: false });
                return;
            }

            const user = await res.json();
            setState({ user, loading: false });
        } catch (err) {
            setState({ user: null, loading: false });
        }
    };

    // Functie om uit te loggen
    const logout = async () => {
        try {
            await apiFetch("/auth/logout", { method: "POST" });
        } finally {
            setState({ user: null, loading: false });
        }
    };

    // Initial check bij app start
    useEffect(() => {
        refreshAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user: state.user, loading: state.loading, refreshAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}