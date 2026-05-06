// ═══════════════════════════════════════════
// FIREBASE CONFIGURATION
// ═══════════════════════════════════════════
// 🔧 INSTRUCTIONS SETUP :
// 1. Va sur https://console.firebase.google.com
// 2. Crée un projet "geek-quiz-evg"
// 3. Active Firestore Database (mode test pour commencer)
// 4. Active Authentication > Sign-in method > Email/Password
// 5. Crée un compte admin : Authentication > Users > Add user
//    → email: admin@evg.fr  mot de passe: (ton choix)
// 6. Dans Project Settings > Your apps > Web app, copie la config
// 7. Remplace les valeurs ci-dessous par ta config

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7_rx3GafLOKA47Yds2lemv7I5AEJ8Rxk",
  authDomain: "quiz-geek-985c5.firebaseapp.com",
  projectId: "quiz-geek-985c5",
  storageBucket: "quiz-geek-985c5.firebasestorage.app",
  messagingSenderId: "743706633379",
  appId: "1:743706633379:web:bbe422ea863a00c1990b16"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Expose globally for non-module scripts
window.__firebaseDb = db;
window.__firebaseAuth = auth;
