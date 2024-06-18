import { initializeApp } from "firebase/app";
import * as admin from "firebase-admin";
import serviceAccount from "./adminFirebase.json";
import { getStorage } from 'firebase-admin/storage';


const firebaseConfig = {
  apiKey: "AIzaSyACzTxAdu8KjTS8jw6jOgBvDRfjEHCSlto",
  authDomain: "electionjuniter.firebaseapp.com",
  projectId: "electionjuniter",
  storageBucket: "electionjuniter.appspot.com",
  messagingSenderId: "887774642327",
  appId: "1:887774642327:web:d1e17943bea540fc93e9d2",
  measurementId: "G-X3LRBVKM81"
};

export const FIRE_ADMIN = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://electionjuniter-default-rtdb.europe-west1.firebasedatabase.app"
});

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = FIRE_ADMIN.auth();
export const FIRESTORE = FIRE_ADMIN.firestore();
export const FIRE_STORAGE = getStorage().bucket("files");



