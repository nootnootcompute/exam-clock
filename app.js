// State for multiple exams
let use24Hour = true;
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
const durationInput = document.getElementById("duration-minutes");
const examForm = document.getElementById("exam-form");
const startExamBtn = document.getElementById("start-exam");
const clearAllExamsBtn = document.getElementById("clear-all-exams");

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

  // Refresh all exam displays
  renderExams();
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

// Render exams list
function renderExams() {
  if (exams.length === 0) {
    examsListEl.innerHTML = `
      <div class="no-exams-message">
        No exams added yet. Use the form to add exam information.
      </div>
    `;
    return;
  }

  examsListEl.innerHTML = exams.map(exam => {
    const now = new Date();
    const isComplete = now > exam.endTime;
    const statusClass = isComplete ? 'complete' : 'running';
    const statusText = isComplete ? 'Complete' : 'In Progress';

    return `
      <div class="exam-card" data-exam-id="${exam.id}">
        <div class="exam-card-header">
          <div class="exam-title">
            <div class="exam-subject">${exam.subject}</div>
            <div class="exam-paper">${exam.paper}</div>
          </div>
          <button class="remove-exam-btn" onclick="removeExam(${exam.id})" title="Remove exam">×</button>
        </div>
        <div class="exam-times">
          <div class="exam-time-item">
            <span class="time-label">Start:</span>
            <span class="time-value">${formatTime(exam.startTime, use24Hour, false)}</span>
          </div>
          <div class="exam-time-item">
            <span class="time-label">End:</span>
            <span class="time-value">${formatTime(exam.endTime, use24Hour, false)}</span>
          </div>
          <div class="exam-time-item">
            <span class="time-label">Duration:</span>
            <span class="time-value">${formatDuration(exam.duration)}</span>
          </div>
        </div>
        <div class="exam-status">
          <span class="status-pill ${statusClass}">${statusText}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Add exam
function addExam(examData) {
  const exam = {
    id: examIdCounter++,
    ...examData,
    startTime: new Date(),
    endTime: new Date(Date.now() + examData.duration * 60 * 1000)
  };
  
  exams.push(exam);
  renderExams();
}

// Remove exam
function removeExam(id) {
  exams = exams.filter(exam => exam.id !== id);
  renderExams();
}

// Make removeExam available globally for onclick
window.removeExam = removeExam;

// Handle "Add Exam"
examForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const subject = subjectInput.value.trim();
  const paper = paperInput.value.trim();
  const durationMinutes = parseInt(durationInput.value, 10);

  if (!subject) {
    alert("Please enter a subject title.");
    return;
  }

  if (!paper) {
    alert("Please enter a paper number.");
    return;
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    alert("Please enter a valid duration in minutes.");
    return;
  }

  addExam({
    centreNumber: centreSettings.centreNumber,
    centreName: centreSettings.centreName,
    examBoard: examBoardInput.value.trim(),
    subject: subject,
    paper: paper,
    duration: durationMinutes
  });

  // Clear only the exam-specific fields
  subjectInput.value = "";
  paperInput.value = "";
  durationInput.value = "";
  
  // Focus back on subject field for quick entry
  subjectInput.focus();
});

// Clear all exams
if (clearAllExamsBtn) {
  clearAllExamsBtn.addEventListener("click", () => {
    if (exams.length === 0) return;
    
    if (confirm("Are you sure you want to clear all exams?")) {
      exams = [];
      renderExams();
      
      // Exit fullscreen if currently in it
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  });
}

// Initial render
renderExams();
