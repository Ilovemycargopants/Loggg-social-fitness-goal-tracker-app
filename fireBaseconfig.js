// Import the functions you need from the SDKs you need
import { initializeApp,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/app";
import {getAuth} from "firebase/auth";
import { initializeAuth,getReactNativePersistance,onAuthStateChanged } from "firebase/auth/react-native";
import { getAnalytics } from "firebase/analytics";
import { useState } from "react";
import { getFirestore } from "firebase/firestore";
import {getStorage }  from "firebase/storage";
import { REACT_APP_API_KEY, REACT_APP_AUTH_DOMAIN, REACT_APP_PROJECT_ID, REACT_APP_STORAGE_BUCKET, REACT_APP_MESSAGING_SENDER_ID, REACT_APP_APP_ID, REACT_APP_MEASUREMENT_ID } from '@env'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
export const firebase_App = initializeApp(firebaseConfig);
export const firebase_Auth = getAuth(firebase_App);
export const db = getFirestore();
export const storage = getStorage(firebase_App);








