// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
// Якщо плануєте використовувати Firestore
import { getFirestore } from "firebase/firestore";
// Якщо плануєте використовувати Authentication
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація сервісів Firebase, які вам потрібні
const db = getFirestore(app); // Firestore database
// const auth = getAuth(app); // Firebase Authentication (якщо потрібно)

// Експортуємо те, що будемо використовувати в інших частинах застосунку
export { db /*, auth */ };
