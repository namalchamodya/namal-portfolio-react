import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyCRnD7rvsw8wE9XyZSkIRvvvzkd0T-Y_LA",
    authDomain: "namal-chamodya-lms.firebaseapp.com",
    projectId: "namal-chamodya-lms",
    storageBucket: "namal-chamodya-lms.firebasestorage.app",
    messagingSenderId: "638467485590",
    appId: "1:638467485590:web:6708a93ec665c8d488b7b7",
    measurementId: "G-FSZGNQBQ16"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { auth, googleProvider, signInWithPopup, signOut, db };
