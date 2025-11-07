
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import 'dotenv/config'

let app: App;
let firestore: Firestore;

if (!getApps().length) {
  const hasCredentials = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

  if (hasCredentials) {
    // Remove quotes from the key and then replace escaped newlines
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/^"|"$/g, '').replace(/\\n/g, '\n');

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey
    };
    
    app = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    // This will use Application Default Credentials
    // Useful for deployments to Google Cloud services
    console.log("Initializing Firebase Admin with Application Default Credentials");
    app = initializeApp();
  }
} else {
  app = getApp();
}

firestore = getFirestore(app);

export { app, firestore };
