import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const activateButton = document.getElementById("activateButton");

activateButton.onclick = async () => {

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    if (!email || !password || !confirmPassword) {

        alert("Please complete all fields.");

        return;
    }

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }

    if (password.length < 6) {

        alert("Password must be at least 6 characters.");

        return;
    }

    try {

        // Look for pending invitation
        const pendingQuery = query(
            collection(db, "pendingUsers"),
            where("email", "==", email)
        );

        const pendingSnapshot = await getDocs(pendingQuery);

        if (pendingSnapshot.empty) {

            alert("No invitation was found for this email.");

            return;
        }

        const invitationDoc = pendingSnapshot.docs[0];

        const invitation = invitationDoc.data();

        // Create Authentication account
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Create permanent user profile
   await setDoc(
    doc(db, "users", result.user.uid),
    {
        name: invitation.name,
        email: invitation.email,
        role: invitation.role,
        department: invitation.department,
        active: true,
        createdAt: serverTimestamp()
    }
);

        // Remove invitation
        await deleteDoc(doc(db, "pendingUsers", invitationDoc.id));

        alert("Account activated successfully!");

window.location.href = "index.html";

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};
