import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCgslqQolkmKUf-9LX0BlsVaitVIjlmOLg",
  authDomain: "carnest-chat.firebaseapp.com",
  projectId: "carnest-chat",
  storageBucket: "carnest-chat.appspot.com",
  messagingSenderId: "58290986017",
  appId: "1:58290986017:web:109f30d9f7415784431760",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ✅ Export Firestore
export default app;
