// Curated modern oceanic & coral slice palette inspired directly by the artwork
const SLICE_COLORS = [
  "#143452", // Deep Navy Blue
  "#1c4d79", // Ocean Blue
  "#256d9c", // Cerulean
  "#3188bf", // Azure
  "#45a2d6", // Sky Aqua
  "#ff6838", // Luminous Coral Orange (Feature Accent)
  "#1b4965", // Deep Sea Teal
  "#206a8e", // Marine Blue
  "#2d82b7", // Steel Blue
  "#3ea1cb", // Light Cerulean
  "#ff7e47", // Warm Tangerine
  "#173d61", // Midnight Ocean
  "#1f5c8b", // Sapphire Sea
  "#2a7ca8", // Cyan Navy
  "#3b97c7", // Bright Ocean
  "#ff6838", // Luminous Coral
  "#194168", // Deep Azure
  "#226699", // Classic Marine
  "#2f89be", // Vibrant Blue
  "#4caedc", // Aqua Sky
  "#ff8a5b", // Soft Coral
  "#133758", // Deep Indigo
  "#1d5583", // Sea Blue
  "#2873a2", // Cerulean
  "#3690c3", // Sky Blue
  "#ff6838", // Coral
  "#1a4770", // Pacific Blue
  "#236192", // Deep Aqua
  "#3080b3", // Light Marine
  "#419ecf", // Clear Sky
  "#ff7842"  // Radiant Orange
];

// Inspiring scripture verses for prayer callouts
const SCRIPTURES = [
  "“The Lord bless you and keep you; the Lord make his face shine upon you and be gracious to you.” — Numbers 6:24-25",
  "“As for me and my house, we will serve the Lord.” — Joshua 24:15",
  "“May the God of hope fill your family with all joy and peace as you trust in him.” — Romans 15:13",
  "“Above all, love each other deeply, because love covers over a multitude of sins.” — 1 Peter 4:8",
  "“Every generous and perfect gift is from above, coming down from the Father of lights.” — James 1:17",
  "“The Lord is near to all who call on him, to all who call on him in truth.” — Psalm 145:18",
  "“Peace be to you, and peace to your house, and peace to all that you have.” — 1 Samuel 25:6"
];

// Specific prayer types to pray for each family
const PRAYER_TYPES = [
  { name: "Hail Mary", icon: "🌹", desc: "Pray 1 Hail Mary for their family peace & grace" },
  { name: "Glory Be", icon: "✨", desc: "Praise God with 1 Glory Be for their household" },
  { name: "Our Father", icon: "🕊️", desc: "Pray 1 Our Father for their blessing" }
];

// Complete 31 Familia'26 Retreat Participants from your Google Sheet
const GOOGLE_SHEET_FAMILIES = [
  "Shaji & Rini Shaji",
  "Shijo Jose & Alphonsa Mathai",
  "Binoy Mathew & Divya Syriac",
  "Sajeesh & Sneha",
  "Shiju KV & Anitha Jose",
  "Joseph & Jenny",
  "Jobin George & Jomol Thomas",
  "Shibu K C & Josily Jose",
  "Baiju Baby & Jiji P G",
  "Sony Paul & Libina Joseph",
  "Libin Baby George & Soja Abraham",
  "Aneesh C Mani & Rose Mery",
  "Akhil Devasia & Athira Babu",
  "Binu John & Betsy George",
  "Jaise Vincent & Rony Paul",
  "Vinu Mathew & Rini",
  "Ebin T J & Rajeena",
  "Robin Jose & Rittina",
  "Saneesh Philip & Rini Saneesh",
  "Thomas M A & Shanty",
  "Shaji Varghese & Sunitha Shaji",
  "Robin Sebastian & Rose Simon",
  "Prince Paulose & Amala Mathew",
  "Anoop & Anu",
  "Proshob & Shilpa",
  "Rahul Jose & Rose Mary Mathew",
  "Ajeesh & Joshmy",
  "Shaiju Jose & Sajini S",
  "Joby Paul & Shintu Joseph",
  "Jomesh & Sneha",
  "Judy & Reeba"
];

// Web Audio API Sound Synthesizer (Zero external files needed)
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(460 + Math.random() * 80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }

  playCelebration() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

        const startTime = this.ctx.currentTime + i * 0.08;
        const duration = 1.6;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.16, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (e) {}
  }
}

// Confetti Particle Shower
class ConfettiShower {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst() {
    this.resize();
    const colors = ["#ff6838", "#ff8a5b", "#5ec4e6", "#3897cd", "#ffffff", "#ffcc80"];
    const count = 100;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: this.canvas.height * 0.45,
        w: Math.random() * 8 + 5,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.9) * 16 - 3,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 15,
        opacity: 1,
        decay: Math.random() * 0.01 + 0.008
      });
    }

    if (!this.animationId) {
      this.render();
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.rot += p.vRot;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rot * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }
}

// Application State Manager
class PrayerWheelApp {
  constructor() {
    this.allFamilies = [];
    this.activeFamilies = [];
    this.historyList = [];
    this.currentRotation = 0;
    this.isSpinning = false;
    this.selectedFamily = null;
    
    // UI Elements
    this.canvas = document.getElementById("wheelCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.spinBtn = document.getElementById("spinBtn");
    this.pointerWrapper = document.getElementById("pointerWrapper");
    this.soundToggleBtn = document.getElementById("soundToggleBtn");
    this.historyToggleBtn = document.getElementById("historyToggleBtn");
    this.historyCount = document.getElementById("historyCount");
    this.manageFamiliesBtn = document.getElementById("manageFamiliesBtn");
    this.totalFamilyCount = document.getElementById("totalFamilyCount");
    this.resetBtn = document.getElementById("resetBtn");
    
    this.resultCard = document.getElementById("resultCard");
    this.resultPlaceholder = document.getElementById("resultPlaceholder");
    this.resultContent = document.getElementById("resultContent");
    this.selectedFamilyName = document.getElementById("selectedFamilyName");
    this.prayerTypeName = document.getElementById("prayerTypeName");
    this.prayerMessage = document.getElementById("prayerMessage");
    this.scriptureQuote = document.getElementById("scriptureQuote");

    // Menu Modal
    this.menuBtn = document.getElementById("menuBtn");
    this.menuModal = document.getElementById("menuModal");
    this.closeMenuBtn = document.getElementById("closeMenuBtn");
    this.closeMenuFooterBtn = document.getElementById("closeMenuFooterBtn");

    // Manage Families Modal
    this.manageModal = document.getElementById("manageModal");
    this.closeManageBtn = document.getElementById("closeManageBtn");
    this.closeManageFooterBtn = document.getElementById("closeManageFooterBtn");
    this.familyListTextarea = document.getElementById("familyListTextarea");
    this.saveFamiliesBtn = document.getElementById("saveFamiliesBtn");
    this.loadDefaultsBtn = document.getElementById("loadDefaultsBtn");
    this.textareaCount = document.getElementById("textareaCount");

    // History Modal
    this.historyModal = document.getElementById("historyModal");
    this.closeHistoryBtn = document.getElementById("closeHistoryBtn");
    this.closeHistoryFooterBtn = document.getElementById("closeHistoryFooterBtn");
    this.historyListElem = document.getElementById("historyList");

    // Reset Modal
    this.resetModal = document.getElementById("resetModal");
    this.cancelResetBtn = document.getElementById("cancelResetBtn");
    this.confirmResetBtn = document.getElementById("confirmResetBtn");

    // Completed Modal & Round Tracking
    this.completedModal = document.getElementById("completedModal");
    this.completedResetBtn = document.getElementById("completedResetBtn");
    this.completedTitle = document.getElementById("completedTitle");
    this.nextRoundNum = document.getElementById("nextRoundNum");
    this.btnNextRoundNum = document.getElementById("btnNextRoundNum");
    this.autostartCountdown = document.getElementById("autostartCountdown");
    this.roundBadgeText = document.getElementById("roundBadgeText");
    this.roundNumber = 1;
    this.autoStartCountdownTimer = null;

    // Helpers
    this.sounds = new SoundEffects();
    this.confetti = new ConfettiShower(document.getElementById("confettiCanvas"));
    this.lastTickIndex = -1;
    this.lastProcessedSpinTrigger = null;
    this.broadcastChannel = null;
    this.dbRef = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadData();
    this.initSync();
    this.recalculateActiveFamilies();
    this.drawWheel();
    this.updateUI();
  }

  initSync() {
    // 1. BroadcastChannel for local same-browser cross-tab sync
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.broadcastChannel = new BroadcastChannel("familia_retreat_channel");
        this.broadcastChannel.onmessage = (event) => {
          if (event && event.data) {
            this.handleIncomingState(event.data);
          }
        };
      } catch (e) {}
    }

    // 2. Firebase Realtime Database
    if (typeof firebase !== "undefined" && window.firebaseConfig) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(window.firebaseConfig);
        }
        const db = firebase.database();
        this.dbRef = db.ref("retreat_state");

        this.dbRef.on("value", (snap) => {
          const val = snap.val();
          if (val) {
            this.handleIncomingState(val);
          }
        });
      } catch (e) {
        console.warn("Firebase sync error in app.js:", e);
      }
    }
  }

  handleIncomingState(state) {
    if (!state) return;

    // Check remote spin trigger from Admin Portal
    if (state.spinTrigger && state.spinTrigger.timestamp) {
      const triggerKey = state.spinTrigger.id || state.spinTrigger.timestamp;
      if (this.lastProcessedSpinTrigger !== triggerKey) {
        this.lastProcessedSpinTrigger = triggerKey;
        // If trigger is recent (within 10 seconds) and wheel is ready
        if (Date.now() - state.spinTrigger.timestamp < 10000 && !this.isSpinning) {
          this.spin();
          return;
        }
      }
    }

    let needsRedraw = false;

    if (state.roundNumber !== undefined && state.roundNumber !== this.roundNumber) {
      this.roundNumber = state.roundNumber;
      localStorage.setItem("familia_retreat_round_v4", this.roundNumber.toString());
      needsRedraw = true;
    }

    if (Array.isArray(state.allFamilies) && JSON.stringify(state.allFamilies) !== JSON.stringify(this.allFamilies)) {
      this.allFamilies = state.allFamilies;
      needsRedraw = true;
    }

    if (Array.isArray(state.historyList) && JSON.stringify(state.historyList) !== JSON.stringify(this.historyList)) {
      this.historyList = state.historyList;
      needsRedraw = true;
    }

    if (state.selectedFamily !== undefined && state.selectedFamily !== this.selectedFamily) {
      this.selectedFamily = state.selectedFamily;
      if (!this.isSpinning) {
        if (this.selectedFamily) {
          this.displaySelectedFamily(this.selectedFamily, state.selectedPrayer, false);
        } else {
          this.clearResultCard();
        }
      }
    }

    if (needsRedraw) {
      localStorage.setItem("familia_retreat_families_v4", JSON.stringify(this.allFamilies));
      localStorage.setItem("familia_retreat_history_v4", JSON.stringify(this.historyList));
      localStorage.setItem("familia_retreat_round_v4", this.roundNumber.toString());
      this.recalculateActiveFamilies();
      this.drawWheel();
      this.updateUI();
    }
  }

  publishState(extraPayload = {}) {
    const statePayload = {
      roundNumber: this.roundNumber,
      allFamilies: this.allFamilies,
      historyList: this.historyList,
      selectedFamily: this.selectedFamily,
      selectedPrayer: this.selectedPrayer,
      lastUpdated: Date.now(),
      ...extraPayload
    };

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(statePayload);
      } catch (e) {}
    }

    if (this.dbRef) {
      this.dbRef.update(statePayload).catch(() => {});
    }
  }

  loadData() {
    this.roundNumber = parseInt(localStorage.getItem("familia_retreat_round_v4") || "1", 10) || 1;

    const savedFamilies = localStorage.getItem("familia_retreat_families_v4");
    if (savedFamilies) {
      try {
        const parsed = JSON.parse(savedFamilies);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.allFamilies = parsed;
        } else {
          this.allFamilies = [...GOOGLE_SHEET_FAMILIES];
        }
      } catch (e) {
        this.allFamilies = [...GOOGLE_SHEET_FAMILIES];
      }
    } else {
      this.allFamilies = [...GOOGLE_SHEET_FAMILIES];
      this.saveFamiliesToStorage();
    }

    const savedHistory = localStorage.getItem("familia_retreat_history_v4");
    if (savedHistory) {
      try {
        this.historyList = JSON.parse(savedHistory) || [];
      } catch (e) {
        this.historyList = [];
      }
    } else {
      this.historyList = [];
    }

    const savedSelected = localStorage.getItem("familia_retreat_selected_v4");
    if (savedSelected) {
      try {
        this.selectedFamily = JSON.parse(savedSelected);
        if (this.selectedFamily) {
          this.displaySelectedFamily(this.selectedFamily, false);
        }
      } catch (e) {}
    }
  }

  saveFamiliesToStorage() {
    localStorage.setItem("familia_retreat_families_v4", JSON.stringify(this.allFamilies));
    this.publishState();
  }

  saveHistoryToStorage() {
    localStorage.setItem("familia_retreat_history_v4", JSON.stringify(this.historyList));
    localStorage.setItem("familia_retreat_selected_v4", JSON.stringify(this.selectedFamily));
    this.publishState();
  }

  recalculateActiveFamilies() {
    const prayedSet = new Set(
      this.historyList.map(item => typeof item === 'string' ? item : item.family)
    );
    this.activeFamilies = this.allFamilies.filter(f => !prayedSet.has(f));

    if (this.allFamilies.length === 0) {
      this.spinBtn.disabled = true;
      this.spinBtn.querySelector(".btn-text").textContent = "NO FAMILIES LISTED";
    } else if (this.activeFamilies.length === 0) {
      this.spinBtn.disabled = true;
      this.spinBtn.querySelector(".btn-text").textContent = "ALL FAMILIES PRAYED FOR";
      if (!this.isSpinning) {
        this.showCompletedModal();
      }
    } else {
      this.spinBtn.disabled = this.isSpinning;
      this.spinBtn.querySelector(".btn-text").textContent = "SPIN FOR PRAYER";
    }
  }

  updateUI() {
    const total = this.allFamilies.length;
    const completed = this.historyList.length;

    this.historyCount.textContent = completed;
    this.totalFamilyCount.textContent = total;

    if (this.roundBadgeText) {
      this.roundBadgeText.textContent = `Round ${this.roundNumber || 1}`;
    }

    this.renderHistoryList();
  }

  renderHistoryList() {
    this.historyListElem.innerHTML = "";
    if (this.historyList.length === 0) {
      this.historyListElem.innerHTML = '<li class="empty-history">No families selected yet for this session.</li>';
      return;
    }

    const reversed = [...this.historyList].reverse();
    reversed.forEach((item, idx) => {
      const familyName = typeof item === 'string' ? item : item.family;
      const prayerName = typeof item === 'object' && item.prayer ? item.prayer : "1 Hail Mary";
      const icon = typeof item === 'object' && item.icon ? item.icon : "🌹";

      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.1rem;">
          <strong class="history-item-name">🕊️ ${this.escapeHtml(familyName)}</strong>
          <span style="font-size:0.75rem; color:var(--coral-primary);">${icon} ${this.escapeHtml(prayerName)}</span>
        </div>
        <span class="history-item-num">#${this.historyList.length - idx}</span>
      `;
      this.historyListElem.appendChild(li);
    });
  }

  setupEventListeners() {
    this.spinBtn.addEventListener("click", () => this.spin());

    // Menu Modal
    this.menuBtn.addEventListener("click", () => {
      this.menuModal.classList.remove("hidden");
    });
    this.closeMenuBtn.addEventListener("click", () => {
      this.menuModal.classList.add("hidden");
    });
    this.closeMenuFooterBtn.addEventListener("click", () => {
      this.menuModal.classList.add("hidden");
    });

    // Sound toggle
    this.soundToggleBtn.addEventListener("click", () => {
      this.sounds.enabled = !this.sounds.enabled;
      this.soundToggleBtn.textContent = this.sounds.enabled ? "Sound ON" : "Sound OFF";
    });

    // History Modal
    this.historyToggleBtn.addEventListener("click", () => {
      this.historyModal.classList.remove("hidden");
    });
    this.closeHistoryBtn.addEventListener("click", () => {
      this.historyModal.classList.add("hidden");
    });
    this.closeHistoryFooterBtn.addEventListener("click", () => {
      this.historyModal.classList.add("hidden");
    });

    // Manage Families Modal (from Menu)
    this.manageFamiliesBtn.addEventListener("click", () => {
      this.menuModal.classList.add("hidden");
      this.familyListTextarea.value = this.allFamilies.join("\n");
      this.updateTextareaCount();
      this.manageModal.classList.remove("hidden");
    });
    this.closeManageBtn.addEventListener("click", () => {
      this.manageModal.classList.add("hidden");
    });
    this.closeManageFooterBtn.addEventListener("click", () => {
      this.manageModal.classList.add("hidden");
    });

    this.familyListTextarea.addEventListener("input", () => this.updateTextareaCount());

    this.loadDefaultsBtn.addEventListener("click", () => {
      this.familyListTextarea.value = GOOGLE_SHEET_FAMILIES.join("\n");
      this.updateTextareaCount();
    });

    this.saveFamiliesBtn.addEventListener("click", () => {
      const lines = this.familyListTextarea.value
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

      if (lines.length === 0) {
        alert("Please enter at least one family name.");
        return;
      }

      this.allFamilies = lines;
      this.saveFamiliesToStorage();
      this.recalculateActiveFamilies();
      this.drawWheel();
      this.updateUI();
      this.manageModal.classList.add("hidden");
    });

    // Reset Modal (from Menu)
    this.resetBtn.addEventListener("click", () => {
      this.menuModal.classList.add("hidden");
      this.resetModal.classList.remove("hidden");
    });
    this.cancelResetBtn.addEventListener("click", () => {
      this.resetModal.classList.add("hidden");
    });
    this.confirmResetBtn.addEventListener("click", () => {
      this.resetSession();
      this.resetModal.classList.add("hidden");
    });

    // Completed Modal Reset
    this.completedResetBtn.addEventListener("click", () => {
      this.startNextRound();
    });

    // Close on overlay click
    [this.menuModal, this.historyModal, this.manageModal, this.resetModal, this.completedModal].forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
      });
    });

    // Spacebar to spin
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !this.spinBtn.disabled && !this.isSpinning) {
        const isInputFocused = ["INPUT", "TEXTAREA", "BUTTON"].includes(document.activeElement?.tagName);
        if (!isInputFocused) {
          e.preventDefault();
          this.spin();
        }
      }
    });
  }

  updateTextareaCount() {
    const lines = this.familyListTextarea.value
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);
    this.textareaCount.textContent = `${lines.length} families detected`;
  }

  drawWheel() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;

    ctx.clearRect(0, 0, size, size);

    const families = this.activeFamilies;
    const numSlices = families.length;

    if (numSlices === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#0c233c";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ff6838";
      ctx.stroke();

      ctx.fillStyle = "#f0f7fb";
      ctx.font = "600 24px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const message = this.allFamilies.length === 0 
        ? "No Families Added 🕊️" 
        : "All Families Prayed For! 🕊️";
      ctx.fillText(message, center, center);
      ctx.restore();
      return;
    }

    const arcSize = (2 * Math.PI) / numSlices;

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(this.currentRotation);

    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;
      const familyName = families[i];
      const sliceColor = SLICE_COLORS[i % SLICE_COLORS.length];

      // Sector Arc
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = sliceColor;
      ctx.fill();

      // Delicate clean slice dividers
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.stroke();

      // Outer rim
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(94, 196, 230, 0.4)";
      ctx.stroke();

      // Text on Slice
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      let fontSize = 21;
      if (numSlices > 12) fontSize = 16;
      if (numSlices > 20) fontSize = 13;
      if (numSlices > 28) fontSize = 11;
      if (numSlices > 40) fontSize = 9.5;

      ctx.font = `600 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = "#ffffff";

      let displayName = familyName;
      const maxTextWidth = radius - 70;
      if (ctx.measureText(displayName).width > maxTextWidth) {
        while (displayName.length > 3 && ctx.measureText(displayName + "…").width > maxTextWidth) {
          displayName = displayName.slice(0, -1);
        }
        displayName += "…";
      }

      ctx.fillText(displayName, radius - 28, 0);
      ctx.restore();
    }

    ctx.restore();
  }

  spin() {
    if (this.isSpinning || this.activeFamilies.length === 0) return;

    this.isSpinning = true;
    this.spinBtn.disabled = true;
    this.sounds.init();

    const numSlices = this.activeFamilies.length;
    const winningIndex = Math.floor(Math.random() * numSlices);
    const winningFamily = this.activeFamilies[winningIndex];

    const sliceAngle = (2 * Math.PI) / numSlices;
    const extraRotations = (5 + Math.floor(Math.random() * 4)) * (2 * Math.PI);
    const randomOffsetInSlice = (Math.random() - 0.5) * (sliceAngle * 0.7);
    
    const targetAngleNormalized = (3 * Math.PI / 2) - (winningIndex * sliceAngle + sliceAngle / 2) + randomOffsetInSlice;
    
    const currentMod = this.currentRotation % (2 * Math.PI);
    let deltaAngle = (targetAngleNormalized - currentMod) % (2 * Math.PI);
    if (deltaAngle < 0) deltaAngle += 2 * Math.PI;

    const totalRotationTarget = this.currentRotation + extraRotations + deltaAngle;
    const startRotation = this.currentRotation;
    const spinDuration = 5500;
    const startTime = performance.now();

    this.lastTickIndex = -1;

    const animateSpin = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Smooth Quintic Easing
      const easeOut = 1 - Math.pow(1 - progress, 5);

      this.currentRotation = startRotation + (totalRotationTarget - startRotation) * easeOut;
      this.drawWheel();

      // Sound ticker & Pointer tilt physics
      const pointerAngle = (3 * Math.PI / 2 - (this.currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currentSliceIndex = Math.floor(pointerAngle / sliceAngle) % numSlices;
      if (currentSliceIndex !== this.lastTickIndex) {
        this.sounds.playTick();
        this.lastTickIndex = currentSliceIndex;

        // Dynamic pointer bounce
        if (this.pointerWrapper) {
          this.pointerWrapper.style.transform = "translateX(-50%) rotate(-12deg)";
          setTimeout(() => {
            if (this.pointerWrapper) {
              this.pointerWrapper.style.transform = "translateX(-50%) rotate(0deg)";
            }
          }, 45);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        this.currentRotation = totalRotationTarget;
        this.drawWheel();
        if (this.pointerWrapper) {
          this.pointerWrapper.style.transform = "translateX(-50%) rotate(0deg)";
        }
        this.onSpinCompleted(winningFamily);
      }
    };

    requestAnimationFrame(animateSpin);
  }

  onSpinCompleted(selectedFamily) {
    this.isSpinning = false;
    this.selectedFamily = selectedFamily;
    this.sounds.playCelebration();
    this.confetti.burst();

    // Select prayer type
    const randomPrayer = PRAYER_TYPES[Math.floor(Math.random() * PRAYER_TYPES.length)];
    this.selectedPrayer = randomPrayer;

    this.displaySelectedFamily(selectedFamily, randomPrayer, true);

    this.historyList.push({
      family: selectedFamily,
      prayer: randomPrayer.name,
      icon: randomPrayer.icon
    });
    this.saveHistoryToStorage();

    this.recalculateActiveFamilies();
    this.updateUI();

    if (this.activeFamilies.length === 0) {
      setTimeout(() => {
        this.showCompletedModal();
      }, 3500);
    }
  }

  displaySelectedFamily(familyName, prayerObj = null, isNewPick = false) {
    this.resultPlaceholder.classList.add("hidden");
    this.resultContent.classList.remove("hidden");
    this.selectedFamilyName.textContent = familyName;

    if (!prayerObj) {
      prayerObj = PRAYER_TYPES[Math.floor(Math.random() * PRAYER_TYPES.length)];
    }

    if (this.prayerTypeName) {
      this.prayerTypeName.textContent = `${prayerObj.icon} ${prayerObj.name}`;
    }
    if (this.prayerMessage) {
      this.prayerMessage.textContent = `🙏 Please pray ${prayerObj.name} for this family.`;
    }

    const randomScripture = SCRIPTURES[Math.floor(Math.random() * SCRIPTURES.length)];
    this.scriptureQuote.textContent = randomScripture;

    if (isNewPick) {
      this.resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  clearResultCard() {
    this.resultPlaceholder.classList.remove("hidden");
    this.resultContent.classList.add("hidden");
  }

  resetSession() {
    if (this.autoStartCountdownTimer) {
      clearInterval(this.autoStartCountdownTimer);
      this.autoStartCountdownTimer = null;
    }
    this.roundNumber = 1;
    this.historyList = [];
    this.selectedFamily = null;
    this.selectedPrayer = null;
    localStorage.setItem("familia_retreat_round_v4", "1");
    this.saveHistoryToStorage();
    this.clearResultCard();
    this.recalculateActiveFamilies();
    this.drawWheel();
    this.updateUI();
  }

  showCompletedModal() {
    if (this.autoStartCountdownTimer) {
      clearInterval(this.autoStartCountdownTimer);
      this.autoStartCountdownTimer = null;
    }

    const currentRound = this.roundNumber || 1;
    const nextRound = currentRound + 1;

    if (this.completedTitle) {
      this.completedTitle.textContent = `Round ${currentRound} Completed! 🎉`;
    }
    if (this.nextRoundNum) {
      this.nextRoundNum.textContent = nextRound;
    }
    if (this.btnNextRoundNum) {
      this.btnNextRoundNum.textContent = nextRound;
    }

    let timeLeft = 5;
    if (this.autostartCountdown) {
      this.autostartCountdown.textContent = timeLeft;
    }

    this.completedModal.classList.remove("hidden");
    this.confetti.burst();
    this.sounds.playCelebration();

    // Auto-start countdown (5 seconds)
    this.autoStartCountdownTimer = setInterval(() => {
      timeLeft -= 1;
      if (this.autostartCountdown) {
        this.autostartCountdown.textContent = Math.max(0, timeLeft);
      }
      if (timeLeft <= 0) {
        clearInterval(this.autoStartCountdownTimer);
        this.autoStartCountdownTimer = null;
        this.startNextRound();
      }
    }, 1000);
  }

  startNextRound() {
    if (this.autoStartCountdownTimer) {
      clearInterval(this.autoStartCountdownTimer);
      this.autoStartCountdownTimer = null;
    }

    this.roundNumber = (this.roundNumber || 1) + 1;
    this.historyList = [];
    this.selectedFamily = null;
    this.selectedPrayer = null;
    localStorage.setItem("familia_retreat_round_v4", this.roundNumber.toString());

    this.saveHistoryToStorage();
    this.clearResultCard();
    this.recalculateActiveFamilies();
    this.drawWheel();
    this.updateUI();

    if (this.completedModal) {
      this.completedModal.classList.add("hidden");
    }

    this.confetti.burst();
    this.sounds.playCelebration();
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.prayerWheel = new PrayerWheelApp();
});
