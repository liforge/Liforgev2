function enterSystem(){
  document.getElementById("intro").style.display="none";
  document.getElementById("app").style.display="block";
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

function calcScore(sleep,steps,training,water){

  sleep = sleep || 0;
  steps = steps || 0;
  training = training || 0;
  water = water || 0;

  return Math.round(
    (
      Math.min(sleep/7,1) +
      Math.min(steps/8000,1) +
      Math.min(training/2,1) +
      Math.min(water/2.5,1)
    ) / 4 * 100
  );
}

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
    score: calcScore(sleep,steps,training,water)
  });

  saveData(data);

  document.getElementById("sleep").value="";
  document.getElementById("steps").value="";
  document.getElementById("training").value="";
  document.getElementById("water").value="";

  alert("Saved");
}

function renderHistory(){
  const h = document.getElementById("history");
  const data = getData();

  h.innerHTML="";

  if(!data.length){
    h.innerHTML="<div>No data yet</div>";
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
  document.getElementById("historyView").style.display="flex";
}

function hideHistory(){
  document.getElementById("historyView").style.display="none";
}

function clearHistory(){
  localStorage.removeItem("liforge");
  renderHistory();
}
