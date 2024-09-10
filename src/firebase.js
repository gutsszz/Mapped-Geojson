import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPshT4yjPpghRgSw8DmVrrNn52i0hF4Rw",
  authDomain: "project1-8709d.firebaseapp.com",
  databaseURL: "https://project1-8709d-default-rtdb.firebaseio.com",
  projectId: "project1-8709d",
  storageBucket: "project1-8709d.appspot.com",
  messagingSenderId: "930208080927",
  appId: "1:930208080927:web:3009ff4c1abc62c797a12a",
  measurementId: "G-FBMDQQF66B"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
