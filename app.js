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

// =====================
// TŁUMACZENIA / i18n
// =====================
const translations = {
  goInside: {en:"GO INSIDE", pl:"WEJDŹ"},
  loadingSystem: {en:"LOADING SYSTEM", pl:"WCZYTYWANIE SYSTEMU"},
  energyScoreLabel: {en:"ENERGY SCORE", pl:"WYNIK ENERGII"},
  currentAlignment: {en:"CURRENT ALIGNMENT", pl:"AKTUALNE DOSTROJENIE"},
  sleep: {en:"SLEEP", pl:"SEN"},
  steps: {en:"STEPS", pl:"KROKI"},
  training: {en:"TRAINING", pl:"TRENING"},
  water: {en:"WATER", pl:"WODA"},
  balanced: {en:"BALANCED", pl:"ZRÓWNOWAŻONY"},
  building: {en:"BUILDING", pl:"BUDOWANIE"},
  active: {en:"ACTIVE", pl:"AKTYWNY"},
  hydrated: {en:"HYDRATED", pl:"NAWODNIONY"},
  updateTodayTitle: {en:"UPDATE TODAY", pl:"AKTUALIZUJ DZIŚ"},
  updateTodayBtn: {en:"Update Today", pl:"Aktualizuj dziś"},
  hoursPh: {en:"Hours", pl:"Godziny"},
  stepsPh: {en:"Steps", pl:"Kroki"},
  sessionsPh: {en:"Sessions", pl:"Sesje"},
  litersPh: {en:"Liters", pl:"Litry"},
  weeklyProgress: {en:"WEEKLY PROGRESS", pl:"PROGRES TYGODNIA"},
  weeklyProgressInfo: {
    en:"Weekly Progress shows how you're building your week. Each day can add up to 14% to your weekly progress. Today's gain depends on your Energy Score.",
    pl:"Progres Tygodnia pokazuje, jak budujesz swój tydzień. Każdy dzień może dodać maksymalnie 14% do tygodniowego progresu. Dzisiejszy przyrost zależy od Twojego Energy Score."
  },
  historyTitle: {en:"HISTORY", pl:"HISTORIA"},
  sevenDays: {en:"7 DAYS", pl:"7 DNI"},
  viewFullHistory: {en:"View full history", pl:"Pokaż całą historię"},
  hideHistory: {en:"Hide history", pl:"Zwiń historię"},
  exportData: {en:"Export data (.json)", pl:"Eksportuj dane (.json)"},
  noDataYet: {en:"No data yet", pl:"Brak danych"},
  directionTitle: {en:"DIRECTION", pl:"KIERUNEK"},
  yourNamePh: {en:"Your name", pl:"Twoje imię"},
  stepsTarget: {en:"Steps target", pl:"Cel: kroki"},
  trainingTarget: {en:"Training target", pl:"Cel: trening"},
  waterTarget: {en:"Water target", pl:"Cel: woda"},
  saveMetrics: {en:"Save metrics", pl:"Zapisz ustawienia"},
  languageLabel: {en:"Language", pl:"Język"},
  directionUpdated: {en:"DIRECTION UPDATED", pl:"ZAKTUALIZOWANO KIERUNEK"},
  dayUpdated: {en:"DAY UPDATED", pl:"DZIEŃ ZAKTUALIZOWANY"},
  dataCleared: {en:"DATA CLEARED", pl:"DANE WYCZYSZCZONE"},
  dataExported: {en:"DATA EXPORTED", pl:"DANE WYEKSPORTOWANE"},
  today: {en:"TODAY", pl:"DZISIAJ"},
  dayLabel: {en:"DAY", pl:"DZIEŃ"},
  dailyTab: {en:"DAILY", pl:"DZIENNIE"},
  weeklyTab: {en:"WEEKLY", pl:"TYGODNIOWO"},
  weekLabel: {en:"WEEK", pl:"TYDZIEŃ"},
  openWeek: {en:"OPEN WEEK", pl:"OTWARTY TYDZIEŃ"},
  welcomeBack: {en:"WELCOME BACK", pl:"WITAJ Z POWROTEM"},
  stable: {en:"STABLE", pl:"STABILNIE"},
  score: {en:"SCORE", pl:"WYNIK"},
  trainShort: {en:"TRAIN", pl:"TREN"},
  dayStreak: {en:"DAY STREAK", pl:"DNI STREAK"}
};

let currentLang = "en";

function t(key){
  const entry = translations[key];
  if(!entry){ return key; }
  return entry[currentLang] || entry.en;
}

function setLanguage(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyTranslations();
  updateLanguageButtons();
}

function updateLanguageButtons(){
  const btnEn = getEl("langBtnEn");
  const btnPl = getEl("langBtnPl");
  if(btnEn){ btnEn.classList.toggle("active", currentLang === "en"); }
  if(btnPl){ btnPl.classList.toggle("active", currentLang === "pl"); }
}

function applyTranslations(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });
  renderDashboard();
  renderHistory();
  renderBuilding();
}

function loadUserName(){
  return localStorage.getItem("userName") || "";
}

function saveMetrics(){
  METRICS = {
    sleep:{target: Number(getEl("set_sleep")?.value) || 7, max:1},
    steps:{target: Number(getEl("set_steps")?.value) || 8000, max:1},
    training:{target: Number(getEl("set_training")?.value) || 2, max:1},
    water:{target: Number(getEl("set_water")?.value) || 2.5, max:1}
  };
  localStorage.setItem("metrics", JSON.stringify(METRICS));

  const nameInput = getEl("set_name");
  if(nameInput){
    const name = nameInput.value.trim();
    localStorage.setItem("userName", name);
  }

  renderDashboard();
  showToast(t("directionUpdated"));
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
      showWelcomeBanner();
    },1900);

  },500);
}

function showWelcomeBanner(){
  const name = loadUserName();
  if(!name){ return; }
  const el = document.getElementById("welcomeBanner");
  if(!el){ return; }
  el.textContent = t("welcomeBack") + " " + name.toUpperCase();
  el.classList.add("show");
  setTimeout(()=>{
    el.classList.remove("show");
    setTimeout(()=>{ el.textContent = ""; },600);
  },3000);
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
    <div class="energyLabel">${t("energyScoreLabel")}</div>
    <div class="energyValue">${day.score}<span class="energyPercent">%</span></div>
    <div class="energyStatus">${t("currentAlignment")}</div>
    ${streak > 0 ? `<div class="streakBadge">🔥 ${streak} ${t("dayStreak")}</div>` : ""}
  </div>
  <div class="metricsList">
    ${createMetric(t("sleep"), day.sleep + "h", progress.sleep, t("balanced"))}
    ${createMetric(t("steps"), day.steps, progress.steps, t("building"))}
    ${createMetric(t("training"), day.training, progress.training, t("active"))}
    ${createMetric(t("water"), day.water + "L", progress.water, t("hydrated"))}
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
    el.innerHTML = `<span class="compareStable">${t("stable")}</span>`;
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
  showToast(t("dayUpdated"));
}

function createBuildingLayout(chartWidth, columnsCount){
  const left = 0;
  const right = chartWidth;
  columnsCount = columnsCount || 7;
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

const MAX_WEEKS_DISPLAY = 7;

function getAllWeeks(){
  // Zwraca tablicę tygodni w porządku chronologicznym (najstarszy pierwszy)
  // każdy element: {days:[...chronologicznie], finalPercent:Number, isOpen:Boolean}
  const allData = getData();
  const chronological = allData.slice().reverse();
  const weeks = [];
  for(let i = 0; i < chronological.length; i += 7){
    const chunk = chronological.slice(i, i + 7);
    let building = 0;
    chunk.forEach(day=>{
      building += (day.score / 100) * 14;
    });
    weeks.push({
      days: chunk,
      finalPercent: Math.round(building),
      isOpen: chunk.length < 7
    });
  }
  return weeks;
}

function getWeeklyValues(){
  const weeks = getAllWeeks();
  const slots = [];
  for(let i = 0; i < MAX_WEEKS_DISPLAY; i++){ slots.push(null); }
  const visibleWeeks = weeks.slice(0, MAX_WEEKS_DISPLAY);
  visibleWeeks.forEach((week,i)=>{
    slots[i] = week.finalPercent;
  });
  return slots;
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

  const isWeekly = currentHistoryView === "weekly";
  const values = isWeekly ? getWeeklyValues() : getBuildingValues();
  const columnsCount = isWeekly ? MAX_WEEKS_DISPLAY : 7;
  const layout = createBuildingLayout(chartWidth, columnsCount);

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
      let label;
      if(isWeekly){
        label = t("weekLabel") + " " + (index + 1);
        if(index === todayIndex && hasData){ label = t("openWeek"); }
      }else{
        label = t("dayLabel") + " " + (index + 1);
        if(index === todayIndex && hasData){ label = t("today"); }
      }
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
let currentHistoryView = "daily";

function switchHistoryView(mode){
  if(currentHistoryView === mode){ return; }
  currentHistoryView = mode;

  const tabDaily = document.getElementById("tabDaily");
  const tabWeekly = document.getElementById("tabWeekly");
  if(tabDaily){ tabDaily.classList.toggle("active", mode === "daily"); }
  if(tabWeekly){ tabWeekly.classList.toggle("active", mode === "weekly"); }

  historyDisplayLimit = 7;
  renderBuilding();
  renderHistory();
}

function renderHistory(){
  if(currentHistoryView === "weekly"){
    renderWeeklyHistory();
  }else{
    renderDailyHistory();
  }
}

function renderDailyHistory(){
  const history = document.getElementById("historyList");
  if(!history){ return; }
  const data = getData();
  history.innerHTML = "";
  if(!data.length){
    history.innerHTML = `<div>${t("noDataYet")}</div>`;
    updateViewMoreButton(0, 0);
    return;
  }

  const circumference = 2 * Math.PI * 16;

  data.slice(0, historyDisplayLimit).forEach((day,index)=>{
    const isToday = index === 0;
    const percent = Math.max(0, Math.min(100, day.score));
    const offset = circumference * (1 - percent / 100);
    const label = isToday ? t("today") : t("dayLabel") + " " + (data.length - index);

    history.innerHTML += `
    <div class="dayCard ${isToday ? "dayCardToday" : ""}">
      <div class="dayCardLeft">
        <div class="dayCardLabel ${isToday ? "today" : ""}">${label}</div>
        <div class="dayCardMetrics">
          <div>
            <div class="dayCardMetricValue">${day.sleep}h</div>
            <div class="dayCardMetricLabel">${t("sleep")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${day.steps}</div>
            <div class="dayCardMetricLabel">${t("steps")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${day.water}L</div>
            <div class="dayCardMetricLabel">${t("water")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${day.training}</div>
            <div class="dayCardMetricLabel">${t("trainShort")}</div>
          </div>
        </div>
      </div>
      <div class="dayCardRing">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="${isToday ? "#35d9ff" : "#5ecbff"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
        </svg>
        <div class="dayCardRingText">${percent}%</div>
      </div>
    </div>
    `;
  });

  updateViewMoreButton(data.length, historyDisplayLimit);
}

function renderWeeklyHistory(){
  const history = document.getElementById("historyList");
  if(!history){ return; }
  const weeks = getAllWeeks();
  history.innerHTML = "";
  if(!weeks.length){
    history.innerHTML = `<div>${t("noDataYet")}</div>`;
    updateViewMoreButton(0, 0);
    return;
  }

  const circumference = 2 * Math.PI * 16;
  const reversedWeeks = weeks.slice().reverse();

  reversedWeeks.slice(0, historyDisplayLimit).forEach((week,index)=>{
    const isOpen = week.isOpen;
    const percent = Math.max(0, Math.min(100, week.finalPercent));
    const offset = circumference * (1 - percent / 100);
    const weekNumber = weeks.length - index;
    const label = isOpen ? t("openWeek") : t("weekLabel") + " " + weekNumber;

    const dayCount = week.days.length || 1;
    const avgSleep = (week.days.reduce((sum,d)=>sum + d.sleep, 0) / dayCount).toFixed(1);
    const totalSteps = week.days.reduce((sum,d)=>sum + d.steps, 0);
    const avgWater = (week.days.reduce((sum,d)=>sum + d.water, 0) / dayCount).toFixed(1);
    const totalTraining = week.days.reduce((sum,d)=>sum + d.training, 0);

    history.innerHTML += `
    <div class="dayCard ${isOpen ? "dayCardToday" : ""}">
      <div class="dayCardLeft">
        <div class="dayCardLabel ${isOpen ? "today" : ""}">${label}</div>
        <div class="dayCardMetrics">
          <div>
            <div class="dayCardMetricValue">${avgSleep}h</div>
            <div class="dayCardMetricLabel">${t("sleep")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${totalSteps}</div>
            <div class="dayCardMetricLabel">${t("steps")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${avgWater}L</div>
            <div class="dayCardMetricLabel">${t("water")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${totalTraining}</div>
            <div class="dayCardMetricLabel">${t("trainShort")}</div>
          </div>
        </div>
      </div>
      <div class="dayCardRing">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="${isOpen ? "#35d9ff" : "#5ecbff"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
        </svg>
        <div class="dayCardRingText">${percent}%</div>
      </div>
    </div>
    `;
  });

  updateViewMoreButton(weeks.length, historyDisplayLimit);
}

function updateViewMoreButton(totalDays, shownDays){
  const btn = document.getElementById("viewMoreBtn");
  const hideBtn = document.getElementById("hideHistoryBtn");
  if(!btn){ return; }
  if(totalDays > shownDays){
    btn.style.display = "block";
    const remaining = totalDays - shownDays;
    btn.textContent = t("viewFullHistory") + " (+" + Math.min(remaining, 7) + ")";
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
  showToast(t("dataExported"));
}

function clearHistory(){
  localStorage.removeItem("liforge");
  renderHistory();
  renderDashboard();
  showToast(t("dataCleared"));
}

function toggleInfoTooltip(event){
  event.stopPropagation();
  const tooltip = document.getElementById("infoTooltip");
  if(!tooltip){ return; }
  tooltip.classList.toggle("show");
}

document.addEventListener("click", (e)=>{
  const tooltip = document.getElementById("infoTooltip");
  if(!tooltip){ return; }
  if(!e.target.closest(".infoIcon") && !e.target.closest(".infoTooltip")){
    tooltip.classList.remove("show");
  }
});

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
  if(page==="settings"){
    settings.style.display="block";
    const nameInput = getEl("set_name");
    if(nameInput){ nameInput.value = loadUserName(); }
  }

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
  currentLang = localStorage.getItem("lang") || "en";
  showPage("core");
  applyTranslations();
  updateLanguageButtons();
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
