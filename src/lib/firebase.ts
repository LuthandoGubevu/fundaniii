
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
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

// Check if the API key is loaded correctly
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.trim() === "") {
  const errorMessage = "CRITICAL_CONFIG_ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, empty, or invalid in your environment. " +
    "Firebase SDK cannot initialize. Please ensure this variable is correctly set in your .env file " +
    "(e.g., .env.local or .env) at the root of your project, and that you have RESTARTED your Next.js development server. " +
    `The value for apiKey appears to start with: '${String(firebaseConfig.apiKey).substring(0, 5)}...'`;
  
  console.error(errorMessage);

  // For Server-Side Rendering (SSR), throwing an error here can be more visible 
  // than just a console.error if logs are hard to access.
  if (typeof window === 'undefined') {
    throw new Error(errorMessage);
  }
  // For client-side, the console.error might be sufficient, or you could implement
  // a UI to show this critical error.
}

// Initialize Firebase
// The getApps().length check prevents reinitializing Firebase, especially during client-side hot reloads.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// These will still throw an error if initializeApp failed due to a malformed (but non-empty) API key.
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

let analyticsInstance: Analytics | undefined;

// Conditionally initialize Firebase Analytics only on the client-side
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analyticsInstance = getAnalytics(app);
  }).catch(err => {
    console.error("Error initializing Firebase Analytics:", err);
  });
}

export { app, auth, db, analyticsInstance as analytics };
