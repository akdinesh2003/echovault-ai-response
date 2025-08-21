import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDA98mp868M8n-wJPvD-anR7hkIrgOopE8',
  authDomain: 'echovault-1b80q.firebaseapp.com',
  projectId: 'echovault-1b80q',
  storageBucket: 'echovault-1b80q.appspot.com',
  messagingSenderId: '361403673991',
  appId: '1:361403673991:web:c4ecea2232da4af3b7f722',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
