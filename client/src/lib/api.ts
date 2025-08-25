import { auth } from '$lib/firebase/client';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export async function apiFetch(path: string, init: RequestInit = {}) {
    const token = await auth.currentUser?.getIdToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}`} : {})
    };

    const res = await fetch(`${PUBLIC_API_BASE_URL}${path}`, { ...init, headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`${res.status} ${res.statusText} ${JSON.stringify(err)}`);
    }
    return res;
}