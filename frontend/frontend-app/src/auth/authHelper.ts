let globalRefreshAuth: (() => Promise<void>) | null = null;

export function setGlobalRefreshAuth(fn: () => Promise<void>) {
    globalRefreshAuth = fn;
}

export async function callGlobalRefreshAuth() {
    if (globalRefreshAuth) {
        await globalRefreshAuth();
        return true;
    }
    return false;
}