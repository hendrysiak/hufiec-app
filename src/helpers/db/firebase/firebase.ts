import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseCredentials = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_PUBLIC_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
};

export const app = initializeApp(firebaseCredentials);
export const auth = getAuth(app);
