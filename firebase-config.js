// Firebase setup for Noam's Game Hub (project: gamehub-fb2ed)
// These values are public by design — security comes from the Firestore rules, not from hiding them.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCB8rn2BkzyuyNTp7EwU4FwkNxuW_a8Si4",
    authDomain: "gamehub-fb2ed.firebaseapp.com",
    projectId: "gamehub-fb2ed",
    storageBucket: "gamehub-fb2ed.firebasestorage.app",
    messagingSenderId: "925712853158",
    appId: "1:925712853158:web:92f3fb672da2e8b486ec67"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
