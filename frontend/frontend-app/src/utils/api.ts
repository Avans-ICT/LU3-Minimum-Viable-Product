import { callGlobalRefreshAuth } from '../auth/authHelper';
import { getCSRFToken } from '../auth/csrf';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const doFetch = async () => {
    const csrfToken = getCSRFToken();

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
  };

  let res = await doFetch();

  if (!path.endsWith("/me") && res.status === 401) {
    const refreshed = await callGlobalRefreshAuth();
    if (refreshed) {
      res = await doFetch(); 
    }
  }

  return res;
}
