import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0NjnaS9REXbnvbjplWmnuNwjRrWpmlj4",
  authDomain: "favorite-books-catalog.firebaseapp.com",
  projectId: "favorite-books-catalog",
  storageBucket: "favorite-books-catalog.firebasestorage.app",
  messagingSenderId: "Y172578656216",
  appId: "1:172578656216:web:a885fc095807c09090acad",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
