
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
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
  storageBucket: "fundanii.firebasestorage.app",
  messagingSenderId: "631717579934",
  appId: "1:631717579934:web:019fa8de102ca1bd8d7f8f",
  measurementId: "G-0CH1R9N6BH"
};

// Check if the API key is literally the placeholder value or truly empty.
// This check is less about 'undefined' now and more about an obviously incorrect hardcoded value.
if (!firebaseConfig.apiKey || String(firebaseConfig.apiKey).trim() === "" || firebaseConfig.apiKey === "YOUR_ACTUAL_API_KEY_FROM_FIREBASE") {
  const errorMessage = `CRITICAL_CONFIG_ERROR: The hardcoded Firebase API Key in src/lib/firebase.ts is missing, empty, or still a placeholder.
    Firebase SDK cannot initialize.
    Please ensure the firebaseConfig object in src/lib/firebase.ts has the correct values.
    Current apiKey value starts with: '${String(firebaseConfig.apiKey).substring(0, 5)}...'`;
  
  console.error(errorMessage);

  if (typeof window === 'undefined') {
    throw new Error(errorMessage);
  } else {
     throw new Error(errorMessage);
  }
}

// Initialize Firebase
// The getApps().length check prevents reinitializing Firebase, especially during client-side hot reloads.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

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

export { app, auth, db, analyticsInstance as analytics };
