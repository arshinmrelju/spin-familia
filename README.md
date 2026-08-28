# 🕊️ Spin Familia'26 — Intercession Prayer Wheel

A modern, prayerful spinning wheel web application built for the **Jesus Youth Familia Retreat '26** to lift up each participant family in prayer.

---

## ✨ Features

- **🎯 Interactive Wheel with Physics**:
  - Smooth deceleration curves with realistic tick pointer audio.
  - Oceanic navy & luminous coral palette inspired by the retreat theme.
  - Dynamically renders family slices from 31 participant families.

- **⚡ Live Admin Control Portal (`admin.html`)**:
  - **Remote Spin Trigger**: Coordinators can remotely trigger the main projector wheel from a smartphone or laptop.
  - **Live Winner Spotlight**: Instant view of the winning family, prayer intention, and scripture.
  - **Family Management**: Add single families, bulk import/paste directly from Google Sheets or Excel, edit, and delete.
  - **Live Search & Filter**: Filter by *All*, *Pending*, and *Prayed*.
  - **Intercession Log**: Chronological feed of prayers with timestamps.
  - **Export & Share**: One-click **Export CSV** spreadsheet and **Copy Summary** for retreat announcements.

- **🔄 Automatic Next Round Transition**:
  - When all families in a round are prayed for, an automated celebratory countdown appears (5s).
  - Automatically advances to **Round 2**, **Round 3**, etc., placing all families back on the wheel.
  - Manual *"Start Next Round Now"* override button.

- **☁️ Real-time Firebase & Offline Sync**:
  - Powered by **Firebase Realtime Database** for instant cross-device synchronization between projector screens and coordinator devices.
  - **BroadcastChannel & LocalStorage** fallback for zero-lag offline local execution.

- **🎵 Zero-Dependency Web Audio API**:
  - Synthesized tick sounds and celebration chimes without external audio assets.
  - Dynamic confetti particle canvas effects.

---

## 📁 Project Structure

```
Spin Familia/
├── index.html            # Main prayer wheel display (Stage / Projector view)
├── app.js                # Wheel animation, physics, audio, and sync logic
├── admin.html            # Coordinator & Admin control dashboard
├── admin.js              # Admin portal state management, remote triggers, and exports
├── style.css             # Unified modern oceanic design system
├── firebase-config.js    # Firebase App & Realtime Database configuration
├── firebase.json         # Firebase Hosting & RTDB rules configuration
├── .firebaserc           # Firebase project link (spin-familia)
├── database.rules.json   # Realtime Database security rules
├── assets/
│   └── jy-logo black.png # Jesus Youth emblem
└── README.md             # Documentation
```

---

## 🚀 Getting Started

### 1. Run Locally
Open `index.html` or `admin.html` in any modern web browser, or serve with a lightweight local server:

```bash
# Using VS Code Live Server or python
python -m http.server 8000
```

- **Live Wheel**: `http://localhost:8000/index.html`
- **Admin Portal**: `http://localhost:8000/admin.html`

### 2. Deploy to Firebase
Deploy to Firebase Hosting with the Firebase CLI:

```bash
# Login to Firebase (if not already logged in)
firebase login

# Deploy hosting and database rules
firebase deploy
```

---

## 📿 Prayer Intentions Included
- 🌹 **1 Hail Mary** (Peace & Grace)
- ✨ **1 Glory Be** (Praise & Thanksgiving)
- 🕊️ **1 Our Father** (Blessing & Protection)

---

## 🛠️ Tech Stack
- **HTML5 & CSS3** (Vanilla CSS with CSS Variables & Glassmorphism)
- **JavaScript (ES6+)**
- **HTML5 Canvas & Web Audio API**
- **Firebase Realtime Database & Firebase Hosting**
