// ===================================================
// FAMILIA RETREAT '26 - ADMIN CONTROL & SYNC PANEL
// ===================================================

const DEFAULT_FAMILIES = [
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

const PRAYER_TYPES = [
  { name: "Hail Mary", icon: "🌹", desc: "Pray 1 Hail Mary for their family peace & grace" },
  { name: "Glory Be", icon: "✨", desc: "Praise God with 1 Glory Be for their household" },
  { name: "Our Father", icon: "🕊️", desc: "Pray 1 Our Father for their blessing" }
];

class AdminController {
  constructor() {
    this.allFamilies = [];
    this.historyList = [];
    this.selectedFamily = null;
    this.selectedPrayer = null;
    this.roundNumber = 1;
    this.currentFilter = "all"; // 'all', 'pending', 'prayed'
    this.searchQuery = "";

    // Firebase & Broadcast references
    this.db = null;
    this.dbRef = null;
    this.isFirebaseConnected = false;
    this.broadcastChannel = null;

    // DOM Elements
    this.statusDot = document.getElementById("statusDot");
    this.statusText = document.getElementById("statusText");
    this.statRound = document.getElementById("statRound");
    this.statTotalFamilies = document.getElementById("statTotalFamilies");
    this.statPrayedFamilies = document.getElementById("statPrayedFamilies");
    this.statRemainingFamilies = document.getElementById("statRemainingFamilies");

    this.remoteSpinBtn = document.getElementById("remoteSpinBtn");
    this.remoteSpinBtnText = document.getElementById("remoteSpinBtnText");
    this.clearSelectionBtn = document.getElementById("clearSelectionBtn");
    this.openResetModalBtn = document.getElementById("openResetModalBtn");

    this.winnerNameDisplay = document.getElementById("winnerNameDisplay");
    this.winnerPrayerDisplay = document.getElementById("winnerPrayerDisplay");

    this.quickAddForm = document.getElementById("quickAddForm");
    this.quickAddInput = document.getElementById("quickAddInput");
    this.familySearchInput = document.getElementById("familySearchInput");
    this.familyListContainer = document.getElementById("familyListContainer");

    this.filterAllBtn = document.getElementById("filterAllBtn");
    this.filterPendingBtn = document.getElementById("filterPendingBtn");
    this.filterPrayedBtn = document.getElementById("filterPrayedBtn");
    this.countFilterAll = document.getElementById("countFilterAll");
    this.countFilterPending = document.getElementById("countFilterPending");
    this.countFilterPrayed = document.getElementById("countFilterPrayed");

    this.historyLogList = document.getElementById("historyLogList");
    this.exportCsvBtn = document.getElementById("exportCsvBtn");
    this.copySummaryBtn = document.getElementById("copySummaryBtn");

    this.forceCloudSyncBtn = document.getElementById("forceCloudSyncBtn");
    this.reloadDefaultsAdminBtn = document.getElementById("reloadDefaultsAdminBtn");
    this.testSoundBtn = document.getElementById("testSoundBtn");

    this.adminPrevRoundBtn = document.getElementById("adminPrevRoundBtn");
    this.adminNextRoundBtn = document.getElementById("adminNextRoundBtn");
    this.startNextRoundBtn = document.getElementById("startNextRoundBtn");

    // Modals
    this.bulkModal = document.getElementById("bulkModal");
    this.openBulkModalBtn = document.getElementById("openBulkModalBtn");
    this.closeBulkBtn = document.getElementById("closeBulkBtn");
    this.closeBulkFooterBtn = document.getElementById("closeBulkFooterBtn");
    this.bulkFamilyTextarea = document.getElementById("bulkFamilyTextarea");
    this.bulkCountText = document.getElementById("bulkCountText");
    this.bulkLoadDefaultsBtn = document.getElementById("bulkLoadDefaultsBtn");
    this.saveBulkBtn = document.getElementById("saveBulkBtn");

    this.adminResetModal = document.getElementById("adminResetModal");
    this.closeAdminResetBtn = document.getElementById("closeAdminResetBtn");
    this.cancelAdminResetBtn = document.getElementById("cancelAdminResetBtn");
    this.confirmAdminResetBtn = document.getElementById("confirmAdminResetBtn");
    this.modalNextRoundNum = document.getElementById("modalNextRoundNum");
    this.modalNextRoundNum2 = document.getElementById("modalNextRoundNum2");
    this.modalStartNextRoundBtn = document.getElementById("modalStartNextRoundBtn");

    this.adminGuideModal = document.getElementById("adminGuideModal");
    this.adminGuideBtn = document.getElementById("adminGuideBtn");
    this.closeAdminGuideBtn = document.getElementById("closeAdminGuideBtn");
    this.closeAdminGuideFooterBtn = document.getElementById("closeAdminGuideFooterBtn");

    this.toast = document.getElementById("adminToast");
    this.toastIcon = document.getElementById("toastIcon");
    this.toastMsg = document.getElementById("toastMsg");

    this.init();
  }

  init() {
    this.initBroadcastChannel();
    this.initFirebase();
    this.loadLocalData();
    this.setupEventListeners();
    this.updateDashboard();
  }

  initBroadcastChannel() {
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.broadcastChannel = new BroadcastChannel("familia_retreat_channel");
        this.broadcastChannel.onmessage = (event) => {
          if (event && event.data) {
            this.handleIncomingState(event.data, "local-broadcast");
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel not supported:", e);
      }
    }
  }

  initFirebase() {
    if (typeof firebase !== "undefined" && window.firebaseConfig) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(window.firebaseConfig);
        }
        this.db = firebase.database();
        this.dbRef = this.db.ref("retreat_state");

        // Connection state listener
        this.db.ref(".info/connected").on("value", (snap) => {
          if (snap.val() === true) {
            this.isFirebaseConnected = true;
            this.statusDot.className = "status-dot online";
            this.statusText.textContent = "Firebase Live RTDB 🟢";
            this.showToast("☁️ Connected to Firebase Live Cloud", "🟢");
          } else {
            this.isFirebaseConnected = false;
            this.statusDot.className = "status-dot syncing";
            this.statusText.textContent = "Local Offline Mode 🟡";
          }
        });

        // Listen for Realtime Database changes
        this.dbRef.on("value", (snapshot) => {
          const cloudData = snapshot.val();
          if (cloudData) {
            this.handleIncomingState(cloudData, "firebase");
          }
        }, (error) => {
          console.warn("Firebase read error (falling back to local):", error);
          this.statusDot.className = "status-dot syncing";
          this.statusText.textContent = "Local Storage Mode 🟡";
        });
      } catch (err) {
        console.warn("Firebase initialization error:", err);
        this.statusDot.className = "status-dot syncing";
        this.statusText.textContent = "Local Storage Mode 🟡";
      }
    } else {
      this.statusDot.className = "status-dot syncing";
      this.statusText.textContent = "Local Mode 🟡";
    }
  }

  loadLocalData() {
    this.roundNumber = parseInt(localStorage.getItem("familia_retreat_round_v4") || "1", 10) || 1;

    const savedFamilies = localStorage.getItem("familia_retreat_families_v4");
    if (savedFamilies) {
      try {
        const parsed = JSON.parse(savedFamilies);
        this.allFamilies = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_FAMILIES];
      } catch (e) {
        this.allFamilies = [...DEFAULT_FAMILIES];
      }
    } else {
      this.allFamilies = [...DEFAULT_FAMILIES];
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
      } catch (e) {
        this.selectedFamily = null;
      }
    }
  }

  handleIncomingState(state, source = "sync") {
    if (!state) return;

    if (state.roundNumber !== undefined) {
      this.roundNumber = state.roundNumber;
    }
    if (Array.isArray(state.allFamilies) && state.allFamilies.length > 0) {
      this.allFamilies = state.allFamilies;
    }
    if (Array.isArray(state.historyList)) {
      this.historyList = state.historyList;
    }
    if (state.selectedFamily !== undefined) {
      this.selectedFamily = state.selectedFamily;
    }
    if (state.selectedPrayer !== undefined) {
      this.selectedPrayer = state.selectedPrayer;
    }

    // Save to local cache
    localStorage.setItem("familia_retreat_round_v4", this.roundNumber.toString());
    localStorage.setItem("familia_retreat_families_v4", JSON.stringify(this.allFamilies));
    localStorage.setItem("familia_retreat_history_v4", JSON.stringify(this.historyList));
    localStorage.setItem("familia_retreat_selected_v4", JSON.stringify(this.selectedFamily));

    this.updateDashboard();
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

    // 1. Local Storage
    localStorage.setItem("familia_retreat_round_v4", this.roundNumber.toString());
    localStorage.setItem("familia_retreat_families_v4", JSON.stringify(this.allFamilies));
    localStorage.setItem("familia_retreat_history_v4", JSON.stringify(this.historyList));
    localStorage.setItem("familia_retreat_selected_v4", JSON.stringify(this.selectedFamily));

    // 2. BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(statePayload);
      } catch (e) {}
    }

    // 3. Firebase RTDB
    if (this.dbRef) {
      this.dbRef.update(statePayload).catch((err) => {
        console.warn("Firebase update failed:", err);
      });
    }

    this.updateDashboard();
  }

  startNextRound() {
    this.roundNumber = (this.roundNumber || 1) + 1;
    this.historyList = [];
    this.selectedFamily = null;
    this.selectedPrayer = null;
    this.publishState();
    this.playTestChime();
    this.showToast(`🎉 Advanced to Round ${this.roundNumber}! All families back on wheel.`, "🚀");
  }

  updateDashboard() {
    const total = this.allFamilies.length;
    const prayedSet = new Set(
      this.historyList.map(item => (typeof item === "string" ? item : item.family))
    );
    const completed = this.historyList.length;
    const remaining = Math.max(0, total - completed);
    const nextRound = (this.roundNumber || 1) + 1;

    // Stats
    if (this.statRound) {
      this.statRound.textContent = `Round ${this.roundNumber || 1}`;
    }
    this.statTotalFamilies.textContent = total;
    this.statPrayedFamilies.textContent = completed;
    this.statRemainingFamilies.textContent = remaining;

    if (this.modalNextRoundNum) {
      this.modalNextRoundNum.textContent = `Round ${nextRound}`;
    }
    if (this.modalNextRoundNum2) {
      this.modalNextRoundNum2.textContent = `${nextRound}`;
    }

    // Selected Winner View
    if (this.selectedFamily) {
      this.winnerNameDisplay.textContent = this.selectedFamily;
      if (this.selectedPrayer) {
        this.winnerPrayerDisplay.textContent = `${this.selectedPrayer.icon || "🌹"} ${this.selectedPrayer.name || "Hail Mary"}`;
      } else {
        this.winnerPrayerDisplay.textContent = "🌹 1 Hail Mary";
      }
    } else {
      this.winnerNameDisplay.textContent = "No family selected yet";
      this.winnerPrayerDisplay.textContent = "Spin the wheel or trigger from remote";
    }

    // Spin Button state
    if (remaining === 0) {
      this.remoteSpinBtn.disabled = false;
      this.remoteSpinBtn.classList.add("btn-start-next-round");
      this.remoteSpinBtnText.textContent = `START ROUND ${nextRound} NOW 🔄`;
    } else {
      this.remoteSpinBtn.disabled = false;
      this.remoteSpinBtn.classList.remove("btn-start-next-round");
      this.remoteSpinBtnText.textContent = "TRIGGER REMOTE SPIN 🎯";
    }

    // Counts for filter pills
    this.countFilterAll.textContent = total;
    this.countFilterPending.textContent = remaining;
    this.countFilterPrayed.textContent = completed;

    this.renderFamilyList(prayedSet);
    this.renderHistoryLog();
  }

  renderFamilyList(prayedSet) {
    this.familyListContainer.innerHTML = "";

    const query = this.searchQuery.trim().toLowerCase();

    let filtered = this.allFamilies.map((name, index) => ({
      name,
      index: index + 1,
      isPrayed: prayedSet.has(name)
    }));

    if (query) {
      filtered = filtered.filter(f => f.name.toLowerCase().includes(query));
    }

    if (this.currentFilter === "pending") {
      filtered = filtered.filter(f => !f.isPrayed);
    } else if (this.currentFilter === "prayed") {
      filtered = filtered.filter(f => f.isPrayed);
    }

    if (filtered.length === 0) {
      this.familyListContainer.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.85rem;">
          No families match current filter or search.
        </div>
      `;
      return;
    }

    filtered.forEach((item) => {
      const row = document.createElement("div");
      row.className = `family-row ${item.isPrayed ? "prayed-row" : ""}`;

      row.innerHTML = `
        <div class="family-info">
          <span class="family-idx">#${item.index}</span>
          <span class="family-name-text" title="${this.escapeHtml(item.name)}">${this.escapeHtml(item.name)}</span>
          <span class="family-status-badge ${item.isPrayed ? "status-completed" : "status-pending"}">
            ${item.isPrayed ? "✅ Prayed" : "⏳ Pending"}
          </span>
        </div>
        <div class="family-actions">
          ${
            item.isPrayed
              ? `<button class="btn-sm-icon" data-action="unpray" data-name="${this.escapeHtml(item.name)}" title="Move back to wheel">↩️ Re-add</button>`
              : `<button class="btn-sm-icon" data-action="markprayed" data-name="${this.escapeHtml(item.name)}" title="Mark as prayed manually">✔️ Mark Prayed</button>`
          }
          <button class="btn-sm-icon" data-action="edit" data-name="${this.escapeHtml(item.name)}" title="Edit Name">✏️</button>
          <button class="btn-sm-icon btn-sm-danger" data-action="delete" data-name="${this.escapeHtml(item.name)}" title="Delete Family">🗑️</button>
        </div>
      `;

      this.familyListContainer.appendChild(row);
    });
  }

  renderHistoryLog() {
    this.historyLogList.innerHTML = "";

    if (this.historyList.length === 0) {
      this.historyLogList.innerHTML = `
        <li class="empty-history" style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.85rem;">
          No prayers logged yet for this round.
        </li>
      `;
      return;
    }

    const reversed = [...this.historyList].reverse();
    reversed.forEach((item, idx) => {
      const familyName = typeof item === "string" ? item : item.family;
      const prayerName = typeof item === "object" && item.prayer ? item.prayer : "1 Hail Mary";
      const icon = typeof item === "object" && item.icon ? item.icon : "🌹";
      const timeStr = typeof item === "object" && item.time ? item.time : "";

      const li = document.createElement("li");
      li.className = "history-log-item";
      li.innerHTML = `
        <div>
          <div class="history-log-title">🕊️ ${this.escapeHtml(familyName)}</div>
          <div class="history-log-sub">${icon} ${this.escapeHtml(prayerName)}</div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${timeStr ? `<span class="history-log-time">${timeStr}</span>` : ""}
          <span style="font-size:0.75rem; font-weight:700; color:var(--sea-cyan);">#${this.historyList.length - idx}</span>
          <button class="btn-sm-icon btn-sm-danger" data-history-idx="${this.historyList.length - 1 - idx}" title="Remove from history">✕</button>
        </div>
      `;
      this.historyLogList.appendChild(li);
    });
  }

  setupEventListeners() {
    // 1. Remote Spin Trigger & Next Round Action
    this.remoteSpinBtn.addEventListener("click", () => {
      const prayedSet = new Set(this.historyList.map(h => typeof h === 'string' ? h : h.family));
      const remaining = this.allFamilies.filter(f => !prayedSet.has(f));
      
      if (remaining.length === 0) {
        this.startNextRound();
        return;
      }

      this.showToast("🚀 Triggering Live Wheel Spin...", "🎯");
      this.selectedFamily = null;
      this.selectedPrayer = null;
      this.publishState({
        spinTrigger: {
          timestamp: Date.now(),
          id: Math.random().toString(36).substring(2, 9)
        }
      });
    });

    // 1b. Direct Next Round Button in Remote Stage Box
    if (this.startNextRoundBtn) {
      this.startNextRoundBtn.addEventListener("click", () => {
        this.startNextRound();
      });
    }

    // 1c. Header Round Stepper (+ / -)
    if (this.adminPrevRoundBtn) {
      this.adminPrevRoundBtn.addEventListener("click", () => {
        if (this.roundNumber > 1) {
          this.roundNumber -= 1;
          this.publishState();
          this.showToast(`Switched back to Round ${this.roundNumber}`, "ℹ️");
        }
      });
    }
    if (this.adminNextRoundBtn) {
      this.adminNextRoundBtn.addEventListener("click", () => {
        this.startNextRound();
      });
    }

    // 2. Clear Selection
    this.clearSelectionBtn.addEventListener("click", () => {
      this.selectedFamily = null;
      this.selectedPrayer = null;
      this.publishState();
      this.showToast("Display cleared on connected wheels", "⏹️");
    });

    // 3. Quick Add Family
    this.quickAddForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = this.quickAddInput.value.trim();
      if (!val) return;

      if (this.allFamilies.includes(val)) {
        this.showToast(`"${val}" is already in the list!`, "⚠️");
        return;
      }

      this.allFamilies.push(val);
      this.quickAddInput.value = "";
      this.publishState();
      this.showToast(`Added "${val}" to retreat list!`, "✅");
    });

    // 4. Family Search & Filter
    this.familySearchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      const prayedSet = new Set(this.historyList.map(item => (typeof item === "string" ? item : item.family)));
      this.renderFamilyList(prayedSet);
    });

    const filterBtns = [
      { btn: this.filterAllBtn, key: "all" },
      { btn: this.filterPendingBtn, key: "pending" },
      { btn: this.filterPrayedBtn, key: "prayed" }
    ];

    filterBtns.forEach(({ btn, key }) => {
      btn.addEventListener("click", () => {
        this.currentFilter = key;
        filterBtns.forEach(b => {
          b.btn.style.background = b.key === key ? "rgba(94,196,230,0.25)" : "rgba(255,255,255,0.06)";
        });
        const prayedSet = new Set(this.historyList.map(item => (typeof item === "string" ? item : item.family)));
        this.renderFamilyList(prayedSet);
      });
    });

    // 5. Family List Event Delegation (Edit, Delete, Mark Prayed, Re-add)
    this.familyListContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;
      const name = btn.dataset.name;

      if (action === "delete") {
        if (confirm(`Remove "${name}" from the retreat list?`)) {
          this.allFamilies = this.allFamilies.filter(f => f !== name);
          this.historyList = this.historyList.filter(h => (typeof h === "string" ? h : h.family) !== name);
          if (this.selectedFamily === name) {
            this.selectedFamily = null;
          }
          this.publishState();
          this.showToast(`Removed "${name}"`, "🗑️");
        }
      } else if (action === "edit") {
        const newName = prompt("Edit Family Name:", name);
        if (newName && newName.trim() && newName.trim() !== name) {
          const trimmed = newName.trim();
          const idx = this.allFamilies.indexOf(name);
          if (idx !== -1) {
            this.allFamilies[idx] = trimmed;
          }
          this.historyList = this.historyList.map(h => {
            if (typeof h === "string" && h === name) return trimmed;
            if (typeof h === "object" && h.family === name) return { ...h, family: trimmed };
            return h;
          });
          if (this.selectedFamily === name) {
            this.selectedFamily = trimmed;
          }
          this.publishState();
          this.showToast(`Updated to "${trimmed}"`, "✏️");
        }
      } else if (action === "markprayed") {
        const prayer = PRAYER_TYPES[Math.floor(Math.random() * PRAYER_TYPES.length)];
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.historyList.push({
          family: name,
          prayer: prayer.name,
          icon: prayer.icon,
          time: timeStr
        });
        this.publishState();
        this.showToast(`Marked "${name}" as prayed`, "✔️");
      } else if (action === "unpray") {
        this.historyList = this.historyList.filter(h => (typeof h === "string" ? h : h.family) !== name);
        this.publishState();
        this.showToast(`Restored "${name}" back to wheel`, "↩️");
      }
    });

    // 6. History Log Remove Button
    this.historyLogList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-history-idx]");
      if (!btn) return;
      const idx = parseInt(btn.dataset.historyIdx, 10);
      if (!isNaN(idx) && idx >= 0 && idx < this.historyList.length) {
        const removed = this.historyList.splice(idx, 1);
        const name = typeof removed[0] === 'string' ? removed[0] : removed[0].family;
        this.publishState();
        this.showToast(`Removed "${name}" from log`, "ℹ️");
      }
    });

    // 7. Bulk Edit Modal
    this.openBulkModalBtn.addEventListener("click", () => {
      this.bulkFamilyTextarea.value = this.allFamilies.join("\n");
      this.updateBulkCount();
      this.bulkModal.classList.remove("hidden");
    });
    this.closeBulkBtn.addEventListener("click", () => this.bulkModal.classList.add("hidden"));
    this.closeBulkFooterBtn.addEventListener("click", () => this.bulkModal.classList.add("hidden"));

    this.bulkFamilyTextarea.addEventListener("input", () => this.updateBulkCount());

    this.bulkLoadDefaultsBtn.addEventListener("click", () => {
      this.bulkFamilyTextarea.value = DEFAULT_FAMILIES.join("\n");
      this.updateBulkCount();
    });

    this.saveBulkBtn.addEventListener("click", () => {
      const raw = this.bulkFamilyTextarea.value;
      const lines = raw.split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

      if (lines.length === 0) {
        alert("Please enter at least one family name.");
        return;
      }

      this.allFamilies = lines;
      this.bulkModal.classList.add("hidden");
      this.publishState();
      this.showToast(`Updated ${lines.length} families in database!`, "📋");
    });

    // 8. Reset & Next Round Modal
    this.openResetModalBtn.addEventListener("click", () => {
      this.adminResetModal.classList.remove("hidden");
    });
    if (this.closeAdminResetBtn) {
      this.closeAdminResetBtn.addEventListener("click", () => {
        this.adminResetModal.classList.add("hidden");
      });
    }
    this.cancelAdminResetBtn.addEventListener("click", () => {
      this.adminResetModal.classList.add("hidden");
    });

    // Next Round option from modal
    if (this.modalStartNextRoundBtn) {
      this.modalStartNextRoundBtn.addEventListener("click", () => {
        this.adminResetModal.classList.add("hidden");
        this.startNextRound();
      });
    }

    // Reset to Round 1
    this.confirmAdminResetBtn.addEventListener("click", () => {
      this.roundNumber = 1;
      this.historyList = [];
      this.selectedFamily = null;
      this.selectedPrayer = null;
      this.adminResetModal.classList.add("hidden");
      this.publishState();
      this.showToast("🔄 Prayer session reset successfully to Round 1!", "✨");
    });

    // 8b. Coordinator Guide Modal
    if (this.adminGuideBtn && this.adminGuideModal) {
      this.adminGuideBtn.addEventListener("click", () => {
        this.adminGuideModal.classList.remove("hidden");
      });
      if (this.closeAdminGuideBtn) {
        this.closeAdminGuideBtn.addEventListener("click", () => {
          this.adminGuideModal.classList.add("hidden");
        });
      }
      if (this.closeAdminGuideFooterBtn) {
        this.closeAdminGuideFooterBtn.addEventListener("click", () => {
          this.adminGuideModal.classList.add("hidden");
        });
      }
    }

    // Close on overlay click
    [this.bulkModal, this.adminResetModal, this.adminGuideModal].forEach(modal => {
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.classList.add("hidden");
        });
      }
    });

    // 9. Export CSV & Copy Summary
    this.exportCsvBtn.addEventListener("click", () => this.exportCsv());
    this.copySummaryBtn.addEventListener("click", () => this.copySummary());

    // 10. Tools: Force sync, reload defaults, test sound
    this.forceCloudSyncBtn.addEventListener("click", () => {
      this.publishState();
      this.showToast("Forced cloud synchronization ☁️", "🔄");
    });

    this.reloadDefaultsAdminBtn.addEventListener("click", () => {
      if (confirm("Restore the default 31 retreat participant families?")) {
        this.allFamilies = [...DEFAULT_FAMILIES];
        this.publishState();
        this.showToast("Reloaded 31 retreat families from sheet", "📋");
      }
    });

    this.testSoundBtn.addEventListener("click", () => this.playTestChime());
  }

  updateBulkCount() {
    const raw = this.bulkFamilyTextarea.value;
    const count = raw.split("\n").map(l => l.trim()).filter(l => l.length > 0).length;
    this.bulkCountText.textContent = `${count} families detected`;
  }

  exportCsv() {
    if (this.historyList.length === 0) {
      this.showToast("No history to export yet", "⚠️");
      return;
    }

    let csv = "Index,Family Name,Prayer Intention,Time Logged\n";
    this.historyList.forEach((item, idx) => {
      const familyName = typeof item === "string" ? item : item.family;
      const prayerName = typeof item === "object" && item.prayer ? item.prayer : "1 Hail Mary";
      const timeStr = typeof item === "object" && item.time ? item.time : "";
      csv += `${idx + 1},"${familyName.replace(/"/g, '""')}","${prayerName}","${timeStr}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `familia_prayer_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("CSV file exported successfully!", "📥");
  }

  copySummary() {
    if (this.historyList.length === 0) {
      this.showToast("No history to copy yet", "⚠️");
      return;
    }

    let text = `🕊️ FAMILIA '26 RETREAT - PRAYER SUMMARY\n`;
    text += `Total Completed: ${this.historyList.length} / ${this.allFamilies.length}\n\n`;
    this.historyList.forEach((item, idx) => {
      const familyName = typeof item === "string" ? item : item.family;
      const prayerName = typeof item === "object" && item.prayer ? item.prayer : "1 Hail Mary";
      text += `${idx + 1}. ${familyName} — ${prayerName}\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      this.showToast("Summary copied to clipboard!", "📋");
    }).catch(() => {
      this.showToast("Failed to copy clipboard", "❌");
    });
  }

  playTestChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.7);
      });
      this.showToast("Played celebration chime 🔔", "✨");
    } catch (e) {}
  }

  showToast(message, icon = "✨") {
    if (!this.toast) return;
    this.toastMsg.textContent = message;
    this.toastIcon.textContent = icon;
    this.toast.classList.add("show");

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove("show");
    }, 2800);
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
  window.adminApp = new AdminController();
});
