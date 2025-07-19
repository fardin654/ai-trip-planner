import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCUAk9wh2Yb_MQTUsB563ls24CRQOYkRq8",
  authDomain: "ai-trip-planner-b7804.firebaseapp.com",
  projectId: "ai-trip-planner-b7804",
  storageBucket: "ai-trip-planner-b7804.firebasestorage.app",
  messagingSenderId: "391169389539",
  appId: "1:391169389539:web:e40a2544ba690a3a66e6d6",
  measurementId: "G-FEHPW2NW39"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

