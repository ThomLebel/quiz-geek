// ═══════════════════════════════════════════
// APP v4 — Orchestration principale
// ═══════════════════════════════════════════
import { Room } from './room.js?v=1';
import { Game } from './game.js?v=1';
import { Leaderboard } from './leaderboard.js?v=1';
import { AVATARS } from './avatars.js?v=1';
import { QUESTIONS, DIFFICULTY_POINTS, DIFFICULTY_LABELS } from './data.js?v=1';

// Globals accessibles depuis le HTML
window.AVATARS = AVATARS;
window.QUESTIONS = QUESTIONS;
window.DIFFICULTY_POINTS = DIFFICULTY_POINTS;
window.DIFFICULTY_LABELS = DIFFICULTY_LABELS;

export const App = {
  _prevScreen: null,

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const next = document.getElementById(`screen-${name}`);
    if (next) next.classList.add('active');
    App._prevScreen = name;
  },

  goToCreate() {
    App.showScreen('create');
    App.renderAvatarGrid('create');
  },

  goToJoin() {
    App.showScreen('join');
    App.renderAvatarGrid('join');
    // Masquer le champ mot de passe par défaut
    document.getElementById('join-password-row')?.classList.add('hidden');
    // Charger la liste des salons
    Room.loadRoomList();
  },

  backFromLeaderboard() {
    const active = document.querySelector('.screen.active')?.id;
    App.showScreen('game-end');
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
    // Sélection par défaut : premier avatar
    grid.querySelector('.avatar-item-wrap')?.classList.add('selected');
  },

  selectAvatar(id, el, suffix) {
    document.querySelectorAll(`#avatar-grid-${suffix} .avatar-item-wrap`)
      .forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
  },

  toast(msg, duration = 2800) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(App._toastTimer);
    App._toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
  }
};

// ══════════════════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════════════════
window.Modal = {
  show(title, body, buttons = []) {
    document.getElementById('modal-title').innerHTML = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal-footer').innerHTML = buttons.map(b =>
      `<button class="${b.class}" onclick="${b.onclick}">${b.label}</button>`
    ).join('');
    document.getElementById('modal-overlay').classList.remove('hidden');
  },
  close() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
};

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
window.App = App;
window.Room = Room;
window.Game = Game;
window.Leaderboard = Leaderboard;

async function init() {
  // Essayer de restaurer la session
  const restored = await Room.restoreSession();
  if (!restored) {
    // Démarrer au home avec animation
    setTimeout(() => App.showScreen('home'), 1800);
  }

  // Démarrer l'écoute de jeu si session active
  if (window.session.roomCode) {
    Game.startListening();
  }
}

init();