const status=document.getElementById("bootStatus");

const fill=document.getElementById("progressFill");

const splash=document.getElementById("splashScreen");

const steps=[

"Initializing...",

"Connecting to Firebase...",

"Checking Authentication...",

"Loading Department...",

"Ready."

];

let i=0;

function next(){

    status.textContent=steps[i];

    fill.style.width=((i+1)/steps.length)*100+"%";

    i++;

    if(i<steps.length){

        setTimeout(next,500);

    }

}

next();

export function hideSplash(){

    splash.classList.add("hidden");

    setTimeout(()=>{

        splash.remove();

    },600);

}
