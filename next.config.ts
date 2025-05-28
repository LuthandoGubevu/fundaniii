
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ====================================================================================
  // ENVIRONMENT VARIABLES FOR CLIENT-SIDE ACCESS
  // ====================================================================================
  // This `env` block makes server-side environment variables (loaded by Next.js from
  // your .env file into `process.env`) available in the client-side JavaScript bundle.
  //
  // For these to work, the corresponding `process.env.NEXT_PUBLIC_...` variables
  // MUST be correctly defined in your .env file (at the project root) AND your
  // Next.js development server MUST be restarted after any .env file changes.
  //
  // If `process.env.NEXT_PUBLIC_FIREBASE_API_KEY` (for example) is `undefined` on the
  // server when this config is processed, it will also be `undefined` on the client.
  // ====================================================================================
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }
};

export default nextConfig;
