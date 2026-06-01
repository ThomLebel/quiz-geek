// ═══════════════════════════════════════════
// APP MODULE v2
// ═══════════════════════════════════════════
import { Auth } from './auth.js?v=10';
import { Game } from './game.js?v=10';
import { Leaderboard } from './leaderboard.js?v=10';
import { Admin } from './admin.js?v=10';
import { AVATARS } from './avatars.js?v=10';
import { db } from './firebase-config.js?v=10';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.Modal = {
  show(title, bodyHTML, buttons = []) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-footer').innerHTML = buttons.map(b =>
      `<button class="${b.class}" onclick="${b.onclick}" style="flex:1">${b.label}</button>`
    ).join('');
    document.getElementById('modal-overlay').classList.remove('hidden');
  },
  close() { document.getElementById('modal-overlay').classList.add('hidden'); }
};

let _toastTimeout;
window.App = {
  toast(msg, duration = 2500) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(_toastTimeout);
    _toastTimeout = setTimeout(() => el.classList.add('hidden'), duration);
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${name}`)?.classList.add('active');
  },

  goToLogin() {
    App.showScreen('login');
    App.renderAvatarGrid('new');
    Auth.showTab('new');
    App.loadTeamsForSelect();
  },

  goToAdminLogin() {
    App.showScreen('admin-login');
  },

  renderAvatarGrid(suffix) {
    const grid = document.getElementById(`avatar-grid-${suffix}`);
    if (!grid) return;
    grid.innerHTML = AVATARS.map(av => `
      <div class="avatar-item-wrap" data-avatar-id="${av.id}"
           onclick="App.selectAvatar('${av.id}', this, '${suffix}')">
        <div class="avatar-item">${av.svg}</div>
        <div class="avatar-name">${av.name}</div>
      </div>
    `).join('');
    grid.querySelector('.avatar-item-wrap')?.classList.add('selected');
  },

  selectAvatar(id, el, suffix) {
    document.querySelectorAll(`#avatar-grid-${suffix} .avatar-item-wrap`).forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
  },

  async loadTeamsForSelect() {
    try {
      const snap = await getDocs(query(collection(db, 'teams'), orderBy('name')));
      const sel = document.getElementById('new-team-select');
      if (!sel) return;
      sel.innerHTML = '<option value="">— Sans équipe —</option>';
      snap.docs.forEach(d => {
        sel.innerHTML += `<option value="${d.id}">${d.data().name}</option>`;
      });
    } catch (e) { /* ignore */ }
  },

  updateLobbyUI() {
    const u = window.currentUser;
    if (!u) return;
    const av = AVATARS.find(a => a.id === u.avatarId);
    document.getElementById('lobby-avatar').innerHTML = av ? av.svg : '';
    document.getElementById('lobby-pseudo').textContent = u.pseudo;
    document.getElementById('lobby-score').textContent = u.score || 0;
    document.getElementById('lobby-team-name').textContent = u.teamName || 'Sans équipe';
  },

  showLeaderboard() {
    App.showScreen('leaderboard');
    Leaderboard.show('players');
  },

  backToLobby() {
    const u = window.currentUser;
    if (!u) { App.showScreen('home'); return; }
    if (u.isAdmin) {
      App.showScreen('admin');
      Admin.init();
    } else {
      App.updateLobbyUI();
      App.showScreen('player-lobby');
    }
  }
};

async function init() {
  App.showScreen('loading');
  await new Promise(r => setTimeout(r, 1800));
  const restored = await Auth.restoreSession();
  if (!restored) App.showScreen('home');
  Auth.init();
}

init();