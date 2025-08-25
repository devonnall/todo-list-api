import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    })
}

export { admin };