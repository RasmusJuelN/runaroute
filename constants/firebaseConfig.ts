import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBbFqCUxn6IzqK5m4OGxS_0nocNaQakdQA",
  authDomain: "runaroute-b8d50.firebaseapp.com",
  projectId: "runaroute-b8d50",
  storageBucket: "runaroute-b8d50.appspot.com", // <-- FIXED
  messagingSenderId: "883554243093",
  appId: "1:883554243093:web:7699a931edf5129306341c",
  measurementId: "G-HWG3B3EK9S"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
