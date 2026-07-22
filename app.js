// =====================
// LIFORGE APP
// METRICS + STORAGE SYSTEM
// =====================


// =====================
// METRICS CONFIG
// =====================

let METRICS = loadMetrics();


function getDefaultMetrics(){

  return {
    sleep:{
      target:7,
      max:1
    },

    steps:{
      target:8000,
      max:1
    },

    training:{
      target:2,
      max:1
    },

    water:{
      target:2.5,
      max:1
    }
  };

}



function loadMetrics(){

  try{

    const saved =
      localStorage.getItem("metrics");


    return saved
      ? JSON.parse(saved)
      : getDefaultMetrics();


  }catch(e){

    return getDefaultMetrics();

  }

}



function saveMetrics(){

  METRICS = {

    sleep:{
      target:
      Number(
        document.getElementById("set_sleep").value
      ) || 7,

      max:1
    },


    steps:{
      target:
      Number(
        document.getElementById("set_steps").value
      ) || 8000,

      max:1
    },


    training:{
      target:
      Number(
        document.getElementById("set_training").value
      ) || 2,

      max:1
    },


    water:{
      target:
      Number(
        document.getElementById("set_water").value
      ) || 2.5,

      max:1
    }

  };


  localStorage.setItem(
    "metrics",
    JSON.stringify(METRICS)
  );


  renderDashboard();

  showToast(
    "DIRECTION UPDATED"
  );

}




// =====================
// SYSTEM START
// =====================


function enterSystem(){

  const intro =
    document.getElementById("intro");


  const app =
    document.getElementById("app");



  intro.classList.add(
    "fadeOut"
  );



  setTimeout(()=>{


    intro.style.display =
      "none";


    app.style.display =
      "block";



    setTimeout(()=>{

      app.classList.add(
        "active"
      );

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



function saveData(data){

  localStorage.setItem(
    "liforge",
    JSON.stringify(data)
  );

}



function getTodayState(){

  const data =
    getData();



  const today =
    new Date()
    .toISOString()
    .split("T")[0];



  return data.find(
    item =>
    item.date === today
  ) || null;

}



function getDashboardData(){

  const day =
    getTodayState();



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




// =====================
// SCORE ENGINE
// =====================


function calcScore(
  sleep,
  steps,
  training,
  water
){


  const m =
    METRICS ||
    getDefaultMetrics();



  sleep =
    sleep || 0;


  steps =
    steps || 0;


  training =
    training || 0;


  water =
    water || 0;



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

    / 4 * 100

  );

}




function getMetricProgress(){

  const day =
    getTodayState();



  if(!day){

    return {

      sleep:0,
      steps:0,
      training:0,
      water:0

    };

  }



  const m =
    METRICS ||
    getDefaultMetrics();



  return {

    sleep:
    Math.min(
      Math.round(
        day.sleep /
        m.sleep.target *
        100
      ),
      100
    ),


    steps:
    Math.min(
      Math.round(
        day.steps /
        m.steps.target *
        100
      ),
      100
    ),


    training:
    Math.min(
      Math.round(
        day.training /
        m.training.target *
        100
      ),
      100
    ),


    water:
    Math.min(
      Math.round(
        day.water /
        m.water.target *
        100
      ),
      100
    )

  };

}
// =====================
// DASHBOARD RENDER
// =====================


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





  <div class="metricsList">



    ${createMetric(
      "SLEEP",
      day.sleep + "h",
      progress.sleep,
      "BALANCED"
    )}



    ${createMetric(
      "STEPS",
      day.steps,
      progress.steps,
      "BUILDING"
    )}



    ${createMetric(
      "TRAINING",
      day.training,
      progress.training,
      "ACTIVE"
    )}



    ${createMetric(
      "WATER",
      day.water + "L",
      progress.water,
      "HYDRATED"
    )}



  </div>



  `;

}





// =====================
// SINGLE METRIC CARD
// =====================


function createMetric(
  title,
  value,
  percent,
  status
){


return `


<div class="metricCard">


  <div class="metricHeader">


    <span class="metricTitle">
      ${title}
    </span>



    <span class="metricData">
      ${value}
    </span>


  </div>





  <div class="metricBarRow">


    <div class="metricBar">


      <div 
      class="progressFill"
      style="width:${percent}%">
      </div>


    </div>



    <span class="metricPercent">
      ${percent}%
    </span>


  </div>





  <div class="metricStatus">

    ${status}

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
    Number(
      sleepInput || 0
    );


  const steps =
    Number(
      stepsInput || 0
    );


  const training =
    Number(
      trainingInput || 0
    );


  const water =
    Number(
      waterInput || 0
    );




  const today =
    new Date()
    .toISOString()
    .split("T")[0];




  const data =
    getData();




  const todayIndex =
    data.findIndex(
      item =>
      item.date === today
    );





  let day;




  if(todayIndex !== -1){


    day =
      data[todayIndex];


  }else{


    day = {


      date:today,

      sleep:0,

      steps:0,

      training:0,

      water:0


    };


  }





  if(sleepInput !== ""){

    day.sleep =
      sleep;

  }




  if(stepsInput !== ""){

    day.steps +=
      steps;

  }




  if(trainingInput !== ""){

    day.training +=
      training;

  }




  if(waterInput !== ""){

    day.water +=
      water;

  }





  day.score =
    calcScore(
      day.sleep,
      day.steps,
      day.training,
      day.water
    );





  if(todayIndex !== -1){

    data[todayIndex] =
      day;


  }else{


    data.unshift(
      day
    );


  }




  saveData(
    data
  );




  document.getElementById("sleep").value =
    day.sleep;


  document.getElementById("steps").value =
    "";


  document.getElementById("training").value =
    "";


  document.getElementById("water").value =
    "";




  renderBuilding();

renderHistory();

renderDashboard();


  showToast(
    "DAY UPDATED"
  );


}


// =====================
// BUILDING SYSTEM
// 




function createBuildingLayout(chartWidth){

  const left = 10;
const right = 130;

const columns = [];

const gap = (right - left) / 6;

for(let i = 0; i < 7; i++){

  columns.push(
  left + i * gap
);

}
  return {

    columns: columns,

    startX:0,
    startY:100,

    left:10,

    right:130,

    top:0,

    bottom:100,

    width:140,
    height:100,


  };

}

function getBuildingPoint(value,index){

  const layout = createBuildingLayout();

  const x = layout.columns[index];

  const y =
    layout.bottom -
    (value / 100) *
    layout.height;


  return {
    x:x,
    y:y
  };

}

function getBuildingValues(){

  const data = getData()
    .slice(0,7)
    .reverse();


  const week = [
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ];


  let building = 0;


  data.forEach((day,index)=>{

    const gain =
      (day.score / 100) * 14;

    building += gain;

    week[index] = Math.round(building);

  });


  return week;


}

function renderBuilding(){

  const chart =
    document.getElementById("momentumChart");

  if(!chart){
    return;
  }
    const chartWidth = chart.clientWidth;

  const values = getBuildingValues();

  const layout = createBuildingLayout(chartWidth);



let pathData = "";

values.forEach((value,index)=>{

  if(value === null){
    return;
  }

  const point = getBuildingPoint(value,index);

const x = point.x;
const y = point.y;


  if(pathData === ""){

    pathData = `M ${layout.startX} ${layout.startY} L ${x} ${y}`;

  }else{

    pathData += ` L ${x} ${y}`;

  }

});



  let todayIndex = values.length - 1;

for(let i = values.length - 1; i >= 0; i--){

  if(values[i] !== null){

    todayIndex = i;
    break;

  }

}


const todayPoint =
  getBuildingPoint(
    values[todayIndex],
    todayIndex
  );


const lastX = todayPoint.x;

const lastY = todayPoint.y;



  const textX =
  lastX > 90
  ? lastX - 20
  : lastX + 4;



  chart.innerHTML = `

<div class="chartGuides">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>


<svg
id="buildingSvg"
viewBox="0 0 140 100"
preserveAspectRatio="none">


<defs>

<filter id="glow">

<feGaussianBlur
stdDeviation="1.2"
result="blur"/>

<feMerge>

<feMergeNode in="blur"/>

<feMergeNode in="SourceGraphic"/>

</feMerge>

</filter>

</defs>



<path

d="${pathData}"

fill="none"

stroke="#00aaff"

stroke-width="1.8"

stroke-linecap="round"

stroke-linejoin="round"

filter="url(#glow)"

/>

${values.map((value,index)=>{

  if(value === null){
    return "";
  }

  const point = getBuildingPoint(value,index);

const x = point.x;
const y = point.y;

  return `
  <circle
    cx="${x}"
    cy="${y}"
    r="2"
    fill="#00aaff"
  />
  `;

}).join("")}


<text
x="${textX}"
y="${lastY - 4}"
fill="#ffffff"
font-size="4">

${values[todayIndex]}%

</text>


</svg>


`;


const days =
document.getElementById("buildingDays");


if(days){

  days.innerHTML = "";

  values.forEach((value,index)=>{

  


    let label = "DAY " + (index + 1);


if(index === todayIndex){

  label = "TODAY";

}


    days.innerHTML += `

    <span>
    ${label}
    </span>

    `;

  });

}

}
// =====================
// HISTORY SYSTEM
// =====================

function renderHistory(){

const history =
document.getElementById("historyList");

if(!history){
return;
}

const data =
getData();

history.innerHTML = "";

if(!data.length){

history.innerHTML =
"<div>No data yet</div>";

return;

}


// Nagłówek tabeli

history.innerHTML = `

<div class="historyHeader">

<div>DAY</div>
<div>🌙</div>
<div>🦿</div>
<div>💦</div>
<div>🔥</div>
<div>⚡️</div>

</div>

`;


data
.slice(0,7)
.forEach((day,index)=>{

history.innerHTML += `

<div class="${index === 0 ? "historyToday" : "historyItem"}">

<div class="dayNumber">

${index === 0 ? "TODAY" : "DAY " + (data.length - index)}

</div>

<div>${day.sleep}h</div>

<div>${day.steps}</div>

<div>${day.water}L</div>

<div>${day.training}</div>

<div>${day.score}%</div>

</div>

`;

});

}

// =====================
// SETTINGS
// =====================


function showSettings(){


  document
  .getElementById("settingsView")
  .style.display =
  "flex";


}





function hideSettings(){


  document
  .getElementById("settingsView")
  .style.display =
  "none";


}







// =====================
// RESET DATA
// =====================


function clearHistory(){


  localStorage.removeItem(
    "liforge"
  );


  renderHistory();


  renderDashboard();



  showToast(
    "DATA CLEARED"
  );


}






// =====================
// TOAST SYSTEM
// =====================


function showToast(message){


  const toast =
    document.getElementById("toast");



  if(!toast){
    return;
  }




  toast.innerText =
    message;



  toast.classList.add(
    "show"
  );





  setTimeout(()=>{


    toast.classList.remove(
      "show"
    );


  },2500);



}







// =====================
// SERVICE WORKER / PWA
// =====================


if(
  "serviceWorker"
  in navigator
){


window.addEventListener(
"load",
()=>{


  navigator.serviceWorker

  .register(
    "/Liforgev2/service-worker.js"
  )


  .then(()=>{


    console.log(
      "LIFORGE PWA ready"
    );


  })


  .catch(error=>{


    console.log(
      "Service Worker error:",
      error
    );


  });



});


}
function showUpdate(){


document
.querySelector(".hero")
.style.display="none";



document
.getElementById("updatePage")
.style.display="block";


}
function showCore(){


document
.getElementById("updatePage")
.style.display="none";



document
.querySelector(".hero")
.style.display="block";


}

function showPage(page){
  const navButtons = document.querySelectorAll(".bottomNav button");

navButtons.forEach(btn => {
  btn.classList.remove("active");
});

const hero =
document.querySelector(".hero");

const update =
document.getElementById("updatePage");

  const history =
document.getElementById("historyPage");
  
const settings =
document.getElementById("settingsPage");


hero.style.display="none";
update.style.display="none";
  history.style.display="none";
  settings.style.display="none";



if(page==="core"){

hero.style.display="block";
  renderDashboard();

}


if(page==="update"){

update.style.display="block";

}

if(page==="history"){

history.style.display="block";

  renderBuilding();

renderHistory();

}
  if(page==="settings"){

settings.style.display="block";
    const active =
document.getElementById("nav-" + page);

if(active){

active.classList.add("active");

}

  }
  
}
