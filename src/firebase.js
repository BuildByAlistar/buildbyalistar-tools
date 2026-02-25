import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Optional: only keep analytics if you really want it
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAN9cxWPJDxQVUsC1TR3ubvmrMC2a_ZdKA",
  authDomain: "buildbystar-a109d.firebaseapp.com",
  projectId: "buildbystar-a109d",
  storageBucket: "buildbystar-a109d.firebasestorage.app",
  messagingSenderId: "969895704358",
  appId: "1:969895704358:web:15aeeb92caf49a305233e7",
  measurementId: "G-MPFQ4HK3B8",
};

const app = initializeApp(firebaseConfig);

// If you need analytics later, uncomment below:
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();