// ═══════════════════════════════════════════
// GAME ENGINE v4 — Basé sur les salons
// Chemins Firestore : rooms/{code}/game/current
//                     rooms/{code}/players/{uid}
//                     rooms/{code}/teams/{id}
// ═══════════════════════════════════════════
import { db } from './firebase-config.js?v=1';
import {
  doc, updateDoc, getDoc, setDoc, getDocs,
  collection, onSnapshot, increment, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const CIRC = 2 * Math.PI * 22;

// ── État local (réinitialisé à chaque question)
let L = {
  sessionScore: 0, sessionCorrect: 0, sessionTotal: 0,
  questionIndex: -1,
  answered: false, blindCorrect: false,
  scored: false, scoreThisQ: 0,
  timerInterval: null, isPaused: false,
  _highlightDone: false
};

function stopTimer() {
  if (L.timerInterval) { clearTimeout(L.timerInterval); clearInterval(L.timerInterval); L.timerInterval = null; }
}

// ── Convertit un Timestamp Firestore en ms
function _tsToMs(ts) {
  if (!ts) return Infinity;
  if (typeof ts === 'number') return ts;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (ts.seconds !== undefined) return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return Infinity;
}

// ── Chemin Firestore selon session courante
function _gameRef() {
  return doc(db, 'rooms', window.session.roomCode, 'game', 'current');
}
function _playerRef(uid) {
  return doc(db, 'rooms', window.session.roomCode, 'players', uid || window.session.uid);
}
function _playersCol() {
  return collection(db, 'rooms', window.session.roomCode, 'players');
}
function _teamsCol() {
  return collection(db, 'rooms', window.session.roomCode, 'teams');
}

export const Game = {
  _unsub: null,

  // ─────────────────────────────────────────
  // HOST : LANCER LA PARTIE
  // ─────────────────────────────────────────
  async hostStartGame() {
    const { roomCode } = window.session;
    const rounds = window.Room._rounds || [{ mode:'normal', count:10, theme:'all', difficulty:'all', timer:20 }];

    window.App.toast('Préparation de la partie…');

    // Charger l'historique des questions déjà posées
    let usedIds = [];
    try {
      const h = await getDoc(doc(db, 'game', 'history'));
      if (h.exists()) usedIds = h.data().usedIds || [];
    } catch(e) {}

    // Charger les questions depuis Firestore, avec fallback sur data.js
    let allQuestions = [];
    try {
      const snap = await getDocs(collection(db, 'questions'));
      allQuestions = snap.docs.map(d => ({ ...d.data(), _firestoreId: d.id }));
    } catch(e) {}

    // Fallback sur les questions locales si Firestore vide ou inaccessible
    if (!allQuestions.length) {
      allQuestions = window.QUESTIONS || [];
      if (allQuestions.length) {
        window.App.toast('Utilisation des questions locales (Firestore vide)');
      }
    }

    if (!allQuestions.length) {
      window.App.toast('Aucune question disponible !'); return;
    }

    // Construire les questions pour chaque manche
    const builtRounds = rounds.map(r => {
      let pool = [...allQuestions];
      if (r.theme !== 'all') pool = pool.filter(q => q.theme === r.theme);
      if (r.difficulty !== 'all') pool = pool.filter(q => q.difficulty === r.difficulty);
      const fresh = pool.filter(q => !usedIds.includes(q.id) && !usedIds.includes(q._firestoreId));
      const effective = fresh.length > 0 ? fresh : pool;
      if (fresh.length === 0 && pool.length > 0) window.App.toast('Pool réinitialisé pour ce thème !');

      const orderMap = { debutant:1, connaisseur:2, otaku:3 };
      effective.sort((a,b) => (orderMap[a.difficulty]-orderMap[b.difficulty]) || (Math.random()-.5));
      const count = r.count === 0 ? effective.length : Math.min(r.count, effective.length);
      const questions = effective.slice(0, count).map(q => {
        const sh = q.answers.map((text,idx) => ({ text, originalIdx:idx }));
        for (let i=sh.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [sh[i],sh[j]]=[sh[j],sh[i]]; }
        // Utiliser _firestoreId comme identifiant pour l'historique
        return { ...q, id: q._firestoreId || q.id, shuffledAnswers: sh };
      });
      questions.forEach(q => { if (!usedIds.includes(q.id)) usedIds.push(q.id); });
      return { ...r, questions, questionCount: questions.length };
    });

    if (builtRounds.every(r => r.questions.length === 0)) {
      window.App.toast('Aucune question disponible pour ces filtres !'); return;
    }

    await updateDoc(doc(db, 'rooms', roomCode), { status: 'playing' });

    await setDoc(_gameRef(), {
      status: 'starting',
      rounds: builtRounds,
      currentRound: 0,
      mode: builtRounds[0].mode,
      timerSeconds: builtRounds[0].timer,
      questionCount: builtRounds[0].questionCount,
      questions: builtRounds[0].questions,
      questionIndex: -1, currentQuestion: null,
      answers: {}, paused: false, createdAt: Date.now()
    });

    Game._hostNextQuestion(0);
  },

  _hostTimer: null,
  _hostAnswerWatcher: null,  // unsubscribe pour compter les réponses

  async _hostNextQuestion(idx) {
    if (Game._hostTimer) clearTimeout(Game._hostTimer);
    if (Game._hostAnswerWatcher) { Game._hostAnswerWatcher(); Game._hostAnswerWatcher = null; }

    const snap = await getDoc(_gameRef());
    const state = snap.data();
    const q = state.questions[idx];

    // Sauvegarder dans l'historique
    try {
      const h = await getDoc(doc(db, 'game', 'history'));
      const existing = h.exists() ? (h.data().usedIds||[]) : [];
      if (!existing.includes(q.id)) {
        await setDoc(doc(db, 'game', 'history'), { usedIds:[...existing, q.id], updatedAt:Date.now() });
      }
    } catch(e) {}

    const startedAt = Date.now();
    await updateDoc(_gameRef(), {
      status: 'question', questionIndex: idx,
      currentQuestion: q, answers: {},
      questionStartedAt: startedAt, paused: false,
      timerAcceleratedAt: null  // reset explicite à chaque question
    });

    const timerMs = state.timerSeconds * 1000;
    Game._hostTimer = setTimeout(() => Game._hostReveal(), timerMs);

    // Surveiller les réponses pour accélérer si tout le monde a répondu
    const pSnap = await getDocs(_playersCol());
    const totalPlayers = pSnap.size;
    let accelerated = false;  // flag local — évite les re-entrées après l'accélération

    Game._hostAnswerWatcher = onSnapshot(_gameRef(), async watchSnap => {
      if (!watchSnap.exists() || accelerated) return;
      const ws = watchSnap.data();
      if (ws.status !== 'question' || ws.questionIndex !== idx) return;

      const answerCount = Object.keys(ws.answers || {}).length;
      if (answerCount >= totalPlayers) {
        const elapsed = Date.now() - startedAt;
        const remaining = timerMs - elapsed;
        if (remaining > 3000) {
          accelerated = true;  // bloquer toute ré-entrée immédiatement
          if (Game._hostTimer) clearTimeout(Game._hostTimer);
          if (Game._hostAnswerWatcher) { Game._hostAnswerWatcher(); Game._hostAnswerWatcher = null; }
          await updateDoc(_gameRef(), { timerAcceleratedAt: Date.now() });
          Game._hostTimer = setTimeout(() => Game._hostReveal(), 3000);
        }
      }
    });
  },

  async _hostReveal() {
    if (Game._hostTimer) clearTimeout(Game._hostTimer);
    if (Game._hostAnswerWatcher) { Game._hostAnswerWatcher(); Game._hostAnswerWatcher = null; }

    const snap = await getDoc(_gameRef());
    const state = snap.data();
    const pSnap = await getDocs(_playersCol());
    const players = pSnap.docs.map(d => d.data()).sort((a,b) => b.score - a.score);
    const prevRanks = {};
    players.forEach((p,i) => { prevRanks[p.uid] = i; });

    await updateDoc(_gameRef(), { status:'reveal', prevRanks, nextAt: Date.now()+8500 });
    Game._hostTimer = setTimeout(() => Game.hostAdvance(), 8500);
  },

  async hostAdvance() {
    if (Game._hostTimer) clearTimeout(Game._hostTimer);
    if (Game._hostAnswerWatcher) { Game._hostAnswerWatcher(); Game._hostAnswerWatcher = null; }

    const snap = await getDoc(_gameRef());
    const state = snap.data();
    const nextIdx = (state.questionIndex||0) + 1;

    if (nextIdx >= state.questionCount) {
      // Fin des questions de cette manche → vérifier s'il y a une manche suivante
      const rounds = state.rounds || [];
      const currentRound = state.currentRound || 0;
      const nextRound = currentRound + 1;

      if (nextRound < rounds.length) {
        // Lancer la manche suivante
        const r = rounds[nextRound];
        window.App.toast(`Manche ${nextRound+1} / ${rounds.length} — ${r.mode === 'normal' ? '🎯 Normal' : r.mode === 'blind' ? '🙈 Aveugle' : '⚡ Vitesse'}`);
        await updateDoc(_gameRef(), {
          currentRound: nextRound,
          mode: r.mode,
          timerSeconds: r.timer,
          questionCount: r.questionCount,
          questions: r.questions,
          questionIndex: -1, currentQuestion: null, answers: {}
        });
        Game._hostTimer = setTimeout(() => Game._hostNextQuestion(0), 2000);
      } else {
        await Game._hostFinish(state);
      }
    } else {
      Game._hostNextQuestion(nextIdx);
    }
  },

  async hostForceReveal() {
    if (Game._hostTimer) clearTimeout(Game._hostTimer);
    await Game._hostReveal();
  },

  async hostPause() {
    if (Game._hostTimer) clearTimeout(Game._hostTimer);
    const snap = await getDoc(_gameRef());
    const state = snap.data();
    const isPaused = state.status === 'paused';

    if (isPaused) {
      // Reprendre
      await updateDoc(_gameRef(), {
        status: 'question',
        questionStartedAt: Date.now() - (state.pausedElapsed || 0)
      });
      const remaining = (state.timerSeconds - Math.floor((state.pausedElapsed || 0) / 1000)) * 1000;
      Game._hostTimer = setTimeout(() => Game._hostReveal(), Math.max(0, remaining));
      document.getElementById('btn-pause')?.querySelector ? null : null;
      window.App.toast('Reprise !');
    } else {
      const elapsed = Date.now() - state.questionStartedAt;
      await updateDoc(_gameRef(), { status: 'paused', pausedElapsed: elapsed });
      window.App.toast('Pause');
    }
  },

  async _hostFinish(state) {
    if (Game._hostAnswerWatcher) { Game._hostAnswerWatcher(); Game._hostAnswerWatcher = null; }
    const pSnap = await getDocs(_playersCol());
    const finalScores = {};
    pSnap.docs.forEach(d => {
      const p = d.data();
      finalScores[p.uid] = { pseudo: p.pseudo, score: p.score, avatarId: p.avatarId };
    });
    await updateDoc(_gameRef(), { status: 'finished', finalScores });
    // Salon repasse en lobby (pas de reset scores — accumulation)
    await updateDoc(doc(db, 'rooms', window.session.roomCode), { status: 'lobby' });
  },

  // ─────────────────────────────────────────
  // ÉCOUTE FIRESTORE (tous les joueurs)
  // ─────────────────────────────────────────
  startListening() {
    if (Game._unsub) Game._unsub();
    Game._unsub = onSnapshot(_gameRef(), snap => {
      if (!snap.exists()) return;
      Game._handleGameState(snap.data());
    });
  },

  _handleGameState(state) {
    // Pause overlay
    const isPausing = state.status === 'paused';
    document.getElementById('pause-overlay')?.classList.toggle('hidden', !isPausing);
    // Bouton reprendre dans l'overlay — host uniquement
    const resumeBtn = document.getElementById('pause-resume-btn');
    if (resumeBtn) resumeBtn.classList.toggle('hidden', !(isPausing && window.session.isHost));
    L.isPaused = isPausing;

    // Host game bar
    if (window.session.isHost) {
      const bar = document.getElementById('host-game-bar');
      if (state.status === 'question' || state.status === 'paused') {
        bar?.classList.remove('hidden');
        const readyCount = Object.values(state.readyPlayers || {}).filter(Boolean).length ||
          Object.keys(state.answers || {}).length;
        // Compter les joueurs
        const ansCount = Object.keys(state.answers || {}).length;
        document.getElementById('host-answer-count').textContent = `${ansCount} réponses`;
        // Bouton pause
        const btnPause = document.getElementById('btn-pause');
        if (btnPause) btnPause.textContent = state.status === 'paused' ? '▶' : '⏸';
      } else {
        bar?.classList.add('hidden');
      }
    }

    const active = document.querySelector('.screen.active')?.id;

    switch (state.status) {
      case 'starting':
        L.sessionScore = 0; L.sessionCorrect = 0; L.sessionTotal = 0;
        L._leftGame = false;  // reset au démarrage d'une nouvelle partie
        // Cacher le bouton rejoindre si visible
        document.getElementById('rejoin-game-btn')?.classList.add('hidden');
        break;

      case 'question':
        if (L._leftGame) break;  // joueur a quitté volontairement → pas de redirection
        if (active !== 'screen-game') App.showScreen('game');
        if (state.questionIndex !== L.questionIndex) {
          L.questionIndex = state.questionIndex;
          L.answered = !!(state.answers?.[window.session.uid]);
          L.blindCorrect = !!(state.answers?.[window.session.uid]?.blindMode);
          L.scored = false; L.scoreThisQ = 0;
          L._highlightDone = false;
          L._timerAccelerated = false;  // reset explicite
          Game._renderQuestion(state);
          _startTimer(state);
        } else {
          // Accélération : timerAcceleratedAt non-null et pas encore appliqué
          if (state.timerAcceleratedAt && !L._timerAccelerated) {
            L._timerAccelerated = true;
            _accelerateTimer(state.timerAcceleratedAt);
          }
          Game._onAnswerUpdate(state);
        }
        break;

      case 'paused':
        if (L._leftGame) break;
        if (active !== 'screen-game') App.showScreen('game');
        break;

      case 'reveal':
        if (L._leftGame) break;
        stopTimer();
        L.questionIndex = -1;
        if (active !== 'screen-game-reveal') {
          App.showScreen('game-reveal');
          Game._renderReveal(state);
        }
        // Host controls in reveal
        document.getElementById('reveal-host-controls')?.classList.toggle('hidden', !window.session.isHost);
        break;

      case 'host_left':
        stopTimer();
        if (window.Game?._hostTimer) clearTimeout(window.Game._hostTimer);
        window.App.toast("L'host a arrêté la partie.");
        L._leftGame = false;
        L.questionIndex = -1;
        document.getElementById('rejoin-game-btn')?.classList.add('hidden');
        App.showScreen('lobby');
        break;

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

  _onAnswerUpdate(state) {
    if (state.mode === 'speed') _updateSpeedBar(state);
    const ansCount = Object.keys(state.answers || {}).length;
    if (window.session.isHost) {
      document.getElementById('host-answer-count').textContent = `${ansCount} réponses`;
    }
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
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    const snap = await getDoc(_gameRef());
    if (!snap.exists()) return;
    const q = snap.data().currentQuestion;
    const isCorrect = originalIdx === q.correct;

    btn.classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) {
      q.shuffledAnswers.forEach((ans, i) => {
        if (ans.originalIdx === q.correct) {
          document.querySelectorAll('.answer-btn')[i]?.classList.add('correct');
        }
      });
    }
    L._highlightDone = true;

    await updateDoc(_gameRef(), {
      [`answers.${window.session.uid}`]: {
        pseudo: window.session.pseudo,
        originalIdx, isCorrect,
        answeredAt: serverTimestamp()
      }
    }).catch(() => {});
  },

  async submitBlindAnswer() {
    if (L.answered) return;
    const input = document.getElementById('blind-answer').value.trim();
    if (!input) { window.App.toast('Entre une réponse !'); return; }

    const snap = await getDoc(_gameRef());
    if (!snap.exists() || snap.data().status !== 'question') return;
    const q = snap.data().currentQuestion;
    const isCorrect = _fuzzy(input, q.answers[q.correct]);

    const chip = document.createElement('div');
    chip.className = `blind-attempt-chip ${isCorrect ? 'correct' : 'wrong'}`;
    chip.textContent = isCorrect ? `✅ ${input}` : `✗ ${input}`;
    document.getElementById('blind-attempts').appendChild(chip);
    document.getElementById('blind-answer').value = '';

    if (isCorrect) {
      L.answered = true; L.blindCorrect = true;
      document.getElementById('blind-input-row').classList.add('hidden');
      document.getElementById('blind-reveal-btn').classList.add('hidden');
      await updateDoc(_gameRef(), {
        [`answers.${window.session.uid}`]: {
          pseudo: window.session.pseudo,
          originalIdx: q.correct, isCorrect: true, blindMode: true,
          answeredAt: serverTimestamp()
        }
      }).catch(() => {});
    }
  },

  revealChoices() {
    if (L.answered) return;
    document.getElementById('blind-input-row').classList.add('hidden');
    document.getElementById('blind-reveal-btn').classList.add('hidden');
    getDoc(_gameRef()).then(snap => {
      if (!snap.exists()) return;
      const grid = document.getElementById('answers-grid');
      grid.style.display = 'grid';
      document.getElementById('blind-zone').classList.add('hidden');
      _renderButtons(snap.data().currentQuestion.shuffledAnswers, false);
    });
  },

  // ─────────────────────────────────────────
  // REVEAL — 3 phases
  // ─────────────────────────────────────────
  _renderReveal(state) {
    const q = state.currentQuestion;
    const uid = window.session.uid;
    const myAnswer = state.answers?.[uid];

    // Calcul points
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

    if (!L.scored) {
      L.scored = true; L.scoreThisQ = points;
      if (isCorrect) { L.sessionScore += points; L.sessionCorrect++; }
      L.sessionTotal++;
      if (points > 0) {
        updateDoc(_playerRef(), { score: increment(points) }).catch(() => {});
        if (window.session.teamId) {
          updateDoc(doc(db, 'rooms', window.session.roomCode, 'teams', window.session.teamId), {
            score: increment(points)
          }).catch(() => {});
        }
      }
    }

    document.getElementById('game-current-score').textContent = L.sessionScore;
    Game._showPhase1(state, q, myAnswer, isCorrect, points);
  },

  _showPhase1(state, q, myAnswer, isCorrect, points) {
    document.getElementById('reveal-phase1').classList.remove('hidden');
    document.getElementById('reveal-phase2').classList.add('hidden');
    document.getElementById('reveal-phase3').classList.add('hidden');

    document.getElementById('reveal-correct-answer').textContent = q.answers[q.correct];
    document.getElementById('reveal-focus').textContent = q.focus || '';

    const myIcon = isCorrect ? '✅' : myAnswer ? '❌' : '⏱️';
    const myText = isCorrect ? `+${points} pt${points > 1 ? 's' : ''}` : myAnswer ? 'Raté' : 'Pas répondu';
    document.getElementById('reveal-my-result-icon').textContent = myIcon;
    document.getElementById('reveal-my-result-text').textContent = myText;

    // Détail pour le host
    if (window.session.isHost) {
      const hostDiv = document.getElementById('reveal-host-answers');
      hostDiv.classList.remove('hidden');
      const rows = Object.entries(state.answers || {}).map(([, a]) => {
        const chosen = q.shuffledAnswers?.find(s => s.originalIdx === a.originalIdx)?.text || '?';
        return `<div class="reveal-host-answer-row">
          ${a.isCorrect ? '✅' : '❌'}
          <span style="flex:1;font-weight:800">${a.pseudo}</span>
          <span style="color:${a.isCorrect ? 'var(--success)' : 'var(--error)'};font-size:12px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${chosen}</span>
        </div>`;
      });
      hostDiv.innerHTML = `<div style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Réponses des joueurs</div>${rows.join('')}`;
    }

    // Liste des résultats
    const allAnswers = Object.entries(state.answers || {});
    const rows = allAnswers.map(([, a]) => ({
      pseudo: a.pseudo,
      icon: a.isCorrect ? '✅' : '❌',
      pts: a.isCorrect ? _calcPoints(state, q, a) : 0
    })).sort((a, b) => b.pts - a.pts);

    document.getElementById('reveal-players-list').innerHTML = rows.map(r =>
      `<div class="reveal-player-row">
        <span class="reveal-player-icon">${r.icon}</span>
        <span class="reveal-player-name">${r.pseudo}</span>
        <span class="reveal-player-pts">${r.pts > 0 ? `+${r.pts}` : ''}</span>
      </div>`
    ).join('');

    setTimeout(() => Game._showPhase2(state), 2500);
  },

  async _showPhase2(state) {
    const pSnap = await getDocs(_playersCol());
    const players = pSnap.docs.map(d => d.data())
      .sort((a, b) => b.score - a.score);
    const prevRanks = state.prevRanks || {};

    document.getElementById('reveal-phase1').classList.add('hidden');
    document.getElementById('reveal-phase2').classList.remove('hidden');
    document.getElementById('reveal-phase3').classList.add('hidden');

    document.getElementById('reveal-leaderboard').innerHTML = players.map((p, i) => {
      const prev = prevRanks[p.uid];
      const moved = prev !== undefined ? prev - i : 0;
      const arrow = moved > 0 ? '↑' : moved < 0 ? '↓' : '';
      const arrowColor = moved > 0 ? 'var(--success)' : moved < 0 ? 'var(--error)' : 'transparent';
      const av = (window.AVATARS || []).find(a => a.id === p.avatarId);
      const isMe = p.uid === window.session.uid;
      return `<div class="reveal-lb-row ${isMe ? 'me' : ''}" style="animation-delay:${i * .08}s">
        <span class="reveal-lb-rank">${i + 1}</span>
        <div class="reveal-lb-avatar">${av ? av.svg : ''}</div>
        <span class="reveal-lb-name">${p.pseudo}</span>
        <span class="reveal-lb-arrow" style="color:${arrowColor}">${arrow}</span>
        <span class="reveal-lb-score">${p.score}</span>
      </div>`;
    }).join('');

    setTimeout(() => Game._showPhase3(state), 3000);
  },

  _showPhase3(state) {
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
  _showEnd(state) {
    const scores = state.finalScores || {};
    const sorted = Object.values(scores).sort((a, b) => b.score - a.score);
    const icons = ['🥇', '🥈', '🥉'];

    document.getElementById('end-score').textContent = L.sessionScore;
    const pct = L.sessionTotal ? Math.round(L.sessionCorrect / L.sessionTotal * 100) : 0;
    document.getElementById('end-stats').innerHTML =
      `✅ ${L.sessionCorrect} bonne${L.sessionCorrect > 1 ? 's' : ''} réponse${L.sessionCorrect > 1 ? 's' : ''}<br>
       ❌ ${L.sessionTotal - L.sessionCorrect} erreur${L.sessionTotal - L.sessionCorrect !== 1 ? 's' : ''}<br>
       📊 ${pct}% de réussite`;

    document.getElementById('end-podium').innerHTML = sorted.slice(0, 3).map((p, i) =>
      `<div class="podium-item" style="${i === 0 ? 'border-color:#ffd700' : ''}">
        <span class="podium-rank">${icons[i]}</span>
        <span class="podium-name">${p.pseudo}</span>
        <span class="podium-score">${p.score}</span>
      </div>`
    ).join('');

    L.sessionScore = 0; L.sessionCorrect = 0; L.sessionTotal = 0;
    App.showScreen('game-end');
  },

  showFinalLeaderboard() {
    App.showScreen('leaderboard');
    window.Leaderboard.show('players');
  },

  // ─────────────────────────────────────────
  // QUITTER LA PARTIE
  // ─────────────────────────────────────────
  // Stopper la partie et renvoyer tout le monde au lobby (sans fermer le salon)
  async hostStopGame() {
    if (Game._hostTimer) clearTimeout(Game._hostTimer);
    if (Game._hostAnswerWatcher) { Game._hostAnswerWatcher(); Game._hostAnswerWatcher = null; }
    await updateDoc(_gameRef(), { status: 'host_left' }).catch(()=>{});
    await updateDoc(doc(db, 'rooms', window.session.roomCode), { status: 'lobby' }).catch(()=>{});
    // L'host lui-même revient au lobby
    L._leftGame = false;
    L.questionIndex = -1;
    document.getElementById('rejoin-game-btn')?.classList.add('hidden');
    App.showScreen('lobby');
  },

  requestLeave() {
    if (window.session.isHost) {
      window.Modal.show('Arrêter la partie ?',
        '<p>Tous les joueurs seront renvoyés dans le lobby. Le salon reste ouvert.</p>',
        [
          { label: 'Continuer', class: 'btn btn-ghost', onclick: 'Modal.close()' },
          { label: 'Arrêter la partie', class: 'btn btn-danger', onclick: 'Modal.close(); Game.hostStopGame()' }
        ]
      );
    } else {
      window.Modal.show('Quitter la partie ?',
        '<p>Tu retourneras dans le lobby. Tu pourras rejoindre si la partie est toujours en cours.</p>',
        [
          { label: 'Rester', class: 'btn btn-ghost', onclick: 'Modal.close()' },
          { label: 'Quitter', class: 'btn btn-danger', onclick: 'Game.leaveGame(); Modal.close();' }
        ]
      );
    }
  },

  leaveGame() {
    stopTimer();
    L.questionIndex = -1;
    L._leftGame = true;  // flag : ne plus rediriger vers le jeu sur snapshot
    const rejoignBtn = document.getElementById('rejoin-game-btn');
    if (rejoignBtn) rejoignBtn.classList.remove('hidden');
    App.showScreen('lobby');
  },

  isPlayerOut() { return L._leftGame === true; },

  rejoinGame() {
    L._leftGame = false;
    const rejoignBtn = document.getElementById('rejoin-game-btn');
    if (rejoignBtn) rejoignBtn.classList.add('hidden');
    // Recharger l'état actuel et rediriger
    getDoc(doc(db, 'rooms', window.session.roomCode, 'game', 'current')).then(snap => {
      if (snap.exists()) Game._handleGameState(snap.data());
    });
  }
};

// ══════════════════════════════════════════════════════
// FONCTIONS INTERNES
// ══════════════════════════════════════════════════════

function _renderButtons(shuffledAnswers, disabled) {
  const letters = ['A', 'B', 'C', 'D'];
  const grid = document.getElementById('answers-grid');
  grid.innerHTML = shuffledAnswers.map((ans, i) => `
    <button class="answer-btn" ${disabled ? 'disabled' : ''}
      onclick="Game.selectAnswer(${ans.originalIdx}, this)">
      <span class="answer-letter">${letters[i]}</span>${ans.text}
    </button>`).join('');
}

function _highlightAnswer(state) {
  const q = state.currentQuestion;
  const myAnswer = state.answers?.[window.session.uid];
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
    .slice(0, 3);
  const icons = ['🥇', '🥈', '🥉'];
  document.getElementById('speed-live-list').innerHTML =
    ranked.map(([, d], i) =>
      `<div class="speed-winner-row"><span class="speed-pos">${icons[i]}</span><span>${d.pseudo}</span></div>`
    ).join('') || '<div style="color:var(--text3);font-size:13px">Personne encore…</div>';
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
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: k + 1 }, (_, j) => i || j));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= k; j++)
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][k] <= 2;
}

function _startTimer(state) {
  stopTimer();
  L._timerAccelerated = false;  // reset à chaque nouvelle question
  const arcEl = document.getElementById('timer-arc');
  const timerEl = document.getElementById('game-timer');
  const wrap = document.querySelector('.game-timer-wrap');
  if (!arcEl || !timerEl) return;

  arcEl.style.strokeDasharray = CIRC;
  const totalSecs = state.timerSeconds;
  const alreadyElapsedMs = state.questionStartedAt ? (Date.now() - state.questionStartedAt) : 0;
  let remaining = Math.max(0, totalSecs - Math.floor(alreadyElapsedMs / 1000));

  const tick = () => {
    if (L.isPaused) { L.timerInterval = setTimeout(tick, 200); return; }

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
      arcEl.setAttribute('class', 'timer-arc');
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

// Accélère le timer local à max 3s restantes (appelé quand timerAcceleratedAt arrive)
function _accelerateTimer(acceleratedAt) {
  const elapsed = Date.now() - acceleratedAt;
  const remaining = Math.max(0, 3000 - elapsed);
  stopTimer();

  const arcEl = document.getElementById('timer-arc');
  const timerEl = document.getElementById('game-timer');
  const wrap = document.querySelector('.game-timer-wrap');
  if (!arcEl || !timerEl) return;

  let secs = Math.ceil(remaining / 1000);
  arcEl.setAttribute('class', 'timer-arc danger');
  timerEl.style.color = '#ff4d6d';
  wrap?.classList.add('danger');

  const tick = () => {
    if (L.isPaused) { L.timerInterval = setTimeout(tick, 200); return; }
    timerEl.textContent = secs;
    if (secs <= 0) {
      arcEl.style.strokeDashoffset = CIRC;
      timerEl.textContent = '0';
      wrap?.classList.remove('danger');
      return;
    }
    secs--;
    L.timerInterval = setTimeout(tick, 1000);
  };
  tick();
}
window.Game = Game;