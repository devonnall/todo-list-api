import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '$lib/firebase/firebaseConfig';

async function fetchDataFromBackend() {
    const user = auth.currentUser;

    if (!user) {
        console.error("No user is signed in.");
        return;
    }

    try {
        const token = await user.getIdToken();

        const response = await fetch('https://localhost:3000/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }
    } catch (err) {

    }
}
