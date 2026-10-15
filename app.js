// State for multiple exams
let use24Hour = localStorage.getItem("clockFormat") !== "12";
let exams = []; // Array to store multiple exams
let examIdCounter = 0;
let centreSettings = {
  centreNumber: "",
  centreName: "",
  logoData: null
};

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const headerLogo = document.getElementById("header-logo");

// Update logo based on theme
function updateHeaderLogo(isLight) {
  if (headerLogo) {
    headerLogo.src = isLight 
      ? "assets/InvigiClock Logo BLACK.png" 
      : "assets/InvigiClock Logo WHITE.png";
  }
}

// Initialize theme (default dark)
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.checked = true;
    updateHeaderLogo(true);
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.checked = false;
    updateHeaderLogo(false);
  }
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    updateHeaderLogo(true);
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
    updateHeaderLogo(false);
  }
});

initTheme();

// Settings modal elements
const settingsModal = document.getElementById("settings-modal");
const openSettingsBtn = document.getElementById("open-settings");
const closeSettingsBtn = document.getElementById("close-settings");
const cancelSettingsBtn = document.getElementById("cancel-settings");
const settingsForm = document.getElementById("settings-form");
const settingsCentreNumberInput = document.getElementById("settings-centre-number");
const settingsCentreNameInput = document.getElementById("settings-centre-name");
const settingsLogoInput = document.getElementById("settings-logo");
const logoPreviewContainer = document.getElementById("logo-preview-container");
const logoPreview = document.getElementById("logo-preview");
const removeLogoBtn = document.getElementById("remove-logo");

// Display elements
const examsListEl = document.getElementById("exams-list");
const examBannerEl = document.getElementById("exam-in-progress-banner");
const centreInfoDisplay = document.getElementById("centre-info-display");
const displayCentreNumber = document.getElementById("display-centre-number");
const displayCentreName = document.getElementById("display-centre-name");
const centreLogo = document.getElementById("centre-logo");

// Update centre info display
function updateCentreDisplay() {
  // Update logo
  if (centreSettings.logoData && centreLogo) {
    centreLogo.src = centreSettings.logoData;
    centreLogo.style.display = "block";
  } else if (centreLogo) {
    centreLogo.style.display = "none";
  }

  if (centreSettings.centreNumber || centreSettings.centreName) {
    if (displayCentreNumber) {
      displayCentreNumber.innerHTML = centreSettings.centreNumber 
        ? `Centre Number: <strong>${centreSettings.centreNumber}</strong>` 
        : "Centre Number:";
    }
    if (displayCentreName) {
      displayCentreName.textContent = centreSettings.centreName || "Not configured";
    }
    if (centreInfoDisplay) {
      centreInfoDisplay.style.display = "flex";
    }
  } else {
    if (displayCentreNumber) {
      displayCentreNumber.textContent = "Centre Number:";
    }
    if (displayCentreName) {
      displayCentreName.textContent = "Not configured - Click Settings";
    }
    if (centreInfoDisplay) {
      centreInfoDisplay.style.display = "flex";
    }
  }
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem("centreSettings");
  if (saved) {
    centreSettings = JSON.parse(saved);
    if (settingsCentreNumberInput) settingsCentreNumberInput.value = centreSettings.centreNumber || "";
    if (settingsCentreNameInput) settingsCentreNameInput.value = centreSettings.centreName || "";
    
    // Update logo preview in settings
    if (centreSettings.logoData && logoPreview && logoPreviewContainer) {
      logoPreview.src = centreSettings.logoData;
      logoPreviewContainer.style.display = "flex";
    }
  }
  updateCentreDisplay();
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem("centreSettings", JSON.stringify(centreSettings));
}

// Open settings modal
if (openSettingsBtn) {
  openSettingsBtn.addEventListener("click", () => {
    if (settingsModal) {
      settingsModal.classList.add("active");
      loadSettings();
    }
  });
}

// Close settings modal
function closeSettingsModal() {
  if (settingsModal) {
    settingsModal.classList.remove("active");
  }
}

if (closeSettingsBtn) {
  closeSettingsBtn.addEventListener("click", closeSettingsModal);
}

if (cancelSettingsBtn) {
  cancelSettingsBtn.addEventListener("click", closeSettingsModal);
}

// Close modal when clicking outside
if (settingsModal) {
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      closeSettingsModal();
    }
  });
}

// Handle settings form submission
if (settingsForm) {
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    centreSettings.centreNumber = settingsCentreNumberInput.value.trim();
    centreSettings.centreName = settingsCentreNameInput.value.trim();
    
    saveSettings();
    updateCentreDisplay();
    closeSettingsModal();
    
    // Show confirmation
    alert("Settings saved successfully!");
  });
}

// Handle logo upload
if (settingsLogoInput) {
  settingsLogoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        centreSettings.logoData = event.target.result;
        
        // Show preview
        if (logoPreview && logoPreviewContainer) {
          logoPreview.src = event.target.result;
          logoPreviewContainer.style.display = "flex";
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// Remove logo
if (removeLogoBtn) {
  removeLogoBtn.addEventListener("click", () => {
    centreSettings.logoData = null;
    if (logoPreviewContainer) logoPreviewContainer.style.display = "none";
    if (logoPreview) logoPreview.src = "";
    if (settingsLogoInput) settingsLogoInput.value = "";
  });
}

// Validate centre number in settings - only allow numbers
if (settingsCentreNumberInput) {
  settingsCentreNumberInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });
}

// Load settings on startup
loadSettings();

// Disclaimer modal elements
const disclaimerModal = document.getElementById("disclaimer-modal");
const openDisclaimerBtn = document.getElementById("open-disclaimer");
const closeDisclaimerBtn = document.getElementById("close-disclaimer");
const closeDisclaimerBtnBottom = document.getElementById("close-disclaimer-btn");

// Open disclaimer modal
if (openDisclaimerBtn) {
  openDisclaimerBtn.addEventListener("click", () => {
    if (disclaimerModal) {
      disclaimerModal.classList.add("active");
    }
  });
}

// Close disclaimer modal
function closeDisclaimerModal() {
  if (disclaimerModal) {
    disclaimerModal.classList.remove("active");
  }
}

if (closeDisclaimerBtn) {
  closeDisclaimerBtn.addEventListener("click", closeDisclaimerModal);
}

if (closeDisclaimerBtnBottom) {
  closeDisclaimerBtnBottom.addEventListener("click", closeDisclaimerModal);
}

// Close disclaimer modal when clicking outside
if (disclaimerModal) {
  disclaimerModal.addEventListener("click", (e) => {
    if (e.target === disclaimerModal) {
      closeDisclaimerModal();
    }
  });
}

// Live clock elements
const liveClockEl = document.getElementById("live-clock");
const clockFormatLabelEl = document.getElementById("clock-format-label");
const toggleFormatBtn = document.getElementById("toggle-format");
const toggleFullscreenBtn = document.getElementById("toggle-fullscreen");

// Form elements
const examBoardInput = document.getElementById("exam-board");
const subjectInput = document.getElementById("subject-title");
const paperInput = document.getElementById("paper-number");
const startTimeInput = document.getElementById("start-time");
const startNowBtn = document.getElementById("start-now");
const calcFromDurationInput = document.getElementById("calc-from-duration");
const durationInput = document.getElementById("duration-minutes");
const endTimeInput = document.getElementById("end-time");
const extra25Input = document.getElementById("extra-25");
const extra50Input = document.getElementById("extra-50");
const timingPreviewEl = document.getElementById("timing-preview");
const examForm = document.getElementById("exam-form");
const startExamBtn = document.getElementById("start-exam");
const clearAllExamsBtn = document.getElementById("clear-all-exams");

const MS_PER_MINUTE = 60 * 1000;
const EXTRA_TIME_OPTIONS = [
  { percent: 25, input: extra25Input },
  { percent: 50, input: extra50Input }
];

function getCheckedPercents(options) {
  return options.filter(option => option.input.checked).map(option => option.percent);
}

// Utility
function pad(num) {
  return num.toString().padStart(2, "0");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Format a Date as the "HH:MM" value used by <input type="time">
function toTimeInputValue(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Convert an "HH:MM" time input value into a Date for today (seconds zeroed)
function timeInputToDate(value) {
  const match = /^(\d{2}):(\d{2})/.exec(value || "");
  if (!match) return null;

  const date = new Date();
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return date;
}

function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "-";
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
    
  if (hours === 0) {
    return `${mins} Minute${mins !== 1 ? 's' : ''}`;
  } else if (mins === 0) {
    return `${hours} Hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} Hour${hours !== 1 ? 's' : ''} ${mins} Minute${mins !== 1 ? 's' : ''}`;
  }
}

function formatTime(date, use24, includeSeconds = true) {
  if (!date) return "-";

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  if (use24) {
    return includeSeconds
      ? `${pad(hours)}:${minutes}:${seconds}`
      : `${pad(hours)}:${minutes}`;
  } else {
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return includeSeconds
      ? `${hours}:${minutes}:${seconds} ${ampm}`
      : `${hours}:${minutes} ${ampm}`;
  }
}

function updateClock() {
  const now = new Date();
  liveClockEl.textContent = formatTime(now, use24Hour, true);
  refreshExamStatuses(now);
}

// Start the live clock (real world time, not countdown or elapsed)
updateClock();
setInterval(updateClock, 1000);

// Update the format button and clock label to match the current 12 / 24 hour setting
function updateFormatControls() {
  toggleFormatBtn.textContent = use24Hour
    ? "Switch to 12-hour"
    : "Switch to 24-hour";

  clockFormatLabelEl.textContent = use24Hour
    ? "Current Time"
    : "Current Time (12-hour)";
}

updateFormatControls();

// Toggle 12 / 24 hour format
toggleFormatBtn.addEventListener("click", () => {
  use24Hour = !use24Hour;
  localStorage.setItem("clockFormat", use24Hour ? "24" : "12");

  updateFormatControls();

  // Refresh all exam displays
  renderExams();
  renderTimingPreview();
  renderLatePreview();
});

// Fullscreen handler
toggleFullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.body.classList.add("fullscreen-mode");
    toggleFullscreenBtn.textContent = "Exit Full Screen";
  } else {
    document.exitFullscreen();
    document.body.classList.remove("fullscreen-mode");
    toggleFullscreenBtn.textContent = "Full Screen";
  }
});

// Handle exiting fullscreen via Escape key
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove("fullscreen-mode");
    toggleFullscreenBtn.textContent = "Full Screen";
  }
});

// Build the end and extra-time finish times for a start time and duration.
// Extra time is a percentage of the standard duration, rounded up to the next whole minute.
function buildTimings(startTime, endTime, duration, percents) {
  const extraTimes = percents.map(percent => {
    const extraMinutes = Math.ceil((duration * percent) / 100);
    const totalDuration = duration + extraMinutes;
    return {
      percent,
      extraMinutes,
      duration: totalDuration,
      endTime: new Date(startTime.getTime() + totalDuration * MS_PER_MINUTE)
    };
  });

  const finishTime = extraTimes.reduce(
    (latest, extra) => (extra.endTime > latest ? extra.endTime : latest),
    endTime
  );

  return { startTime, endTime, duration, extraTimes, finishTime };
}

// Work out start, end, duration and extra-time finish times from the form.
// Returns { error } when the form values are incomplete or invalid.
function calculateTimings() {
  const startTime = timeInputToDate(startTimeInput.value);
  if (!startTime) return { error: "Enter a start time." };

  let endTime;
  let duration;

  if (calcFromDurationInput.checked) {
    duration = parseInt(durationInput.value, 10);
    if (!Number.isFinite(duration) || duration <= 0) {
      return { error: "Enter a valid duration in minutes." };
    }
    endTime = new Date(startTime.getTime() + duration * MS_PER_MINUTE);
  } else {
    endTime = timeInputToDate(endTimeInput.value);
    if (!endTime) return { error: "Enter an end time." };
    if (endTime <= startTime) {
      return { error: "End time must be after the start time." };
    }
    duration = Math.round((endTime - startTime) / MS_PER_MINUTE);
  }

  return buildTimings(startTime, endTime, duration, getCheckedPercents(EXTRA_TIME_OPTIONS));
}

// Keep duration / end time fields in step: whichever is not being entered is derived from the other
function syncTimingFields() {
  const fromDuration = calcFromDurationInput.checked;
  durationInput.readOnly = !fromDuration;
  endTimeInput.readOnly = fromDuration;

  const startTime = timeInputToDate(startTimeInput.value);

  if (fromDuration) {
    const duration = parseInt(durationInput.value, 10);
    endTimeInput.value = startTime && duration > 0
      ? toTimeInputValue(new Date(startTime.getTime() + duration * MS_PER_MINUTE))
      : "";
  } else {
    const endTime = timeInputToDate(endTimeInput.value);
    durationInput.value = startTime && endTime && endTime > startTime
      ? Math.round((endTime - startTime) / MS_PER_MINUTE)
      : "";
  }

  renderTimingPreview();
}

// Calculated times as HTML, shown before an exam / late candidate is added so no manual maths is needed
function timingPreviewHtml(timings) {
  if (timings.error) {
    return `<span class="timing-preview-label">${escapeHtml(timings.error)}</span>`;
  }

  const row = (label, value) => `
    <div class="timing-preview-row">
      <span class="timing-preview-label">${label}</span>
      <span>${value}</span>
    </div>
  `;

  return [
    row("Start", formatTime(timings.startTime, use24Hour, false)),
    row("End", `${formatTime(timings.endTime, use24Hour, false)} (${formatDuration(timings.duration)})`),
    ...timings.extraTimes.map(extra =>
      row(
        `End (+${extra.percent}%)`,
        `${formatTime(extra.endTime, use24Hour, false)} (${formatDuration(extra.duration)})`
      )
    )
  ].join("");
}

function renderTimingPreview() {
  timingPreviewEl.innerHTML = timingPreviewHtml(calculateTimings());
}

// Status of a single finish time relative to the current time
function getTimingStatus(startTime, endTime, now) {
  if (now < startTime) return "upcoming";
  if (now >= endTime) return "complete";
  return "running";
}

// Each finish time gets its own status pill: the main time, then any extra time.
// Works for an exam or a late candidate, as both have a start, end and extra times.
function getExamTimings(entry) {
  return [
    { label: "Main Time", endTime: entry.endTime },
    ...entry.extraTimes.map(extra => ({ label: `${extra.percent}% Time`, endTime: extra.endTime }))
  ];
}

// e.g. ["complete", "running", "running"] when the main time is over but extra time is still going
function getTimingStatuses(entry, now) {
  return getExamTimings(entry).map(timing => getTimingStatus(entry.startTime, timing.endTime, now));
}

// The exam itself plus any late arriving candidates, each with their own times
function getTimedEntries(exam) {
  return [exam, ...exam.lateCandidates];
}

// Changes whenever any pill on an exam (including its late candidates) changes status
function getExamStatusKey(exam, now) {
  return getTimedEntries(exam).map(entry => getTimingStatuses(entry, now).join()).join("|");
}

// An exam is running while any of its finish times (including late candidates') is still running
function isExamRunning(exam, now) {
  return getTimedEntries(exam).some(entry => getTimingStatuses(entry, now).includes("running"));
}

const STATUS_LABELS = {
  upcoming: "Upcoming",
  running: "In Progress",
  complete: "Complete"
};

// Re-render only when any pill has moved to a different status
function refreshExamStatuses(now = new Date()) {
  if (exams.some(exam => getExamStatusKey(exam, now) !== exam.statusKey)) {
    renderExams();
  }
}

// Show the "Exam in Progress" banner while any exam (including extra time and late candidates) is running
function updateExamBanner(now) {
  examBannerEl.hidden = !exams.some(exam => isExamRunning(exam, now));
}

function timeItemHtml(label, date) {
  return `
          <div class="exam-time-item">
            <span class="time-label">${label}:</span>
            <span class="time-value">${formatTime(date, use24Hour, false)}</span>
          </div>`;
}

// End times for each extra-time group, e.g. "End (+25%)"
function extraTimeItemsHtml(entry) {
  return entry.extraTimes.map(extra => `
          <div class="exam-time-item">
            <span class="time-label">End (+${extra.percent}%):</span>
            <span class="time-value">${formatTime(extra.endTime, use24Hour, false)} (${formatDuration(extra.duration)})</span>
          </div>`).join("");
}

function extraTimesHtml(exam) {
  return exam.extraTimes.length === 0
    ? ""
    : `<div class="exam-extra-times">${extraTimeItemsHtml(exam)}
        </div>`;
}

// One pill per finish time. Pills are only labelled when there is extra time to tell them apart.
function statusPillsHtml(entry, now) {
  const timings = getExamTimings(entry);
  const statuses = getTimingStatuses(entry, now);
  const showLabels = timings.length > 1;

  return timings.map((timing, index) => `
          <span class="status-pill ${statuses[index]}">${showLabels ? `${timing.label}: ` : ""}${STATUS_LABELS[statuses[index]]}</span>`
  ).join("");
}

// Late arriving candidates for an exam, each with their own times and status pills
function lateCandidatesHtml(exam, now) {
  if (exam.lateCandidates.length === 0) return "";

  const sortedCandidates = [...exam.lateCandidates].sort(
    (a, b) => a.startTime - b.startTime || a.id - b.id
  );

  return `
        <div class="late-candidates">
          ${sortedCandidates.map(late => `
          <div class="late-candidate">
            <div class="late-candidate-header">
              <div class="late-candidate-name"><span class="late-tag">Late</span>${escapeHtml(late.name)}</div>
              <button class="remove-exam-btn remove-late-btn" onclick="removeLateCandidate(${exam.id}, ${late.id})" title="Remove late candidate" aria-label="Remove late candidate ${escapeHtml(late.name)}">×</button>
            </div>
            <div class="exam-times">
              ${timeItemHtml("Start", late.startTime)}
              ${timeItemHtml("End", late.endTime)}
              ${extraTimeItemsHtml(late)}
            </div>
            <div class="exam-status">${statusPillsHtml(late, now)}</div>
          </div>`).join("")}
        </div>`;
}

// Render exams list
function renderExams() {
  const now = new Date();
  updateExamBanner(now);

  if (exams.length === 0) {
    examsListEl.innerHTML = `
      <div class="no-exams-message">
        No exams added yet. Use the Exam Setup panel to add exam information.
      </div>
    `;
    return;
  }

  const sortedExams = [...exams].sort(
    (a, b) => a.startTime - b.startTime || a.id - b.id
  );

  examsListEl.innerHTML = sortedExams.map(exam => {
    exam.statusKey = getExamStatusKey(exam, now);

    return `
      <div class="exam-card" data-exam-id="${exam.id}">
        <div class="exam-card-header">
          <div class="exam-title">
            <div class="exam-subject">${escapeHtml(exam.subject)}</div>
            <div class="exam-paper">${escapeHtml(exam.paper)}</div>
          </div>
          <div class="exam-card-actions">
            <button class="late-exam-btn" onclick="openLateCandidateModal(${exam.id})" title="Add late arriving candidate" aria-label="Add late arriving candidate">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="16" y1="11" x2="22" y2="11"></line>
              </svg>
            </button>
            <button class="remove-exam-btn" onclick="removeExam(${exam.id})" title="Remove exam" aria-label="Remove exam">×</button>
          </div>
        </div>
        <div class="exam-times">
          ${timeItemHtml("Start", exam.startTime)}
          ${timeItemHtml("End", exam.endTime)}
          <div class="exam-time-item">
            <span class="time-label">Duration:</span>
            <span class="time-value">${formatDuration(exam.duration)}</span>
          </div>
        </div>
        ${extraTimesHtml(exam)}
        <div class="exam-status">${statusPillsHtml(exam, now)}</div>
        ${lateCandidatesHtml(exam, now)}
      </div>
    `;
  }).join('');
}

const EXAMS_STORAGE_KEY = "exams";

// Save exams so they survive a refresh or leaving the page (statusKey is derived, so it isn't stored)
function saveExams() {
  const data = exams.map(({ statusKey, ...exam }) => exam);
  try {
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Unable to save exams", error);
  }
}

// Rebuild the Date objects on a stored set of times (an exam or a late candidate); null if any are invalid
function reviveTimings(raw) {
  const startTime = new Date(raw.startTime);
  const endTime = new Date(raw.endTime);
  const finishTime = new Date(raw.finishTime);
  const extraTimes = Array.isArray(raw.extraTimes)
    ? raw.extraTimes.map(extra => ({ ...extra, endTime: new Date(extra?.endTime) }))
    : [];

  const datesValid = [startTime, endTime, finishTime, ...extraTimes.map(extra => extra.endTime)]
    .every(date => !Number.isNaN(date.getTime()));

  return datesValid ? { ...raw, startTime, endTime, finishTime, extraTimes } : null;
}

function reviveLateCandidate(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!Number.isInteger(raw.id) || typeof raw.name !== "string") return null;

  return reviveTimings(raw);
}

// Turn a stored exam back into one with real Date objects; returns null if it is malformed
function reviveExam(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!Number.isInteger(raw.id) || typeof raw.subject !== "string" || typeof raw.paper !== "string") {
    return null;
  }

  const exam = reviveTimings(raw);
  if (!exam) return null;

  // Exams saved before late candidates existed have none
  const lateCandidates = Array.isArray(raw.lateCandidates)
    ? raw.lateCandidates.map(reviveLateCandidate).filter(Boolean)
    : [];

  return { ...exam, lateCandidates };
}

// Restore saved exams. Exam times are for a single day, so exams that finished
// before today (or that can't be read) are discarded.
function loadExams() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(EXAMS_STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
  if (!Array.isArray(saved)) return [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return saved
    .map(reviveExam)
    .filter(exam => exam && exam.finishTime >= startOfToday);
}

// Next free exam id, continuing on from any restored exams
function nextExamId() {
  return exams.reduce((next, exam) => Math.max(next, exam.id + 1), 0);
}

// Add exam
function addExam(examData) {
  const exam = {
    id: examIdCounter++,
    lateCandidates: [],
    ...examData
  };

  exams.push(exam);
  saveExams();
  renderExams();
}

// Remove exam
function removeExam(id) {
  exams = exams.filter(exam => exam.id !== id);
  saveExams();
  renderExams();
}

// Make removeExam available globally for onclick
window.removeExam = removeExam;

// Late arriving candidate modal
const lateModal = document.getElementById("late-modal");
const lateForm = document.getElementById("late-form");
const lateExamSummaryEl = document.getElementById("late-exam-summary");
const lateCandidateInput = document.getElementById("late-candidate");
const lateStartInput = document.getElementById("late-start-time");
const lateStartNowBtn = document.getElementById("late-start-now");
const lateExtra25Input = document.getElementById("late-extra-25");
const lateExtra50Input = document.getElementById("late-extra-50");
const latePreviewEl = document.getElementById("late-preview");
const closeLateBtn = document.getElementById("close-late");
const cancelLateBtn = document.getElementById("cancel-late");

const LATE_EXTRA_TIME_OPTIONS = [
  { percent: 25, input: lateExtra25Input },
  { percent: 50, input: lateExtra50Input }
];

// The exam the late candidate is being added to (null while the modal is closed)
let lateExamId = null;

// A late candidate sits the same paper for its full duration, starting from when they began
function calculateLateTimings() {
  const exam = exams.find(item => item.id === lateExamId);
  if (!exam) return { error: "This exam is no longer on the screen." };

  const startTime = timeInputToDate(lateStartInput.value);
  if (!startTime) return { error: "Enter the candidate's start time." };

  if (startTime < exam.startTime) {
    return { error: `Start time can't be before the exam started (${formatTime(exam.startTime, use24Hour, false)}).` };
  }

  const endTime = new Date(startTime.getTime() + exam.duration * MS_PER_MINUTE);
  return buildTimings(startTime, endTime, exam.duration, getCheckedPercents(LATE_EXTRA_TIME_OPTIONS));
}

function renderLatePreview() {
  if (lateExamId === null) return;
  latePreviewEl.innerHTML = timingPreviewHtml(calculateLateTimings());
}

function openLateCandidateModal(examId) {
  const exam = exams.find(item => item.id === examId);
  if (!exam) return;

  lateExamId = examId;
  lateExamSummaryEl.textContent = `${exam.subject} · ${exam.paper} · ${formatDuration(exam.duration)}`;
  lateCandidateInput.value = "";
  lateStartInput.value = "";
  lateExtra25Input.checked = false;
  lateExtra50Input.checked = false;
  renderLatePreview();

  lateModal.classList.add("active");
  lateCandidateInput.focus();
}

function closeLateModal() {
  lateModal.classList.remove("active");
  lateExamId = null;
}

function removeLateCandidate(examId, lateId) {
  const exam = exams.find(item => item.id === examId);
  if (!exam) return;

  exam.lateCandidates = exam.lateCandidates.filter(late => late.id !== lateId);
  saveExams();
  renderExams();
}

// Make the card buttons available globally for onclick
window.openLateCandidateModal = openLateCandidateModal;
window.removeLateCandidate = removeLateCandidate;

[lateStartInput, lateExtra25Input, lateExtra50Input].forEach(el => {
  el.addEventListener("input", renderLatePreview);
  el.addEventListener("change", renderLatePreview);
});

lateStartNowBtn.addEventListener("click", () => {
  lateStartInput.value = toTimeInputValue(new Date());
  renderLatePreview();
});

closeLateBtn.addEventListener("click", closeLateModal);
cancelLateBtn.addEventListener("click", closeLateModal);

// Close modal when clicking outside
lateModal.addEventListener("click", (event) => {
  if (event.target === lateModal) {
    closeLateModal();
  }
});

lateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const exam = exams.find(item => item.id === lateExamId);
  if (!exam) {
    alert("This exam is no longer on the screen.");
    closeLateModal();
    return;
  }

  const name = lateCandidateInput.value.trim();
  if (!name) {
    alert("Please enter the candidate's number or name.");
    return;
  }

  const timings = calculateLateTimings();
  if (timings.error) {
    alert(timings.error);
    return;
  }

  const nextLateId = exam.lateCandidates.reduce((next, late) => Math.max(next, late.id + 1), 0);
  exam.lateCandidates.push({ id: nextLateId, name, ...timings });

  saveExams();
  renderExams();
  closeLateModal();
});

// Keep the timing fields and preview up to date as the form changes
[
  startTimeInput,
  calcFromDurationInput,
  durationInput,
  endTimeInput,
  extra25Input,
  extra50Input
].forEach(el => {
  el.addEventListener("input", syncTimingFields);
  el.addEventListener("change", syncTimingFields);
});

startNowBtn.addEventListener("click", () => {
  startTimeInput.value = toTimeInputValue(new Date());
  syncTimingFields();
});

// Handle "Add Exam"
examForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const subject = subjectInput.value.trim();
  const paper = paperInput.value.trim();

  if (!subject) {
    alert("Please enter a subject title.");
    return;
  }

  if (!paper) {
    alert("Please enter a paper number.");
    return;
  }

  const timings = calculateTimings();
  if (timings.error) {
    alert(timings.error);
    return;
  }

  addExam({
    centreNumber: centreSettings.centreNumber,
    centreName: centreSettings.centreName,
    examBoard: examBoardInput.value.trim(),
    subject: subject,
    paper: paper,
    ...timings
  });

  // Clear only the exam-specific fields; the start time and timing mode are kept
  // so several exams for the same session can be added quickly
  subjectInput.value = "";
  paperInput.value = "";
  durationInput.value = "";
  endTimeInput.value = "";
  extra25Input.checked = false;
  extra50Input.checked = false;
  syncTimingFields();

  // Focus back on subject field for quick entry
  subjectInput.focus();
});

// Clear all exams
if (clearAllExamsBtn) {
  clearAllExamsBtn.addEventListener("click", () => {
    if (exams.length === 0) return;
    
    if (confirm("Are you sure you want to clear all exams?")) {
      exams = [];
      saveExams();
      renderExams();
      
      // Exit fullscreen if currently in it
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  });
}

// Restore any saved exams, then render
exams = loadExams();
examIdCounter = nextExamId();
saveExams();
renderExams();
syncTimingFields();

// Keep other open tabs in step. The storage event only fires in tabs other than the one
// that made the change, and loading never writes back, so this can't loop.
window.addEventListener("storage", (event) => {
  const clearedAll = event.key === null;

  if (clearedAll || event.key === EXAMS_STORAGE_KEY) {
    exams = loadExams();
    examIdCounter = nextExamId();
    renderExams();
  }

  if (clearedAll || event.key === "centreSettings") {
    loadSettings();
  }
});
