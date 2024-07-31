// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI0DcjghhlU_BYJdGNcPPd4288VmvFtxg",
  authDomain: "hspantryapp-13132.firebaseapp.com",
  projectId: "hspantryapp-13132",
  storageBucket: "hspantryapp-13132.appspot.com",
  messagingSenderId: "692544768499",
  appId: "1:692544768499:web:a3d1d0ffe5e8c024596a86",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
