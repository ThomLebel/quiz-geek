// ═══════════════════════════════════════════
// LEADERBOARD v4 — lit depuis rooms/{code}/players et teams
// ═══════════════════════════════════════════
import { db } from './firebase-config.js?v=1';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const Leaderboard = {
  _current: 'players',

  async show(tab = 'players') {
    Leaderboard._current = tab;
    document.getElementById('tab-lb-players')?.classList.toggle('active', tab === 'players');
    document.getElementById('tab-lb-teams')?.classList.toggle('active', tab === 'teams');

    const { roomCode } = window.session;
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '<div class="spinner"></div>';

    try {
      if (tab === 'players') {
        const snap = await getDocs(
          query(collection(db, 'rooms', roomCode, 'players'), orderBy('score', 'desc'))
        );
        const players = snap.docs.map(d => d.data());

        if (!players.length) {
          list.innerHTML = `<div class="empty-state">${window.I18n.t('lb_no_players')}</div>`;
          return;
        }

        const ranks = ['🥇', '🥈', '🥉'];
        list.innerHTML = players.map((p, i) => {
          const av = (window.AVATARS || []).find(a => a.id === p.avatarId);
          const isMe = p.uid === window.session.uid;
          const rankClass = i < 3 ? `top-${i + 1}` : '';
          return `<div class="leaderboard-item ${rankClass}" ${isMe ? 'style="border-color:var(--accent3)"' : ''}>
            <div class="lb-rank ${rankClass}">${i < 3 ? ranks[i] : i + 1}</div>
            <div class="lb-avatar">${av ? av.svg : ''}</div>
            <div class="lb-info">
              <div class="lb-name">${p.pseudo}${isMe ? ' 👈' : ''}${p.isHost ? ' 👑' : ''}</div>
              ${p.teamName ? `<div class="lb-sub">${window.I18n.t('lb_team_prefix')} ${p.teamName}</div>` : `<div class="lb-sub">${window.I18n.t('lb_no_team')}</div>`}
            </div>
            <div class="lb-score">${p.score}</div>
          </div>`;
        }).join('');

      } else {
        // Équipes
        const snap = await getDocs(
          query(collection(db, 'rooms', roomCode, 'teams'), orderBy('score', 'desc'))
        );
        const teams = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (!teams.length) {
          list.innerHTML = `<div class="empty-state">${window.I18n.t('lb_no_teams')}</div>`;
          return;
        }

        const ranks = ['🥇', '🥈', '🥉'];
        list.innerHTML = teams.map((t, i) => {
          const rankClass = i < 3 ? `top-${i + 1}` : '';
          return `<div class="leaderboard-item ${rankClass}">
            <div class="lb-rank ${rankClass}">${i < 3 ? ranks[i] : i + 1}</div>
            <div class="lb-avatar" style="display:flex;align-items:center;justify-content:center;font-size:28px">👥</div>
            <div class="lb-info">
              <div class="lb-name">${t.name}</div>
              <div class="lb-sub">${(t.memberNames || []).join(', ') || window.I18n.t('no_members')}</div>
            </div>
            <div class="lb-score">${t.score || 0}</div>
          </div>`;
        }).join('');
      }
    } catch(e) {
      list.innerHTML = `<div class="empty-state">${window.I18n.t('lb_error')}</div>`;
      console.error('Leaderboard error:', e);
    }
  }
};

window.Leaderboard = Leaderboard;