// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as admin from "firebase-admin";
import serviceAccount from "./adminFirebase.json";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY ,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  databaseURL: process.env.FIREBASE_DATABAASE_URL,
  messagingSenderId: process.env.FIREBASE_MESSAGINSENDERID,
  appId:  process.env.FIREBASE_APPID,
  measurementId:  process.env.FIREBASE_MEASERMENTID,
  storageBucket:  process.env.FIREBASE_STORAGEBUCKET
};

export const FIRE_ADMIN = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = FIRE_ADMIN.auth();
export const FIRESTORE = FIRE_ADMIN.firestore();
export const FIRE_STORAGE = FIRE_ADMIN.storage();
