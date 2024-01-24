// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGPQ-zURi0iOgVjd9ecUPc3udsLgXMmNo",
  authDomain: "protoperp-attendance-monitor.firebaseapp.com",
  databaseURL: "https://protoperp-attendance-monitor-default-rtdb.firebaseio.com",
  projectId: "protoperp-attendance-monitor",
  storageBucket: "protoperp-attendance-monitor.appspot.com",
  messagingSenderId: "488993031796",
  appId: "1:488993031796:web:a071dc3545acd9c7f23321",
  measurementId: "G-P0GNMPED0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage};