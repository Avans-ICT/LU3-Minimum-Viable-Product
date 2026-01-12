import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../utils/api";
import { setCSRFToken } from "./csrf";
import type Profile from "../domain/entities/profile";
import { setGlobalRefreshAuth } from "./authHelper";

type AuthState = {
  profile: Profile | null;      
  loading: boolean;      
};

type AuthContextType = {
  profile: Profile | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({ profile: null, loading: true });

    // Functie om auth status bij te werken via backend
    const refreshAuth = async () => {
        try {
            let res = await apiFetch("/auth/me", { method: "GET" });
            if (res.status === 401) {
                const refreshRes = await apiFetch("/auth/refresh", { method: "POST" });
                if (!refreshRes.ok) {
                    setState({ profile: null, loading: false });
                    return;
                }
                const refreshData = await refreshRes.json();
                setCSRFToken(refreshData.csrfToken);
                res = await apiFetch("/auth/me");
            }
            
            if (!res.ok) {
                setState({ profile: null, loading: false });
                return;
            }

            const profile = await res.json();
            console.log(profile)
            setState({ profile, loading: false });
        } catch (err) {
            setState({ profile: null, loading: false });
        }
    };

    // Functie om uit te loggen
    const logout = async () => {
        try {
            await apiFetch("/auth/logout", { method: "POST" });
        } finally {
            setState({ profile: null, loading: false });
        }
    };

    // Initial check bij app start
    useEffect(() => {
        setGlobalRefreshAuth(refreshAuth);
        refreshAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ profile: state.profile, loading: state.loading, refreshAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}