import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa0hgkXoOijWBL9GT3nFDAdZcblY3YOlM",
  authDomain: "swap-it-1.firebaseapp.com",
  projectId: "swap-it-1",
  storageBucket: "swap-it-1.firebasestorage.app",
  messagingSenderId: "85717604113",
  appId: "1:85717604113:web:56f21617982a689f901eb0",
  measurementId: "G-YW3B0B64QQ",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
