// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-app-3dfd1.firebaseapp.com",
  projectId: "estate-app-3dfd1",
  storageBucket: "estate-app-3dfd1.appspot.com",
  messagingSenderId: "745306795830",
  appId: "1:745306795830:web:026de76f90168a81818d97"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);