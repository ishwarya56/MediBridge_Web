import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXWCt9SzWA5mjBAQuMgcnACWUdl07Vszw",
  authDomain: "medicari-137df.firebaseapp.com",
  projectId: "medicari-137df",
  storageBucket: "medicari-137df.firebasestorage.app",
  messagingSenderId: "1076657112946",
  appId: "1:1076657112946:web:c98b5f1e68690698dcbfeb",
  measurementId: "G-FV2JGTJGQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (only in browser, not SSR)
export const analytics = getAnalytics(app);

// Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Named exports for convenience
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot
};
