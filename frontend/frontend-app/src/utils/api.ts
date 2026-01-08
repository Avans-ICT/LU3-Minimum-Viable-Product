import { getCookie } from './cookies';

export async function apiFetch(path: string, options: RequestInit = {}) {
    const csrfToken = getCookie('csrf_token');
    console.log(csrfToken);
    // Bouw headers dynamisch
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (csrfToken) {
        console.log(csrfToken);
        headers['X-CSRF-Token'] = csrfToken;
        console.log(headers);
    }

    return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        credentials: 'include',
        headers,
        ...options,
    });
}