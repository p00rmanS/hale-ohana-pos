import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 your config (you already have this)
const firebaseConfig = {
  apiKey: "AIzaSyBotifoIi5Wdh-iFQ-ceMTf8x8tmcAJV8",
  authDomain: "hale-ohana-pos.firebaseapp.com",
  projectId: "hale-ohana-pos",
  storageBucket: "hale-ohana-pos.firebasestorage.app",
  messagingSenderId: "325915011599",
  appId: "1:325915011599:web:299ac6b988b9aab186517d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// export so we can use it anywhere
export { db };