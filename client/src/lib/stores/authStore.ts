import { writable } from "svelte/store";
import type { User } from "firebase/auth";

interface AuthState {
    user: User | null;
    loading: boolean;
    data: object | null;
}

export const authStore = writable<AuthState>({
    user: null,
    loading: true,
    data: null,
})