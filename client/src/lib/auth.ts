import { auth } from './firebase/client';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    signOut, 
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

export async function signInGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signUpEmail(opts: { email: string; password: string; displayName?: string }) {
    const cred = await createUserWithEmailAndPassword(auth, opts.email, opts.password);
    if (opts.displayName) await updateProfile(cred.user, { displayName: opts.displayName });

    try { await sendEmailVerification(cred.user); } catch {}
    return cred.user;
}

export async function signInEmail(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

export async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
}

export async function logout() {
    await signOut(auth);
}