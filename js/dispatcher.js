import { auth, db } from "./firebase-config.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const departmentName =
document.getElementById("departmentName");


const callsList =
document.getElementById("callsList");


const unitsList =
document.getElementById("unitsList");



onAuthStateChanged(auth, async (user)=>{


    if(!user){

        window.location.href="index.html";

        return;

    }



    const userRef =
    doc(db,"users",user.uid);



    const userSnap =
    await getDoc(userRef);



    if(!userSnap.exists()){

        alert("User profile not found");

        window.location.href="index.html";

        return;

    }



    const data =
    userSnap.data();



    if(
        data.role !== "dispatcher" &&
        data.role !== "admin"
    ){

        alert("Unauthorized access");

        window.location.href="index.html";

        return;

    }



    departmentName.textContent =
    data.department;



    loadCalls(data.department);

    loadUnits(data.department);



});





function loadCalls(department){


    const callsQuery =
    query(

        collection(db,"calls"),

        where(
            "department",
            "==",
            department
        ),

        where(
            "status",
            "==",
            "active"
        )

    );



    onSnapshot(
        callsQuery,
        (snapshot)=>{


            callsList.innerHTML="";



            if(snapshot.empty){

                callsList.innerHTML =
                "<p>No Active Calls</p>";

                return;

            }



            snapshot.forEach((call)=>{


                const data =
                call.data();



                callsList.innerHTML += `

<div class="call-card">

    <h3>
    ${data.type}
    </h3>

    <p>
    ${data.location}
    </p>

    <p>
    Priority:
    ${data.priority}
    </p>


    <button class="edit-call"
    data-id="${call.id}">
        Edit
    </button>


    <button class="close-call"
    data-id="${call.id}">
        Close
    </button>


</div>

`;


            });


        }

    );


}

async function closeCall(callId){


    await updateDoc(

        doc(db,"calls",callId),

        {

            status:"closed"

        }

    );


}

document.querySelectorAll(".close-call")
.forEach(button=>{


    button.onclick = ()=>{


        closeCall(button.dataset.id);


    };


});



function loadUnits(department){


    const unitsQuery =
    query(

        collection(db,"units"),

        where(
            "department",
            "==",
            department
        )

    );



    onSnapshot(
        unitsQuery,
        (snapshot)=>{


            unitsList.innerHTML="";



            if(snapshot.empty){

                unitsList.innerHTML =
                "<p>No Units Found</p>";

                return;

            }




            snapshot.forEach((unit)=>{


                const data =
                unit.data();



                unitsList.innerHTML += `

                <div class="unit-card">

                    <h3>
                    ${data.name}
                    </h3>

                    <p>
                    Status:
                    ${data.status}
                    </p>

                </div>

                `;


            });


        }

    );


}






document
.getElementById("createCall")
.onclick = async ()=>{


    const type =
    document.getElementById("callType").value;


    const location =
    document.getElementById("callLocation").value;


    const priority =
    document.getElementById("callPriority").value;


    const notes =
    document.getElementById("callNotes").value;




    if(!location){

        alert("Please enter a location");

        return;

    }



    const user =
    auth.currentUser;



    const userSnap =
    await getDoc(
        doc(db,"users",user.uid)
    );


    const userData =
    userSnap.data();




    await addDoc(

        collection(db,"calls"),

        {

            type:type,

            location:location,

            priority:priority,

            notes:notes,

            department:userData.department,

            status:"active",

            assignedUnits:[],

            createdBy:user.email,

            createdAt:serverTimestamp()

        }

    );



    alert("Call Created");


};






document
.getElementById("logout")
.onclick = ()=>{


    signOut(auth);

    window.location.href="index.html";


};
