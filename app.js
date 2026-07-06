// =====================
// METRICS (system konfiguracji)
// =====================
let METRICS = loadMetrics();

function loadMetrics(){
  const m = localStorage.getItem("metrics");
  return m ? JSON.parse(m) : {
    sleep: { target: 7, max: 1 },
    steps: { target: 8000, max: 1 },
    training: { target: 2, max: 1 },
    water: { target: 2.5, max: 1 }
  };
}

function saveMetrics(){
  METRICS = {
    sleep: { target: Number(document.getElementById("set_sleep").value) || 7, max: 1 },
    steps: { target: Number(document.getElementById("set_steps").value) || 8000, max: 1 },
    training: { target: Number(document.getElementById("set_training").value) || 2, max: 1 },
    water: { target: Number(document.getElementById("set_water").value) || 2.5, max: 1 }
  };

  localStorage.setItem("metrics", JSON.stringify(METRICS));
  alert("Saved metrics");
}

// =====================
// APP CORE
// =====================
function enterSystem(){
  document.getElementById("intro").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function getData(){
  try{
    return JSON.parse(localStorage.getItem("liforge")) || [];
  }catch{
    return [];
  }
}

function saveData(data){
  localStorage.setItem("liforge", JSON.stringify(data));
}

// =====================
// SCORE ENGINE (METRICS-BASED)
// =====================
function calcScore(sleep, steps, training, water){

  sleep = sleep || 0;
  steps = steps || 0;
  training = training || 0;
  water = water || 0;

  return Math.round(
    (
      Math.min(sleep / METRICS.sleep.target, METRICS.sleep.max) +
      Math.min(steps / METRICS.steps.target, METRICS.steps.max) +
      Math.min(training / METRICS.training.target, METRICS.training.max) +
      Math.min(water / METRICS.water.target, METRICS.water.max)
    ) / 4 * 100
  );
}

// =====================
// SAVE DATA
// =====================
function save(){

  const sleep = Number(document.getElementById("sleep").value || 0);
  const steps = Number(document.getElementById("steps").value || 0);
  const training = Number(document.getElementById("training").value || 0);
  const water = Number(document.getElementById("water").value || 0);

  const data = getData();

  data.unshift({
    date: new Date().toISOString().split("T")[0],
    sleep,
    steps,
    training,
    water,
    score: calcScore(sleep, steps, training, water)
  });

  saveData(data);

  document.getElementById("sleep").value = "";
  document.getElementById("steps").value = "";
  document.getElementById("training").value = "";
  document.getElementById("water").value = "";

  alert("Saved");
}

// =====================
// HISTORY
// =====================
function renderHistory(){
  const h = document.getElementById("history");
  const data = getData();

  h.innerHTML = "";

  if(!data.length){
    h.innerHTML = "<div>No data yet</div>";
    return;
  }

  data.slice(0,10).forEach(d=>{
    h.innerHTML += `
      <div class="historyItem">
        <div>${d.date} • ${d.sleep}h • ${d.steps} • ${d.training}h • ${d.water}L</div>
        <div>${d.score}%</div>
      </div>
    `;
  });
}

function showHistory(){
  renderHistory();
  document.getElementById("historyView").style.display = "flex";
}

function hideHistory(){
  document.getElementById("historyView").style.display = "none";
}

// =====================
// RESET
// =====================
function clearHistory(){
  localStorage.removeItem("liforge");
  renderHistory();
}
