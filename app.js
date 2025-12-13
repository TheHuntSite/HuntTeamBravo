// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

/* -----------------------------
   FIREBASE CONFIG
--------------------------------*/
const firebaseConfig = {
  apiKey: "AIzaSyBgR2nAGe1Y2H0AjZrwL9nmvPXFYMRXSkQ",
  authDomain: "huntsite2.firebaseapp.com",
  databaseURL: "https://huntsite2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "huntsite2",
  storageBucket: "huntsite2.firebasestorage.app",
  messagingSenderId: "174140620136",
  appId: "1:174140620136:web:78da8203b332c173beeadd"
};

/* -----------------------------
   INIT FIREBASE
--------------------------------*/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* -----------------------------
   UPDATE UI FROM DATABASE
--------------------------------*/
function updateOverlays(statuses) {
  document.querySelectorAll(".overlay-item").forEach((overlay, index) => {
    const entry = statuses?.[index + 1];
    const status = entry?.status ?? 0;
    overlay.style.display = status === 1 ? "block" : "none";
  });
}

/* -----------------------------
   REALTIME LISTENER
--------------------------------*/
function listenForOverlayChanges() {
  const statusRef = ref(db, "overlayStatus");

  onValue(statusRef, snapshot => {
    if (!snapshot.exists()) return;
    updateOverlays(snapshot.val());
  });
}

/* -----------------------------
   WRITE STATUS TO FIREBASE
--------------------------------*/
function updateStatusInFirebase(index, status) {
  const statusRef = ref(db, `overlayStatus/${index + 1}`);
  set(statusRef, { status });
}

/* -----------------------------
   CLICK HANDLERS
--------------------------------*/
function addItemClickListeners() {
  document.querySelectorAll(".item-container").forEach(container => {
    const inventoryItem = container.querySelector(".inventory-item");
    const index = Number(inventoryItem.dataset.index);

    container.addEventListener("click", () => {
      const overlay = container.querySelector(".overlay-item");
      if (!overlay) return;

      const isVisible = overlay.style.display === "block";
      const newStatus = isVisible ? 0 : 1;

      // Only write to Firebase, let onValue handle UI
      updateStatusInFirebase(index, newStatus);
    });
  });
}

/* -----------------------------
   INIT
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  listenForOverlayChanges();   // LIVE SYNC
  addItemClickListeners();     // attach click handlers
});