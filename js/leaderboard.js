// ═══════════════════════════════════════════
// LEADERBOARD v3 — score équipe = somme des membres
// ═══════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const Leaderboard = {
  async show(tab) {
    document.querySelectorAll('#screen-leaderboard .tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-lb-${tab}`)?.classList.add('active');
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '<div class="spinner"></div>';
    tab === 'players' ? await Leaderboard.showPlayers() : await Leaderboard.showTeams();
  },

  async showPlayers() {
    const list = document.getElementById('leaderboard-list');
    try {
      const q = query(collection(db, 'players'), orderBy('score', 'desc'), limit(20));
      const snap = await getDocs(q);
      const players = snap.docs.map(d => ({uid: d.id, ...d.data()}));
      if (!players.length) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">🏆</div><p>Aucun joueur encore</p></div>';
        return;
      }
      list.innerHTML = players.map((p, i) => {
        const rank = i + 1;
        const rc = rank <= 3 ? `top-${rank}` : '';
        const icon = rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank;
        const av = (window.AVATARS||[]).find(a=>a.id===p.avatarId);
        const isMe = window.currentUser?.uid === p.uid;
        return `
          <div class="leaderboard-item ${rc}" style="${isMe?'border-color:var(--accent3)':''}">
            <div class="lb-rank ${rc}">${icon}</div>
            <div class="lb-avatar">${av?av.svg:''}</div>
            <div class="lb-info">
              <div class="lb-name">${p.pseudo}${isMe?' 👈':''}</div>
              <div class="lb-sub">${p.gamesPlayed||0} partie${(p.gamesPlayed||0)>1?'s':''} · ${p.correctAnswers||0} ✅ · ${p.teamName||'Sans équipe'}</div>
            </div>
            <div class="lb-score">${p.score||0}</div>
          </div>`;
      }).join('');
    } catch(e) {
      list.innerHTML = '<div class="empty-state"><p>Erreur de chargement</p></div>';
    }
  },

  async showTeams() {
    const list = document.getElementById('leaderboard-list');
    try {
      // Load teams and players, compute score dynamically
      const [tSnap, pSnap] = await Promise.all([
        getDocs(collection(db, 'teams')),
        getDocs(collection(db, 'players'))
      ]);
      const players = pSnap.docs.map(d => ({uid: d.id, ...d.data()}));
      const teams = tSnap.docs.map(d => {
        const data = d.data();
        const members = players.filter(p => p.teamId === d.id);
        const score = members.reduce((s,m) => s + (m.score||0), 0);
        return {id: d.id, ...data, score, members};
      }).sort((a,b) => b.score - a.score);

      if (!teams.length) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>Aucune équipe encore</p></div>';
        return;
      }

      const isMyTeam = id => window.currentUser?.teamId === id;
      list.innerHTML = teams.map((t, i) => {
        const rank = i + 1;
        const rc = rank<=3?`top-${rank}`:'';
        const icon = rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank;
        const members = t.members.map(m=>m.pseudo).join(', ') || 'Aucun membre';
        return `
          <div class="leaderboard-item ${rc}" style="${isMyTeam(t.id)?'border-color:var(--accent3)':''}">
            <div class="lb-rank ${rc}">${icon}</div>
            <div class="lb-avatar" style="font-size:24px;display:flex;align-items:center;justify-content:center">👥</div>
            <div class="lb-info">
              <div class="lb-name">${t.name}${isMyTeam(t.id)?' 👈':''}</div>
              <div class="lb-sub">${members}</div>
            </div>
            <div class="lb-score">${t.score}</div>
          </div>`;
      }).join('');
    } catch(e) {
      list.innerHTML = '<div class="empty-state"><p>Erreur de chargement</p></div>';
    }
  }
};

window.Leaderboard = Leaderboard;
