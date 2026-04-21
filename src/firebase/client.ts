'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './config';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const databaseId =
	process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID ||
	process.env.NEXT_PUBLIC_FIREBASE_WEBSITE_DATABASE_ID ||
	'(default)';
const firestore = getFirestore(app, databaseId);
const auth = getAuth(app);

export { app, firestore, auth };
