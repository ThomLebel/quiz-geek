// ═══════════════════════════════════════════
// ADMIN MODULE
// ═══════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  collection, getDocs, query, orderBy, doc,
  updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const Admin = {
  currentTab: 'players',
  allPlayers: [],
  allTeams: [],

  init() {
    Admin.showTab('players');
  },

  showTab(tab) {
    Admin.currentTab = tab;
    document.querySelectorAll('.admin-tabs .tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`atab-${tab}`)?.classList.add('active');

    const content = document.getElementById('admin-content');
    content.innerHTML = '<div class="spinner"></div>';

    switch (tab) {
      case 'players': Admin.renderPlayers(); break;
      case 'teams': Admin.renderTeams(); break;
      case 'questions': Admin.renderQuestions(); break;
      case 'game': Admin.renderGameControls(); break;
    }
  },

  // ─── PLAYERS
  async renderPlayers() {
    const content = document.getElementById('admin-content');
    try {
      const q = query(collection(db, 'players'), orderBy('score', 'desc'));
      const snap = await getDocs(q);
      Admin.allPlayers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));

      content.innerHTML = `
        <div class="admin-section-title">Joueurs (${Admin.allPlayers.length})</div>
        ${Admin.allPlayers.map(p => Admin.playerCard(p)).join('')}
      `;
    } catch (e) {
      content.innerHTML = `<p style="color:var(--error)">Erreur: ${e.message}</p>`;
    }
  },

  playerCard(p) {
    const avatar = (window.AVATARS || []).find(a => a.id === p.avatarId);
    const svgContent = avatar ? avatar.svg : '';
    const teamName = Admin.allTeams.find(t => t.id === p.teamId)?.name || 'Sans équipe';
    return `
      <div class="admin-player-card">
        <div class="player-avatar-small">${svgContent}</div>
        <div class="admin-player-info">
          <div class="admin-player-name">${p.pseudo}</div>
          <div class="admin-player-sub">${p.score || 0} pts · ${teamName}</div>
        </div>
        <div class="admin-player-actions">
          <button class="admin-btn admin-btn-edit" onclick="Admin.editPlayer('${p.uid}')">✏️</button>
          <button class="admin-btn admin-btn-delete" onclick="Admin.deletePlayer('${p.uid}', '${p.pseudo}')">🗑️</button>
        </div>
      </div>
    `;
  },

  async editPlayer(uid) {
    const player = Admin.allPlayers.find(p => p.uid === uid);
    if (!player) return;

    const teamOptions = Admin.allTeams.map(t =>
      `<option value="${t.id}" ${player.teamId === t.id ? 'selected' : ''}>${t.name}</option>`
    ).join('');

    window.Modal.show('Modifier le joueur', `
      <div class="form-group">
        <label>Pseudo</label>
        <input type="text" id="edit-pseudo" value="${player.pseudo}" maxlength="20"/>
      </div>
      <div class="form-group">
        <label>Score</label>
        <input type="number" id="edit-score" value="${player.score || 0}" min="0"/>
      </div>
      <div class="form-group">
        <label>Équipe</label>
        <select id="edit-team">
          <option value="">Sans équipe</option>
          ${teamOptions}
        </select>
      </div>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: 'Sauvegarder', class: 'btn btn-primary', onclick: `Admin.savePlayer('${uid}')` }
    ]);
  },

  async savePlayer(uid) {
    const pseudo = document.getElementById('edit-pseudo').value.trim();
    const score = parseInt(document.getElementById('edit-score').value) || 0;
    const teamId = document.getElementById('edit-team').value || null;

    if (!pseudo) { window.App.toast('Pseudo requis !'); return; }

    try {
      await updateDoc(doc(db, 'players', uid), { pseudo, score, teamId });
      window.Modal.close();
      window.App.toast('Joueur mis à jour !');
      Admin.renderPlayers();
    } catch (e) {
      window.App.toast('Erreur : ' + e.message);
    }
  },

  async deletePlayer(uid, pseudo) {
    window.Modal.show('Supprimer le joueur', `
      <p>Supprimer <strong>${pseudo}</strong> définitivement ?</p>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: '🗑️ Supprimer', class: 'btn btn-danger', onclick: `Admin.confirmDeletePlayer('${uid}')` }
    ]);
  },

  async confirmDeletePlayer(uid) {
    try {
      await deleteDoc(doc(db, 'players', uid));
      window.Modal.close();
      window.App.toast('Joueur supprimé');
      Admin.renderPlayers();
    } catch (e) {
      window.App.toast('Erreur : ' + e.message);
    }
  },

  // ─── TEAMS
  async renderTeams() {
    const content = document.getElementById('admin-content');
    try {
      const snap = await getDocs(collection(db, 'teams'));
      Admin.allTeams = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Also load players for member assignment
      const pSnap = await getDocs(collection(db, 'players'));
      Admin.allPlayers = pSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

      content.innerHTML = `
        <button class="add-btn" onclick="Admin.addTeam()">+ Créer une équipe</button>
        <div class="admin-section-title">Équipes (${Admin.allTeams.length})</div>
        ${Admin.allTeams.map(t => Admin.teamCard(t)).join('')}
      `;
    } catch (e) {
      content.innerHTML = `<p style="color:var(--error)">Erreur: ${e.message}</p>`;
    }
  },

  teamCard(team) {
    const members = Admin.allPlayers.filter(p => p.teamId === team.id);
    const memberChips = members.map(m => `<span class="member-chip">${m.pseudo}</span>`).join('');
    return `
      <div class="admin-team-card">
        <div class="admin-team-header">
          <span class="admin-team-name">👥 ${team.name}</span>
          <span class="admin-team-score">${team.score || 0} pts</span>
        </div>
        <div class="admin-team-members">
          ${memberChips || '<span style="color:var(--text3);font-size:12px">Aucun membre</span>'}
        </div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="admin-btn admin-btn-edit" onclick="Admin.editTeam('${team.id}')">✏️ Modifier</button>
          <button class="admin-btn admin-btn-delete" onclick="Admin.deleteTeam('${team.id}', '${team.name}')">🗑️</button>
        </div>
      </div>
    `;
  },

  async addTeam() {
    const playerOptions = Admin.allPlayers.map(p =>
      `<option value="${p.uid}">${p.pseudo} (${p.score || 0} pts)</option>`
    ).join('');

    window.Modal.show('Créer une équipe', `
      <div class="form-group">
        <label>Nom de l'équipe</label>
        <input type="text" id="new-team-name" placeholder="ex: Les Otakus" maxlength="30"/>
      </div>
      <div class="form-group">
        <label>Membres (2–6)</label>
        <select id="new-team-members" multiple size="6" style="height:auto">
          ${playerOptions}
        </select>
        <small style="color:var(--text3);font-size:11px;margin-top:4px;display:block">Ctrl+clic pour sélection multiple</small>
      </div>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: '✅ Créer', class: 'btn btn-primary', onclick: 'Admin.confirmAddTeam()' }
    ]);
  },

  async confirmAddTeam() {
    const name = document.getElementById('new-team-name').value.trim();
    const select = document.getElementById('new-team-members');
    const memberUids = Array.from(select.selectedOptions).map(o => o.value);

    if (!name) { window.App.toast('Nom requis !'); return; }
    if (memberUids.length < 2) { window.App.toast('Minimum 2 membres !'); return; }
    if (memberUids.length > 6) { window.App.toast('Maximum 6 membres !'); return; }

    const memberNames = memberUids.map(uid =>
      Admin.allPlayers.find(p => p.uid === uid)?.pseudo || ''
    );

    try {
      const teamRef = await addDoc(collection(db, 'teams'), {
        name, score: 0, memberUids, memberNames,
        createdAt: serverTimestamp()
      });

      // Update each player's teamId
      await Promise.all(memberUids.map(uid =>
        updateDoc(doc(db, 'players', uid), { teamId: teamRef.id })
      ));

      window.Modal.close();
      window.App.toast(`Équipe "${name}" créée !`);
      Admin.renderTeams();
    } catch (e) {
      window.App.toast('Erreur : ' + e.message);
    }
  },

  async editTeam(teamId) {
    const team = Admin.allTeams.find(t => t.id === teamId);
    if (!team) return;

    const playerOptions = Admin.allPlayers.map(p =>
      `<option value="${p.uid}" ${(team.memberUids || []).includes(p.uid) ? 'selected' : ''}>${p.pseudo}</option>`
    ).join('');

    window.Modal.show('Modifier l\'équipe', `
      <div class="form-group">
        <label>Nom</label>
        <input type="text" id="edit-team-name" value="${team.name}" maxlength="30"/>
      </div>
      <div class="form-group">
        <label>Score</label>
        <input type="number" id="edit-team-score" value="${team.score || 0}" min="0"/>
      </div>
      <div class="form-group">
        <label>Membres</label>
        <select id="edit-team-members" multiple size="6" style="height:auto">
          ${playerOptions}
        </select>
      </div>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: 'Sauvegarder', class: 'btn btn-primary', onclick: `Admin.saveTeam('${teamId}')` }
    ]);
  },

  async saveTeam(teamId) {
    const name = document.getElementById('edit-team-name').value.trim();
    const score = parseInt(document.getElementById('edit-team-score').value) || 0;
    const select = document.getElementById('edit-team-members');
    const newMemberUids = Array.from(select.selectedOptions).map(o => o.value);
    const memberNames = newMemberUids.map(uid =>
      Admin.allPlayers.find(p => p.uid === uid)?.pseudo || ''
    );

    if (!name) { window.App.toast('Nom requis !'); return; }

    try {
      // Old members: remove team assignment
      const oldTeam = Admin.allTeams.find(t => t.id === teamId);
      const oldMemberUids = oldTeam?.memberUids || [];
      const removed = oldMemberUids.filter(uid => !newMemberUids.includes(uid));
      await Promise.all(removed.map(uid =>
        updateDoc(doc(db, 'players', uid), { teamId: null })
      ));

      // New members: add team assignment
      await Promise.all(newMemberUids.map(uid =>
        updateDoc(doc(db, 'players', uid), { teamId })
      ));

      await updateDoc(doc(db, 'teams', teamId), { name, score, memberUids: newMemberUids, memberNames });
      window.Modal.close();
      window.App.toast('Équipe mise à jour !');
      Admin.renderTeams();
    } catch (e) {
      window.App.toast('Erreur : ' + e.message);
    }
  },

  async deleteTeam(teamId, teamName) {
    window.Modal.show('Supprimer l\'équipe', `
      <p>Supprimer l'équipe <strong>${teamName}</strong> ?<br>Les joueurs seront libérés.</p>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: '🗑️ Supprimer', class: 'btn btn-danger', onclick: `Admin.confirmDeleteTeam('${teamId}')` }
    ]);
  },

  async confirmDeleteTeam(teamId) {
    try {
      const team = Admin.allTeams.find(t => t.id === teamId);
      if (team?.memberUids) {
        await Promise.all(team.memberUids.map(uid =>
          updateDoc(doc(db, 'players', uid), { teamId: null })
        ));
      }
      await deleteDoc(doc(db, 'teams', teamId));
      window.Modal.close();
      window.App.toast('Équipe supprimée');
      Admin.renderTeams();
    } catch (e) {
      window.App.toast('Erreur : ' + e.message);
    }
  },

  // ─── QUESTIONS
  renderQuestions() {
    const content = document.getElementById('admin-content');
    const diffOrder = { debutant: 1, connaisseur: 2, otaku: 3 };
    const sorted = [...window.QUESTIONS].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);

    content.innerHTML = `
      <button class="add-btn" onclick="Admin.addQuestion()">+ Ajouter une question</button>
      <div class="admin-section-title">Questions (${sorted.length})</div>
      ${sorted.map(q => `
        <div class="question-card">
          <div class="question-card-header">
            <span class="difficulty-badge ${q.difficulty}">${window.DIFFICULTY_LABELS[q.difficulty]}</span>
            <span style="font-size:11px;color:var(--text3)">#${q.id}</span>
          </div>
          <div class="question-card-text">${q.question}</div>
          <div class="question-card-answer">✓ ${q.answers[q.correct]}</div>
        </div>
      `).join('')}
    `;
  },

  addQuestion() {
    window.Modal.show('Ajouter une question', `
      <div class="form-group">
        <label>Question</label>
        <textarea id="new-q-text" placeholder="La question..."></textarea>
      </div>
      <div class="form-group">
        <label>Réponse correcte</label>
        <input type="text" id="new-q-correct" placeholder="La bonne réponse"/>
      </div>
      <div class="form-group">
        <label>Mauvaise réponse 1</label>
        <input type="text" id="new-q-w1" placeholder="Mauvaise réponse 1"/>
      </div>
      <div class="form-group">
        <label>Mauvaise réponse 2</label>
        <input type="text" id="new-q-w2" placeholder="Mauvaise réponse 2"/>
      </div>
      <div class="form-group">
        <label>Mauvaise réponse 3</label>
        <input type="text" id="new-q-w3" placeholder="Mauvaise réponse 3"/>
      </div>
      <div class="form-group">
        <label>Difficulté</label>
        <select id="new-q-diff">
          <option value="debutant">Débutant</option>
          <option value="connaisseur">Connaisseur</option>
          <option value="otaku">Otaku</option>
        </select>
      </div>
      <div class="form-group">
        <label>Thème</label>
        <select id="new-q-theme">
          <option value="manga">Manga</option>
          <option value="jv">Jeux Vidéo</option>
          <option value="roman">Roman</option>
          <option value="series">Séries</option>
          <option value="gameplay">Gameplay</option>
        </select>
      </div>
      <div class="form-group">
        <label>Anecdote (Focus)</label>
        <textarea id="new-q-focus" placeholder="L'anecdote qui explique la réponse..."></textarea>
      </div>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: '✅ Ajouter', class: 'btn btn-primary', onclick: 'Admin.confirmAddQuestion()' }
    ]);
  },

  confirmAddQuestion() {
    const text = document.getElementById('new-q-text').value.trim();
    const correct = document.getElementById('new-q-correct').value.trim();
    const w1 = document.getElementById('new-q-w1').value.trim();
    const w2 = document.getElementById('new-q-w2').value.trim();
    const w3 = document.getElementById('new-q-w3').value.trim();
    const diff = document.getElementById('new-q-diff').value;
    const theme = document.getElementById('new-q-theme').value;
    const focus = document.getElementById('new-q-focus').value.trim();

    if (!text || !correct || !w1 || !w2 || !w3) {
      window.App.toast('Remplis tous les champs !'); return;
    }

    const newId = Math.max(...window.QUESTIONS.map(q => q.id)) + 1;
    const newQuestion = {
      id: newId, category: theme === 'gameplay' ? 'gameplay' : theme === 'series' ? 'series' : 'general',
      theme, difficulty: diff,
      question: text,
      answers: [correct, w1, w2, w3],
      correct: 0, focus
    };

    window.QUESTIONS.push(newQuestion);
    window.Modal.close();
    window.App.toast(`Question #${newId} ajoutée !`);
    Admin.renderQuestions();
  },

  // ─── GAME CONTROLS
  renderGameControls() {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="admin-section-title">Contrôles de Partie</div>

      <div class="game-control-card">
        <div class="game-control-title">Reset des scores</div>
        <p style="color:var(--text2);font-size:13px;margin-bottom:12px">Remettre à zéro les scores de tous les joueurs et équipes.</p>
        <button class="btn btn-danger" onclick="Admin.resetAllScores()">⚠️ Reset tous les scores</button>
      </div>

      <div class="game-control-card">
        <div class="game-control-title">Reset d'un joueur</div>
        <p style="color:var(--text2);font-size:13px;margin-bottom:12px">Sélectionne un joueur et remet son score à zéro.</p>
        <button class="btn btn-ghost" onclick="Admin.pickPlayerReset()">👤 Choisir un joueur</button>
      </div>

      <div class="game-control-card">
        <div class="game-control-title">Statistiques globales</div>
        <button class="btn btn-ghost" onclick="Admin.showStats()">📊 Voir les stats</button>
      </div>
    `;
  },

  async resetAllScores() {
    window.Modal.show('⚠️ Reset tous les scores', `
      <p>Cette action remettra à zéro le score de <strong>tous</strong> les joueurs et équipes. Irréversible !</p>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: '⚠️ Confirmer le reset', class: 'btn btn-danger', onclick: 'Admin.confirmResetAll()' }
    ]);
  },

  async confirmResetAll() {
    try {
      const pSnap = await getDocs(collection(db, 'players'));
      await Promise.all(pSnap.docs.map(d =>
        updateDoc(doc(db, 'players', d.id), { score: 0, gamesPlayed: 0, correctAnswers: 0 })
      ));
      const tSnap = await getDocs(collection(db, 'teams'));
      await Promise.all(tSnap.docs.map(d =>
        updateDoc(doc(db, 'teams', d.id), { score: 0 })
      ));
      window.Modal.close();
      window.App.toast('Tous les scores remis à zéro !');
    } catch (e) {
      window.App.toast('Erreur : ' + e.message);
    }
  },

  async pickPlayerReset() {
    const pSnap = await getDocs(collection(db, 'players'));
    const players = pSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
    const options = players.map(p =>
      `<option value="${p.uid}">${p.pseudo} (${p.score || 0} pts)</option>`
    ).join('');
    window.Modal.show('Reset un joueur', `
      <div class="form-group">
        <label>Joueur</label>
        <select id="reset-player-select">${options}</select>
      </div>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: 'Reset', class: 'btn btn-danger', onclick: 'Admin.confirmResetPlayer()' }
    ]);
  },

  async confirmResetPlayer() {
    const uid = document.getElementById('reset-player-select').value;
    try {
      await updateDoc(doc(db, 'players', uid), { score: 0, gamesPlayed: 0, correctAnswers: 0 });
      window.Modal.close();
      window.App.toast('Score remis à zéro !');
    } catch (e) {
      window.App.toast('Erreur : ' + e.message);
    }
  },

  async showStats() {
    const pSnap = await getDocs(collection(db, 'players'));
    const players = pSnap.docs.map(d => d.data());
    const total = players.length;
    const totalScore = players.reduce((s, p) => s + (p.score || 0), 0);
    const totalGames = players.reduce((s, p) => s + (p.gamesPlayed || 0), 0);

    window.Modal.show('📊 Statistiques', `
      <p>👥 Joueurs inscrits : <strong>${total}</strong></p>
      <p>🎮 Parties jouées : <strong>${totalGames}</strong></p>
      <p>⭐ Score total distribué : <strong>${totalScore}</strong></p>
      <p>❓ Questions dans la base : <strong>${window.QUESTIONS.length}</strong></p>
    `, [
      { label: 'Fermer', class: 'btn btn-ghost', onclick: 'Modal.close()' }
    ]);
  }
};

window.Admin = Admin;
