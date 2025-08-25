import { readable } from 'svelte/store';
import { auth } from '$lib/firebase/client';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as fbSignOut,
  type User as FirebaseUser
} from 'firebase/auth';

export type PublicUser = {
  id: string;
  email: string | null;
  displayName: string | null;
};

function toPublic(u: FirebaseUser): PublicUser {
  return { id: u.uid, email: u.email, displayName: u.displayName };
}

export const user = readable<PublicUser | null>(null, (set) => {
  const unsub = onAuthStateChanged(auth, (u) => set(u ? toPublic(u) : null));
  return () => unsub();
});

export async function signUp(email: string, password: string, displayName?: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(user, { displayName });
  return toPublic(user);
}

export async function signIn(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return toPublic(user);
}

export async function signOut() {
  await fbSignOut(auth);
}

export async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
}
