// ═══════════════════════════════════════════
// MAIN APP MODULE
// ═══════════════════════════════════════════
import { Auth } from './auth.js';
import { Game } from './game.js';
import { Leaderboard } from './leaderboard.js';
import { Admin } from './admin.js';
import { AVATARS } from './avatars.js';

// ── Modal helper
window.Modal = {
  show(title, bodyHTML, buttons = []) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-footer').innerHTML = buttons.map(b =>
      `<button class="${b.class}" onclick="${b.onclick}" style="flex:1">${b.label}</button>`
    ).join('');
    document.getElementById('modal-overlay').classList.remove('hidden');
  },
  close() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
};

// ── Toast
window.App = {
  toast(msg, duration = 2500) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => el.classList.add('hidden'), duration);
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${name}`);
    if (target) target.classList.add('active');
  },

  goToLogin() {
    App.showScreen('login');
    App.renderAvatarGrid();
  },

  goToAdmin() {
    App.showScreen('admin-login');
  },

  renderAvatarGrid() {
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;
    grid.innerHTML = AVATARS.map(av => `
      <div class="avatar-item" data-avatar-id="${av.id}" title="${av.name} (${av.universe})"
           onclick="App.selectAvatar('${av.id}', this)">
        ${av.svg}
      </div>
    `).join('');
    // Select first by default
    grid.querySelector('.avatar-item')?.classList.add('selected');
  },

  selectAvatar(id, el) {
    document.querySelectorAll('.avatar-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
  },

  updateLobbyUI() {
    const u = window.currentUser;
    if (!u) return;

    // Avatar
    const avatar = AVATARS.find(a => a.id === u.avatarId);
    const svgContent = avatar ? avatar.svg : '';

    document.getElementById('lobby-avatar').innerHTML = svgContent;
    document.getElementById('lobby-pseudo').textContent = u.pseudo;
    document.getElementById('lobby-score').textContent = u.score || 0;

    // Team
    if (u.teamId) {
      // Lazy load team name
      import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js").then(({ doc, getDoc }) => {
        import('./firebase-config.js').then(({ db }) => {
          getDoc(doc(db, 'teams', u.teamId)).then(snap => {
            if (snap.exists()) {
              document.getElementById('lobby-team-name').textContent = snap.data().name;
            }
          });
        });
      });
    } else {
      document.getElementById('lobby-team-name').textContent = 'Sans équipe';
    }
  },

  showGameSetup(mode) {
    App.showScreen('game-setup');
    Game.initSetupUI(mode);
  },

  showLeaderboard() {
    App.showScreen('leaderboard');
    Leaderboard.show('players');
  },

  backToLobby() {
    const u = window.currentUser;
    if (!u) {
      App.showScreen('home');
      return;
    }
    if (u.isAdmin) {
      App.showScreen('admin');
    } else {
      App.updateLobbyUI();
      App.showScreen('player-lobby');
    }
  }
};

// ── Init
async function init() {
  // Show loading
  App.showScreen('loading');

  // Wait for Firebase to be ready
  await new Promise(r => setTimeout(r, 1800));

  // Try restore player session
  const restored = await Auth.restoreSession();
  if (!restored) {
    App.showScreen('home');
  }

  // Init Firebase Auth listener for admin
  Auth.init();
}

init();
