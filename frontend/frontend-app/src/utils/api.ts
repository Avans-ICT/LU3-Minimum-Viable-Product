import { callGlobalRefreshAuth } from '../auth/authHelper';
import { getCSRFToken } from '../auth/csrf';
export async function apiFetch(path: string, options: RequestInit = {}) {
    const csrfToken = getCSRFToken();
    console.log("csrf token na opgehaald: " + csrfToken);
    // Bouw headers dynamisch
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (csrfToken) {
        console.log("csrf token voor header zetten" + csrfToken);
        headers['X-CSRF-Token'] = csrfToken;
        console.log("alle headers?" + headers);
    }

    const doFetch = async () =>
        fetch(`${import.meta.env.VITE_API_URL}${path}`, {
            credentials: 'include',
            headers,
            ...options,
        });

    let res = await doFetch();

    if (!path.endsWith("/me") && res.status === 401) {
        const refreshed = await callGlobalRefreshAuth();
        if (refreshed) {
            res = await doFetch();
        }
    }
    return res;
}