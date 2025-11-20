
// src/firebase/server.ts
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import 'dotenv/config';

let app: App;
let firestore: Firestore;

/**
 * Read and normalize service account values from environment variables.
 * - Remove surrounding quotes (single/double) if present.
 * - Convert escaped newline sequences ("\n" or "\\n") to actual newlines.
 * - Validate the key contains PEM BEGIN/END markers.
 */
function buildServiceAccountFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  // Trim whitespace
  privateKey = privateKey.trim();

  // Remove surrounding quotes if the value was wrapped (either "..." or '...')
  privateKey = privateKey.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

  // Convert escaped newlines (two chars: backslash + n) into real newline characters.
  // This supports privateKey values that look like: "-----BEGIN...\\nMIIEv..."
  privateKey = privateKey.replace(/\\n/g, '\n');

  // Some systems might store actual "\n" (escaped backslash + n) twice, normalize again just in case
  privateKey = privateKey.replace(/\\\\n/g, '\n');

  // Validate minimal PEM structure
  const hasBegin = privateKey.includes('-----BEGIN PRIVATE KEY-----');
  const hasEnd = privateKey.includes('-----END PRIVATE KEY-----');

  if (!hasBegin || !hasEnd) {
    // Provide actionable guidance but do NOT print the key itself
    throw new Error(
      'FIREBASE_PRIVATE_KEY environment variable does not contain a valid PEM private key. ' +
      'Make sure the value includes "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----".\n' +
      'If you stored the key as a single-line env variable, encode newlines as \\n (two characters), ' +
      'and in your code convert them with .replace(/\\\\n/g, \'\\n\').\n' +
      'Example (single-line env): FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----'
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

if (!getApps().length) {
  const serviceAccount = buildServiceAccountFromEnv();

  try {
    if (serviceAccount) {
      // Initialize using explicit service account from env
      // (we don't log the private key; we only log presence/length info)
      console.log('Initializing Firebase Admin using service account from environment variables.');
      // Optional: basic sanity log (no secrets)
      console.log(`FIREBASE_PROJECT_ID present: ${Boolean(process.env.FIREBASE_PROJECT_ID)}; privateKey length: ${serviceAccount.privateKey.length}`);

      app = initializeApp({
        credential: cert({
          projectId: serviceAccount.projectId,
          clientEmail: serviceAccount.clientEmail,
          // `cert()` accepts an object shaped like a ServiceAccount
          privateKey: serviceAccount.privateKey,
        } as any),
      });
    } else {
      // Fallback to Application Default Credentials (GCP environment)
      console.warn('FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY not found — using Application Default Credentials.');
      app = initializeApp();
    }
  } catch (err) {
    // Provide actionable error and rethrow so the calling runtime fails loudly
    console.error('Failed to initialize Firebase Admin SDK. See error for details (private key not printed).');
    // If the underlying error includes helpful text, include it
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err;
  }
} else {
  app = getApp();
}

firestore = getFirestore(app);

export { app as adminApp, firestore as adminFirestore };
