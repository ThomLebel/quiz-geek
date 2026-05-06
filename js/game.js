// ═══════════════════════════════════════════
// GAME ENGINE v2 — Multi-joueurs synchronisé via Firestore
// Architecture : l'admin crée/contrôle un doc "currentGame" dans Firestore.
// Les joueurs écoutent ce doc en temps réel et suivent l'état.
// ═══════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  doc, setDoc, updateDoc, getDoc, onSnapshot,
  increment, addDoc, collection, serverTimestamp, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const CIRC = 119.4; // 2π × 19

// État local du joueur
let local = {
  answered: false,
  blindCorrect: false,
  sessionScore: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
  speedAnswerTime: null,
  unsubGame: null,
  countdownInterval: null
};

export const Game = {
  _unsubGame: null,

  // ──────────────────────────────────────────
  // ÉCOUTE DE L'ÉTAT DU JEU (côté joueur)
  // ──────────────────────────────────────────
  listenToGameState() {
    if (Game._unsubGame) Game._unsubGame();

    Game._unsubGame = onSnapshot(doc(db, 'game', 'current'), (snap) => {
      if (!snap.exists()) {
        // Pas de partie active — retour lobby
        document.getElementById('lobby-game-status')?.classList.add('hidden');
        return;
      }
      const state = snap.data();
      Game.handleGameState(state);
    });
  },

  handleGameState(state) {
    const currentScreen = document.querySelector('.screen.active')?.id;

    switch (state.status) {
      case 'waiting':
        // Partie configurée, en attente que les joueurs rejoignent
        document.getElementById('lobby-game-status')?.classList.remove('hidden');
        document.getElementById('game-status-title').textContent = '🎮 Partie configurée !';
        document.getElementById('game-status-sub').textContent =
          `${state.mode === 'normal' ? 'Mode Normal' : state.mode === 'blind' ? 'Mode Aveugle' : 'Mode Rapidité'} · ${state.questionCount} questions`;
        document.getElementById('game-join-btn').textContent = 'Rejoindre';
        if (currentScreen === 'screen-game-waiting') {
          Game.updateWaitingScreen(state);
        }
        break;

      case 'question':
        // Question en cours — aller sur l'écran de jeu
        if (currentScreen !== 'screen-game') {
          local.answered = false;
          local.blindCorrect = false;
          local.speedAnswerTime = null;
          window.App.showScreen('game');
        }
        Game.renderQuestion(state);
        break;

      case 'reveal':
        // Afficher la correction
        Game.revealAnswer(state);
        break;

      case 'finished':
        // Partie terminée
        Game.showEndScreen(state);
        break;
    }
  },

  joinCurrentGame() {
    window.App.showScreen('game-waiting');
    // Subscribe will have already happened in listenToGameState
    // Update waiting screen
    getDoc(doc(db, 'game', 'current')).then(snap => {
      if (snap.exists()) Game.updateWaitingScreen(snap.data());
    });
    // Register player as ready
    const uid = window.currentUser?.uid;
    if (uid) {
      updateDoc(doc(db, 'game', 'current'), {
        [`readyPlayers.${uid}`]: window.currentUser.pseudo
      }).catch(() => {});
    }
  },

  leaveGame() {
    const uid = window.currentUser?.uid;
    if (uid) {
      // Remove from ready players
      updateDoc(doc(db, 'game', 'current'), {
        [`readyPlayers.${uid}`]: null
      }).catch(() => {});
    }
    window.App.backToLobby();
  },

  updateWaitingScreen(state) {
    const ready = Object.entries(state.readyPlayers || {});
    document.getElementById('waiting-info').innerHTML = `
      <strong>Mode :</strong> ${state.mode === 'normal' ? '🎯 Normal' : state.mode === 'blind' ? '🙈 Aveugle' : '⚡ Rapidité'}<br>
      <strong>Questions :</strong> ${state.questionCount}<br>
      <strong>Timer :</strong> ${state.timerSeconds}s par question
    `;
    document.getElementById('waiting-players').innerHTML = ready.map(([uid, pseudo]) => {
      const u = window.currentUser?.uid === uid ? window.currentUser : null;
      const av = (window.AVATARS || []).find(a => a.id === (u?.avatarId || ''));
      return `<div class="waiting-player-chip">
        <div class="chip-avatar">${av ? av.svg : ''}</div>
        <span>${pseudo}</span>
      </div>`;
    }).join('');
  },

  // ──────────────────────────────────────────
  // AFFICHER UNE QUESTION (côté joueur)
  // ──────────────────────────────────────────
  renderQuestion(state) {
    const qData = state.currentQuestion;
    if (!qData) return;

    local.answered = (state.answers?.[window.currentUser?.uid] !== undefined);
    local.blindCorrect = false;

    // Header
    document.getElementById('game-q-num').textContent = state.questionIndex + 1;
    document.getElementById('game-q-total').textContent = state.questionCount;
    document.getElementById('game-current-score').textContent = local.sessionScore;

    // Difficulty badge
    const badge = document.getElementById('game-difficulty-badge');
    badge.textContent = window.DIFFICULTY_LABELS?.[qData.difficulty] || qData.difficulty;
    badge.className = `difficulty-badge ${qData.difficulty}`;

    document.getElementById('game-question').textContent = qData.question;

    // Hide feedback
    document.getElementById('answer-feedback').classList.add('hidden');

    // Reset blind zone
    const blindZone = document.getElementById('blind-zone');
    const answersGrid = document.getElementById('answers-grid');
    document.getElementById('blind-attempts').innerHTML = '';
    document.getElementById('blind-answer').value = '';

    if (state.mode === 'blind') {
      blindZone.classList.remove('hidden');
      answersGrid.innerHTML = '';
      answersGrid.style.display = 'none';
      document.getElementById('blind-timer-label').textContent = 'Réponse libre…';
      if (local.answered) {
        // Already answered in blind mode — freeze input
        document.getElementById('blind-answer').disabled = true;
        document.querySelector('.blind-input-row .btn')?.setAttribute('disabled', '');
      }
    } else {
      blindZone.classList.add('hidden');
      answersGrid.style.display = 'grid';
      Game.renderAnswerButtons(qData.shuffledAnswers, local.answered);
    }

    // Speed live bar
    const speedBar = document.getElementById('speed-live-bar');
    if (state.mode === 'speed') {
      speedBar.classList.remove('hidden');
      Game.updateSpeedBar(state);
    } else {
      speedBar.classList.add('hidden');
    }

    // Timer (client side countdown from server timestamp)
    Game.startLocalTimer(state);
  },

  renderAnswerButtons(shuffledAnswers, disabled) {
    const letters = ['A', 'B', 'C', 'D'];
    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';
    shuffledAnswers.forEach((ans, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.disabled = disabled;
      btn.dataset.idx = i;
      btn.innerHTML = `<span class="answer-letter">${letters[i]}</span>${ans.text}`;
      btn.onclick = () => Game.selectAnswer(ans.originalIdx, i, btn);
      grid.appendChild(btn);
    });
  },

  async selectAnswer(originalIdx, btnIdx, btn) {
    if (local.answered) return;
    local.answered = true;

    const snap = await getDoc(doc(db, 'game', 'current'));
    const state = snap.data();
    const qData = state.currentQuestion;
    const isCorrect = originalIdx === qData.correct;

    // Disable all buttons
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    // For speed mode: record time
    local.speedAnswerTime = state.mode === 'speed' ? Date.now() : null;

    // Save answer to Firestore
    const uid = window.currentUser?.uid;
    await updateDoc(doc(db, 'game', 'current'), {
      [`answers.${uid}`]: {
        pseudo: window.currentUser.pseudo,
        originalIdx,
        isCorrect,
        answeredAt: Date.now()
      }
    });

    // Visual feedback immediately (don't wait for reveal state)
    if (!isCorrect) btn.classList.add('wrong');
  },

  // Blind mode: submit free text answer
  async submitBlindAnswer() {
    const snap = await getDoc(doc(db, 'game', 'current'));
    const state = snap.data();
    if (state.status !== 'question' || state.mode !== 'blind') return;

    const input = document.getElementById('blind-answer').value.trim();
    if (!input) { window.App.toast('Entre une réponse !'); return; }

    const qData = state.currentQuestion;
    const correct = qData.answers[qData.correct];
    const isCorrect = Game.fuzzyMatch(input, correct);

    // Show attempt chip
    const chip = document.createElement('div');
    chip.className = `blind-attempt-chip ${isCorrect ? 'correct' : 'wrong'}`;
    chip.textContent = input;
    document.getElementById('blind-attempts').appendChild(chip);
    document.getElementById('blind-answer').value = '';

    if (isCorrect && !local.blindCorrect) {
      local.blindCorrect = true;
      local.answered = true;
      document.getElementById('blind-answer').disabled = true;
      document.querySelector('.blind-input-row .btn')?.setAttribute('disabled', '');
      document.getElementById('blind-timer-label').textContent = '✅ Bonne réponse !';

      // Save to Firestore as correct (blind)
      const uid = window.currentUser?.uid;
      await updateDoc(doc(db, 'game', 'current'), {
        [`answers.${uid}`]: {
          pseudo: window.currentUser.pseudo,
          originalIdx: qData.correct,
          isCorrect: true,
          blindMode: true,
          answeredAt: Date.now()
        }
      });
    }
  },

  // Fuzzy match: accept partial match (first word, or edit distance ≤ 2)
  fuzzyMatch(input, correct) {
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const a = norm(input);
    const b = norm(correct);
    if (b.includes(a) || a.includes(b)) return true;
    // Check each word of the correct answer
    const words = b.split(/\s+/).filter(w => w.length >= 3);
    if (words.some(w => a === w || a.includes(w) || w.includes(a))) return true;
    return Game.levenshtein(a, b) <= 2;
  },

  levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({length: m+1}, (_, i) => Array.from({length: n+1}, (_, j) => i||j));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
  },

  // ──────────────────────────────────────────
  // LOCAL TIMER (visual only — real timer on admin side)
  // ──────────────────────────────────────────
  startLocalTimer(state) {
    clearInterval(local.countdownInterval);
    const arcEl = document.getElementById('timer-arc');
    const timerEl = document.getElementById('game-timer');

    const startedAt = state.questionStartedAt; // ms timestamp
    const total = state.timerSeconds;
    arcEl.style.strokeDasharray = CIRC;

    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const remaining = Math.max(0, total - elapsed);
      const pct = remaining / total;

      arcEl.style.strokeDashoffset = CIRC * (1 - pct);
      timerEl.textContent = Math.ceil(remaining);

      arcEl.className = pct <= 0.25 ? 'timer-arc danger' : pct <= 0.5 ? 'timer-arc warning' : 'timer-arc';

      // Blind: reveal choices after 10s
      if (state.mode === 'blind') {
        const elapsed10 = elapsed >= 10;
        const blindZone = document.getElementById('blind-zone');
        const answersGrid = document.getElementById('answers-grid');
        if (elapsed10 && answersGrid.style.display === 'none') {
          answersGrid.style.display = 'grid';
          Game.renderAnswerButtons(state.currentQuestion.shuffledAnswers, local.answered);
          document.getElementById('blind-timer-label').textContent = local.blindCorrect ? '✅ Bonne réponse !' : 'Choisis parmi les propositions…';
          if (!local.blindCorrect) blindZone.classList.add('hidden');
        }
        if (!elapsed10 && !local.answered) {
          const secsLeft = Math.max(0, Math.ceil(10 - elapsed));
          document.getElementById('blind-timer-label').textContent = `Réponse libre encore ${secsLeft}s…`;
        }
      }

      if (remaining <= 0) clearInterval(local.countdownInterval);
    };

    tick();
    local.countdownInterval = setInterval(tick, 250);
  },

  // ──────────────────────────────────────────
  // REVEAL ANSWER STATE (admin transitions to this)
  // ──────────────────────────────────────────
  revealAnswer(state) {
    clearInterval(local.countdownInterval);
    const qData = state.currentQuestion;

    // Stop timer at 0
    document.getElementById('timer-arc').style.strokeDashoffset = CIRC;
    document.getElementById('game-timer').textContent = '0';

    // Highlight correct answer button
    const allBtns = document.querySelectorAll('.answer-btn');
    allBtns.forEach(b => b.disabled = true);
    qData.shuffledAnswers?.forEach((ans, i) => {
      if (ans.originalIdx === qData.correct) allBtns[i]?.classList.add('correct');
    });

    // Also show grid if blind mode
    if (state.mode === 'blind') {
      document.getElementById('blind-zone').classList.add('hidden');
      const grid = document.getElementById('answers-grid');
      grid.style.display = 'grid';
      if (allBtns.length === 0) {
        Game.renderAnswerButtons(qData.shuffledAnswers, true);
        qData.shuffledAnswers?.forEach((ans, i) => {
          const b = document.querySelectorAll('.answer-btn')[i];
          if (ans.originalIdx === qData.correct) b?.classList.add('correct');
        });
      }
    }

    // Calculate points for this player
    const myAnswer = state.answers?.[window.currentUser?.uid];
    let points = 0;
    let isCorrect = false;

    if (myAnswer?.isCorrect) {
      isCorrect = true;
      const base = window.DIFFICULTY_POINTS?.[qData.difficulty] || 1;
      if (state.mode === 'blind' && myAnswer.blindMode) {
        points = base * 4;
      } else if (state.mode === 'speed') {
        // Rank-based points
        const correctAnswers = Object.entries(state.answers || {})
          .filter(([,v]) => v.isCorrect)
          .sort((a, b) => a[1].answeredAt - b[1].answeredAt);
        const myRank = correctAnswers.findIndex(([uid]) => uid === window.currentUser?.uid);
        points = myRank === 0 ? 5 : myRank === 1 ? 4 : myRank === 2 ? 3 : 0;
      } else {
        points = base;
      }
    }

    // Update local session stats
    if (myAnswer !== undefined) {
      if (isCorrect) { local.sessionScore += points; local.sessionCorrect++; }
      local.sessionTotal++;
    }

    document.getElementById('game-current-score').textContent = local.sessionScore;

    // Feedback
    const fb = document.getElementById('answer-feedback');
    document.getElementById('feedback-icon').textContent = isCorrect ? '✅' : (myAnswer ? '❌' : '⏱️');
    document.getElementById('feedback-text').textContent = isCorrect
      ? `+${points} point${points > 1 ? 's' : ''} !`
      : myAnswer ? 'Raté !' : 'Temps écoulé !';
    document.getElementById('feedback-focus').textContent = qData.focus || '';

    const next = state.nextQuestionIn;
    if (next) {
      const countdown = () => {
        const remaining = Math.max(0, Math.ceil((next - Date.now()) / 1000));
        document.getElementById('feedback-next').textContent = remaining > 0
          ? `Prochaine question dans ${remaining}s…`
          : 'Question suivante !';
      };
      countdown();
      const iv = setInterval(() => { countdown(); if (Date.now() >= next) clearInterval(iv); }, 500);
    }

    fb.classList.remove('hidden');

    // Update speed bar
    if (state.mode === 'speed') {
      document.getElementById('speed-live-bar').classList.remove('hidden');
      Game.updateSpeedBar(state);
    }

    // Update cumulative score on Firestore
    const uid = window.currentUser?.uid;
    if (uid && !window.currentUser?.isAdmin && points > 0) {
      updateDoc(doc(db, 'players', uid), {
        score: increment(points),
        correctAnswers: increment(isCorrect ? 1 : 0)
      }).catch(() => {});
    }
  },

  updateSpeedBar(state) {
    const list = document.getElementById('speed-live-list');
    const answers = Object.entries(state.answers || {})
      .filter(([,v]) => v.isCorrect)
      .sort((a, b) => a[1].answeredAt - b[1].answeredAt)
      .slice(0, 3);
    const icons = ['🥇', '🥈', '🥉'];
    list.innerHTML = answers.map(([uid, data], i) => `
      <div class="speed-winner-row">
        <span class="speed-pos">${icons[i]}</span>
        <span>${data.pseudo}</span>
      </div>
    `).join('') || '<div style="color:var(--text3);font-size:13px">Personne encore…</div>';
  },

  // ──────────────────────────────────────────
  // END SCREEN
  // ──────────────────────────────────────────
  async showEndScreen(state) {
    clearInterval(local.countdownInterval);

    // Final update
    const uid = window.currentUser?.uid;
    if (uid && !window.currentUser?.isAdmin && local.sessionTotal > 0) {
      await updateDoc(doc(db, 'players', uid), {
        gamesPlayed: increment(1)
      }).catch(() => {});
      // Update team score if in team
      if (window.currentUser?.teamId) {
        await updateDoc(doc(db, 'teams', window.currentUser.teamId), {
          score: increment(local.sessionScore)
        }).catch(() => {});
      }
    }

    document.getElementById('end-score').textContent = local.sessionScore;
    document.getElementById('end-stats').innerHTML = `
      ✅ ${local.sessionCorrect} bonne${local.sessionCorrect > 1 ? 's' : ''} réponse${local.sessionCorrect > 1 ? 's' : ''}<br>
      ❌ ${local.sessionTotal - local.sessionCorrect} erreur${local.sessionTotal - local.sessionCorrect !== 1 ? 's' : ''}<br>
      📊 ${local.sessionTotal ? Math.round((local.sessionCorrect/local.sessionTotal)*100) : 0}% de réussite
    `;

    // Build final podium from state.finalScores if available
    const finalScores = state.finalScores || {};
    const sorted = Object.entries(finalScores).sort((a, b) => b[1].score - a[1].score).slice(0, 3);
    const icons = ['🥇', '🥈', '🥉'];
    document.getElementById('end-podium').innerHTML = sorted.length ? `
      <div class="admin-section-title" style="margin-bottom:12px">Podium de la partie</div>
      ${sorted.map(([, data], i) => `
        <div class="podium-item" style="${i === 0 ? 'border-color:#ffd700' : ''}">
          <span class="podium-rank">${icons[i]}</span>
          <span class="podium-name">${data.pseudo}</span>
          <span class="podium-score">${data.score}</span>
        </div>
      `).join('')}
    ` : '';

    // Reset session
    local.sessionScore = 0; local.sessionCorrect = 0; local.sessionTotal = 0;

    window.App.showScreen('game-end');
  }
};

window.Game = Game;
