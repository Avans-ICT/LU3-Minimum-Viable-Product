import { callGlobalRefreshAuth } from '../auth/authHelper';
import { getCSRFToken } from '../auth/csrf';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

  // 401 → refresh auth
  if (!path.endsWith('/me') && res.status === 401) {
    const refreshed = await callGlobalRefreshAuth();
    if (refreshed) {
      res = await doFetch();
    }
  }

  // 429 wacht 2 seconden en retry 1 keer
  if (res.status === 429) {
    await delay(2000);
    res = await doFetch();
  }

  return res;
}