export function setCSRFToken(token: string) {
    localStorage.setItem("csrf_token", token);
}

export function getCSRFToken(): string | null {
    return localStorage.getItem("csrf_token");
}