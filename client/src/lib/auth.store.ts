import { writable } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase/client';

export const currentUser = writable<User | null>(null);
onAuthStateChanged(auth, (u) => currentUser.set(u));