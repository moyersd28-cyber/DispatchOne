import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const departmentName = document.getElementById("departmentName");
const memberName = document.getElementById("memberName");
const memberRole = document.getElementById("memberRole");

const statusBadge = document.getElementById("statusBadge");
const toggleStatus = document.getElementById("toggleStatus");

let currentUserData = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";
        return;

    }

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

        alert("User profile not found.");

        window.location.href = "index.html";
        return;

    }

    currentUserData = userSnap.data();

    if (currentUserData.role !== "firefighter") {

        alert("Unauthorized.");

        window.location.href = "index.html";
        return;

    }

    departmentName.textContent = currentUserData.department;
    memberName.textContent = currentUserData.name;
    memberRole.textContent = currentUserData.role;

    updateStatusUI();

});

function updateStatusUI() {

    const available = currentUserData.available !== false;

    if (available) {

        statusBadge.textContent = "AVAILABLE";

        statusBadge.className = "available";

        toggleStatus.textContent = "Become Unavailable";

    } else {

        statusBadge.textContent = "UNAVAILABLE";

        statusBadge.className = "unavailable";

        toggleStatus.textContent = "Become Available";

    }

}

toggleStatus.onclick = async () => {

    const newStatus = !(currentUserData.available !== false);

    await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        {
            available: newStatus
        }
    );

    currentUserData.available = newStatus;

    updateStatusUI();

};

document.getElementById("logout").onclick = () => {

    signOut(auth);

    window.location.href = "index.html";

};

