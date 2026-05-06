// ═══════════════════════════════════════════
// ADMIN MODULE v2 — Contrôle de partie synchronisé
// ═══════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  doc, setDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, query, orderBy, addDoc, onSnapshot,
  serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let adminGameUnsub = null;
let adminNextTimer = null;

export const Admin = {
  currentTab: 'game',
  allPlayers: [],
  allTeams: [],

  init() {
    Admin.showTab('game');
  },

  showTab(tab) {
    Admin.currentTab = tab;
    document.querySelectorAll('.admin-tabs .tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`atab-${tab}`)?.classList.add('active');
    const content = document.getElementById('admin-content');
    content.innerHTML = '<div class="spinner"></div>';
    switch (tab) {
      case 'game': Admin.renderGameSetup(); break;
      case 'players': Admin.renderPlayers(); break;
      case 'teams': Admin.renderTeams(); break;
      case 'questions': Admin.renderQuestions(); break;
    }
  },

  // ──────────────────────────────────────────
  // ONGLET PARTIE
  // ──────────────────────────────────────────
  async renderGameSetup() {
    const content = document.getElementById('admin-content');

    // Check if game is active
    const snap = await getDoc(doc(db, 'game', 'current'));
    if (snap.exists() && snap.data().status !== 'finished') {
      Admin.renderGameControl(snap.data());
      // Listen for updates
      if (adminGameUnsub) adminGameUnsub();
      adminGameUnsub = onSnapshot(doc(db, 'game', 'current'), s => {
        if (s.exists() && Admin.currentTab === 'game') Admin.renderGameControl(s.data());
      });
      return;
    }

    // Game setup form
    content.innerHTML = `
      <div class="admin-section-title">Nouvelle partie</div>

      <div class="game-setup-card">
        <div class="game-setup-label">Mode de jeu</div>
        <div class="btn-group" id="setup-mode">
          <button class="btn-toggle active" data-val="normal">🎯 Normal</button>
          <button class="btn-toggle" data-val="blind">🙈 Aveugle</button>
          <button class="btn-toggle" data-val="speed">⚡ Rapidité</button>
        </div>
      </div>

      <div class="game-setup-card">
        <div class="game-setup-label">Nombre de questions</div>
        <div class="btn-group" id="setup-count">
          <button class="btn-toggle active" data-val="5">5</button>
          <button class="btn-toggle" data-val="10">10</button>
          <button class="btn-toggle" data-val="15">15</button>
          <button class="btn-toggle" data-val="0">Toutes</button>
        </div>
      </div>

      <div class="game-setup-card">
        <div class="game-setup-label">Thème</div>
        <div class="btn-group" id="setup-theme">
          <button class="btn-toggle active" data-val="all">Tous</button>
          <button class="btn-toggle" data-val="manga">Mangas</button>
          <button class="btn-toggle" data-val="jv">Jeux Vidéo</button>
          <button class="btn-toggle" data-val="roman">Romans</button>
          <button class="btn-toggle" data-val="series">Séries</button>
          <button class="btn-toggle" data-val="gameplay">Gameplay</button>
        </div>
      </div>

      <div class="game-setup-card">
        <div class="game-setup-label">Difficulté</div>
        <div class="btn-group" id="setup-diff">
          <button class="btn-toggle active" data-val="all">Toutes</button>
          <button class="btn-toggle" data-val="debutant">Débutant</button>
          <button class="btn-toggle" data-val="connaisseur">Connaisseur</button>
          <button class="btn-toggle" data-val="otaku">Otaku</button>
        </div>
      </div>

      <div class="game-setup-card">
        <div class="game-setup-label">Timer par question (secondes)</div>
        <div class="btn-group" id="setup-timer">
          <button class="btn-toggle" data-val="10">10s</button>
          <button class="btn-toggle" data-val="15">15s</button>
          <button class="btn-toggle active" data-val="20">20s</button>
          <button class="btn-toggle" data-val="30">30s</button>
          <button class="btn-toggle" data-val="45">45s</button>
          <button class="btn-toggle" data-val="60">60s</button>
        </div>
      </div>

      <button class="btn btn-primary full mt" onclick="Admin.createGame()">🎮 Créer et ouvrir la salle d'attente</button>
    `;

    // Toggle logic
    content.querySelectorAll('.btn-group').forEach(group => {
      group.querySelectorAll('.btn-toggle').forEach(btn => {
        btn.onclick = () => {
          group.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        };
      });
    });
  },

  async createGame() {
    const mode = document.querySelector('#setup-mode .btn-toggle.active')?.dataset.val || 'normal';
    const countRaw = parseInt(document.querySelector('#setup-count .btn-toggle.active')?.dataset.val || '10');
    const theme = document.querySelector('#setup-theme .btn-toggle.active')?.dataset.val || 'all';
    const diff = document.querySelector('#setup-diff .btn-toggle.active')?.dataset.val || 'all';
    const timerSeconds = parseInt(document.querySelector('#setup-timer .btn-toggle.active')?.dataset.val || '20');

    // Build question list
    let pool = [...window.QUESTIONS];
    if (theme !== 'all') pool = pool.filter(q => q.theme === theme);
    if (diff !== 'all') pool = pool.filter(q => q.difficulty === diff);
    const order = { debutant: 1, connaisseur: 2, otaku: 3 };
    pool.sort((a, b) => order[a.difficulty] - order[b.difficulty] || Math.random() - 0.5);
    const count = countRaw === 0 ? pool.length : Math.min(countRaw, pool.length);
    const questions = pool.slice(0, count).map(q => {
      // Pre-shuffle answers for all players (same order)
      const shuffled = q.answers.map((text, idx) => ({ text, originalIdx: idx }));
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return { ...q, shuffledAnswers: shuffled };
    });

    if (questions.length === 0) { window.App.toast('Aucune question pour ces filtres !'); return; }

    await setDoc(doc(db, 'game', 'current'), {
      status: 'waiting',
      mode, timerSeconds,
      questionCount: questions.length,
      questions,
      questionIndex: -1,
      currentQuestion: null,
      answers: {},
      readyPlayers: {},
      finalScores: {},
      createdAt: Date.now()
    });

    window.App.toast('Salle créée ! Les joueurs peuvent rejoindre.');
    Admin.renderGameSetup();
  },

  renderGameControl(state) {
    const content = document.getElementById('admin-content');
    const qIdx = state.questionIndex;
    const total = state.questionCount;
    const isWaiting = state.status === 'waiting';
    const isQuestion = state.status === 'question';
    const isReveal = state.status === 'reveal';
    const readyCount = Object.keys(state.readyPlayers || {}).length;
    const answeredCount = Object.keys(state.answers || {}).length;

    const readyChips = Object.entries(state.readyPlayers || {}).map(([uid, pseudo]) => `
      <div class="ready-chip ready">👤 ${pseudo}</div>
    `).join('');

    content.innerHTML = `
      <div class="admin-section-title">
        ${isWaiting ? '⏳ Salle d\'attente' : isQuestion ? `❓ Question ${qIdx + 1}/${total}` : isReveal ? `✅ Correction ${qIdx + 1}/${total}` : '🏁 Partie terminée'}
      </div>

      <div class="game-setup-card">
        <div class="game-setup-label">Joueurs connectés (${readyCount})</div>
        <div class="players-ready-list">${readyChips || '<span style="color:var(--text3);font-size:13px">En attente…</span>'}</div>
      </div>

      ${isQuestion ? `
        <div class="game-setup-card">
          <div class="game-setup-label">Réponses reçues</div>
          <div style="font-family:'Bangers',cursive;font-size:32px;color:var(--accent)">${answeredCount} / ${readyCount}</div>
          <div style="color:var(--text2);font-size:13px;margin-top:4px">
            ${Object.entries(state.answers || {}).map(([uid, a]) => `${a.pseudo}: ${a.isCorrect ? '✅' : '❌'}`).join(' · ')}
          </div>
        </div>
        <button class="btn btn-primary full" onclick="Admin.nextQuestion()">
          ⏭ Passer à la correction (fin du timer)
        </button>
      ` : ''}

      ${isReveal ? `
        <div class="game-setup-card">
          <div class="game-setup-label">Résultats de la question</div>
          ${Object.entries(state.answers || {}).map(([uid, a]) => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:14px">
              <span>${a.isCorrect ? '✅' : '❌'}</span>
              <span style="font-weight:700">${a.pseudo}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary full" onclick="Admin.launchNext()">
          ${qIdx + 1 < total ? `➡ Question suivante (${qIdx + 2}/${total})` : '🏁 Terminer la partie'}
        </button>
      ` : ''}

      ${isWaiting ? `
        <button class="btn btn-primary full" onclick="Admin.launchGame()" style="margin-bottom:12px">
          🚀 Lancer la partie !
        </button>
      ` : ''}

      <button class="btn btn-danger full mt" onclick="Admin.stopGame()">⏹ Arrêter la partie</button>
    `;
  },

  async launchGame() {
    // Launch first question
    await Admin.launchQuestion(0);
  },

  async launchNext() {
    const snap = await getDoc(doc(db, 'game', 'current'));
    const state = snap.data();
    const nextIdx = state.questionIndex + 1;
    if (nextIdx >= state.questionCount) {
      await Admin.finishGame(state);
    } else {
      await Admin.launchQuestion(nextIdx);
    }
  },

  async launchQuestion(idx) {
    const snap = await getDoc(doc(db, 'game', 'current'));
    const state = snap.data();
    const q = state.questions[idx];
    await updateDoc(doc(db, 'game', 'current'), {
      status: 'question',
      questionIndex: idx,
      currentQuestion: q,
      answers: {},
      questionStartedAt: Date.now()
    });

    // Auto-reveal after timer
    const timerSeconds = state.timerSeconds;
    if (adminNextTimer) clearTimeout(adminNextTimer);
    adminNextTimer = setTimeout(() => Admin.nextQuestion(), timerSeconds * 1000);
  },

  async nextQuestion() {
    if (adminNextTimer) clearTimeout(adminNextTimer);
    const snap = await getDoc(doc(db, 'game', 'current'));
    const state = snap.data();
    // Transition to reveal state
    await updateDoc(doc(db, 'game', 'current'), {
      status: 'reveal',
      nextQuestionIn: Date.now() + 3000
    });
    // Auto next after 3s
    adminNextTimer = setTimeout(() => Admin.launchNext(), 3000);
  },

  async finishGame(state) {
    // Build final scores from all player answers across questions
    // (simplified: we use current Firestore scores)
    const pSnap = await getDocs(collection(db, 'players'));
    const finalScores = {};
    pSnap.docs.forEach(d => {
      if (Object.values(state.readyPlayers || {}).includes(d.data().pseudo)) {
        finalScores[d.id] = { pseudo: d.data().pseudo, score: d.data().score };
      }
    });
    await updateDoc(doc(db, 'game', 'current'), {
      status: 'finished',
      finalScores
    });
  },

  async stopGame() {
    if (adminNextTimer) clearTimeout(adminNextTimer);
    if (adminGameUnsub) adminGameUnsub();
    await deleteDoc(doc(db, 'game', 'current')).catch(() => {});
    window.App.toast('Partie arrêtée.');
    Admin.renderGameSetup();
  },

  // ──────────────────────────────────────────
  // ONGLET JOUEURS
  // ──────────────────────────────────────────
  async renderPlayers() {
    const content = document.getElementById('admin-content');
    try {
      await Admin.loadAll();
      content.innerHTML = `
        <div class="admin-section-title">Joueurs (${Admin.allPlayers.length})</div>
        ${Admin.allPlayers.map(p => Admin.playerCard(p)).join('')}
      `;
    } catch (e) { content.innerHTML = `<p style="color:var(--error)">Erreur: ${e.message}</p>`; }
  },

  async loadAll() {
    const pSnap = await getDocs(query(collection(db, 'players'), orderBy('score', 'desc')));
    Admin.allPlayers = pSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
    const tSnap = await getDocs(collection(db, 'teams'));
    Admin.allTeams = tSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  playerCard(p) {
    const av = (window.AVATARS || []).find(a => a.id === p.avatarId);
    const team = Admin.allTeams.find(t => t.id === p.teamId);
    return `
      <div class="admin-player-card">
        <div class="player-avatar-small">${av ? av.svg : ''}</div>
        <div class="admin-player-info">
          <div class="admin-player-name">${p.pseudo}</div>
          <div class="admin-player-sub">${p.score || 0} pts · ${team?.name || 'Sans équipe'}</div>
        </div>
        <div class="admin-player-actions">
          <button class="admin-btn admin-btn-edit" onclick="Admin.editPlayer('${p.uid}')">✏️</button>
          <button class="admin-btn admin-btn-delete" onclick="Admin.deletePlayer('${p.uid}','${p.pseudo}')">🗑️</button>
        </div>
      </div>
    `;
  },

  async editPlayer(uid) {
    const p = Admin.allPlayers.find(x => x.uid === uid);
    if (!p) return;
    const opts = Admin.allTeams.map(t => `<option value="${t.id}" ${p.teamId===t.id?'selected':''}>${t.name}</option>`).join('');
    window.Modal.show('Modifier le joueur', `
      <div class="form-group"><label>Pseudo</label><input id="ep-pseudo" type="text" value="${p.pseudo}" maxlength="20"/></div>
      <div class="form-group"><label>Score</label><input id="ep-score" type="number" value="${p.score||0}" min="0"/></div>
      <div class="form-group"><label>Équipe</label><select id="ep-team"><option value="">Sans équipe</option>${opts}</select></div>
    `, [
      {label:'Annuler', class:'btn btn-ghost', onclick:'Modal.close()'},
      {label:'Sauvegarder', class:'btn btn-primary', onclick:`Admin.savePlayer('${uid}')`}
    ]);
  },

  async savePlayer(uid) {
    const pseudo = document.getElementById('ep-pseudo').value.trim();
    const score = parseInt(document.getElementById('ep-score').value)||0;
    const teamId = document.getElementById('ep-team').value||null;
    if (!pseudo) { window.App.toast('Pseudo requis !'); return; }
    const teamName = Admin.allTeams.find(t=>t.id===teamId)?.name || null;
    await updateDoc(doc(db,'players',uid), {pseudo, score, teamId, teamName});
    window.Modal.close(); window.App.toast('Joueur mis à jour !'); Admin.renderPlayers();
  },

  async deletePlayer(uid, pseudo) {
    window.Modal.show('Supprimer le joueur', `<p>Supprimer <strong>${pseudo}</strong> ?</p>`, [
      {label:'Annuler', class:'btn btn-ghost', onclick:'Modal.close()'},
      {label:'🗑️ Supprimer', class:'btn btn-danger', onclick:`Admin.confirmDeletePlayer('${uid}')`}
    ]);
  },

  async confirmDeletePlayer(uid) {
    await deleteDoc(doc(db,'players',uid));
    window.Modal.close(); window.App.toast('Joueur supprimé'); Admin.renderPlayers();
  },

  // ──────────────────────────────────────────
  // ONGLET ÉQUIPES
  // ──────────────────────────────────────────
  async renderTeams() {
    const content = document.getElementById('admin-content');
    try {
      await Admin.loadAll();
      content.innerHTML = `
        <button class="add-btn" onclick="Admin.addTeam()">+ Créer une équipe</button>
        <div class="admin-section-title">Équipes (${Admin.allTeams.length})</div>
        ${Admin.allTeams.map(t => Admin.teamCard(t)).join('')}
      `;
    } catch (e) { content.innerHTML = `<p style="color:var(--error)">Erreur: ${e.message}</p>`; }
  },

  teamCard(t) {
    const members = Admin.allPlayers.filter(p => p.teamId === t.id);
    return `
      <div class="admin-team-card">
        <div class="admin-team-header">
          <span class="admin-team-name">👥 ${t.name}</span>
          <span class="admin-team-score">${t.score||0} pts</span>
        </div>
        <div class="admin-team-members">
          ${members.length ? members.map(m=>`<span class="member-chip">${m.pseudo}</span>`).join('') : '<span style="color:var(--text3);font-size:12px">Aucun membre</span>'}
        </div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="admin-btn admin-btn-edit" onclick="Admin.editTeam('${t.id}')">✏️ Modifier</button>
          <button class="admin-btn admin-btn-delete" onclick="Admin.deleteTeam('${t.id}','${t.name}')">🗑️</button>
        </div>
      </div>
    `;
  },

  addTeam() {
    window.Modal.show('Créer une équipe vide', `
      <p style="color:var(--text2);font-size:13px;margin-bottom:16px">L'équipe sera vide — les joueurs pourront la rejoindre à l'inscription.</p>
      <div class="form-group"><label>Nom de l'équipe</label><input type="text" id="nt-name" placeholder="ex: Les Otakus" maxlength="30"/></div>
    `, [
      {label:'Annuler', class:'btn btn-ghost', onclick:'Modal.close()'},
      {label:'✅ Créer', class:'btn btn-primary', onclick:'Admin.confirmAddTeam()'}
    ]);
  },

  async confirmAddTeam() {
    const name = document.getElementById('nt-name').value.trim();
    if (!name) { window.App.toast('Nom requis !'); return; }
    await addDoc(collection(db,'teams'), {name, score:0, memberUids:[], memberNames:[], createdAt:serverTimestamp()});
    window.Modal.close(); window.App.toast(`Équipe "${name}" créée !`); Admin.renderTeams();
  },

  async editTeam(teamId) {
    const t = Admin.allTeams.find(x => x.id===teamId);
    if (!t) return;
    const opts = Admin.allPlayers.map(p => `<option value="${p.uid}" ${(t.memberUids||[]).includes(p.uid)?'selected':''}>${p.pseudo}</option>`).join('');
    window.Modal.show('Modifier l\'équipe', `
      <div class="form-group"><label>Nom</label><input type="text" id="et-name" value="${t.name}" maxlength="30"/></div>
      <div class="form-group"><label>Score</label><input type="number" id="et-score" value="${t.score||0}" min="0"/></div>
      <div class="form-group"><label>Membres</label><select id="et-members" multiple size="5">${opts}</select><small style="color:var(--text3);font-size:11px;display:block;margin-top:4px">Ctrl+clic pour sélection multiple</small></div>
    `, [
      {label:'Annuler', class:'btn btn-ghost', onclick:'Modal.close()'},
      {label:'Sauvegarder', class:'btn btn-primary', onclick:`Admin.saveTeam('${teamId}')`}
    ]);
  },

  async saveTeam(teamId) {
    const name = document.getElementById('et-name').value.trim();
    const score = parseInt(document.getElementById('et-score').value)||0;
    const sel = document.getElementById('et-members');
    const newUids = Array.from(sel.selectedOptions).map(o=>o.value);
    const newNames = newUids.map(uid=>Admin.allPlayers.find(p=>p.uid===uid)?.pseudo||'');
    if (!name) { window.App.toast('Nom requis !'); return; }
    const old = Admin.allTeams.find(t=>t.id===teamId);
    const removed = (old?.memberUids||[]).filter(uid=>!newUids.includes(uid));
    await Promise.all(removed.map(uid=>updateDoc(doc(db,'players',uid),{teamId:null,teamName:null})));
    await Promise.all(newUids.map(uid=>updateDoc(doc(db,'players',uid),{teamId,teamName:name})));
    await updateDoc(doc(db,'teams',teamId),{name,score,memberUids:newUids,memberNames:newNames});
    window.Modal.close(); window.App.toast('Équipe mise à jour !'); Admin.renderTeams();
  },

  async deleteTeam(teamId, teamName) {
    window.Modal.show('Supprimer l\'équipe', `<p>Supprimer <strong>${teamName}</strong> ? Les joueurs seront libérés.</p>`, [
      {label:'Annuler', class:'btn btn-ghost', onclick:'Modal.close()'},
      {label:'🗑️ Supprimer', class:'btn btn-danger', onclick:`Admin.confirmDeleteTeam('${teamId}')`}
    ]);
  },

  async confirmDeleteTeam(teamId) {
    const t = Admin.allTeams.find(x=>x.id===teamId);
    if (t?.memberUids) await Promise.all(t.memberUids.map(uid=>updateDoc(doc(db,'players',uid),{teamId:null,teamName:null})));
    await deleteDoc(doc(db,'teams',teamId));
    window.Modal.close(); window.App.toast('Équipe supprimée'); Admin.renderTeams();
  },

  // ──────────────────────────────────────────
  // ONGLET QUESTIONS
  // ──────────────────────────────────────────
  renderQuestions() {
    const content = document.getElementById('admin-content');
    const order = {debutant:1, connaisseur:2, otaku:3};
    const sorted = [...window.QUESTIONS].sort((a,b)=>order[a.difficulty]-order[b.difficulty]);
    content.innerHTML = `
      <button class="add-btn" onclick="Admin.addQuestion()">+ Ajouter une question</button>
      <div class="admin-section-title">Questions (${sorted.length})</div>
      ${sorted.map(q=>`
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
      <div class="form-group"><label>Question</label><textarea id="nq-text" placeholder="La question…"></textarea></div>
      <div class="form-group"><label>Bonne réponse</label><input type="text" id="nq-c" placeholder="Réponse correcte"/></div>
      <div class="form-group"><label>Mauvaise réponse 1</label><input type="text" id="nq-w1" placeholder=""/></div>
      <div class="form-group"><label>Mauvaise réponse 2</label><input type="text" id="nq-w2" placeholder=""/></div>
      <div class="form-group"><label>Mauvaise réponse 3</label><input type="text" id="nq-w3" placeholder=""/></div>
      <div class="form-group"><label>Anecdote</label><textarea id="nq-focus" placeholder="Explication de la réponse…"></textarea></div>
      <div class="form-group"><label>Difficulté</label>
        <select id="nq-diff"><option value="debutant">Débutant</option><option value="connaisseur">Connaisseur</option><option value="otaku">Otaku</option></select>
      </div>
      <div class="form-group"><label>Thème</label>
        <select id="nq-theme"><option value="manga">Manga</option><option value="jv">Jeux Vidéo</option><option value="roman">Roman</option><option value="series">Séries</option><option value="gameplay">Gameplay</option></select>
      </div>
    `, [
      {label:'Annuler', class:'btn btn-ghost', onclick:'Modal.close()'},
      {label:'✅ Ajouter', class:'btn btn-primary', onclick:'Admin.confirmAddQuestion()'}
    ]);
  },

  confirmAddQuestion() {
    const t = v => document.getElementById(v).value.trim();
    const text=t('nq-text'), c=t('nq-c'), w1=t('nq-w1'), w2=t('nq-w2'), w3=t('nq-w3'), focus=t('nq-focus');
    const diff=document.getElementById('nq-diff').value;
    const theme=document.getElementById('nq-theme').value;
    if (!text||!c||!w1||!w2||!w3) { window.App.toast('Remplis tous les champs !'); return; }
    const id = Math.max(...window.QUESTIONS.map(q=>q.id))+1;
    window.QUESTIONS.push({id, category:theme==='gameplay'?'gameplay':theme==='series'?'series':'general',
      theme, difficulty:diff, question:text, answers:[c,w1,w2,w3], correct:0, focus});
    window.Modal.close(); window.App.toast(`Question #${id} ajoutée !`); Admin.renderQuestions();
  }
};

window.Admin = Admin;
