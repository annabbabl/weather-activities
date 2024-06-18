import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyACzTxAdu8KjTS8jw6jOgBvDRfjEHCSlto",
  authDomain: "electionjuniter.firebaseapp.com",
  projectId: "electionjuniter",
  storageBucket: "electionjuniter.appspot.com",
  messagingSenderId: "887774642327",
  appId: "1:887774642327:web:d1e17943bea540fc93e9d2",
  measurementId: "G-X3LRBVKM81"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE = getFirestore(FIREBASE_APP);
export const FIRE_STORAGE = getStorage(FIREBASE_APP);


