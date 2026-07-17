import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    doc,
    getDoc,
    collection,
    getDocs,
    setDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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


loadDashboardStats(data.department);

});

async function loadDashboardStats(department){

    
    const usersRef = collection(db,"users");

    const usersSnapshot = await getDocs(usersRef);


    let members = 0;

    let dispatchers = 0;



    usersSnapshot.forEach((user)=>{

        const data = user.data();


        if(data.department === department){

            members++;


            if(data.role === "dispatcher"){

                dispatchers++;
                

            }

        }


    });



    document.getElementById("memberCount").textContent =
        members;


    document.getElementById("dispatcherCount").textContent =
        dispatchers;




    const apparatusRef = collection(db,"apparatus");


    const apparatusSnapshot = await getDocs(apparatusRef);



    document.getElementById("apparatusCount").textContent =
        apparatusSnapshot.size;


}

document.getElementById("logout").onclick = ()=>{


    signOut(auth);

    window.location.href="index.html";


};

const createButton = document.getElementById("createMember");


createButton.onclick = async ()=>{


const name =
document.getElementById("memberName").value;


const email =
document.getElementById("memberEmail").value;


const role =
document.getElementById("memberRole").value;



if(!name || !email){

alert("Please fill in all fields");

return;

}



try{

await addDoc(
    collection(db, "pendingUsers"),
    {
        name: name,
        email: email.toLowerCase(),
        role: role,
        department: document.getElementById("departmentName").textContent,
        active: true,
        createdAt: new Date()
    }
);

alert("Invitation created successfully!");
    
    
alert("Member Created");


}
catch(error){

console.error(error);

alert(error.message);


}


};

document.getElementById("memberName").value = "";
document.getElementById("memberEmail").value = "";
document.getElementById("memberRole").selectedIndex = 0;
