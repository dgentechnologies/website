
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import 'dotenv/config'

let app: App;
let firestore: Firestore;

if (!getApps().length) {
  const hasCredentials = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

  if (hasCredentials) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
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
