import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAN9cxWPJDxQVUsC1TR3ubvmrMC2a_ZdKA",
  authDomain: "buildbystar-a109d.firebaseapp.com",
  projectId: "buildbystar-a109d",
  storageBucket: "buildbystar-a109d.firebasestorage.app",
  messagingSenderId: "969895704358",
  appId: "1:969895704358:web:f61dae46e0f3ca065233e7",
  measurementId: "G-H3QCGE8W8V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
