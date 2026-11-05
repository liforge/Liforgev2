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
    water:{target:2.5,max:1},
    language:{target:20,max:1},
    study:{target:60,max:1}
  };
}

function loadMetrics(){
  try{
    const saved = localStorage.getItem("metrics");
    const defaults = getDefaultMetrics();
    if(!saved){ return defaults; }
    const parsed = JSON.parse(saved);
    // scalamy z domyślnymi, żeby starsze zapisy (bez language/study) nie powodowały błędów
    return Object.assign({}, defaults, parsed);
  }catch(e){
    return getDefaultMetrics();
  }
}

function fmtMin(m){
  m = Math.max(0, Math.round(m || 0));
  if(m < 60){ return m + "m"; }
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? h + "h " + r + "m" : h + "h";
}

function getEl(id){ return document.getElementById(id) || null; }

// =====================
// TŁUMACZENIA / i18n
// =====================
const translations = {
  goInside: {en:"GO INSIDE", pl:"WEJDŹ", de:"REIN"},
  loadingSystem: {en:"LOADING SYSTEM", pl:"WCZYTYWANIE SYSTEMU", de:"SYSTEM WIRD GELADEN"},
  energyScoreLabel: {en:"ENERGY SCORE", pl:"WYNIK ENERGII", de:"ENERGIEWERT"},
  currentAlignment: {en:"CURRENT ALIGNMENT", pl:"AKTUALNE DOSTROJENIE", de:"AKTUELLER ZUSTAND"},
  sleep: {en:"SLEEP", pl:"SEN", de:"SCHLAF"},
  steps: {en:"STEPS", pl:"KROKI", de:"SCHRITTE"},
  training: {en:"TRAINING", pl:"TRENING", de:"TRAINING"},
  water: {en:"WATER", pl:"WODA", de:"WASSER"},
  balanced: {en:"BALANCED", pl:"ZRÓWNOWAŻONY", de:"AUSGEGLICHEN"},
  building: {en:"BUILDING", pl:"BUDOWANIE", de:"AUFBAU"},
  active: {en:"ACTIVE", pl:"AKTYWNY", de:"AKTIV"},
  hydrated: {en:"HYDRATED", pl:"NAWODNIONY", de:"HYDRIERT"},
  updateTodayTitle: {en:"DAILY LOG", pl:"DZIENNIK DNIA", de:"TAGESPROTOKOLL"},
  updateTodayBtn: {en:"Update Today", pl:"Aktualizuj dziś", de:"Heute aktualisieren"},
  updateYourData: {en:"UPDATE YOUR DATA", pl:"ZAKTUALIZUJ DANE", de:"DATEN AKTUALISIEREN"},
  keepInSync: {en:"Keep your system in sync.", pl:"Utrzymuj swój system w synchronizacji.", de:"Halte dein System synchron."},
  pressToAddTraining: {en:"Press to add one training", pl:"Kliknij, aby dodać trening", de:"Tippen, um ein Training hinzuzufügen"},
  trainingsAddedToday: {en:"training added today", pl:"treningów dodanych dziś", de:"Trainings heute hinzugefügt"},
  saveUpdatesBtn: {en:"SAVE UPDATES", pl:"ZAPISZ ZMIANY", de:"ÄNDERUNGEN SPEICHERN"},
  lockedIn: {en:"LOCKED IN", pl:"ZABLOKOWANE", de:"GESPEICHERT"},
  hoursPh: {en:"Hours", pl:"Godziny", de:"Stunden"},
  stepsPh: {en:"Steps", pl:"Kroki", de:"Schritte"},
  sessionsPh: {en:"Sessions", pl:"Sesje", de:"Einheiten"},
  litersPh: {en:"Liters", pl:"Litry", de:"Liter"},
  weeklyProgress: {en:"WEEKLY PROGRESS", pl:"PROGRES TYGODNIA", de:"WOCHENFORTSCHRITT"},
  weeklyProgressInfo: {
    en:"Weekly Progress shows how you're building your week. Each day can add up to 14% to your weekly progress. Today's gain depends on your Energy Score.",
    pl:"Progres Tygodnia pokazuje, jak budujesz swój tydzień. Każdy dzień może dodać maksymalnie 14% do tygodniowego progresu. Dzisiejszy przyrost zależy od Twojego Energy Score.",
    de:"Der Wochenfortschritt zeigt, wie du deine Woche aufbaust. Jeder Tag kann bis zu 14% zum Wochenfortschritt beitragen. Der heutige Zuwachs hängt von deinem Energiewert ab."
  },
  btsInfo: {
    en:"BTS - Based on Yesterday - Shows your current progress relative to yesterday.",
    pl:"BTS - Based on Yesterday - Pokazuje Twój obecny postęp w porównaniu do wczoraj.",
    de:"BTS - Based on Yesterday - Zeigt deinen aktuellen Fortschritt im Vergleich zu gestern."
  },
  historyTitle: {en:"HISTORY", pl:"HISTORIA", de:"VERLAUF"},
  sevenDays: {en:"7 DAYS", pl:"7 DNI", de:"7 TAGE"},
  viewFullHistory: {en:"View full history", pl:"Pokaż całą historię", de:"Vollständigen Verlauf anzeigen"},
  hideHistory: {en:"Hide history", pl:"Zwiń historię", de:"Verlauf ausblenden"},
  exportData: {en:"Export data (.json)", pl:"Eksportuj dane (.json)", de:"Daten exportieren (.json)"},
  noDataYet: {en:"No data yet", pl:"Brak danych", de:"Noch keine Daten"},
  directionTitle: {en:"DIRECTION", pl:"KIERUNEK", de:"RICHTUNG"},
  yourNamePh: {en:"Your name", pl:"Twoje imię", de:"Dein Name"},
  stepsTarget: {en:"Steps target", pl:"Cel: kroki", de:"Ziel: Schritte"},
  trainingTarget: {en:"Training target", pl:"Cel: trening", de:"Ziel: Training"},
  waterTarget: {en:"Water target", pl:"Cel: woda", de:"Ziel: Wasser"},
  saveMetrics: {en:"Save metrics", pl:"Zapisz ustawienia", de:"Einstellungen speichern"},
  resetAllDays: {en:"RESET ALL DAYS", pl:"RESETUJ WSZYSTKIE DNI", de:"ALLE TAGE ZURÜCKSETZEN"},
  resetAllDaysConfirm: {
    en:"This will permanently delete all your logged days. Are you sure?",
    pl:"To trwale usunie wszystkie zapisane dni. Na pewno?",
    de:"Dadurch werden alle erfassten Tage dauerhaft gelöscht. Bist du sicher?"
  },
  languageLabel: {en:"Language", pl:"Język", de:"Sprache"},
  directionUpdated: {en:"DIRECTION UPDATED", pl:"ZAKTUALIZOWANO KIERUNEK", de:"RICHTUNG AKTUALISIERT"},
  dayUpdated: {en:"DAY UPDATED", pl:"DZIEŃ ZAKTUALIZOWANY", de:"TAG AKTUALISIERT"},
  dataCleared: {en:"DATA CLEARED", pl:"DANE WYCZYSZCZONE", de:"DATEN GELÖSCHT"},
  dataExported: {en:"DATA EXPORTED", pl:"DANE WYEKSPORTOWANE", de:"DATEN EXPORTIERT"},
  today: {en:"TODAY", pl:"DZISIAJ", de:"HEUTE"},
  dayLabel: {en:"DAY", pl:"DZIEŃ", de:"TAG"},
  dailyTab: {en:"DAILY", pl:"DZIENNIE", de:"TÄGLICH"},
  weeklyTab: {en:"WEEKLY", pl:"TYGODNIOWO", de:"WÖCHENTLICH"},
  weekLabel: {en:"WEEK", pl:"TYDZIEŃ", de:"WOCHE"},
  openWeek: {en:"OPEN WEEK", pl:"OTWARTY TYDZIEŃ", de:"OFFENE WOCHE"},
  welcomeBack: {en:"WELCOME BACK", pl:"WITAJ Z POWROTEM", de:"WILLKOMMEN ZURÜCK"},
  stable: {en:"STABLE", pl:"STABILNIE", de:"STABIL"},
  score: {en:"SCORE", pl:"WYNIK", de:"WERT"},
  trainShort: {en:"TRAIN", pl:"TREN", de:"TRAIN"},
  language: {en:"LANGUAGE", pl:"JĘZYK OBCY", de:"FREMDSPRACHE"},
  langShort: {en:"LANG", pl:"JĘZ.", de:"SPR."},
  study: {en:"STUDY", pl:"NAUKA", de:"LERNEN"},
  focused: {en:"FOCUSED", pl:"SKUPIONY", de:"FOKUSSIERT"},
  growing: {en:"GROWING", pl:"ROZWÓJ", de:"WACHSEND"},
  languageTarget: {en:"Language target (min)", pl:"Cel: język obcy (min)", de:"Ziel: Fremdsprache (Min.)"},
  studyTarget: {en:"Study target (min)", pl:"Cel: nauka (min)", de:"Ziel: Lernen (Min.)"},
  dayStreak: {en:"DAY STREAK", pl:"DNI STREAK", de:"TAGE STREAK"}
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
  const btnDe = getEl("langBtnDe");
  if(btnEn){ btnEn.classList.toggle("active", currentLang === "en"); }
  if(btnPl){ btnPl.classList.toggle("active", currentLang === "pl"); }
  if(btnDe){ btnDe.classList.toggle("active", currentLang === "de"); }
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
  renderUpdatePage();
}

function loadUserName(){
  return localStorage.getItem("userName") || "";
}

function saveMetrics(){
  METRICS = {
    sleep:{target: Number(getEl("set_sleep")?.value) || 7, max:1},
    steps:{target: Number(getEl("set_steps")?.value) || 8000, max:1},
    training:{target: Number(getEl("set_training")?.value) || 2, max:1},
    water:{target: Number(getEl("set_water")?.value) || 2.5, max:1},
    language:{target: Number(getEl("set_language")?.value) || (METRICS.language && METRICS.language.target) || 20, max:1},
    study:{target: Number(getEl("set_study")?.value) || (METRICS.study && METRICS.study.target) || 60, max:1}
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
  if(!day){ return {sleep:0,steps:0,training:0,water:0,language:0,study:0,score:0}; }
  return {sleep:day.sleep,steps:day.steps,training:day.training,water:day.water,language:day.language||0,study:day.study||0,score:day.score};
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
  if(!day){ return {sleep:0,steps:0,training:0,water:0,language:0,study:0}; }
  const m = METRICS || getDefaultMetrics();
  const langTarget = (m.language && m.language.target) || 20;
  const studyTarget = (m.study && m.study.target) || 60;
  return {
    language: Math.min(Math.round((day.language || 0) / langTarget * 100),100),
    study: Math.min(Math.round((day.study || 0) / studyTarget * 100),100),
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
    <div class="infoTooltip btsTooltip" id="btsTooltip" data-i18n="btsInfo">BTS - Based on Yesterday - Shows your current progress relative to yesterday.</div>
    <div class="marbleLockWrap">
      <div class="lockedInFlash" id="lockedInFlash" data-i18n="lockedIn">LOCKED IN</div>
      <button class="marbleLockBtn" id="marbleLockBtn" onclick="toggleMarbleLock()">
        <div class="marbleParticles" id="marbleParticles"></div>
        <svg class="lockIcon" id="lockIconOpen" viewBox="0 0 24 24" width="20" height="20" fill="none">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="#5a5a62" stroke-width="1.6"/>
          <path d="M8 11V7a4 4 0 0 1 7.2-2.4" stroke="#5a5a62" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <svg class="lockIcon" id="lockIconClosed" viewBox="0 0 24 24" width="20" height="20" fill="none" style="display:none;">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="#5a5a62" stroke-width="1.6"/>
          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#5a5a62" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="energyLabel">${t("energyScoreLabel")}</div>
    <div class="energyValue">
      <div class="energyHex"></div>
      <div class="energyValueText">${day.score}<span class="energyPercent">%</span></div>
    </div>
    <div class="energyStatus">${t("currentAlignment")}</div>
    ${streak > 0 ? `<div class="streakBadge">🔥 ${streak} ${t("dayStreak")}</div>` : ""}
  </div>
  <div class="metricsList">
    ${createMetric(t("sleep"), day.sleep + "h", progress.sleep, t("balanced"))}
    ${createMetric(t("steps"), day.steps, progress.steps, t("building"))}
    ${createMetric(t("training"), day.training, progress.training, t("active"))}
    ${createMetric(t("water"), day.water + "L", progress.water, t("hydrated"))}
    ${createMetric(t("language"), fmtMin(day.language), progress.language, t("growing"))}
    ${createMetric(t("study"), fmtMin(day.study), progress.study, t("focused"))}
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
  const todayScore = data[0].score;
  const yesterdayScore = data[1].score;
  const diff = Math.round(todayScore - yesterdayScore);

  if(diff > 0){
    el.innerHTML = `<span class="compareUp">▲ BTS: ${diff}%</span><span class="infoIcon" onclick="toggleInfoTooltip(event, 'btsTooltip')">ⓘ</span>`;
  }else if(diff < 0){
    el.innerHTML = `<span class="compareDown">▼ BTS: ${Math.abs(diff)}%</span><span class="infoIcon" onclick="toggleInfoTooltip(event, 'btsTooltip')">ⓘ</span>`;
  }else{
    el.innerHTML = `<span class="compareStable">${t("stable")}</span><span class="infoIcon" onclick="toggleInfoTooltip(event, 'btsTooltip')">ⓘ</span>`;
  }
}

let marbleLocked = false;

function toggleMarbleLock(){
  const btn = document.getElementById("marbleLockBtn");
  const openIcon = document.getElementById("lockIconOpen");
  const closedIcon = document.getElementById("lockIconClosed");
  const flash = document.getElementById("lockedInFlash");
  if(!btn){ return; }

  if(!marbleLocked){
    marbleLocked = true;
    spawnMarbleParticles();
    if(openIcon){ openIcon.style.display = "none"; }
    if(closedIcon){ closedIcon.style.display = "block"; }
    btn.classList.add("locked");
    if(flash){
      flash.classList.add("show");
      setTimeout(()=>{ flash.classList.remove("show"); }, 1200);
    }
  }else{
    marbleLocked = false;
    if(openIcon){ openIcon.style.display = "block"; }
    if(closedIcon){ closedIcon.style.display = "none"; }
    btn.classList.remove("locked");
  }
}

function spawnMarbleParticles(){
  const container = document.getElementById("marbleParticles");
  if(!container){ return; }
  container.innerHTML = "";
  const colors = ["#eceef0","#c3c4ca","#8d8d96","#dadbe0","#a9aab1"];
  for(let i = 0; i < 14; i++){
    const p = document.createElement("div");
    p.className = "marbleParticle";
    const angle = Math.random() * 360;
    const dist = 16 + Math.random() * 26;
    const dx = Math.cos(angle * Math.PI / 180) * dist;
    const dy = Math.sin(angle * Math.PI / 180) * dist;
    const size = 2 + Math.random() * 3;
    p.style.setProperty("--dx", dx + "px");
    p.style.setProperty("--dy", dy + "px");
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }
  setTimeout(()=>{ container.innerHTML = ""; }, 700);
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
    <div class="timeRow">
      <span class="timeText">${timeStr}</span>
      ${currentWeatherTemp ? `<span class="weatherTemp">${currentWeatherTemp}</span>` : ""}
    </div>
    <div class="dayNameText">${dayName}</div>
  `;
}

let currentWeatherTemp = null;

function fetchWeather(){
  if(!navigator.geolocation){ return; }
  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`)
        .then(res=>res.json())
        .then(data=>{
          if(data && data.current && typeof data.current.temperature_2m === "number"){
            currentWeatherTemp = Math.round(data.current.temperature_2m) + "°C";
            renderDateTime();
          }
        })
        .catch(()=>{});
    },
    ()=>{
      // lokalizacja odrzucona lub niedostępna - po prostu nie pokazujemy temperatury
    },
    {timeout:8000}
  );
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

let pendingSteps = 0;
let pendingTraining = 0;
let pendingWater = 0;
let pendingLanguage = 0;
let pendingStudy = 0;
let sleepSliderValue = 7;
let sleepLockedIn = false;
let moonLitTimeout = null;

function getTodayEntryOrDefault(){
  const todayStr = new Date().toISOString().split("T")[0];
  const data = getData();
  const found = data.find(d => d.date === todayStr);
  return found || {sleep:7, steps:0, training:0, water:0, language:0, study:0};
}

function initUpdatePage(){
  pendingSteps = 0;
  pendingTraining = 0;
  pendingWater = 0;
  pendingLanguage = 0;
  pendingStudy = 0;
  const todayStr = new Date().toISOString().split("T")[0];
  const existing = getData().find(d => d.date === todayStr);
  const today = existing || {sleep:7, steps:0, training:0, water:0};
  sleepSliderValue = today.sleep || 7;
  sleepLockedIn = !!existing;
  renderUpdatePage();
}

function renderUpdatePage(){
  const today = getTodayEntryOrDefault();

  const h = Math.floor(sleepSliderValue);
  const m = Math.round((sleepSliderValue - h) * 60);
  const hEl = getEl("sleepValueH");
  const mEl = getEl("sleepValueM");
  if(hEl){ hEl.textContent = h; }
  if(mEl){ mEl.textContent = m; }
  const slider = getEl("sleepSlider");
  if(slider){ slider.value = sleepSliderValue; }

  const sliderLabels = getEl("sleepSliderLabels");
  const lockedText = getEl("sleepLockedText");
  if(slider){ slider.classList.toggle("hidden", sleepLockedIn); }
  if(sliderLabels){ sliderLabels.classList.toggle("hidden", sleepLockedIn); }
  if(lockedText){ lockedText.classList.toggle("show", sleepLockedIn); }

  const stepsEl = getEl("stepsValue");
  if(stepsEl){ stepsEl.textContent = (today.steps + pendingSteps).toLocaleString("en-US").replace(/,/g, " "); }

  const hint = getEl("trainingHint");
  if(hint){
    hint.textContent = pendingTraining > 0
      ? pendingTraining + " " + t("trainingsAddedToday")
      : t("pressToAddTraining");
  }
  const trainingGlyph = getEl("trainingGlyph");
  if(trainingGlyph){ trainingGlyph.classList.toggle("trainingLocked", pendingTraining > 0); }

  const waterTotal = today.water + pendingWater;
  const waterEl = getEl("waterValueNum");
  if(waterEl){ waterEl.textContent = waterTotal.toFixed(1); }

  const langTotal = (today.language || 0) + pendingLanguage;
  const studyTotal = (today.study || 0) + pendingStudy;
  const langEl = getEl("languageValue");
  const studyEl = getEl("studyValue");
  if(langEl){ langEl.textContent = fmtMin(langTotal); }
  if(studyEl){ studyEl.textContent = fmtMin(studyTotal); }
  const langGlyph = getEl("languageGlyph");
  const studyGlyph = getEl("studyGlyph");
  if(langGlyph){ langGlyph.classList.toggle("glyphLit", pendingLanguage > 0); }
  if(studyGlyph){ studyGlyph.classList.toggle("glyphLit", pendingStudy > 0); }

  const waterFillRect = getEl("waterFillRect");
  if(waterFillRect){
    const target = (METRICS && METRICS.water && METRICS.water.target) || 2.5;
    const fillPercent = Math.max(0, Math.min(1, waterTotal / target));
    const dropTop = 6;
    const dropBottom = 20.5;
    const fillHeight = fillPercent * (dropBottom - dropTop);
    waterFillRect.setAttribute("y", dropBottom - fillHeight);
    waterFillRect.setAttribute("height", fillHeight);
  }
}

function unlockSleep(){
  sleepLockedIn = false;
  renderUpdatePage();
}

function onSleepSliderChange(){
  const slider = getEl("sleepSlider");
  if(!slider){ return; }
  sleepSliderValue = Number(slider.value);
  renderUpdatePage();

  const moon = getEl("moonGlyph");
  if(moon){
    moon.classList.add("moonLit");
    clearTimeout(moonLitTimeout);
    moonLitTimeout = setTimeout(()=>{ moon.classList.remove("moonLit"); }, 700);
  }
}

function adjustSteps(amount){
  const today = getTodayEntryOrDefault();
  pendingSteps += amount;
  if(today.steps + pendingSteps < 0){ pendingSteps = -today.steps; }
  renderUpdatePage();
}

function addTraining(){
  pendingTraining += 1;
  renderUpdatePage();
}

function adjustMinutes(kind, delta){
  const today = getTodayEntryOrDefault();
  if(kind === "language"){
    pendingLanguage += delta;
    const base = today.language || 0;
    if(base + pendingLanguage < 0){ pendingLanguage = -base; }
  }else if(kind === "study"){
    pendingStudy += delta;
    const base = today.study || 0;
    if(base + pendingStudy < 0){ pendingStudy = -base; }
  }
  renderUpdatePage();
}

function addWater(amount){
  pendingWater = Math.round((pendingWater + amount) * 10) / 10;
  renderUpdatePage();
}

function save(){
  const today = new Date().toISOString().split("T")[0];
  const data = getData();
  const todayIndex = data.findIndex(item => item.date === today);

  let day;
  if(todayIndex !== -1){ day = data[todayIndex]; }
  else{ day = {date:today,sleep:0,steps:0,training:0,water:0,language:0,study:0}; }

  day.sleep = sleepSliderValue;
  day.steps += pendingSteps;
  if(day.steps < 0){ day.steps = 0; }
  day.training += pendingTraining;
  day.water = Math.round((day.water + pendingWater) * 10) / 10;
  if(day.water < 0){ day.water = 0; }
  day.language = Math.max(0, (day.language || 0) + pendingLanguage);
  day.study = Math.max(0, (day.study || 0) + pendingStudy);

  day.score = calcScore(day.sleep, day.steps, day.training, day.water);

  if(todayIndex !== -1){ data[todayIndex] = day; }
  else{ data.unshift(day); }

  saveData(data);

  pendingSteps = 0;
  pendingTraining = 0;
  pendingWater = 0;
  pendingLanguage = 0;
  pendingStudy = 0;
  sleepLockedIn = true;

  renderUpdatePage();
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

  animateTabGlow(mode);

  historyDisplayLimit = 7;
  renderBuilding();
  renderHistory();
}

function animateTabGlow(mode){
  const allSegs = [
    document.getElementById("topLeftGlow"),
    document.getElementById("bottomLeftGlow"),
    document.getElementById("topRightGlow"),
    document.getElementById("bottomRightGlow")
  ];
  const activeSegs = mode === "daily"
    ? [document.getElementById("topLeftGlow"), document.getElementById("bottomLeftGlow")]
    : [document.getElementById("topRightGlow"), document.getElementById("bottomRightGlow")];

  // gasimy wszystkie i resetujemy offset (bez przejścia)
  allSegs.forEach(seg=>{
    if(!seg){ return; }
    seg.classList.remove("active");
    seg.style.transition = "none";
    seg.style.strokeDashoffset = "100";
  });

  // wymuszamy reflow, żeby reset zadziałał przed nowym rysowaniem
  void document.querySelector(".viewTabsGlowSvg").getBoundingClientRect();

  // zapalamy aktywną połówkę - diody "dochodzą" od góry i dołu
  activeSegs.forEach(seg=>{
    if(!seg){ return; }
    seg.classList.add("active");
    seg.style.transition = "";
    seg.style.strokeDashoffset = "0";
  });
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
          <div>
            <div class="dayCardMetricValue">${fmtMin(day.language || 0)}</div>
            <div class="dayCardMetricLabel">${t("langShort")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${fmtMin(day.study || 0)}</div>
            <div class="dayCardMetricLabel">${t("study")}</div>
          </div>
        </div>
      </div>
      <div class="dayCardRing">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="${isToday ? "#35d9ff" : "#2a9fd6"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
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
    const totalLanguage = week.days.reduce((sum,d)=>sum + (d.language || 0), 0);
    const totalStudy = week.days.reduce((sum,d)=>sum + (d.study || 0), 0);

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
          <div>
            <div class="dayCardMetricValue">${fmtMin(totalLanguage)}</div>
            <div class="dayCardMetricLabel">${t("langShort")}</div>
          </div>
          <div>
            <div class="dayCardMetricValue">${fmtMin(totalStudy)}</div>
            <div class="dayCardMetricLabel">${t("study")}</div>
          </div>
        </div>
      </div>
      <div class="dayCardRing">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="${isOpen ? "#35d9ff" : "#2a9fd6"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
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
  const confirmed = window.confirm(t("resetAllDaysConfirm"));
  if(!confirmed){ return; }
  localStorage.removeItem("liforge");
  historyDisplayLimit = 7;
  renderBuilding();
  renderHistory();
  renderDashboard();
  showToast(t("dataCleared"));
}

function toggleInfoTooltip(event, tooltipId){
  event.stopPropagation();
  const id = tooltipId || "infoTooltip";
  const tooltip = document.getElementById(id);
  if(!tooltip){ return; }
  tooltip.classList.toggle("show");
}

document.addEventListener("click", (e)=>{
  document.querySelectorAll(".infoTooltip.show").forEach(tooltip=>{
    if(!e.target.closest(".infoIcon") && !e.target.closest(".infoTooltip")){
      tooltip.classList.remove("show");
    }
  });
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
  if(page==="update"){ update.style.display="block"; initUpdatePage(); }
  if(page==="history"){ history.style.display="block"; renderBuilding(); renderHistory(); animateTabGlow(currentHistoryView); }
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
  fetchWeather();
  setInterval(fetchWeather, 900000);
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
