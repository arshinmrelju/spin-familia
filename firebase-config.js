// Firebase configuration for Spin Familia Web App
const firebaseConfig = {
  apiKey: "AIzaSyBh45U58UEMU3A9CKQOmVuAuVBHtV_uE-k",
  authDomain: "spin-familia.firebaseapp.com",
  databaseURL: "https://spin-familia-default-rtdb.firebaseio.com",
  projectId: "spin-familia",
  storageBucket: "spin-familia.firebasestorage.app",
  messagingSenderId: "978728327254",
  appId: "1:978728327254:web:5d3ac3e70a16b0c84903f7",
  measurementId: "G-V0MHKX32G0"
};

// Global export for script tags
if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}

// Module export for ES modules / bundlers
if (typeof module !== "undefined" && module.exports) {
  module.exports = { firebaseConfig };
}
