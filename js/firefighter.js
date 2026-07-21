import { auth, db } from "./firebase-config.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const departmentName = document.getElementById("departmentName");
const memberName = document.getElementById("memberName");
const memberRole = document.getElementById("memberRole");

const statusBadge = document.getElementById("statusBadge");
const toggleStatus = document.getElementById("toggleStatus");

const dispatchTone = new Audio(
    "assets/audio/dispatch-tone.mp3"
);

let lastAlertedCall = null;

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

    listenForCalls(
    currentUserData.department
);
    
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

function listenForCalls(department){


    const callsQuery = query(

        collection(db,"calls"),

        where(
            "department",
            "==",
            department
        ),

        where(
            "status",
            "==",
            "dispatched"
        )

    );


    onSnapshot(
        callsQuery,
        (snapshot)=>{


            snapshot.forEach((call)=>{


                if(call.id === lastAlertedCall){

                    return;

                }


                lastAlertedCall = call.id;


                playDispatchAlert(
                    call.data()
                );


            });


        }

    );


}

function playDispatchAlert(call){

if(alertsEnabled){

    dispatchTone.currentTime = 0;

    dispatchTone.play()
    .catch(error=>{

        console.log(
            "Audio blocked:",
            error
        );

    });

}

    console.log(
        "New Incident:",
        call.type
    );


    displayIncident(call);


}

const dispatchTone = new Audio(
    "assets/audio/dispatch-tone.mp3"
);

let alertsEnabled =
localStorage.getItem("alertsEnabled") === "true";

document
.getElementById("enableAlerts")
.onclick = async ()=>{


    try {


        dispatchTone.volume = 0;


        await dispatchTone.play();


        dispatchTone.pause();

        dispatchTone.currentTime = 0;


        dispatchTone.volume = 1;


        localStorage.setItem(
            "alertsEnabled",
            "true"
        );


        alertsEnabled = true;


        alert(
            "Dispatch tones enabled!"
        );


    }catch(error){

        console.error(error);

        alert(
            "Unable to enable tones."
        );

    }


};

function displayIncident(call){

    const incidentContent =
    document.getElementById("incidentContent");


    incidentContent.innerHTML = `

        <h2>
            🚨 ${call.type}
        </h2>

        <p>
            <strong>Location:</strong><br>
            ${call.location}
        </p>

        <p>
            <strong>Priority:</strong><br>
            ${call.priority}
        </p>

        <p>
            ${call.notes || ""}
        </p>


        <div class="response-buttons">

            <button class="station-btn">
                🚒 Station
            </button>

            <button class="scene-btn">
                🚗 Scene
            </button>

            <button class="unable-btn">
                ❌ Unable
            </button>

        </div>

    `;

}
