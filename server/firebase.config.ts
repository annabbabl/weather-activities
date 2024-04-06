import { initializeApp } from "firebase/app";
import * as admin from "firebase-admin";
import serviceAccount from "./adminFirebase.json";
import { getStorage } from 'firebase-admin/storage';


//Firebase Credentials and definition

const firebaseConfig = {
  apiKey: "AIzaSyApdmGFx3XrJdY9r9bLyMXtAQmzGVGoPvg",
  authDomain: "weatherapp-1243f.firebaseapp.com",
  projectId: "weatherapp-1243f",
  databaseURL: "https://weatherapp-1243f-default-rtdb.europe-west1.firebasedatabase.app",
  messagingSenderId: "673457310800",
  appId:  "1:673457310800:web:c9a5fe1ec0a206ec61d555",
  measurementId:  "G-HSLWL2VHF0",
  storageBucket:  "weatherapp-1243f.appspot.com"
};

export const FIRE_ADMIN = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'weatherapp-1243f.appspot.com'
});

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = FIRE_ADMIN.auth();
export const FIRESTORE = FIRE_ADMIN.firestore();
export const FIRE_STORAGE = getStorage().bucket("files");
