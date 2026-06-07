// ═══════════════════════════════════════════
// GAME ENGINE v3.1 — Architecture claire, timer robuste
//
// Principe :
//   • onSnapshot reçoit chaque changement Firestore
//   • handleGameState dispatch selon state.status
//   • 'question' → renderQuestion() une seule fois par questionIndex
//                   puis updateAnswersOnly() pour les snapshots suivants
//   • Le timer est un setInterval autonome lancé une fois par question,
//     jamais relancé par un snapshot intermédiaire
//   • Quand le timer arrive à 0, c'est l'ADMIN qui fait passer en 'reveal'
//     (pas le client). Le client attend juste le prochain snapshot.
// ═══════════════════════════════════════════
import { db } from './firebase-config.js?v=12';
import {
  doc, updateDoc, getDoc, onSnapshot, increment, getDocs, collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const CIRC = 2 * Math.PI * 22; // r=22 → ≈138.2

// ── État local du joueur (réinitialisé à chaque question)
let L = {
  // Session
  sessionScore: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
  // Question en cours
  questionIndex: -1,      // index de la question actuellement affichée
  answered: false,        // a-t-il répondu ?
  blindCorrect: false,    // a-t-il trouvé en mode aveugle ?
  scoreThisQ: 0,          // points gagnés cette question (calculé au reveal)
  scored: false,          // a-t-on déjà compté cette question ?
  // Timer
  timerInterval: null,
  isPaused: false,
  // Firestore
  _unsub: null
};

function stopTimer() {
  if (L.timerInterval) { clearTimeout(L.timerInterval); clearInterval(L.timerInterval); L.timerInterval = null; }
}

// ══════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════
export const Game = {
  _unsubGame: null,

  // ─────────────────────────────────────────
  // ÉCOUTE FIRESTORE
  // ─────────────────────────────────────────
  listenToGameState() {
    if (Game._unsubGame) Game._unsubGame();
    Game._unsubGame = onSnapshot(doc(db, 'game', 'current'), snap => {
      if (!snap.exists()) {
        document.getElementById('lobby-game-status')?.classList.add('hidden');
        const active = document.querySelector('.screen.active')?.id;
        if (['screen-game', 'screen-game-waiting', 'screen-game-reveal'].includes(active)) {
          stopTimer();
          window.App.toast('La partie a été arrêtée.');
          window.App.backToLobby();
        }
        return;
      }
      Game._dispatch(snap.data());
    });
  },

  _dispatch(state) {
    console.log('[DISPATCH] status=', state.status, 'questionIndex=', state.questionIndex, 'L.questionIndex=', L.questionIndex);
    // Pause overlay
    document.getElementById('pause-overlay')?.classList.toggle('hidden', state.status !== 'paused');
    L.isPaused = (state.status === 'paused');

    const active = document.querySelector('.screen.active')?.id;

    switch (state.status) {
      // ── Salle d'attente
      case 'waiting':
        document.getElementById('lobby-game-status')?.classList.remove('hidden');
        document.getElementById('game-status-title').textContent = '🎮 Partie configurée !';
        document.getElementById('game-status-sub').textContent =
          `${_modeLabel(state.mode)} · ${state.questionCount} questions · ${state.timerSeconds}s/q`;
        if (active === 'screen-game-waiting') Game._updateWaitingPlayers(state);
        break;

      // ── Question
      case 'question':
        if (active !== 'screen-game') {
          if (state.questionIndex === 0) _resetSession();
          window.App.showScreen('game');
        }
        if (state.questionIndex !== L.questionIndex) {
          // Nouvelle question : render complet + démarrer timer
          L.questionIndex = state.questionIndex;
          L.answered = !!(state.answers?.[window.currentUser?.uid]);
          L.blindCorrect = !!(state.answers?.[window.currentUser?.uid]?.blindMode);
          L.scored = false;
          L.scoreThisQ = 0;
          Game._renderQuestion(state);
          _startTimer(state);
        } else {
          // Même question, quelqu'un a répondu → mettre à jour les boutons si nécessaire
          Game._onAnswerUpdate(state);
        }
        break;

      // ── Pause : timer gelé, on ne fait rien d'autre
      case 'paused':
        if (active !== 'screen-game') window.App.showScreen('game');
        break;

      // ── Révélation des résultats
      case 'reveal':
        stopTimer();
        L.questionIndex = -1; // force re-render à la prochaine question
        if (active !== 'screen-game') window.App.showScreen('game');
        Game._renderReveal(state);
        break;

      // ── Fin de partie
      case 'finished':
        stopTimer();
        Game._showEnd(state);
        break;
    }
  },

  // ─────────────────────────────────────────
  // RENDER QUESTION
  // ─────────────────────────────────────────
  _renderQuestion(state) {
    const q = state.currentQuestion;

    document.getElementById('game-q-num').textContent = state.questionIndex + 1;
    document.getElementById('game-q-total').textContent = state.questionCount;
    document.getElementById('game-current-score').textContent = L.sessionScore;

    const badge = document.getElementById('game-difficulty-badge');
    badge.textContent = window.DIFFICULTY_LABELS?.[q.difficulty] || q.difficulty;
    badge.className = `difficulty-badge ${q.difficulty}`;

    document.getElementById('game-question').textContent = q.question;
    document.getElementById('answer-feedback').classList.add('hidden');
    document.getElementById('speed-live-bar').classList.toggle('hidden', state.mode !== 'speed');

    // ── Mode aveugle
    const blindZone = document.getElementById('blind-zone');
    const answersGrid = document.getElementById('answers-grid');

    if (state.mode === 'blind') {
      blindZone.classList.remove('hidden');
      document.getElementById('blind-attempts').innerHTML = '';
      document.getElementById('blind-answer').value = '';
      answersGrid.innerHTML = '';
      answersGrid.style.display = 'none';

      if (L.answered && L.blindCorrect) {
        document.getElementById('blind-input-row').classList.add('hidden');
        document.getElementById('blind-reveal-btn').classList.add('hidden');
        document.getElementById('blind-attempts').innerHTML =
          `<div class="blind-attempt-chip correct">✅ Bonne réponse !</div>`;
      } else if (L.answered) {
        // A répondu via les choix → montrer la grille désactivée
        blindZone.classList.add('hidden');
        answersGrid.style.display = 'grid';
        _renderButtons(q.shuffledAnswers, true);
        _highlightAnswer(state);
      } else {
        document.getElementById('blind-input-row').classList.remove('hidden');
        document.getElementById('blind-reveal-btn').classList.remove('hidden');
      }
    } else {
      blindZone.classList.add('hidden');
      answersGrid.style.display = 'grid';
      _renderButtons(q.shuffledAnswers, L.answered);
      if (L.answered) _highlightAnswer(state);
    }

    if (state.mode === 'speed') _updateSpeedBar(state);
  },

  // Appelé sur les snapshots intermédiaires (même question, quelqu'un a répondu)
  _onAnswerUpdate(state) {
    if (state.mode === 'speed') _updateSpeedBar(state);
    // Si on vient de répondre et que l'ack Firestore arrive, s'assurer que les boutons
    // affichent bien la correction locale
    if (L.answered && !L._highlightDone) {
      _highlightAnswer(state);
      L._highlightDone = true;
    }
  },

  // ─────────────────────────────────────────
  // ACTIONS JOUEUR
  // ─────────────────────────────────────────
  async selectAnswer(originalIdx, btn) {
    if (L.answered) return;
    L.answered = true;
    L._highlightDone = false;

    // Désactiver tous les boutons immédiatement
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    // Feedback visuel immédiat (avant Firestore)
    const snap = await getDoc(doc(db, 'game', 'current'));
    if (!snap.exists()) return;
    const q = snap.data().currentQuestion;
    const isCorrect = originalIdx === q.correct;

    // Colorier la réponse choisie
    btn.classList.add(isCorrect ? 'correct' : 'wrong');
    // Si faux, colorier aussi la bonne réponse
    if (!isCorrect) {
      q.shuffledAnswers.forEach((ans, i) => {
        if (ans.originalIdx === q.correct) {
          document.querySelectorAll('.answer-btn')[i]?.classList.add('correct');
        }
      });
    }
    L._highlightDone = true;

    const uid = window.currentUser?.uid;
    await updateDoc(doc(db, 'game', 'current'), {
      [`answers.${uid}`]: {
        pseudo: window.currentUser.pseudo,
        originalIdx, isCorrect,
        answeredAt: serverTimestamp()  // timestamp serveur = équitable pour tous
      }
    }).catch(() => {});
  },

  async submitBlindAnswer() {
    if (L.answered) return;
    const input = document.getElementById('blind-answer').value.trim();
    if (!input) { window.App.toast('Entre une réponse !'); return; }

    const snap = await getDoc(doc(db, 'game', 'current'));
    if (!snap.exists() || snap.data().status !== 'question') return;
    const q = snap.data().currentQuestion;
    const isCorrect = _fuzzy(input, q.answers[q.correct]);

    const chip = document.createElement('div');
    chip.className = `blind-attempt-chip ${isCorrect ? 'correct' : 'wrong'}`;
    chip.textContent = isCorrect ? `✅ ${input}` : `✗ ${input}`;
    document.getElementById('blind-attempts').appendChild(chip);
    document.getElementById('blind-answer').value = '';

    if (isCorrect) {
      L.answered = true;
      L.blindCorrect = true;
      document.getElementById('blind-input-row').classList.add('hidden');
      document.getElementById('blind-reveal-btn').classList.add('hidden');
      const uid = window.currentUser?.uid;
      await updateDoc(doc(db, 'game', 'current'), {
        [`answers.${uid}`]: {
          pseudo: window.currentUser.pseudo,
          originalIdx: q.correct,
          isCorrect: true, blindMode: true,
          answeredAt: serverTimestamp()
        }
      }).catch(() => {});
    }
  },

  revealChoices() {
    if (L.answered) return;
    document.getElementById('blind-input-row').classList.add('hidden');
    document.getElementById('blind-reveal-btn').classList.add('hidden');
    getDoc(doc(db, 'game', 'current')).then(snap => {
      if (!snap.exists()) return;
      const grid = document.getElementById('answers-grid');
      grid.style.display = 'grid';
      document.getElementById('blind-zone').classList.add('hidden');
      _renderButtons(snap.data().currentQuestion.shuffledAnswers, false);
    });
  },

  // ─────────────────────────────────────────
  // REVEAL — 3 phases enchaînées côté client
  //   Phase 1 : résultats joueurs (immediate)
  //   Phase 2 : classement animé (après 2s)
  //   Phase 3 : décompte 3s → question suivante (après 2+3s)
  // ─────────────────────────────────────────
  _renderReveal(state) {
    const q = state.currentQuestion;
    const myAnswer = state.answers?.[window.currentUser?.uid];
    const uid = window.currentUser?.uid;

    // ── Calculer les points gagnés
    let points = 0, isCorrect = false;
    if (myAnswer?.isCorrect) {
      isCorrect = true;
      const base = window.DIFFICULTY_POINTS?.[q.difficulty] || 1;
      if (state.mode === 'blind' && myAnswer.blindMode) points = base * 4;
      else if (state.mode === 'speed') {
        const ranked = Object.entries(state.answers || {})
          .filter(([, v]) => v.isCorrect)
          .sort((a, b) => _tsToMs(a[1].answeredAt) - _tsToMs(b[1].answeredAt));
        const r = ranked.findIndex(([id]) => id === uid);
        points = r === 0 ? 5 : r === 1 ? 4 : r === 2 ? 3 : 0;
      } else points = base;
    }

    // ── Mettre à jour le score session (une seule fois)
    if (!L.scored) {
      L.scored = true;
      L.scoreThisQ = points;
      if (isCorrect) { L.sessionScore += points; L.sessionCorrect++; }
      L.sessionTotal++;
      // Sauvegarder sur Firestore
      if (uid && !window.currentUser?.isAdmin && points > 0) {
        updateDoc(doc(db, 'players', uid), {
          score: increment(points), correctAnswers: increment(1)
        }).catch(() => {});
        if (window.currentUser?.teamId) {
          updateDoc(doc(db, 'teams', window.currentUser.teamId), {
            score: increment(points)
          }).catch(() => {});
        }
      }
    }

    document.getElementById('game-current-score').textContent = L.sessionScore;

    // ════════════════════
    // PHASE 1 : Résultats
    // ════════════════════
    Game._showPhase1Results(state, q, myAnswer, isCorrect, points);
  },

  _showPhase1Results(state, q, myAnswer, isCorrect, points) {
    window.App.showScreen('game-reveal');

    // Toujours réinitialiser les 3 phases
    document.getElementById('reveal-phase1').classList.remove('hidden');
    document.getElementById('reveal-phase2').classList.add('hidden');
    document.getElementById('reveal-phase3').classList.add('hidden');

    // Bonne réponse
    document.getElementById('reveal-correct-answer').textContent = q.answers[q.correct];
    document.getElementById('reveal-focus').textContent = q.focus || '';

    // Ma réponse
    const myIcon = isCorrect ? '✅' : myAnswer ? '❌' : '⏱️';
    const myText = isCorrect
      ? `+${points} pt${points > 1 ? 's' : ''}`
      : myAnswer ? 'Raté' : 'Pas répondu';
    document.getElementById('reveal-my-result-icon').textContent = myIcon;
    document.getElementById('reveal-my-result-text').textContent = myText;

    // Liste des réponses de tous les joueurs
    const allAnswers = Object.entries(state.answers || {});
    const readyPlayers = Object.entries(state.readyPlayers || {}).filter(([, p]) => p !== null);
    const answeredUids = new Set(allAnswers.map(([id]) => id));
    const noAnswer = readyPlayers.filter(([id]) => !answeredUids.has(id));

    const rows = [
      ...allAnswers.map(([, a]) => ({
        pseudo: a.pseudo,
        icon: a.isCorrect ? '✅' : '❌',
        pts: a.isCorrect ? _calcPoints(state, q, a) : 0
      })),
      ...noAnswer.map(([, player]) => ({
        pseudo: typeof player === 'object' ? player.pseudo : player,
        icon: '⏱️', pts: 0
      }))
    ].sort((a, b) => b.pts - a.pts);

    document.getElementById('reveal-players-list').innerHTML = rows.map(r => `
      <div class="reveal-player-row">
        <span class="reveal-player-icon">${r.icon}</span>
        <span class="reveal-player-name">${r.pseudo}</span>
        <span class="reveal-player-pts">${r.pts > 0 ? `+${r.pts}` : ''}</span>
      </div>
    `).join('');

    // Phase 2 après 2.5s
    setTimeout(() => Game._showPhase2Leaderboard(state), 2500);
  },

  async _showPhase2Leaderboard(state) {
    // Charger les scores actuels depuis Firestore
    const pSnap = await getDocs(collection(db, 'players'));
    const activeUids = Object.entries(state.readyPlayers || {})
      .filter(([, p]) => p !== null).map(([id]) => id);
    const players = pSnap.docs.map(d => ({ uid: d.id, ...d.data() }))
      .filter(p => activeUids.includes(p.uid))
      .sort((a, b) => b.score - a.score);

    const prevRanks = state.prevRanks || {}; // Rang avant cette question

    document.getElementById('reveal-phase1').classList.add('hidden');
    document.getElementById('reveal-phase2').classList.remove('hidden');

    const list = document.getElementById('reveal-leaderboard');
    list.innerHTML = players.map((p, i) => {
      const prev = prevRanks[p.uid];
      const moved = prev !== undefined ? prev - i : 0; // positif = monté
      const arrow = moved > 0 ? '↑' : moved < 0 ? '↓' : '';
      const arrowColor = moved > 0 ? 'var(--success)' : moved < 0 ? 'var(--error)' : 'transparent';
      const av = (window.AVATARS || []).find(a => a.id === p.avatarId);
      const isMe = window.currentUser?.uid === p.uid;
      return `
        <div class="reveal-lb-row ${isMe ? 'me' : ''}" style="animation-delay:${i * 0.08}s">
          <span class="reveal-lb-rank">${i + 1}</span>
          <div class="reveal-lb-avatar">${av ? av.svg : ''}</div>
          <span class="reveal-lb-name">${p.pseudo}</span>
          <span class="reveal-lb-arrow" style="color:${arrowColor}">${arrow}</span>
          <span class="reveal-lb-score">${p.score}</span>
        </div>`;
    }).join('');

    // Phase 3 après 3s
    setTimeout(() => Game._showPhase3Countdown(state), 3000);
  },

  _showPhase3Countdown(state) {
    document.getElementById('reveal-phase1').classList.add('hidden');
    document.getElementById('reveal-phase2').classList.add('hidden');
    document.getElementById('reveal-phase3').classList.remove('hidden');

    const isLast = state.questionIndex + 1 >= state.questionCount;
    document.getElementById('reveal-next-label').textContent =
      isLast ? 'Fin de la partie !' : `Question ${state.questionIndex + 2} / ${state.questionCount}`;

    let count = 3;
    document.getElementById('reveal-countdown').textContent = count;
    const iv = setInterval(() => {
      count--;
      document.getElementById('reveal-countdown').textContent = count;
      if (count <= 0) clearInterval(iv);
    }, 1000);
  },

  // ─────────────────────────────────────────
  // FIN DE PARTIE
  // ─────────────────────────────────────────
  async _showEnd(state) {
    const uid = window.currentUser?.uid;
    if (uid && !window.currentUser?.isAdmin) {
      await updateDoc(doc(db, 'players', uid), { gamesPlayed: increment(1) }).catch(() => {});
    }
    document.getElementById('end-score').textContent = L.sessionScore;
    const pct = L.sessionTotal ? Math.round(L.sessionCorrect / L.sessionTotal * 100) : 0;
    document.getElementById('end-stats').innerHTML = `
      ✅ ${L.sessionCorrect} bonne${L.sessionCorrect > 1 ? 's' : ''} réponse${L.sessionCorrect > 1 ? 's' : ''}<br>
      ❌ ${L.sessionTotal - L.sessionCorrect} erreur${L.sessionTotal - L.sessionCorrect !== 1 ? 's' : ''}<br>
      📊 ${pct}% de réussite
    `;
    const sorted = Object.entries(state.finalScores || {})
      .sort((a, b) => b[1].score - a[1].score).slice(0, 3);
    const icons = ['🥇', '🥈', '🥉'];
    document.getElementById('end-podium').innerHTML = sorted.length ? `
      <div style="font-family:'Bangers',cursive;font-size:22px;letter-spacing:2px;color:var(--accent);margin-bottom:12px">Podium</div>
      ${sorted.map(([, d], i) => `
        <div class="podium-item" style="${i === 0 ? 'border-color:#ffd700' : ''}">
          <span class="podium-rank">${icons[i]}</span>
          <span class="podium-name">${d.pseudo}</span>
          <span class="podium-score">${d.score}</span>
        </div>`).join('')}
    ` : '';
    L.sessionScore = 0; L.sessionCorrect = 0; L.sessionTotal = 0;
    window.App.showScreen('game-end');
  },

  // ─────────────────────────────────────────
  // WAITING SCREEN
  // ─────────────────────────────────────────
  joinCurrentGame() {
    window.App.showScreen('game-waiting');
    getDoc(doc(db, 'game', 'current')).then(snap => {
      if (snap.exists()) Game._updateWaitingPlayers(snap.data());
    });
    const uid = window.currentUser?.uid;
    if (uid) updateDoc(doc(db, 'game', 'current'), {
      [`readyPlayers.${uid}`]: { pseudo: window.currentUser.pseudo, avatarId: window.currentUser.avatarId }
    }).catch(() => {});
  },

  _updateWaitingPlayers(state) {
    const ready = Object.entries(state.readyPlayers || {}).filter(([, p]) => p !== null);
    document.getElementById('waiting-info').innerHTML = `
      <strong>Mode :</strong> ${_modeLabel(state.mode)}<br>
      <strong>Questions :</strong> ${state.questionCount}<br>
      <strong>Timer :</strong> ${state.timerSeconds}s par question
    `;
    document.getElementById('waiting-players').innerHTML = ready.map(([id, player]) => {
      // Compatibilité : player peut être un objet {pseudo, avatarId} ou une string (ancienne version)
      const pseudo = typeof player === 'object' ? player.pseudo : player;
      const avatarId = typeof player === 'object' ? player.avatarId : null;
      const isMe = window.currentUser?.uid === id;
      const av = (window.AVATARS || []).find(a => a.id === avatarId);
      return `<div class="waiting-player-chip">
        <div class="chip-avatar">${av ? av.svg : ''}</div>
        <span>${pseudo}${isMe ? ' (toi)' : ''}</span>
      </div>`;
    }).join('');
  },

  leaveGame() {
    stopTimer();
    L.questionIndex = -1;
    const uid = window.currentUser?.uid;
    if (uid) updateDoc(doc(db, 'game', 'current'), {
      [`readyPlayers.${uid}`]: null
    }).catch(() => {});
    window.App.backToLobby();
  },

  requestLeave() {
    window.Modal.show('Quitter la partie ?', '<p>Tu perdras les points de la partie en cours.</p>', [
      { label: 'Rester', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: 'Quitter', class: 'btn btn-danger', onclick: 'Game.leaveGame(); Modal.close();' }
    ]);
  },

  _modeLabel: m => _modeLabel(m)
};

// ══════════════════════════════════════════════════════
// FONCTIONS INTERNES (hors export)
// ══════════════════════════════════════════════════════

function _resetSession() {
  L.sessionScore = 0; L.sessionCorrect = 0; L.sessionTotal = 0;
}

function _modeLabel(mode) {
  return mode === 'normal' ? '🎯 Normal' : mode === 'blind' ? '🙈 Aveugle' : '⚡ Rapidité';
}

function _renderButtons(shuffledAnswers, disabled) {
  const letters = ['A', 'B', 'C', 'D'];
  const grid = document.getElementById('answers-grid');
  grid.innerHTML = '';
  shuffledAnswers.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.disabled = disabled;
    btn.innerHTML = `<span class="answer-letter">${letters[i]}</span>${ans.text}`;
    btn.onclick = () => Game.selectAnswer(ans.originalIdx, btn);
    grid.appendChild(btn);
  });
}

// Colorie les boutons selon la réponse du joueur (sans redraw complet)
function _highlightAnswer(state) {
  const q = state.currentQuestion;
  const myAnswer = state.answers?.[window.currentUser?.uid];
  if (!myAnswer) return;
  const btns = document.querySelectorAll('.answer-btn');
  btns.forEach(b => b.disabled = true);
  q.shuffledAnswers.forEach((ans, i) => {
    if (ans.originalIdx === q.correct) btns[i]?.classList.add('correct');
    else if (ans.originalIdx === myAnswer.originalIdx && !myAnswer.isCorrect) btns[i]?.classList.add('wrong');
  });
}

function _updateSpeedBar(state) {
  const ranked = Object.entries(state.answers || {})
    .filter(([, v]) => v.isCorrect)
    .sort((a, b) => _tsToMs(a[1].answeredAt) - _tsToMs(b[1].answeredAt))
  const icons = ['🥇', '🥈', '🥉'];
  document.getElementById('speed-live-list').innerHTML =
    ranked.map(([, d], i) =>
      `<div class="speed-winner-row"><span class="speed-pos">${icons[i]}</span><span>${d.pseudo}</span></div>`
    ).join('') || '<div style="color:var(--text3);font-size:13px">Personne encore…</div>';
}

// Convertit un answeredAt (Timestamp Firestore ou ms number) en ms comparable
function _tsToMs(ts) {
  if (!ts) return Infinity;
  if (typeof ts === 'number') return ts;
  if (typeof ts.toMillis === 'function') return ts.toMillis(); // Firestore Timestamp
  if (ts.seconds !== undefined) return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return Infinity;
}

function _calcPoints(state, q, answer) {
  if (!answer.isCorrect) return 0;
  const base = window.DIFFICULTY_POINTS?.[q.difficulty] || 1;
  if (state.mode === 'blind' && answer.blindMode) return base * 4;
  if (state.mode === 'speed') {
    const ranked = Object.entries(state.answers || {})
      .filter(([, v]) => v.isCorrect)
      .sort((a, b) => _tsToMs(a[1].answeredAt) - _tsToMs(b[1].answeredAt));
    const r = ranked.findIndex(([, v]) => v === answer);
    return r === 0 ? 5 : r === 1 ? 4 : r === 2 ? 3 : 0;
  }
  return base;
}

function _fuzzy(input, correct) {
  const n = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const a = n(input), b = n(correct);
  if (a === b || b.includes(a) || a.includes(b)) return true;
  if (b.split(/\s+/).filter(w => w.length >= 3).some(w => a === w)) return true;
  const m = a.length, k = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: k + 1 }, (_, j) => i || j));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= k; j++)
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][k] <= 2;
}

// ── Timer autonome — tourne toujours, ne dépend pas des snapshots
function _startTimer(state) {
  stopTimer();
  const arcEl = document.getElementById('timer-arc');
  const timerEl = document.getElementById('game-timer');
  const wrap = document.querySelector('.game-timer-wrap');
  if (!arcEl || !timerEl) {
    console.error('[TIMER] Elements not found', { arcEl, timerEl });
    return;
  }

  arcEl.style.strokeDasharray = CIRC;
  const totalSecs = state.timerSeconds;
  const alreadyElapsedMs = state.questionStartedAt ? (Date.now() - state.questionStartedAt) : 0;
  let remaining = Math.max(0, totalSecs - Math.floor(alreadyElapsedMs / 1000));

  console.log('[TIMER] Starting', { totalSecs, alreadyElapsedMs, remaining, questionIndex: state.questionIndex });

  const tick = () => {
    if (L.isPaused) {
      console.log('[TIMER] Paused, waiting...');
      L.timerInterval = setTimeout(tick, 200);
      return;
    }

    console.log('[TIMER] tick remaining=', remaining);

    const pct = remaining / totalSecs;
    arcEl.style.strokeDashoffset = CIRC * (1 - pct);
    timerEl.textContent = remaining;

    if (remaining <= 10) {
      arcEl.setAttribute('class', 'timer-arc danger');
      timerEl.style.color = '#ff4d6d';
      wrap?.classList.add('danger');
    } else if (pct <= 0.5) {
      arcEl.setAttribute('class', 'timer-arc warning');
      timerEl.style.color = '';
      wrap?.classList.remove('danger');
    } else {
      arcEl.setAttribute('class', 'timer-arc');
      timerEl.style.color = '';
      wrap?.classList.remove('danger');
    }

    if (remaining <= 0) {
      console.log('[TIMER] Reached 0, stopping');
      arcEl.style.strokeDashoffset = CIRC;
      timerEl.textContent = '0';
      timerEl.style.color = '';
      wrap?.classList.remove('danger');
      return;
    }

    remaining--;
    L.timerInterval = setTimeout(tick, 1000);
  };

  tick();
}

window.Game = Game;