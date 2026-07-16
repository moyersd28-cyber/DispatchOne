import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { hideSplash } from "./splash.js";

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

const splashStart = Date.now();

onAuthStateChanged(auth, async (user) => {

    // Make sure the splash is visible for at least 1.8 seconds
    const elapsed = Date.now() - splashStart;
    const remaining = Math.max(0, 1800 - elapsed);

    await new Promise(resolve => setTimeout(resolve, remaining));

    if (!user) {
        hideSplash();
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            hideSplash();
            errorMessage.textContent = "User profile not found.";
            return;

        }

        const data = userSnap.data();

        hideSplash();

        setTimeout(() => {

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

        }, 500);

    } catch (err) {

        hideSplash();

        console.error(err);

        errorMessage.textContent = "Unable to load user.";

    }

});
