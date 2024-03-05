// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

//Firebase Credentials and definition

const firebaseConfig = {
  apiKey: "AIzaSyApdmGFx3XrJdY9r9bLyMXtAQmzGVGoPvg" ,
  authDomain: "weatherapp-1243f.firebaseapp.com",
  projectId: "weatherapp-1243f",
  storageBucket: "weatherapp-1243f.appspot.com",
  messagingSenderId: "673457310800",
  appId: "1:673457310800:web:c9a5fe1ec0a206ec61d555",
  measurementId:  "G-HSLWL2VHF0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE = getFirestore(FIREBASE_APP);
export const FIRE_STORAGE = getStorage(FIREBASE_APP);


