import { getCookie } from './cookies';

export async function apiFetch(path: string, options: RequestInit = {}) {
    const csrfToken = getCookie('csrf_token');
    console.log('CSRF token:', getCookie('csrf_token'));
    // Bouw headers dynamisch
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
    }

    return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        credentials: 'include',
        headers,
        ...options,
    });
}