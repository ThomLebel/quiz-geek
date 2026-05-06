// ═══════════════════════════════════════════
// AUTH MODULE
// ═══════════════════════════════════════════
import { db, auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Current session state
window.currentUser = null; // { uid, pseudo, avatarId, isAdmin, score, teamId }

export const Auth = {
  init() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase Auth user (admin)
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          window.currentUser = { uid: firebaseUser.uid, isAdmin: true, ...snap.data() };
          window.App.showScreen('admin');
          window.Admin.init();
        } else {
          // Create admin profile
          const adminData = { pseudo: 'Admin', avatarId: 'rick', isAdmin: true, score: 0, createdAt: serverTimestamp() };
          await setDoc(doc(db, 'users', firebaseUser.uid), adminData);
          window.currentUser = { uid: firebaseUser.uid, isAdmin: true, ...adminData };
          window.App.showScreen('admin');
          window.Admin.init();
        }
      }
    });
  },

  async loginAsAdmin() {
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const errEl = document.getElementById('admin-error');
    errEl.classList.add('hidden');

    if (!email || !password) {
      errEl.textContent = 'Remplis tous les champs.';
      errEl.classList.remove('hidden');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the redirect
    } catch (e) {
      errEl.textContent = 'Identifiants incorrects. Vérifie ton email et mot de passe.';
      errEl.classList.remove('hidden');
    }
  },

  async loginAsPlayer() {
    const pseudo = document.getElementById('login-pseudo').value.trim();
    if (!pseudo) { window.App.toast('Entre un pseudo !'); return; }
    if (pseudo.length < 2) { window.App.toast('Pseudo trop court !'); return; }

    const selectedAvatar = document.querySelector('.avatar-item.selected');
    if (!selectedAvatar) { window.App.toast('Choisis un avatar !'); return; }
    const avatarId = selectedAvatar.dataset.avatarId;

    // Check if pseudo already taken
    const { collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const q = query(collection(db, 'players'), where('pseudo', '==', pseudo));
    const existing = await getDocs(q);

    let uid;
    if (!existing.empty) {
      // Reuse existing player (same pseudo = same player)
      uid = existing.docs[0].id;
      const playerData = existing.docs[0].data();
      window.currentUser = { uid, isAdmin: false, ...playerData };
      // Update avatar if changed
      if (playerData.avatarId !== avatarId) {
        await updateDoc(doc(db, 'players', uid), { avatarId });
        window.currentUser.avatarId = avatarId;
      }
    } else {
      // New player
      uid = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const playerData = {
        pseudo, avatarId, isAdmin: false, score: 0,
        teamId: null, gamesPlayed: 0, correctAnswers: 0,
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'players', uid), playerData);
      window.currentUser = { uid, isAdmin: false, ...playerData };
    }

    // Store UID in localStorage for session persistence
    localStorage.setItem('evg_player_uid', uid);
    localStorage.setItem('evg_player_pseudo', pseudo);

    window.App.updateLobbyUI();
    window.App.showScreen('player-lobby');
  },

  async restoreSession() {
    const uid = localStorage.getItem('evg_player_uid');
    if (!uid) return false;
    try {
      const snap = await getDoc(doc(db, 'players', uid));
      if (snap.exists()) {
        window.currentUser = { uid, isAdmin: false, ...snap.data() };
        window.App.updateLobbyUI();
        window.App.showScreen('player-lobby');
        return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  },

  async logout() {
    if (window.currentUser?.isAdmin) {
      await signOut(auth);
    }
    localStorage.removeItem('evg_player_uid');
    localStorage.removeItem('evg_player_pseudo');
    window.currentUser = null;
    window.App.showScreen('home');
  }
};

window.Auth = Auth;
