
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
// Firebase Analytics type, actual import will be dynamic
import type { Analytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if the API key is literally the placeholder value or truly empty.
if (!firebaseConfig.apiKey || String(firebaseConfig.apiKey).trim() === "" || firebaseConfig.apiKey.includes("YOUR_")) {
  const errorMessage = `CRITICAL_CONFIG_ERROR: The Firebase environment variables are missing, empty, or still placeholders.
    Firebase SDK cannot initialize.
    1. Ensure you have a .env.local file at the project root.
    2. Add your Firebase project credentials to it, prefixed with NEXT_PUBLIC_ as shown in the .env file.
    3. For deployments (e.g., Netlify, Vercel), add these same environment variables to your project's settings.
    4. IMPORTANT: You MUST restart your Next.js development server after any .env file changes.
    
    Without this configuration, Firebase services will fail.`;
  
  console.error(errorMessage);

  if (typeof window === 'undefined') {
    // On the server, this can be a fatal error during build or SSR.
    // However, throwing here might break builds even if env vars are set in the provider.
    // A loud console error is often sufficient.
  }
}


// Initialize Firebase
// The getApps().length check prevents reinitializing Firebase, especially during client-side hot reloads.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

let analyticsInstance: Analytics | undefined;

// Conditionally initialize Firebase Analytics only on the client-side
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  import('firebase/analytics').then(({ getAnalytics }) => {
    try {
      analyticsInstance = getAnalytics(app);
    } catch (err) {
      console.error("Error initializing Firebase Analytics on client:", err);
    }
  }).catch(err => {
    console.error("Error dynamically importing Firebase Analytics:", err);
  });
}

export { app, auth, db, storage, analyticsInstance as analytics };
