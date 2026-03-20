export function getToken(): string | null { // Return the token from localStorage, or null if it doesn't exist
    if(typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem('token');
}

export function setToken(token: string): void { // Store the token in localStorage
    if(typeof window === 'undefined') {
        return;
    }
    localStorage.setItem('token', token);
}

export function clearToken(): void { // Remove the token from localStorage
    if(typeof window === 'undefined') {
        return;
    }
    localStorage.removeItem('token');
}