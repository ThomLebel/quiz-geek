// ═══════════════════════════════════════════
// AUTH MODULE v2 — Pseudo + mot de passe, reconnexion profil
// ═══════════════════════════════════════════
import { db, auth } from './firebase-config.js?v=10';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, getDocs, collection, query,
  orderBy, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.currentUser = null;

// Simple password hash (bcrypt not available in browser — we use SHA-256)
async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const Auth = {
  _selectedExistingPlayer: null,

  init() {
    onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        const data = snap.exists() ? snap.data() : { pseudo: 'Admin', avatarId: 'rick' };
        if (!snap.exists()) await setDoc(doc(db, 'users', fbUser.uid), { ...data, createdAt: serverTimestamp() });
        window.currentUser = { uid: fbUser.uid, isAdmin: true, ...data };
        window.App.showScreen('admin');
        window.Admin.init();
      }
    });
  },

  showTab(tab) {
    document.getElementById('tab-new').classList.toggle('active', tab === 'new');
    document.getElementById('tab-existing').classList.toggle('active', tab === 'existing');
    document.getElementById('login-new').classList.toggle('hidden', tab !== 'new');
    document.getElementById('login-existing').classList.toggle('hidden', tab !== 'existing');
    if (tab === 'existing') Auth.loadExistingPlayers();
  },

  async loadExistingPlayers() {
    const list = document.getElementById('existing-players-list');
    list.innerHTML = '<div class="spinner"></div>';
    Auth._selectedExistingPlayer = null;
    document.getElementById('existing-password-form').classList.add('hidden');

    try {
      const q = query(collection(db, 'players'), orderBy('pseudo'));
      const snap = await getDocs(q);
      const players = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      if (players.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>Aucun joueur encore — crée ton profil !</p></div>';
        return;
      }
      list.innerHTML = players.map(p => {
        const av = (window.AVATARS || []).find(a => a.id === p.avatarId);
        return `
          <div class="existing-player-card" onclick="Auth.selectExistingPlayer('${p.uid}')">
            <div class="existing-player-avatar">${av ? av.svg : ''}</div>
            <div class="existing-player-info">
              <div class="existing-player-name">${p.pseudo}</div>
              <div class="existing-player-sub">${p.score || 0} pts · ${p.teamName || 'Sans équipe'}</div>
            </div>
            <span style="color:var(--text3);font-size:20px">›</span>
          </div>
        `;
      }).join('');
    } catch (e) {
      list.innerHTML = `<div class="empty-state"><p>Erreur: ${e.message}</p></div>`;
    }
  },

  selectExistingPlayer(uid) {
    // Find player data from DOM context
    Auth._selectedExistingUid = uid;
    // Show password form
    document.getElementById('existing-players-list').classList.add('hidden');
    document.getElementById('existing-password-form').classList.remove('hidden');
    document.getElementById('existing-password').value = '';
    document.getElementById('existing-error').classList.add('hidden');
    // We'll fetch player data on login attempt
  },

  cancelExisting() {
    document.getElementById('existing-players-list').classList.remove('hidden');
    document.getElementById('existing-password-form').classList.add('hidden');
    Auth._selectedExistingUid = null;
  },

  async loginExisting() {
    const uid = Auth._selectedExistingUid;
    const pw = document.getElementById('existing-password').value;
    const errEl = document.getElementById('existing-error');
    errEl.classList.add('hidden');

    if (!pw) { errEl.textContent = 'Entre ton mot de passe.'; errEl.classList.remove('hidden'); return; }

    try {
      const snap = await getDoc(doc(db, 'players', uid));
      if (!snap.exists()) { errEl.textContent = 'Joueur introuvable.'; errEl.classList.remove('hidden'); return; }
      const data = snap.data();
      const hash = await hashPassword(pw);
      if (hash !== data.passwordHash) {
        errEl.textContent = 'Mot de passe incorrect.';
        errEl.classList.remove('hidden');
        return;
      }
      window.currentUser = { uid, isAdmin: false, ...data };
      localStorage.setItem('evg_uid', uid);
      window.App.updateLobbyUI();
      window.Game.listenToGameState();
      window.App.showScreen('player-lobby');
    } catch (e) {
      errEl.textContent = 'Erreur: ' + e.message;
      errEl.classList.remove('hidden');
    }
  },

  async registerPlayer() {
    const pseudo = document.getElementById('new-pseudo').value.trim();
    const pw = document.getElementById('new-password').value;
    const teamId = document.getElementById('new-team-select').value || null;
    const errEl = document.getElementById('new-player-error');
    errEl.classList.add('hidden');

    if (!pseudo || pseudo.length < 2) { errEl.textContent = 'Pseudo trop court (min 2 caractères).'; errEl.classList.remove('hidden'); return; }
    if (!pw || pw.length < 4) { errEl.textContent = 'Mot de passe trop court (min 4 caractères).'; errEl.classList.remove('hidden'); return; }

    const selectedAv = document.querySelector('#avatar-grid-new .avatar-item-wrap.selected');
    if (!selectedAv) { errEl.textContent = 'Choisis un avatar.'; errEl.classList.remove('hidden'); return; }
    const avatarId = selectedAv.dataset.avatarId;

    // Check pseudo uniqueness
    const q = query(collection(db, 'players'));
    const allSnap = await getDocs(q);
    const taken = allSnap.docs.some(d => d.data().pseudo.toLowerCase() === pseudo.toLowerCase());
    if (taken) { errEl.textContent = 'Ce pseudo est déjà pris !'; errEl.classList.remove('hidden'); return; }

    try {
      const passwordHash = await hashPassword(pw);
      const uid = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

      // Get team name if team selected
      let teamName = null;
      if (teamId) {
        const tSnap = await getDoc(doc(db, 'teams', teamId));
        if (tSnap.exists()) {
          teamName = tSnap.data().name;
          // Add player to team
          const teamData = tSnap.data();
          const memberUids = [...(teamData.memberUids || []), uid];
          const memberNames = [...(teamData.memberNames || []), pseudo];
          await updateDoc(doc(db, 'teams', teamId), { memberUids, memberNames });
        }
      }

      const playerData = {
        pseudo, avatarId, passwordHash, teamId, teamName,
        score: 0, gamesPlayed: 0, correctAnswers: 0,
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'players', uid), playerData);

      window.currentUser = { uid, isAdmin: false, ...playerData };
      localStorage.setItem('evg_uid', uid);
      window.App.updateLobbyUI();
      window.Game.listenToGameState();
      window.App.showScreen('player-lobby');
    } catch (e) {
      errEl.textContent = 'Erreur: ' + e.message;
      errEl.classList.remove('hidden');
    }
  },

  async loginAsAdmin() {
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const errEl = document.getElementById('admin-error');
    errEl.classList.add('hidden');
    if (!email || !password) { errEl.textContent = 'Remplis tous les champs.'; errEl.classList.remove('hidden'); return; }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      errEl.textContent = 'Identifiants incorrects.';
      errEl.classList.remove('hidden');
    }
  },

  async restoreSession() {
    const uid = localStorage.getItem('evg_uid');
    if (!uid) return false;
    try {
      const snap = await getDoc(doc(db, 'players', uid));
      if (snap.exists()) {
        window.currentUser = { uid, isAdmin: false, ...snap.data() };
        window.App.updateLobbyUI();
        window.Game.listenToGameState();
        window.App.showScreen('player-lobby');
        return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  },

  async logout() {
    if (window.currentUser?.isAdmin) await signOut(auth);
    localStorage.removeItem('evg_uid');
    window.currentUser = null;
    if (window.Game._unsubGame) window.Game._unsubGame();
    window.App.showScreen('home');
  }
};

window.Auth = Auth;