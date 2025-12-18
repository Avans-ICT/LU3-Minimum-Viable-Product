export async function apiFetch(path: string, options: RequestInit = {}) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return fetch(`${baseUrl}${path}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });
}