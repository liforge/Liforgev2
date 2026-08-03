// =====================
// LIFORGE APP
// METRICS + STORAGE SYSTEM
// =====================

let METRICS = loadMetrics();

function getDefaultMetrics(){
  return {
    sleep:{target:7,max:1},
    steps:{target:8000,max:1},
    training:{target:2,max:1},
    water:{target:2.5,max:1}
  };
}

function loadMetrics(){
  try{
    const saved = localStorage.getItem("metrics");
    return saved ? JSON.parse(saved) : getDefaultMetrics();
  }catch(e){
    return getDefaultMetrics();
  }
}

function getEl(id){ return document.getElementById(id) || null; }

function saveMetrics(){
  METRICS = {
    sleep:{target: Number(getEl("set_sleep")?.value) || 7, max:1},
    steps:{target: Number(getEl("set_steps")?.value) || 8000, max:1},
    training:{target: Number(getEl("set_training")?.value) || 2, max:1},
    water:{target: Number(getEl("set_water")?.value) || 2.5, max:1}
  };
  localStorage.setItem("metrics", JSON.stringify(METRICS));
  renderDashboard();
  showToast("DIRECTION UPDATED");
}

function enterSystem(){
  const intro = document.getElementById("intro");
  const app = document.getElementById("app");
  const loading = document.getElementById("systemLoading");

  intro.classList.add("fadeOut");

  setTimeout(()=>{
    intro.style.display = "none";
    loading.classList.add("active");

    setTimeout(()=>{
      loading.classList.remove("active");
      app.style.display = "block";
      setTimeout(()=>{ app.classList.add("active"); },50);
      renderDashboard();
    },1900);

  },500);
}

function getData(){
  try{
    return JSON.parse(localStorage.getItem("liforge")) || [];
  }catch(e){
    return [];
  }
}

function saveData(data){
  localStorage.setItem("liforge", JSON.stringify(data));
}

function getTodayState(){
  const data = getData();
  const today = new Date().toISOString().split("T")[0];
  return data.find(item => item.date === today) || null;
}

function getDashboardData(){
  const day = getTodayState();
  if(!day){ return {sleep:0,steps:0,training:0,water:0,score:0}; }
  return {sleep:day.sleep,steps:day.steps,training:day.training,water:day.water,score:day.score};
}

function calcScore(sleep,steps,training,water){
  const m = METRICS || getDefaultMetrics();
  sleep = sleep || 0; steps = steps || 0; training = training || 0; water = water || 0;
  return Math.round((
    Math.min(sleep / m.sleep.target, m.sleep.max) +
    Math.min(steps / m.steps.target, m.steps.max) +
    Math.min(training / m.training.target, m.training.max) +
    Math.min(water / m.water.target, m.water.max)
  ) / 4 * 100);
}

function getMetricProgress(){
  const day = getTodayState();
  if(!day){ return {sleep:0,steps:0,training:0,water:0}; }
  const m = METRICS || getDefaultMetrics();
  return {
    sleep: Math.min(Math.round(day.sleep / m.sleep.target * 100),100),
    steps: Math.min(Math.round(day.steps / m.steps.target * 100),100),
    training: Math.min(Math.round(day.training / m.training.target * 100),100),
    water: Math.min(Math.round(day.water / m.water.target * 100),100)
  };
}

function getStreak(){
  const data = getData();
  let streak = 0;
  for(let i = 0; i < data.length; i++){
    if(data[i].score >= 70){ streak++; }
    else{ break; }
  }
  return streak;
}

function renderDashboard(){
  const dashboard = document.getElementById("dashboard");
  if(!dashboard){ return; }
  const day = getDashboardData();
  const progress = getMetricProgress();
  const streak = getStreak();
  dashboard.innerHTML = `
  <div class="brand">
    <div class="brandTitle">LIFORGE</div>
    <div class="brandSubtitle">Forge Yourself</div>
  </div>
  <div class="coreScore">
    <div id="dateTimeBlock" class="dateTimeBlock"></div>
    <div id="dayCompare" class="dayCompare"></div>
    <div class="energyLabel">ENERGY SCORE</div>
    <div class="energyValue">${day.score}<span class="energyPercent">%</span></div>
    <div class="energyStatus">CURRENT ALIGNMENT</div>
    ${streak > 0 ? `<div class="streakBadge">🔥 ${streak} DAY STREAK</div>` : ""}
  </div>
  <div class="metricsList">
    ${createMetric("SLEEP", day.sleep + "h", progress.sleep, "BALANCED")}
    ${createMetric("STEPS", day.steps, progress.steps, "BUILDING")}
    ${createMetric("TRAINING", day.training, progress.training, "ACTIVE")}
    ${createMetric("WATER", day.water + "L", progress.water, "HYDRATED")}
  </div>
  `;
  renderDateTime();
  renderDayCompare();
}

function getDailyGain(day){
  return (day.score / 100) * 14;
}

function renderDayCompare(){
  const el = document.getElementById("dayCompare");
  if(!el){ return; }
  const data = getData();
  if(data.length < 2){
    el.innerHTML = "";
    return;
  }
  const todayGain = getDailyGain(data[0]);
  const yesterdayGain = getDailyGain(data[1]);
  const diff = Math.round(todayGain - yesterdayGain);

  if(diff > 0){
    el.innerHTML = `<span class="compareUp">▲ ${diff}%</span>`;
  }else if(diff < 0){
    el.innerHTML = `<span class="compareDown">▼ ${Math.abs(diff)}%</span>`;
  }else{
    el.innerHTML = `<span class="compareStable">STABLE</span>`;
  }
}

function renderDateTime(){
  const el = document.getElementById("dateTimeBlock");
  if(!el){ return; }
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,"0");
  const mm = String(now.getMonth()+1).padStart(2,"0");
  const yyyy = now.getFullYear();
  const dateStr = `${dd}.${mm}.${yyyy}`;
  const hh = String(now.getHours()).padStart(2,"0");
  const min = String(now.getMinutes()).padStart(2,"0");
  const timeStr = `${hh}:${min}`;
  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const dayName = days[now.getDay()];
  el.innerHTML = `
    <div class="dateText">${dateStr}</div>
    <div class="timeText">${timeStr}</div>
    <div class="dayNameText">${dayName}</div>
  `;
}

function createMetric(title,value,percent,status){
  return `
  <div class="metricCard">
    <div class="metricHeader">
      <span class="metricTitle">${title}</span>
      <span class="metricData">${value}</span>
    </div>
    <div class="metricBarRow">
      <div class="metricBar">
        <div class="progressFill" style="width:${percent}%"></div>
      </div>
      <span class="metricPercent">${percent}%</span>
    </div>
    <div class="metricStatus">${status}</div>
  </div>
  `;
}

function save(){
  const sleepEl = getEl("sleep");
  const stepsEl = getEl("steps");
  const trainingEl = getEl("training");
  const waterEl = getEl("water");

  const sleepInput = sleepEl?.value ?? "";
  const stepsInput = stepsEl?.value ?? "";
  const trainingInput = trainingEl?.value ?? "";
  const waterInput = waterEl?.value ?? "";

  let sleep = Number(sleepInput || 0);
  let steps = Number(stepsInput || 0);
  let training = Number(trainingInput || 0);
  let water = Number(waterInput || 0);

  if(sleep < 0) sleep = 0;
  if(sleep > 24) sleep = 24;
  if(steps < 0) steps = 0;
  if(training < 0) training = 0;
  if(water < 0) water = 0;

  const today = new Date().toISOString().split("T")[0];
  const data = getData();
  const todayIndex = data.findIndex(item => item.date === today);

  let day;
  if(todayIndex !== -1){ day = data[todayIndex]; }
  else{ day = {date:today,sleep:0,steps:0,training:0,water:0}; }

  if(sleepInput !== ""){ day.sleep = sleep; }
  if(stepsInput !== ""){ day.steps += steps; }
  if(trainingInput !== ""){ day.training += training; }
  if(waterInput !== ""){ day.water += water; }

  day.score = calcScore(day.sleep, day.steps, day.training, day.water);

  if(todayIndex !== -1){ data[todayIndex] = day; }
  else{ data.unshift(day); }

  saveData(data);

  if(sleepEl) sleepEl.value = day.sleep;
  if(stepsEl) stepsEl.value = "";
  if(trainingEl) trainingEl.value = "";
  if(waterEl) waterEl.value = "";

  renderBuilding();
  renderHistory();
  renderDashboard();
  showToast("DAY UPDATED");
}

function createBuildingLayout(chartWidth){
  const left = 0;
  const right = chartWidth;
  const columnsCount = 7;
  const gap = chartWidth / columnsCount;
  const columns = [];
  for(let i = 0; i < columnsCount; i++){ columns.push(gap / 2 + i * gap); }
  return {columns:columns,startX:0,startY:100,left:left,right:right,width:right-left,top:0,bottom:100,height:100};
}

function getBuildingPoint(layout, value, index){
  const x = layout.columns[index];
  const y = layout.bottom - (value / 100) * layout.height;
  return {x:x,y:y};
}

function getBuildingValues(){
  const allData = getData();
  const week = [null,null,null,null,null,null,null];
  const total = allData.length;
  if(total === 0){ return week; }

  // Pozycja w obecnym tygodniu budowania: 1..7, resetuje się co 7 dni
  const weekPosition = ((total - 1) % 7) + 1;

  // Bierzemy tylko dni z aktualnego, jeszcze niezakończonego tygodnia
  const currentWeekData = allData.slice(0, weekPosition).reverse();

  let building = 0;
  currentWeekData.forEach((day,index)=>{
    const gain = (day.score / 100) * 14;
    building += gain;
    week[index] = Math.round(building);
  });
  return week;
}

function createTubeOutline(points, width){
  const top = [];
  const bottom = [];
  for(let i = 0; i < points.length; i++){
    let prev = points[i - 1] || points[i];
    let next = points[i + 1] || points[i];
    let dx = next.x - prev.x;
    let dy = next.y - prev.y;
    let length = Math.sqrt(dx * dx + dy * dy) || 1;
    let nx = -dy / length;
    let ny = dx / length;
    top.push({x: points[i].x + nx * width, y: points[i].y + ny * width});
    bottom.push({x: points[i].x - nx * width, y: points[i].y - ny * width});
  }
  let path = "";
  top.forEach((p,i)=>{
    if(i === 0){ path += `M ${p.x} ${p.y}`; }
    else{ path += ` L ${p.x} ${p.y}`; }
  });
  for(let i = bottom.length - 1; i >= 0; i--){ path += ` L ${bottom[i].x} ${bottom[i].y}`; }
  path += " Z";
  return path;
}

function renderBuilding(){
  const chart = document.getElementById("momentumChart");
  if(!chart){ return; }
  const chartWidth = chart.clientWidth || 300;
  const values = getBuildingValues();
  const layout = createBuildingLayout(chartWidth);

  let todayIndex = values.length - 1;
  for(let i = values.length - 1; i >= 0; i--){
    if(values[i] !== null){ todayIndex = i; break; }
  }

  let pathData = "";
  let areaData = "";
  let linePoints = [];

  values.forEach((value,index)=>{
    if(value === null){ return; }
    const point = getBuildingPoint(layout, value, index);
    linePoints.push(point);
    const x = point.x;
    const y = point.y;
    if(pathData === ""){ pathData = `M ${x} ${y}`; areaData = `M ${x} ${y}`; }
    else{ pathData += ` L ${x} ${y}`; areaData += ` L ${x} ${y}`; }
  });

  const tubePath = createTubeOutline(linePoints, 0.7);
  const lastColumn = layout.columns[values.length - 1];
  areaData += ` L ${lastColumn} 100 L 0 100 Z`;

  const hasData = linePoints.length > 0;

  let pointsMarkup = "";
  let pointCount = 0;
  values.forEach((value,index)=>{
    if(value === null){ return; }
    const point = getBuildingPoint(layout, value, index);
    const isToday = index === todayIndex;
    let inner;
    if(isToday){
      inner = `
        <circle cx="${point.x}" cy="${point.y}" r="2.5" class="ripple ripple1" fill="none"/>
        <circle cx="${point.x}" cy="${point.y}" r="2.5" class="ripple ripple2" fill="none"/>
        <circle cx="${point.x}" cy="${point.y}" r="7.5" fill="url(#pointGlow)"/>
        <circle cx="${point.x}" cy="${point.y}" r="3.2" fill="#f2fbff" class="todayCore"/>
      `;
    }else{
      inner = `<circle cx="${point.x}" cy="${point.y}" r="6.8" fill="url(#pointGlow)"/><circle cx="${point.x}" cy="${point.y}" r="2.6" fill="#f2fbff"/>`;
    }
    const label = `<text x="${point.x}" y="${point.y - 6}" fill="#bfe6ff" font-size="6" text-anchor="middle">${value}</text>`;
    pointsMarkup += `<g class="chartPointGroup">${inner}${label}</g>`;
    pointCount++;
  });

  chart.innerHTML = `
  <div class="chartGuides"><div></div><div></div><div></div><div></div><div></div></div>
  <svg id="buildingSvg" viewBox="0 0 ${layout.width} 100" preserveAspectRatio="none">
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="2.6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#00b7ff" stop-opacity="0.55"/>
        <stop offset="40%" stop-color="#006dff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#003b80" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="pointGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7fd0ff" stop-opacity="0.95"/>
        <stop offset="35%" stop-color="#3fa8ea" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#1f7fc8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <path d="${areaData}" fill="url(#areaGradient)" opacity="0.9"/>
    <path d="${pathData}" class="chartLineCore" fill="none" stroke="#4fb8ff" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -1)"/>
    <path d="${tubePath}" class="chartLineGlow" fill="none" stroke="#2f9fe8" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#lineGlow)" opacity="0.85"/>
    ${pointsMarkup}
  </svg>
  `;

  animateChartReveal(chart, pointCount);

  const days = document.getElementById("buildingDays");
  if(days){
    days.innerHTML = "";
    values.forEach((value,index)=>{
      let label = "DAY " + (index + 1);
      if(index === todayIndex && hasData){ label = "TODAY"; }
      days.innerHTML += `<span>${label}</span>`;
    });
  }
}

function animateChartReveal(chart, pointCount){
  const svgEl = chart.querySelector("#buildingSvg");
  if(!svgEl || pointCount === 0){ return; }

  const corePath = svgEl.querySelector(".chartLineCore");
  const glowPath = svgEl.querySelector(".chartLineGlow");
  const pointGroups = svgEl.querySelectorAll(".chartPointGroup");

  const stepDuration = 260;
  const lineDuration = Math.max(500, pointCount * stepDuration);

  [corePath, glowPath].forEach(p=>{
    if(!p){ return; }
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

  // force reflow, żeby przejście zadziałało od pełnego offsetu
  void svgEl.getBoundingClientRect();

  [corePath, glowPath].forEach(p=>{
    if(!p){ return; }
    p.style.transition = `stroke-dashoffset ${lineDuration}ms ease-out`;
    p.style.strokeDashoffset = "0";
  });

  pointGroups.forEach((g,i)=>{
    g.style.opacity = "0";
    g.style.transition = "opacity .35s ease";
    setTimeout(()=>{
      g.style.opacity = "1";
    }, i * stepDuration + 80);
  });
}

let historyDisplayLimit = 7;

function renderHistory(){
  const history = document.getElementById("historyList");
  if(!history){ return; }
  const data = getData();
  history.innerHTML = "";
  if(!data.length){
    history.innerHTML = "<div>No data yet</div>";
    updateViewMoreButton(0, 0);
    return;
  }
  history.innerHTML = `
  <div class="historyHeader">
    <div></div><div>SLEEP</div><div>STEPS</div><div>WATER</div><div>TRAIN</div><div>SCORE</div>
  </div>
  `;
  data.slice(0, historyDisplayLimit).forEach((day,index)=>{
    history.innerHTML += `
    <div class="${index === 0 ? "historyToday" : "historyItem"}">
      <div class="dayNumber">${index === 0 ? "TODAY" : "DAY " + (data.length - index)}</div>
      <div>${day.sleep}h</div>
      <div>${day.steps}</div>
      <div>${day.water}L</div>
      <div>${day.training}</div>
      <div>${day.score}%</div>
    </div>
    `;
  });
  updateViewMoreButton(data.length, historyDisplayLimit);
}

function updateViewMoreButton(totalDays, shownDays){
  const btn = document.getElementById("viewMoreBtn");
  const hideBtn = document.getElementById("hideHistoryBtn");
  if(!btn){ return; }
  if(totalDays > shownDays){
    btn.style.display = "block";
    const remaining = totalDays - shownDays;
    btn.textContent = "View full history (+" + Math.min(remaining, 7) + ")";
  }else{
    btn.style.display = "none";
  }
  if(hideBtn){
    hideBtn.style.display = shownDays > 7 ? "block" : "none";
  }
}

function loadMoreHistory(){
  historyDisplayLimit += 7;
  renderHistory();
}

function hideHistory(){
  historyDisplayLimit = 7;
  renderHistory();
}

function exportData(){
  const data = getData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "liforge-data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("DATA EXPORTED");
}

function clearHistory(){
  localStorage.removeItem("liforge");
  renderHistory();
  renderDashboard();
  showToast("DATA CLEARED");
}

function showToast(message){
  const toast = document.getElementById("toast");
  if(!toast){ return; }
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(()=>{ toast.classList.remove("show"); },2500);
}

function showPage(page){
  const navButtons = document.querySelectorAll(".bottomNav button");
  navButtons.forEach(btn => { btn.classList.remove("active"); });

  const hero = document.querySelector(".hero");
  const update = document.getElementById("updatePage");
  const history = document.getElementById("historyPage");
  const settings = document.getElementById("settingsPage");

  hero.style.display="none";
  update.style.display="none";
  history.style.display="none";
  settings.style.display="none";

  if(page==="core"){ hero.style.display="block"; renderDashboard(); }
  if(page==="update"){ update.style.display="block"; }
  if(page==="history"){ history.style.display="block"; renderBuilding(); renderHistory(); }
  if(page==="settings"){ settings.style.display="block"; }

  const active = document.getElementById("nav-" + page);
  if(active){ active.classList.add("active"); }
}

// =====================
// CZĄSTECZKI TŁA
// =====================
function generateParticles(){
  const container = document.getElementById("particles");
  if(!container){ return; }
  const count = 22;
  for(let i = 0; i < count; i++){
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 3 + 1;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.bottom = "-10px";
    const duration = Math.random() * 14 + 10;
    const delay = Math.random() * 14;
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = "-" + delay + "s";
    container.appendChild(p);
  }
}

// init: pokaż dashboard od razu w kontenerze hero
document.addEventListener("DOMContentLoaded", ()=>{
  showPage("core");
  generateParticles();
  setInterval(renderDateTime, 30000);
});

// =====================
// SERVICE WORKER / PWA
// =====================
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker
      .register("/Liforgev2/service-worker.js")
      .then(()=>{ console.log("LIFORGE PWA ready"); })
      .catch(error=>{ console.log("Service Worker error:", error); });
  });
}
