// Simple state
let use24Hour = true;
let examStarted = false;
let examStartTime = null;
let examEndTime = null;

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");

// Initialize theme (default dark)
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.checked = true;
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.checked = false;
  }
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  }
});

initTheme();

// Live clock elements
const liveClockEl = document.getElementById("live-clock");
const clockFormatLabelEl = document.getElementById("clock-format-label");
const toggleFormatBtn = document.getElementById("toggle-format");
const toggleFullscreenBtn = document.getElementById("toggle-fullscreen");

// Disable fullscreen button initially
toggleFullscreenBtn.disabled = true;

// Display elements
const centreNameDisplay = document.getElementById("display-centre-name");
const centreNumberDisplay = document.getElementById("display-centre-number");
const examBoardDisplay = document.getElementById("display-exam-board");
const subjectDisplay = document.getElementById("display-subject");
const paperDisplay = document.getElementById("display-paper");
const durationDisplay = document.getElementById("display-duration");
const startDisplay = document.getElementById("display-start");
const endDisplay = document.getElementById("display-end");
const statusPill = document.getElementById("status-pill");

// Form elements
const centreNumberInput = document.getElementById("centre-number");
const centreNameInput = document.getElementById("centre-name");
const examBoardInput = document.getElementById("exam-board");
const subjectInput = document.getElementById("subject-title");
const paperInput = document.getElementById("paper-number");
const durationInput = document.getElementById("duration-minutes");
const actualStartInput = document.getElementById("actual-start");
const actualEndInput = document.getElementById("actual-end");
const examForm = document.getElementById("exam-form");
const startExamBtn = document.getElementById("start-exam");
const resetExamBtn = document.getElementById("reset-exam");

// Utility
function pad(num) {
  return num.toString().padStart(2, "0");
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
}

// Start the live clock (real world time, not countdown or elapsed)
updateClock();
setInterval(updateClock, 1000);

// Toggle 12 / 24 hour format
toggleFormatBtn.addEventListener("click", () => {
  use24Hour = !use24Hour;

  toggleFormatBtn.textContent = use24Hour
    ? "Switch to 12-hour"
    : "Switch to 24-hour";

  clockFormatLabelEl.textContent = use24Hour
    ? "Current Time"
    : "Current Time (12-hour)";

  // Refresh start/end displays with new format
  startDisplay.textContent = formatTime(examStartTime, use24Hour, false);
  endDisplay.textContent = formatTime(examEndTime, use24Hour, false);
  actualStartInput.value = startDisplay.textContent === "-" ? "" : startDisplay.textContent;
  actualEndInput.value = endDisplay.textContent === "-" ? "" : endDisplay.textContent;
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

// Handle "Start Exam"
examForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const centreNumber = centreNumberInput.value.trim();
  const centreName = centreNameInput.value.trim();
  const examBoard = examBoardInput.value.trim();
  const subject = subjectInput.value.trim();
  const paper = paperInput.value.trim();
  const durationMinutes = parseInt(durationInput.value, 10);

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    alert("Please enter a valid duration in minutes.");
    return;
  }

  const now = new Date();
  examStartTime = now;
  examEndTime = new Date(now.getTime() + durationMinutes * 60 * 1000);
  examStarted = true;
  toggleFullscreenBtn.disabled = false;

  // Update display fields
  centreNameDisplay.textContent = centreName || "Centre Name";
  centreNumberDisplay.textContent = centreNumber || "Centre Number";
  examBoardDisplay.textContent = examBoard || "Exam Board";

  subjectDisplay.textContent = subject || "-";
  paperDisplay.textContent = paper || "-";
  durationDisplay.textContent = formatDuration(durationMinutes);

  const startText = formatTime(examStartTime, use24Hour, false);
  const endText = formatTime(examEndTime, use24Hour, false);

  startDisplay.textContent = startText;
  endDisplay.textContent = endText;

  actualStartInput.value = startText;
  actualEndInput.value = endText;

  statusPill.textContent = "In progress";
  statusPill.classList.remove("idle");
  statusPill.classList.add("running");

  // Prevent accidental restart
  startExamBtn.disabled = true;
});

// Reset exam state
resetExamBtn.addEventListener("click", () => {
  examStarted = false;
  examStartTime = null;
  examEndTime = null;

  actualStartInput.value = "";
  actualEndInput.value = "";

  subjectDisplay.textContent = "-";
  paperDisplay.textContent = "-";
  durationDisplay.textContent = "-";
  startDisplay.textContent = "-";
  endDisplay.textContent = "-";

  statusPill.textContent = "Not started";
  statusPill.classList.remove("running");
  statusPill.classList.add("idle");

  startExamBtn.disabled = false;
  toggleFullscreenBtn.disabled = true;

  // Exit fullscreen if currently in it
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
});
