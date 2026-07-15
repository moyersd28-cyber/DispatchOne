import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



onAuthStateChanged(auth, async (user)=>{


    if(!user){

        window.location.href="index.html";
        return;

    }


    const userRef = doc(db,"users",user.uid);

    const snapshot = await getDoc(userRef);


    if(!snapshot.exists()){

        alert("User profile not found");
        window.location.href="index.html";
        return;

    }


    const data = snapshot.data();



    if(data.role !== "admin"){

        alert("Unauthorized Access");

        window.location.href="index.html";

        return;

    }



    document.getElementById("departmentName").textContent =
        data.department;



});



document.getElementById("logout").onclick = ()=>{


    signOut(auth);

    window.location.href="index.html";


};
