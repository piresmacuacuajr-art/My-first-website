import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSy...", // Placeholder
  authDomain: "ais-dev-7pi2lwbohv537ffybslndj-869161737009.firebaseapp.com",
  projectId: "ai-studio-e25d6e46-66cd-453e-892c-8badffd1545c",
  storageBucket: "ai-studio-e25d6e46-66cd-453e-892c-8badffd1545c.appspot.com",
  messagingSenderId: "869161737009",
  appId: "1:869161737009:web:..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
