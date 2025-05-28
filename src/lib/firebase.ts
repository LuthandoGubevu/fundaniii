
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage"; // Added
// Firebase Analytics type, actual import will be dynamic
import type { Analytics } from "firebase/analytics";

// ====================================================================================
// WARNING: HARDCODED FIREBASE CONFIGURATION
// ====================================================================================
// The Firebase configuration below is hardcoded directly into the source code.
// This is generally NOT RECOMMENDED for production applications due to security risks,
// as these keys will be visible in your deployed JavaScript bundle.
//
// The PREFERRED METHOD is to use environment variables (e.g., from a .env file)
// and ensure your Next.js server is correctly loading them.
//
// This hardcoded configuration is provided to help bypass potential .env loading
// issues during development. REMEMBER TO REVERT TO ENVIRONMENT VARIABLES
// AND SECURE YOUR KEYS BEFORE DEPLOYING TO PRODUCTION.
// ====================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBNX7k_4hviCBfNaOrC8hxBRZ5GCFKAJjs",
  authDomain: "fundanii.firebaseapp.com",
  projectId: "fundanii",
  storageBucket: "fundanii.firebasestorage.app", // Corrected: Ensure this is your actual storage bucket
  messagingSenderId: "631717579934",
  appId: "1:631717579934:web:019fa8de102ca1bd8d7f8f",
  measurementId: "G-0CH1R9N6BH"
};


// Check if the API key is literally the placeholder value or truly empty.
// This check is less about 'undefined' now and more about an obviously incorrect hardcoded value.
if (!firebaseConfig.apiKey || String(firebaseConfig.apiKey).trim() === "" || firebaseConfig.apiKey === "YOUR_ACTUAL_API_KEY_FROM_FIREBASE") {
  const errorMessage = `CRITICAL_CONFIG_ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or UNDEFINED in your environment.
    Firebase SDK cannot initialize.
    1. CHECK YOUR .env FILE: Ensure it's at the project root and all NEXT_PUBLIC_FIREBASE_... variables are correctly set.
    2. RESTART YOUR SERVER: You MUST restart your Next.js development server after any .env file changes.
    Current apiKey value starts with: '${String(firebaseConfig.apiKey).substring(0, 5)}...' (should not be 'undef' or empty).`;
  
  console.error(errorMessage);

  // For Server-Side Rendering (SSR), throwing an error here makes it visible in the browser error page.
  if (typeof window === 'undefined') {
    throw new Error(errorMessage);
  }
  // This part is for client-side, but the error indicates it's happening server-side first.
  else {
     console.error("CRITICAL_CONFIG_ERROR also detected on client-side. This usually means the server-side build failed to embed the environment variables.");
     // Optionally, you could throw here too to halt client execution if needed.
  }
}

// Initialize Firebase
// The getApps().length check prevents reinitializing Firebase, especially during client-side hot reloads.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app); // Added

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

export { app, auth, db, storage, analyticsInstance as analytics }; // Added storage
