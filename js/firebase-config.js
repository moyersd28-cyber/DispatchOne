// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    setPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Replace with YOUR Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2OwmcAMpY-buYi0DvMO3ezHFgau8Lzdo",
  authDomain: "dispatchone-30a6f.firebaseapp.com",
  projectId: "dispatchone-30a6f",
  storageBucket: "dispatchone-30a6f.firebasestorage.app",
  messagingSenderId: "335571852717",
  appId: "1:335571852717:web:5b6641a0b591a69ffa5524"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Services

const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);

const db = getFirestore(app);


// Export

export {

    auth,

    db

};
