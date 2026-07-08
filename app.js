// =====================
// METRICS SYSTEM
// =====================

let METRICS = loadMetrics();


function getDefaultMetrics(){

  return {
    sleep:{ target:7, max:1 },
    steps:{ target:8000, max:1 },
    training:{ target:2, max:1 },
    water:{ target:2.5, max:1 }
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
  renderDashboard();


  showToast("DIRECTION UPDATED");

}



// =====================
// APP START
// =====================


function enterSystem(){

  const intro =
    document.getElementById("intro");

  const app =
    document.getElementById("app");


  intro.classList.add("fadeOut");


  setTimeout(()=>{


    intro.style.display="none";


    app.style.display="block";


    setTimeout(()=>{

      app.classList.add("active");

    },50);


    renderDashboard();


  },250);



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



function getTodayState(){

  const data = getData();


  const today =
    new Date()
    .toISOString()
    .split("T")[0];


  return data.find(
    d => d.date === today
  ) || null;

}



function getDashboardData(){

  const day = getTodayState();


  if(!day){

    return {

      sleep:0,
      steps:0,
      training:0,
      water:0,
      score:0

    };

  }


  return {

    sleep:day.sleep,

    steps:day.steps,

    training:day.training,

    water:day.water,

    score:day.score

  };

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


function getMetricProgress(){

  const day = getTodayState();


  if(!day){

    return {

      sleep:0,
      steps:0,
      training:0,
      water:0

    };

  }


  const m = METRICS || getDefaultMetrics();


  return {

    sleep: Math.min(
      Math.round(
        (day.sleep / m.sleep.target) * 100
      ),
      100
    ),


    steps: Math.min(
      Math.round(
        (day.steps / m.steps.target) * 100
      ),
      100
    ),


    training: Math.min(
      Math.round(
        (day.training / m.training.target) * 100
      ),
      100
    ),


    water: Math.min(
      Math.round(
        (day.water / m.water.target) * 100
      ),
      100
    )

  };

}




function renderDashboard(){

  const dashboard =
    document.getElementById("dashboard");


  if(!dashboard){
    return;
  }


  const day =
    getDashboardData();


  const progress =
    getMetricProgress();



  dashboard.innerHTML = `
  <div class="brand">

  <div class="brandTitle">
    LIFORGE
  </div>

  <div class="brandSubtitle">
    Forge Yourself
  </div>

</div>


    <div class="coreScore">


      <div class="energyLabel">
        ENERGY SCORE
      </div>


      <div class="energyValue">
        ${day.score}%
      </div>


      <div class="energyStatus">
        CURRENT ALIGNMENT
      </div>


    </div>




    <div class="hudGrid">



      <div class="metricCard">

        <h3>SLEEP</h3>

        <p>
          ${day.sleep}h
        </p>

        <div class="progressBar">
          <div 
          class="progressFill"
          style="width:${progress.sleep}%">
          </div>
        </div>

        <span>
          ${progress.sleep}%
        </span>

      </div>





      <div class="metricCard">

        <h3>STEPS</h3>

        <p>
          ${day.steps}
        </p>

        <div class="progressBar">
          <div 
          class="progressFill"
          style="width:${progress.steps}%">
          </div>
        </div>

        <span>
          ${progress.steps}%
        </span>

      </div>





      <div class="metricCard">

        <h3>TRAINING</h3>

        <p>
          ${day.training}
        </p>

        <div class="progressBar">
          <div 
          class="progressFill"
          style="width:${progress.training}%">
          </div>
        </div>

        <span>
          ${progress.training}%
        </span>

      </div>





      <div class="metricCard">

        <h3>WATER</h3>

        <p>
          ${day.water}L
        </p>

        <div class="progressBar">
          <div 
          class="progressFill"
          style="width:${progress.water}%">
          </div>
        </div>

        <span>
          ${progress.water}%
        </span>

      </div>



    </div>


  `;

}



// =====================
// UPDATE TODAY
// =====================

function save(){

  const sleepInput =
    document.getElementById("sleep").value;

  const stepsInput =
    document.getElementById("steps").value;

  const trainingInput =
    document.getElementById("training").value;

  const waterInput =
    document.getElementById("water").value;



  const sleep =
    Number(sleepInput || 0);

  const steps =
    Number(stepsInput || 0);

  const training =
    Number(trainingInput || 0);

  const water =
    Number(waterInput || 0);



  const today =
    new Date()
    .toISOString()
    .split("T")[0];



  const data = getData();



  const todayIndex =
    data.findIndex(
      d => d.date === today
    );



  let day;



  if(todayIndex !== -1){

    day = data[todayIndex];

  }else{

    day = {

      date:today,

      sleep:0,
      steps:0,
      training:0,
      water:0

    };

  }



  // SLEEP - ustawienie wartości dnia
  if(sleepInput !== ""){
    day.sleep = sleep;
  }



  // STEPS - dodawanie
  if(stepsInput !== ""){
    day.steps += steps;
  }



  // TRAINING - licznik
  if(trainingInput !== ""){
    day.training += training;
  }



  // WATER - dodawanie
  if(waterInput !== ""){
    day.water += water;
  }



  day.score =
    calcScore(
      day.sleep,
      day.steps,
      day.training,
      day.water
    );



  if(todayIndex !== -1){

    data[todayIndex] = day;

  }else{

    data.unshift(day);

  }



  saveData(data);



  
document.getElementById("sleep").value = day.sleep;

document.getElementById("steps").value = "";

document.getElementById("training").value = "";

document.getElementById("water").value = "";


  renderHistory();

  renderDashboard();


  showToast("DAY UPDATED");

}

// =====================
// HISTORY
// =====================

function renderHistory(){

  const h=document.getElementById("history");

  const data=getData();


  h.innerHTML="";


  if(!data.length){

    h.innerHTML="<div>No data yet</div>";

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

  showToast("DATA CLEARED");

}



// =====================
// TOAST SYSTEM
// =====================

function showToast(message){

  const toast =
    document.getElementById("toast");


  toast.innerText=message;


  toast.classList.add("show");


  setTimeout(()=>{

    toast.classList.remove("show");

  },2500);

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

      console.log(
        "Service Worker error:",
        err
      );

    });

  });

}
