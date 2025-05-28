
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
// Firebase Analytics type, actual import will be dynamic
import type { Analytics } from "firebase/analytics";

// ====================================================================================
// WARNING: HARDCODED FIREBASE CONFIGURATION
// ====================================================================================
// The Firebase configuration below is hardcoded directly into the source code.
// THIS IS STRONGLY NOT RECOMMENDED for production applications due to security risks,
// as these keys will be visible in your deployed JavaScript bundle.
//
// This is a TEMPORARY measure to bypass .env file loading issues for local testing.
// YOU MUST REVERT TO USING ENVIRONMENT VARIABLES (e.g., from a .env file)
// AND SECURE YOUR KEYS BEFORE DEPLOYING TO PRODUCTION.
// ====================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBNX7k_4hviCBfNaOrC8hxBRZ5GCFKAJjs",
  authDomain: "fundanii.firebaseapp.com",
  projectId: "fundanii",
  storageBucket: "fundanii.firebasestorage.app",
  messagingSenderId: "631717579934",
  appId: "1:631717579934:web:019fa8de102ca1bd8d7f8f",
  measurementId: "G-0CH1R9N6BH"
};

// Check if the API key is literally the placeholder value or truly empty.
if (!firebaseConfig.apiKey || String(firebaseConfig.apiKey).trim() === "" || firebaseConfig.apiKey === "YOUR_ACTUAL_API_KEY_FROM_FIREBASE") {
  const errorMessage = `CRITICAL_CONFIG_ERROR: The hardcoded Firebase API Key in src/lib/firebase.ts is MISSING or still a placeholder.
    Firebase SDK cannot initialize.
    Please replace the placeholder values in src/lib/firebase.ts with your actual Firebase project credentials.
    REMINDER: Hardcoding keys is insecure for production.`;
  
  console.error(errorMessage);

  if (typeof window === 'undefined') {
    throw new Error(errorMessage);
  } else {
     console.error("CRITICAL_CONFIG_ERROR also detected on client-side.");
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
