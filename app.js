// =====================
// METRICS SYSTEM
// =====================

let METRICS = loadMetrics();


function getDefaultMetrics(){
  return {
    sleep: { target: 7, max: 1 },
    steps: { target: 8000, max: 1 },
    training: { target: 2, max: 1 },
    water: { target: 2.5, max: 1 }
  };
}


function loadMetrics(){

  try{
    const m = localStorage.getItem("metrics");

    return m ? JSON.parse(m) : getDefaultMetrics();

  }catch(e){

    return getDefaultMetrics();

  }

}


function saveMetrics(){

  METRICS = {

    sleep:{
      target:Number(document.getElementById("set_sleep").value) || 7,
      max:1
    },

    steps:{
      target:Number(document.getElementById("set_steps").value) || 8000,
      max:1
    },

    training:{
      target:Number(document.getElementById("set_training").value) || 2,
      max:1
    },

    water:{
      target:Number(document.getElementById("set_water").value) || 2.5,
      max:1
    }

  };


  localStorage.setItem(
    "metrics",
    JSON.stringify(METRICS)
  );


  console.log("Metrics saved");

}



// =====================
// APP START
// =====================

function enterSystem(){

  document.getElementById("intro").style.display="none";

  document.getElementById("app").style.display="block";

}



// =====================
// DATA STORAGE
// =====================

function getData(){

  try{

    return JSON.parse(
      localStorage.getItem("liforge")
    ) || [];

  }catch(e){

    return [];

  }

}



function saveData(data){

  localStorage.setItem(
    "liforge",
    JSON.stringify(data)
  );

}



// =====================
// SCORE ENGINE
// =====================

function calcScore(
  sleep,
  steps,
  training,
  water
){

  const m = METRICS || getDefaultMetrics();


  sleep = sleep || 0;
  steps = steps || 0;
  training = training || 0;
  water = water || 0;


  return Math.round(

    (
      Math.min(
        sleep / m.sleep.target,
        m.sleep.max
      )

      +

      Math.min(
        steps / m.steps.target,
        m.steps.max
      )

      +

      Math.min(
        training / m.training.target,
        m.training.max
      )

      +

      Math.min(
        water / m.water.target,
        m.water.max
      )

    )

    /4*100

  );

}



// =====================
// SAVE DAY
// =====================

function save(){


  const sleep =
    Number(document.getElementById("sleep").value || 0);


  const steps =
    Number(document.getElementById("steps").value || 0);


  const training =
    Number(document.getElementById("training").value || 0);


  const water =
    Number(document.getElementById("water").value || 0);



  const data = getData();



  data.unshift({

    date:new Date()
    .toISOString()
    .split("T")[0],

    sleep,
    steps,
    training,
    water,

    score:calcScore(
      sleep,
      steps,
      training,
      water
    )

  });



  saveData(data);



  document.getElementById("sleep").value="";
  document.getElementById("steps").value="";
  document.getElementById("training").value="";
  document.getElementById("water").value="";


  alert("Saved");

}



// =====================
// HISTORY
// =====================

function renderHistory(){

  const h =
    document.getElementById("history");


  const data =
    getData();



  h.innerHTML="";



  if(!data.length){

    h.innerHTML=
    "<div>No data yet</div>";

    return;

  }



  data.slice(0,10)
  .forEach(d=>{


    h.innerHTML += `

    <div class="historyItem">

      <div>
      ${d.date}
      • ${d.sleep}h
      • ${d.steps}
      • ${d.training}h
      • ${d.water}L
      </div>

      <div>
      ${d.score}%
      </div>

    </div>

    `;


  });


}



function showHistory(){

  renderHistory();

  document
  .getElementById("historyView")
  .style.display="flex";

}



function hideHistory(){

  document
  .getElementById("historyView")
  .style.display="none";

}



// =====================
// SETTINGS WINDOW
// =====================

function showSettings(){

  document
  .getElementById("settingsView")
  .style.display="flex";


}



function hideSettings(){

  document
  .getElementById("settingsView")
  .style.display="none";

}



// =====================
// RESET
// =====================

function clearHistory(){

  localStorage.removeItem("liforge");

  renderHistory();

}
// =====================
// PWA SERVICE WORKER
// =====================

if("serviceWorker" in navigator){

  window.addEventListener("load",()=>{

    navigator.serviceWorker
    .register("/Liforgev2/service-worker.js")
    .then(()=>{

      console.log("LIFORGE PWA ready");

    })
    .catch(err=>{

      console.log("Service Worker error:", err);

    });

  });

}
