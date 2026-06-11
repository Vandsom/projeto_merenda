import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1wMxVNTcvIyz80arV4YNsKhUZAs7a4Uc",
  authDomain: "sistema-merenda.firebaseapp.com",
  projectId: "sistema-merenda",
  storageBucket: "sistema-merenda.firebasestorage.app",
  messagingSenderId: "1051054133501",
  appId: "1:1051054133501:web:83b869d971cc59a403ee94"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;