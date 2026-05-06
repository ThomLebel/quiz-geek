// ═══════════════════════════════════════════
// LEADERBOARD MODULE
// ═══════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  collection, getDocs, query, orderBy, limit, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const Leaderboard = {
  currentTab: 'players',

  async show(tab) {
    Leaderboard.currentTab = tab;
    document.querySelectorAll('#screen-leaderboard .tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`)?.classList.add('active');

    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '<div class="spinner"></div>';

    if (tab === 'players') {
      await Leaderboard.showPlayers();
    } else {
      await Leaderboard.showTeams();
    }
  },

  async showPlayers() {
    const list = document.getElementById('leaderboard-list');
    try {
      const q = query(collection(db, 'players'), orderBy('score', 'desc'), limit(20));
      const snap = await getDocs(q);
      const players = snap.docs.map(d => ({ uid: d.id, ...d.data() }));

      if (players.length === 0) {
        list.innerHTML = `<div class="empty-state"><div class="empty-icon">🏆</div><p>Aucun joueur encore</p></div>`;
        return;
      }

      list.innerHTML = players.map((p, i) => {
        const rank = i + 1;
        const rankClass = rank <= 3 ? `top-${rank}` : '';
        const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
        const avatar = (window.AVATARS || []).find(a => a.id === p.avatarId);
        const svgContent = avatar ? avatar.svg : `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#333"/><text x="50" y="65" text-anchor="middle" font-size="40">👤</text></svg>`;
        const isMe = window.currentUser?.uid === p.uid;

        return `
          <div class="leaderboard-item ${rankClass}" style="${isMe ? 'border-color:var(--accent3)' : ''}">
            <div class="lb-rank ${rankClass}">${rankIcon}</div>
            <div class="lb-avatar">${svgContent}</div>
            <div class="lb-info">
              <div class="lb-name">${p.pseudo}${isMe ? ' 👈' : ''}</div>
              <div class="lb-sub">${p.gamesPlayed || 0} partie${(p.gamesPlayed||0) > 1 ? 's' : ''} · ${p.correctAnswers || 0} bonnes rép.</div>
            </div>
            <div class="lb-score">${p.score || 0}</div>
          </div>
        `;
      }).join('');
    } catch (e) {
      list.innerHTML = `<div class="empty-state"><p>Erreur de chargement</p></div>`;
    }
  },

  async showTeams() {
    const list = document.getElementById('leaderboard-list');
    try {
      const q = query(collection(db, 'teams'), orderBy('score', 'desc'));
      const snap = await getDocs(q);
      const teams = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (teams.length === 0) {
        list.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><p>Aucune équipe encore</p></div>`;
        return;
      }

      list.innerHTML = teams.map((t, i) => {
        const rank = i + 1;
        const rankClass = rank <= 3 ? `top-${rank}` : '';
        const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
        const members = (t.memberNames || []).join(', ') || 'Aucun membre';
        const isMyTeam = window.currentUser?.teamId === t.id;

        return `
          <div class="leaderboard-item ${rankClass}" style="${isMyTeam ? 'border-color:var(--accent3)' : ''}">
            <div class="lb-rank ${rankClass}">${rankIcon}</div>
            <div class="lb-avatar" style="background:var(--card2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px">👥</div>
            <div class="lb-info">
              <div class="lb-name">${t.name}${isMyTeam ? ' 👈' : ''}</div>
              <div class="lb-sub">${members}</div>
            </div>
            <div class="lb-score">${t.score || 0}</div>
          </div>
        `;
      }).join('');
    } catch (e) {
      list.innerHTML = `<div class="empty-state"><p>Erreur de chargement</p></div>`;
    }
  }
};

window.Leaderboard = Leaderboard;
