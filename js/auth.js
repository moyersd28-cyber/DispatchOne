import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    errorMessage.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);

    } catch (error) {

        errorMessage.textContent = error.message;

    }

});

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            errorMessage.textContent = "User profile not found.";

            return;

        }

        const data = userSnap.data();

        switch (data.role) {

            case "admin":
                window.location.href = "admin.html";
                break;

            case "dispatcher":
                window.location.href = "dispatcher.html";
                break;

            case "firefighter":
                window.location.href = "firefighter.html";
                break;

            default:
                errorMessage.textContent = "Unknown user role.";

        }

    } catch (err) {

        console.error(err);

        errorMessage.textContent = "Unable to load user.";

    }

});
