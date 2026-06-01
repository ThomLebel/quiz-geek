// ═══════════════════════════════════════════
// ADMIN MODULE v3 — Pause, team score dynamique, meilleurs contrôles
// ═══════════════════════════════════════════
import { db } from './firebase-config.js?v=8';
import {
  doc, setDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, query, orderBy, addDoc, onSnapshot,
  serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
let adminNextTimer = null;
let adminGameUnsub = null;

export const Admin = {
  currentTab: 'game',
  allPlayers: [],
  allTeams: [],

  init() { Admin.showTab('game'); },

  showTab(tab) {
    Admin.currentTab = tab;
    document.querySelectorAll('.admin-tabs .tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`atab-${tab}`)?.classList.add('active');
    document.getElementById('admin-content').innerHTML = '<div class="spinner"></div>';
    switch(tab) {
      case 'game': Admin.renderGameSetup(); break;
      case 'players': Admin.renderPlayers(); break;
      case 'teams': Admin.renderTeams(); break;
      case 'questions': Admin.renderQuestions(); break;
    }
  },

  // ──────────────────────────────────────────
  // GAME TAB
  // ──────────────────────────────────────────
  async renderGameSetup() {
    const snap = await getDoc(doc(db, 'game', 'current'));
    if (snap.exists() && !['finished'].includes(snap.data().status)) {
      Admin.renderGameControl(snap.data());
      if (adminGameUnsub) adminGameUnsub();
      adminGameUnsub = onSnapshot(doc(db, 'game', 'current'), s => {
        if (s.exists() && Admin.currentTab === 'game') Admin.renderGameControl(s.data());
        else if (!s.exists() && Admin.currentTab === 'game') Admin.renderGameSetup();
      });
      return;
    }

    document.getElementById('admin-content').innerHTML = `
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

    document.getElementById('admin-content').querySelectorAll('.btn-group').forEach(group => {
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

    let pool = [...window.QUESTIONS];
    if (theme !== 'all') pool = pool.filter(q => q.theme === theme);
    if (diff !== 'all') pool = pool.filter(q => q.difficulty === diff);
    const order = {debutant:1, connaisseur:2, otaku:3};
    pool.sort((a,b) => order[a.difficulty] - order[b.difficulty] || Math.random() - 0.5);
    const count = countRaw === 0 ? pool.length : Math.min(countRaw, pool.length);
    const questions = pool.slice(0, count).map(q => {
      const shuffled = q.answers.map((text,idx) => ({text, originalIdx:idx}));
      for (let i=shuffled.length-1;i>0;i--) {
        const j=Math.floor(Math.random()*(i+1));
        [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
      }
      return {...q, shuffledAnswers: shuffled};
    });

    if (!questions.length) { window.App.toast('Aucune question pour ces filtres !'); return; }

    await setDoc(doc(db, 'game', 'current'), {
      status: 'waiting', mode, timerSeconds,
      questionCount: questions.length, questions,
      questionIndex: -1, currentQuestion: null,
      answers: {}, readyPlayers: {}, finalScores: {},
      paused: false, createdAt: Date.now()
    });
    window.App.toast('Salle créée !');
    Admin.renderGameSetup();
  },

  renderGameControl(state) {
    const content = document.getElementById('admin-content');
    const { status, questionIndex: qIdx, questionCount: total, mode, timerSeconds } = state;
    const isWaiting = status === 'waiting';
    const isQuestion = status === 'question';
    const isReveal = status === 'reveal';
    const isPaused = status === 'paused';
    const readyCount = Object.keys(state.readyPlayers || {}).length;
    const answerCount = Object.keys(state.answers || {}).length;

    const readyChips = Object.values(state.readyPlayers || {}).filter(Boolean)
      .map(p => {
        const pseudo = typeof p === 'object' ? p.pseudo : p;
        const av = (window.AVATARS || []).find(a => a.id === (typeof p === 'object' ? p.avatarId : null));
        return `<div class="ready-chip ready">${av ? `<div style="width:24px;height:24px;border-radius:50%;overflow:hidden;display:inline-block;vertical-align:middle;margin-right:6px">${av.svg}</div>` : '👤'} ${pseudo}</div>`;
      }).join('');

    const answerRows = Object.entries(state.answers || {})
      .map(([,a]) => `<div class="live-answer-row">${a.isCorrect?'✅':'❌'} <span>${a.pseudo}</span></div>`)
      .join('');

    let statusLabel = isWaiting ? '⏳ Salle d\'attente'
      : isPaused ? `⏸ PAUSE — Question ${qIdx+1}/${total}`
      : isQuestion ? `❓ Question ${qIdx+1}/${total}`
      : isReveal ? `✅ Correction ${qIdx+1}/${total}`
      : '🏁 Partie terminée';

    content.innerHTML = `
      <div class="admin-section-title">${statusLabel}</div>

      <div class="game-setup-card">
        <div class="game-setup-label">Joueurs dans la salle (${readyCount})</div>
        <div class="players-ready-list">${readyChips||'<span style="color:var(--text3);font-size:13px">En attente…</span>'}</div>
      </div>

      ${(isQuestion||isPaused) ? `
        <div class="game-setup-card">
          <div class="game-setup-label">Réponses reçues</div>
          <div class="live-count">${answerCount}<span style="font-size:20px;color:var(--text2)"> / ${readyCount}</span></div>
          <div class="live-answers">${answerRows}</div>
        </div>
      ` : ''}

      <div class="admin-controls-row">
        ${isWaiting ? `
          <button class="btn btn-primary" onclick="Admin.launchGame()">🚀 Lancer la partie</button>
        ` : ''}
        ${(isQuestion||isPaused) ? `
          <button class="btn btn-primary" onclick="Admin.nextQuestion()">⏭ Passer à la correction</button>
          ${isPaused
            ? `<button class="btn btn-success" onclick="Admin.resumeGame()">▶ Reprendre</button>`
            : `<button class="btn btn-warn" onclick="Admin.pauseGame()">⏸ Pause</button>`
          }
        ` : ''}
        ${isReveal ? `
          <button class="btn btn-primary" onclick="Admin.launchNext()">
            ${qIdx+1 < total ? `➡ Question suivante (${qIdx+2}/${total})` : '🏁 Terminer'}
          </button>
        ` : ''}
      </div>

      <button class="btn btn-danger full" onclick="Admin.stopGame()">⏹ Arrêter et fermer la partie</button>
    `;
  },

  async launchGame() {
    await Admin.launchQuestion(0);
  },

  async launchNext() {
    const snap = await getDoc(doc(db,'game','current'));
    const state = snap.data();
    const nextIdx = state.questionIndex + 1;
    if (nextIdx >= state.questionCount) await Admin.finishGame(state);
    else await Admin.launchQuestion(nextIdx);
  },

  async launchQuestion(idx) {
    if (adminNextTimer) clearTimeout(adminNextTimer);
    const snap = await getDoc(doc(db,'game','current'));
    const state = snap.data();
    const q = state.questions[idx];
    const now = Date.now();
    await updateDoc(doc(db,'game','current'), {
      status: 'question', questionIndex: idx,
      currentQuestion: q, answers: {},
      questionStartedAt: now, paused: false
    });
    // Auto reveal after timer
    adminNextTimer = setTimeout(() => Admin.nextQuestion(), state.timerSeconds * 1000);
  },

  async nextQuestion() {
    if (adminNextTimer) clearTimeout(adminNextTimer);
    // Snapshot des rangs actuels avant reveal
    const pSnap = await getDocs(collection(db, 'players'));
    const snap = await getDoc(doc(db, 'game', 'current'));
    const state = snap.data();
    const ready = Object.keys(state.readyPlayers || {});
    const players = pSnap.docs
      .map(d => ({ uid: d.id, ...d.data() }))
      .filter(p => ready.includes(p.uid))
      .sort((a, b) => b.score - a.score);
    const prevRanks = {};
    players.forEach((p, i) => { prevRanks[p.uid] = i; });

    await updateDoc(doc(db, 'game', 'current'), {
      status: 'reveal',
      prevRanks,
      nextQuestionIn: Date.now() + 8500  // 2.5s résultats + 3s classement + 3s décompte
    });
    // Auto advance après que les 3 phases clients se soient jouées (~8.5s)
    adminNextTimer = setTimeout(() => Admin.launchNext(), 8500);
  },

  async pauseGame() {
    if (adminNextTimer) clearTimeout(adminNextTimer);
    const snap = await getDoc(doc(db,'game','current'));
    await updateDoc(doc(db,'game','current'), {
      status: 'paused',
      pausedAt: Date.now(),
      // Store elapsed time so timer can resume correctly
      pausedElapsed: Date.now() - snap.data().questionStartedAt
    });
    window.App.toast('Partie en pause.');
  },

  async resumeGame() {
    const snap = await getDoc(doc(db,'game','current'));
    const state = snap.data();
    const remaining = state.timerSeconds * 1000 - (state.pausedElapsed || 0);
    const now = Date.now();
    // Adjust questionStartedAt so elapsed = pausedElapsed
    await updateDoc(doc(db,'game','current'), {
      status: 'question',
      questionStartedAt: now - (state.pausedElapsed || 0),
      paused: false
    });
    // Reset auto-reveal timer with remaining time
    if (adminNextTimer) clearTimeout(adminNextTimer);
    adminNextTimer = setTimeout(() => Admin.nextQuestion(), Math.max(0, remaining));
    window.App.toast('Partie reprise !');
  },

  async finishGame(state) {
    if (adminNextTimer) clearTimeout(adminNextTimer);
    // Build final scores: sum player scores for those in the game
    const pSnap = await getDocs(collection(db,'players'));
    const readyPseudos = Object.values(state.readyPlayers || {})
      .map(p => typeof p === 'object' ? p.pseudo : p);
    const finalScores = {};
    pSnap.docs.forEach(d => {
      if (readyPseudos.includes(d.data().pseudo)) {
        finalScores[d.id] = {pseudo: d.data().pseudo, score: d.data().score};
      }
    });
    await updateDoc(doc(db,'game','current'), {status:'finished', finalScores});
  },

  async stopGame() {
    if (adminNextTimer) clearTimeout(adminNextTimer);
    if (adminGameUnsub) adminGameUnsub();
    // Signal tous les joueurs d'abord (status=stopped), puis supprimer
    await updateDoc(doc(db,'game','current'), {status:'stopped'}).catch(()=>{});
    await new Promise(r => setTimeout(r, 300));
    await deleteDoc(doc(db,'game','current')).catch(()=>{});
    window.App.toast('Partie arrêtée — joueurs renvoyés au lobby.');
    Admin.renderGameSetup();
  },

  // ──────────────────────────────────────────
  // PLAYERS TAB
  // ──────────────────────────────────────────
  async renderPlayers() {
    try {
      await Admin.loadAll();
      document.getElementById('admin-content').innerHTML = `
        <div class="admin-section-title">Joueurs (${Admin.allPlayers.length})</div>
        ${Admin.allPlayers.map(p => Admin.playerCard(p)).join('')}
        ${Admin.allPlayers.length === 0 ? '<div class="empty-state"><div class="empty-icon">👤</div><p>Aucun joueur encore</p></div>' : ''}
      `;
    } catch(e) { document.getElementById('admin-content').innerHTML = `<p style="color:var(--error)">Erreur: ${e.message}</p>`; }
  },

  async loadAll() {
    const pSnap = await getDocs(query(collection(db,'players'), orderBy('score','desc')));
    Admin.allPlayers = pSnap.docs.map(d => ({uid:d.id,...d.data()}));
    const tSnap = await getDocs(collection(db,'teams'));
    Admin.allTeams = tSnap.docs.map(d => ({id:d.id,...d.data()}));
  },

  playerCard(p) {
    const av = (window.AVATARS||[]).find(a=>a.id===p.avatarId);
    const team = Admin.allTeams.find(t=>t.id===p.teamId);
    return `
      <div class="admin-player-card">
        <div class="player-avatar-small">${av?av.svg:''}</div>
        <div class="admin-player-info">
          <div class="admin-player-name">${p.pseudo}</div>
          <div class="admin-player-sub">${p.score||0} pts · ${team?.name||'Sans équipe'}</div>
        </div>
        <div class="admin-player-actions">
          <button class="admin-btn admin-btn-edit" onclick="Admin.editPlayer('${p.uid}')">✏️</button>
          <button class="admin-btn admin-btn-delete" onclick="Admin.deletePlayer('${p.uid}','${p.pseudo}')">🗑️</button>
        </div>
      </div>`;
  },

  async editPlayer(uid) {
    const p = Admin.allPlayers.find(x=>x.uid===uid); if(!p) return;
    const opts = Admin.allTeams.map(t=>`<option value="${t.id}" ${p.teamId===t.id?'selected':''}>${t.name}</option>`).join('');
    window.Modal.show('Modifier le joueur',`
      <div class="form-group"><label>Pseudo</label><input id="ep-pseudo" type="text" value="${p.pseudo}" maxlength="20"/></div>
      <div class="form-group"><label>Score</label><input id="ep-score" type="number" value="${p.score||0}" min="0"/></div>
      <div class="form-group"><label>Équipe</label><select id="ep-team"><option value="">Sans équipe</option>${opts}</select></div>
    `,[
      {label:'Annuler',class:'btn btn-ghost',onclick:'Modal.close()'},
      {label:'Sauvegarder',class:'btn btn-primary',onclick:`Admin.savePlayer('${uid}')`}
    ]);
  },

  async savePlayer(uid) {
    const pseudo=document.getElementById('ep-pseudo').value.trim();
    const score=parseInt(document.getElementById('ep-score').value)||0;
    const teamId=document.getElementById('ep-team').value||null;
    if(!pseudo){window.App.toast('Pseudo requis !');return;}
    const teamName=Admin.allTeams.find(t=>t.id===teamId)?.name||null;
    await updateDoc(doc(db,'players',uid),{pseudo,score,teamId,teamName});
    window.Modal.close(); window.App.toast('Joueur mis à jour !'); Admin.renderPlayers();
  },

  async deletePlayer(uid,pseudo) {
    window.Modal.show('Supprimer le joueur',`<p>Supprimer <strong>${pseudo}</strong> ?</p>`,[
      {label:'Annuler',class:'btn btn-ghost',onclick:'Modal.close()'},
      {label:'🗑️ Supprimer',class:'btn btn-danger',onclick:`Admin.confirmDeletePlayer('${uid}')`}
    ]);
  },

  async confirmDeletePlayer(uid) {
    await deleteDoc(doc(db,'players',uid));
    window.Modal.close(); window.App.toast('Joueur supprimé'); Admin.renderPlayers();
  },

  // ──────────────────────────────────────────
  // TEAMS TAB — score = sum of member scores
  // ──────────────────────────────────────────
  async renderTeams() {
    try {
      await Admin.loadAll();
      // Compute team scores dynamically
      const teams = Admin.allTeams.map(t => {
        const members = Admin.allPlayers.filter(p => p.teamId === t.id);
        const dynamicScore = members.reduce((sum, m) => sum + (m.score||0), 0);
        return {...t, dynamicScore, members};
      }).sort((a,b) => b.dynamicScore - a.dynamicScore);

      document.getElementById('admin-content').innerHTML = `
        <button class="add-btn" onclick="Admin.addTeam()">+ Créer une équipe</button>
        <div class="admin-section-title">Équipes (${teams.length})</div>
        ${teams.map(t => Admin.teamCard(t)).join('')}
        ${teams.length===0?'<div class="empty-state"><div class="empty-icon">👥</div><p>Aucune équipe</p></div>':''}
      `;
    } catch(e) { document.getElementById('admin-content').innerHTML=`<p style="color:var(--error)">Erreur: ${e.message}</p>`; }
  },

  teamCard(t) {
    const chips = (t.members||[]).map(m=>`<span class="member-chip">${m.pseudo} (${m.score||0}pts)</span>`).join('');
    return `
      <div class="admin-team-card">
        <div class="admin-team-header">
          <span class="admin-team-name">👥 ${t.name}</span>
          <span class="admin-team-score">${t.dynamicScore||0} pts</span>
        </div>
        <div class="admin-team-members">${chips||'<span style="color:var(--text3);font-size:12px">Aucun membre</span>'}</div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="admin-btn admin-btn-edit" onclick="Admin.editTeam('${t.id}')">✏️ Modifier</button>
          <button class="admin-btn admin-btn-delete" onclick="Admin.deleteTeam('${t.id}','${t.name}')">🗑️</button>
        </div>
      </div>`;
  },

  addTeam() {
    window.Modal.show('Créer une équipe',`
      <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Équipe vide — les joueurs la rejoignent à l'inscription.</p>
      <div class="form-group"><label>Nom</label><input type="text" id="nt-name" placeholder="ex: Les Otakus" maxlength="30"/></div>
    `,[
      {label:'Annuler',class:'btn btn-ghost',onclick:'Modal.close()'},
      {label:'✅ Créer',class:'btn btn-primary',onclick:'Admin.confirmAddTeam()'}
    ]);
  },

  async confirmAddTeam() {
    const name=document.getElementById('nt-name').value.trim();
    if(!name){window.App.toast('Nom requis !');return;}
    await addDoc(collection(db,'teams'),{name,memberUids:[],memberNames:[],createdAt:serverTimestamp()});
    window.Modal.close(); window.App.toast(`Équipe "${name}" créée !`); Admin.renderTeams();
  },

  async editTeam(teamId) {
    const t=Admin.allTeams.find(x=>x.id===teamId); if(!t) return;
    const opts=Admin.allPlayers.map(p=>`<option value="${p.uid}" ${(t.memberUids||[]).includes(p.uid)?'selected':''}>${p.pseudo}</option>`).join('');
    window.Modal.show('Modifier l\'équipe',`
      <div class="form-group"><label>Nom</label><input type="text" id="et-name" value="${t.name}" maxlength="30"/></div>
      <div class="form-group"><label>Membres</label><select id="et-members" multiple size="5">${opts}</select><small style="color:var(--text3);font-size:11px;display:block;margin-top:4px">Ctrl+clic pour sélection multiple</small></div>
    `,[
      {label:'Annuler',class:'btn btn-ghost',onclick:'Modal.close()'},
      {label:'Sauvegarder',class:'btn btn-primary',onclick:`Admin.saveTeam('${teamId}')`}
    ]);
  },

  async saveTeam(teamId) {
    const name=document.getElementById('et-name').value.trim();
    const sel=document.getElementById('et-members');
    const newUids=Array.from(sel.selectedOptions).map(o=>o.value);
    const newNames=newUids.map(uid=>Admin.allPlayers.find(p=>p.uid===uid)?.pseudo||'');
    if(!name){window.App.toast('Nom requis !');return;}
    const old=Admin.allTeams.find(t=>t.id===teamId);
    const removed=(old?.memberUids||[]).filter(uid=>!newUids.includes(uid));
    await Promise.all(removed.map(uid=>updateDoc(doc(db,'players',uid),{teamId:null,teamName:null})));
    await Promise.all(newUids.map(uid=>updateDoc(doc(db,'players',uid),{teamId,teamName:name})));
    await updateDoc(doc(db,'teams',teamId),{name,memberUids:newUids,memberNames:newNames});
    window.Modal.close(); window.App.toast('Équipe mise à jour !'); Admin.renderTeams();
  },

  async deleteTeam(teamId,teamName) {
    window.Modal.show('Supprimer l\'équipe',`<p>Supprimer <strong>${teamName}</strong> ? Les joueurs seront libérés.</p>`,[
      {label:'Annuler',class:'btn btn-ghost',onclick:'Modal.close()'},
      {label:'🗑️ Supprimer',class:'btn btn-danger',onclick:`Admin.confirmDeleteTeam('${teamId}')`}
    ]);
  },

  async confirmDeleteTeam(teamId) {
    const t=Admin.allTeams.find(x=>x.id===teamId);
    if(t?.memberUids) await Promise.all(t.memberUids.map(uid=>updateDoc(doc(db,'players',uid),{teamId:null,teamName:null})));
    await deleteDoc(doc(db,'teams',teamId));
    window.Modal.close(); window.App.toast('Équipe supprimée'); Admin.renderTeams();
  },

  // ──────────────────────────────────────────
  // QUESTIONS TAB
  // ──────────────────────────────────────────
  renderQuestions() {
    const order={debutant:1,connaisseur:2,otaku:3};
    const sorted=[...window.QUESTIONS].sort((a,b)=>order[a.difficulty]-order[b.difficulty]);
    document.getElementById('admin-content').innerHTML=`
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
    window.Modal.show('Ajouter une question',`
      <div class="form-group"><label>Question</label><textarea id="nq-text" placeholder="La question…"></textarea></div>
      <div class="form-group"><label>Bonne réponse</label><input type="text" id="nq-c"/></div>
      <div class="form-group"><label>Mauvaise réponse 1</label><input type="text" id="nq-w1"/></div>
      <div class="form-group"><label>Mauvaise réponse 2</label><input type="text" id="nq-w2"/></div>
      <div class="form-group"><label>Mauvaise réponse 3</label><input type="text" id="nq-w3"/></div>
      <div class="form-group"><label>Anecdote</label><textarea id="nq-focus" placeholder="Explication…"></textarea></div>
      <div class="form-group"><label>Difficulté</label><select id="nq-diff"><option value="debutant">Débutant</option><option value="connaisseur">Connaisseur</option><option value="otaku">Otaku</option></select></div>
      <div class="form-group"><label>Thème</label><select id="nq-theme"><option value="manga">Manga</option><option value="jv">Jeux Vidéo</option><option value="roman">Roman</option><option value="series">Séries</option><option value="gameplay">Gameplay</option></select></div>
    `,[
      {label:'Annuler',class:'btn btn-ghost',onclick:'Modal.close()'},
      {label:'✅ Ajouter',class:'btn btn-primary',onclick:'Admin.confirmAddQuestion()'}
    ]);
  },

  confirmAddQuestion() {
    const g=id=>document.getElementById(id).value.trim();
    const text=g('nq-text'),c=g('nq-c'),w1=g('nq-w1'),w2=g('nq-w2'),w3=g('nq-w3'),focus=g('nq-focus');
    const diff=document.getElementById('nq-diff').value, theme=document.getElementById('nq-theme').value;
    if(!text||!c||!w1||!w2||!w3){window.App.toast('Remplis tous les champs !');return;}
    const id=Math.max(...window.QUESTIONS.map(q=>q.id))+1;
    window.QUESTIONS.push({id,category:theme==='gameplay'?'gameplay':theme==='series'?'series':'general',
      theme,difficulty:diff,question:text,answers:[c,w1,w2,w3],correct:0,focus});
    window.Modal.close(); window.App.toast(`Question #${id} ajoutée !`); Admin.renderQuestions();
  }
};

window.Admin = Admin;