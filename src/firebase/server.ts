
import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize the app without explicit credentials.
// It will rely on Application Default Credentials in the environment.
let app: App;
if (!getApps().length) {
  app = initializeApp();
} else {
  app = getApp();
}

const firestore: Firestore = getFirestore(app);

export { app, firestore };
