
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAObqia6rjSSCdDDoOmW27L4lbd8vOuCmw",
  authDomain: "test-41b68.firebaseapp.com",
  projectId: "test-41b68",
  storageBucket: "test-41b68.appspot.com",
  messagingSenderId: "642308596074",
  appId: "1:642308596074:web:231d5419d1392ad852c513"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
