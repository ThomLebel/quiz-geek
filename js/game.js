// ═══════════════════════════════════════════
// GAME ENGINE v3
// Fixes: timer SVG animation, blind mode rewrite, pause, leave, lobby redirect
// ═══════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  doc, updateDoc, getDoc, onSnapshot, increment, collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// r=22 → circumference = 2π×22 ≈ 138.23
const CIRC = 2 * Math.PI * 22;

let local = {
  answered: false,
  blindCorrect: false,
  blindRevealed: false,
  sessionScore: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
  rafId: null,
  pausedAt: null,
  pauseElapsed: 0   // ms already elapsed before pause
};

export const Game = {
  _unsubGame: null,

  // ──────────────────────────────────────────
  // LISTEN
  // ──────────────────────────────────────────
  listenToGameState() {
    if (Game._unsubGame) Game._unsubGame();
    Game._unsubGame = onSnapshot(doc(db, 'game', 'current'), snap => {
      if (!snap.exists()) {
        // No active game — update lobby banner and go to lobby if on game screen
        document.getElementById('lobby-game-status')?.classList.add('hidden');
        const active = document.querySelector('.screen.active')?.id;
        if (['screen-game','screen-game-waiting'].includes(active)) {
          window.App.toast('La partie a été arrêtée.');
          window.App.backToLobby();
        }
        return;
      }
      Game.handleGameState(snap.data());
    });
  },

  handleGameState(state) {
    const active = document.querySelector('.screen.active')?.id;

    // Pause overlay (any screen during game)
    const pauseEl = document.getElementById('pause-overlay');
    if (pauseEl) pauseEl.classList.toggle('hidden', state.status !== 'paused');

    switch (state.status) {
      case 'waiting':
        document.getElementById('lobby-game-status')?.classList.remove('hidden');
        document.getElementById('game-status-title').textContent = '🎮 Partie configurée !';
        document.getElementById('game-status-sub').textContent =
          `${Game._modeLabel(state.mode)} · ${state.questionCount} questions · ${state.timerSeconds}s/question`;
        if (active === 'screen-game-waiting') Game.updateWaitingScreen(state);
        break;

      case 'paused':
        // Timer is frozen — handled by pause overlay above
        // Resume local RAF when unpaused
        local.pauseElapsed += Date.now() - (local.pausedAt || Date.now());
        local.pausedAt = Date.now();
        if (active !== 'screen-game') {
          window.App.showScreen('game');
          Game.renderQuestion(state);
        }
        break;

      case 'question':
        if (active !== 'screen-game') {
          Game._resetLocalSession(state);
          window.App.showScreen('game');
        }
        local.pausedAt = null;
        Game.renderQuestion(state);
        break;

      case 'reveal':
        if (active !== 'screen-game') window.App.showScreen('game');
        Game.revealAnswer(state);
        break;

      case 'finished':
        Game.showEndScreen(state);
        break;
    }
  },

  _modeLabel(mode) {
    return mode === 'normal' ? '🎯 Normal' : mode === 'blind' ? '🙈 Aveugle' : '⚡ Rapidité';
  },

  _resetLocalSession(state) {
    // Only reset session counters when a brand-new game starts (q0)
    if (state.questionIndex === 0) {
      local.sessionScore = 0;
      local.sessionCorrect = 0;
      local.sessionTotal = 0;
    }
  },

  joinCurrentGame() {
    window.App.showScreen('game-waiting');
    getDoc(doc(db, 'game', 'current')).then(snap => {
      if (snap.exists()) Game.updateWaitingScreen(snap.data());
    });
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
      updateDoc(doc(db, 'game', 'current'), {
        [`readyPlayers.${uid}`]: null
      }).catch(() => {});
    }
    window.App.backToLobby();
  },

  requestLeave() {
    window.Modal.show('Quitter la partie ?', '<p>Tu perdras les points de la partie en cours.</p>', [
      { label: 'Rester', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: 'Quitter', class: 'btn btn-danger', onclick: 'Game.leaveGame(); Modal.close();' }
    ]);
  },

  updateWaitingScreen(state) {
    const ready = Object.entries(state.readyPlayers || {});
    document.getElementById('waiting-info').innerHTML = `
      <strong>Mode :</strong> ${Game._modeLabel(state.mode)}<br>
      <strong>Questions :</strong> ${state.questionCount}<br>
      <strong>Timer :</strong> ${state.timerSeconds}s par question
    `;
    document.getElementById('waiting-players').innerHTML = ready.map(([uid, pseudo]) => {
      const isMe = window.currentUser?.uid === uid;
      const av = isMe ? (window.AVATARS||[]).find(a=>a.id===window.currentUser?.avatarId) : null;
      return `<div class="waiting-player-chip">
        <div class="chip-avatar">${av ? av.svg : ''}</div>
        <span>${pseudo}${isMe?' (toi)':''}</span>
      </div>`;
    }).join('');
  },

  // ──────────────────────────────────────────
  // RENDER QUESTION
  // ──────────────────────────────────────────
  renderQuestion(state) {
    const qData = state.currentQuestion;
    if (!qData) return;

    // Reset local flags for this question
    local.answered = (state.answers?.[window.currentUser?.uid] !== undefined);
    local.blindCorrect = local.answered && state.answers?.[window.currentUser?.uid]?.blindMode;
    local.blindRevealed = false;

    // Header
    document.getElementById('game-q-num').textContent = state.questionIndex + 1;
    document.getElementById('game-q-total').textContent = state.questionCount;
    document.getElementById('game-current-score').textContent = local.sessionScore;

    const badge = document.getElementById('game-difficulty-badge');
    badge.textContent = window.DIFFICULTY_LABELS?.[qData.difficulty] || qData.difficulty;
    badge.className = `difficulty-badge ${qData.difficulty}`;
    document.getElementById('game-question').textContent = qData.question;
    document.getElementById('answer-feedback').classList.add('hidden');

    const blindZone = document.getElementById('blind-zone');
    const answersGrid = document.getElementById('answers-grid');
    const speedBar = document.getElementById('speed-live-bar');

    if (state.mode === 'blind') {
      // Reset blind UI
      blindZone.classList.remove('hidden');
      answersGrid.innerHTML = '';
      answersGrid.style.display = 'none';
      document.getElementById('blind-attempts').innerHTML = '';
      document.getElementById('blind-answer').value = '';
      document.getElementById('blind-input-row').classList.toggle('hidden', local.answered && local.blindCorrect);
      document.getElementById('blind-reveal-btn').classList.toggle('hidden', local.answered);

      if (local.answered && local.blindCorrect) {
        // Already got it right — show success
        document.getElementById('blind-attempts').innerHTML =
          `<div class="blind-attempt-chip correct">✅ Bonne réponse !</div>`;
      } else if (local.answered) {
        // Answered via choices — show grid disabled
        answersGrid.style.display = 'grid';
        Game.renderAnswerButtons(qData.shuffledAnswers, true);
        blindZone.classList.add('hidden');
      }
    } else {
      blindZone.classList.add('hidden');
      answersGrid.style.display = 'grid';
      Game.renderAnswerButtons(qData.shuffledAnswers, local.answered);
    }

    speedBar.classList.toggle('hidden', state.mode !== 'speed');
    if (state.mode === 'speed') Game.updateSpeedBar(state);

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
      btn.innerHTML = `<span class="answer-letter">${letters[i]}</span>${ans.text}`;
      btn.onclick = () => Game.selectAnswer(ans.originalIdx, btn);
      grid.appendChild(btn);
    });
  },

  // ──────────────────────────────────────────
  // ANSWER SELECTION
  // ──────────────────────────────────────────
  async selectAnswer(originalIdx, btn) {
    if (local.answered) return;
    local.answered = true;
    cancelAnimationFrame(local.rafId);
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    const snap = await getDoc(doc(db, 'game', 'current'));
    if (!snap.exists()) return;
    const state = snap.data();
    const qData = state.currentQuestion;
    const isCorrect = originalIdx === qData.correct;
    if (!isCorrect) btn.classList.add('wrong');

    const uid = window.currentUser?.uid;
    await updateDoc(doc(db, 'game', 'current'), {
      [`answers.${uid}`]: {
        pseudo: window.currentUser.pseudo,
        originalIdx, isCorrect, answeredAt: Date.now()
      }
    });
  },

  // ──────────────────────────────────────────
  // BLIND MODE
  // ──────────────────────────────────────────
  async submitBlindAnswer() {
    if (local.answered) return;
    const input = document.getElementById('blind-answer').value.trim();
    if (!input) { window.App.toast('Entre une réponse !'); return; }

    const snap = await getDoc(doc(db, 'game', 'current'));
    if (!snap.exists() || snap.data().status !== 'question') return;
    const state = snap.data();
    const qData = state.currentQuestion;
    const correct = qData.answers[qData.correct];
    const isCorrect = Game.fuzzyMatch(input, correct);

    const chip = document.createElement('div');
    chip.className = `blind-attempt-chip ${isCorrect ? 'correct' : 'wrong'}`;
    chip.textContent = isCorrect ? `✅ ${input}` : `✗ ${input}`;
    document.getElementById('blind-attempts').appendChild(chip);
    document.getElementById('blind-answer').value = '';

    if (isCorrect && !local.blindCorrect) {
      local.blindCorrect = true;
      local.answered = true;
      cancelAnimationFrame(local.rafId);
      // Hide input and reveal button
      document.getElementById('blind-input-row').classList.add('hidden');
      document.getElementById('blind-reveal-btn').classList.add('hidden');

      const uid = window.currentUser?.uid;
      await updateDoc(doc(db, 'game', 'current'), {
        [`answers.${uid}`]: {
          pseudo: window.currentUser.pseudo,
          originalIdx: qData.correct,
          isCorrect: true, blindMode: true, answeredAt: Date.now()
        }
      });
    }
  },

  // Reveal choices manually (replaces blind text input)
  revealChoices() {
    if (local.answered) return;
    local.blindRevealed = true;
    document.getElementById('blind-input-row').classList.add('hidden');
    document.getElementById('blind-reveal-btn').classList.add('hidden');

    getDoc(doc(db, 'game', 'current')).then(snap => {
      if (!snap.exists()) return;
      const qData = snap.data().currentQuestion;
      const grid = document.getElementById('answers-grid');
      grid.style.display = 'grid';
      Game.renderAnswerButtons(qData.shuffledAnswers, false);
    });
  },

  fuzzyMatch(input, correct) {
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const a = norm(input), b = norm(correct);
    if (a === b || b.includes(a) || a.includes(b)) return true;
    const words = b.split(/\s+/).filter(w => w.length >= 3);
    if (words.some(w => norm(input) === w)) return true;
    return Game.levenshtein(a, b) <= 2;
  },

  levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({length:m+1}, (_,i) => Array.from({length:n+1}, (_,j) => i||j));
    for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
      dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[m][n];
  },

  // ──────────────────────────────────────────
  // TIMER — requestAnimationFrame for smooth animation
  // ──────────────────────────────────────────
  startLocalTimer(state) {
    cancelAnimationFrame(local.rafId);
    const arcEl = document.getElementById('timer-arc');
    const timerEl = document.getElementById('game-timer');
    const total = state.timerSeconds * 1000; // ms
    const startedAt = state.questionStartedAt; // ms timestamp stored by admin
    arcEl.style.strokeDasharray = CIRC;

    const tick = () => {
      // If paused, freeze display
      if (state.status === 'paused') {
        local.rafId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, total - elapsed);
      const pct = remaining / total;

      // Animate arc
      arcEl.style.strokeDashoffset = CIRC * (1 - pct);
      timerEl.textContent = Math.ceil(remaining / 1000);

      arcEl.className = pct <= 0.25 ? 'timer-arc danger' : pct <= 0.5 ? 'timer-arc warning' : 'timer-arc';

      if (remaining <= 0) {
        arcEl.style.strokeDashoffset = CIRC;
        timerEl.textContent = '0';
        return; // Admin will trigger reveal
      }

      local.rafId = requestAnimationFrame(tick);
    };

    local.rafId = requestAnimationFrame(tick);
  },

  // ──────────────────────────────────────────
  // REVEAL
  // ──────────────────────────────────────────
  revealAnswer(state) {
    cancelAnimationFrame(local.rafId);
    const qData = state.currentQuestion;

    // Freeze timer at 0
    const arcEl = document.getElementById('timer-arc');
    if (arcEl) { arcEl.style.strokeDashoffset = CIRC; arcEl.className = 'timer-arc'; }
    document.getElementById('game-timer').textContent = '0';

    // Hide blind zone, show grid
    document.getElementById('blind-zone').classList.add('hidden');
    const grid = document.getElementById('answers-grid');
    grid.style.display = 'grid';
    if (!document.querySelectorAll('.answer-btn').length || grid.innerHTML === '') {
      Game.renderAnswerButtons(qData.shuffledAnswers, true);
    }
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    // Highlight correct
    qData.shuffledAnswers?.forEach((ans, i) => {
      const b = document.querySelectorAll('.answer-btn')[i];
      if (!b) return;
      if (ans.originalIdx === qData.correct) b.classList.add('correct');
    });

    // Calculate points
    const myAnswer = state.answers?.[window.currentUser?.uid];
    let points = 0, isCorrect = false;

    if (myAnswer?.isCorrect) {
      isCorrect = true;
      const base = window.DIFFICULTY_POINTS?.[qData.difficulty] || 1;
      if (state.mode === 'blind' && myAnswer.blindMode) {
        points = base * 4;
      } else if (state.mode === 'speed') {
        const ranked = Object.entries(state.answers || {})
          .filter(([,v]) => v.isCorrect)
          .sort((a,b) => a[1].answeredAt - b[1].answeredAt);
        const myRank = ranked.findIndex(([uid]) => uid === window.currentUser?.uid);
        points = myRank === 0 ? 5 : myRank === 1 ? 4 : myRank === 2 ? 3 : 0;
      } else {
        points = base;
      }
    }

    // Update session
    if (myAnswer !== undefined || !local.answered) {
      // Count this question
      if (!local._countedQ) {
        local._countedQ = true;
        if (isCorrect) { local.sessionScore += points; local.sessionCorrect++; }
        local.sessionTotal++;
      }
    }
    local._countedQ = false;

    document.getElementById('game-current-score').textContent = local.sessionScore;

    // Feedback
    const noAnswer = myAnswer === undefined;
    document.getElementById('feedback-icon').textContent = isCorrect ? '✅' : noAnswer ? '⏱️' : '❌';
    document.getElementById('feedback-text').textContent = isCorrect
      ? `+${points} point${points>1?'s':''} !`
      : noAnswer ? 'Temps écoulé !' : 'Raté…';
    document.getElementById('feedback-focus').textContent = qData.focus || '';

    const next = state.nextQuestionIn;
    if (next) {
      const updateCountdown = () => {
        const r = Math.max(0, Math.ceil((next - Date.now()) / 1000));
        document.getElementById('feedback-next').textContent =
          r > 0 ? `Prochaine question dans ${r}s…` : '';
        if (r > 0) setTimeout(updateCountdown, 400);
      };
      updateCountdown();
    }

    document.getElementById('answer-feedback').classList.remove('hidden');

    // Speed bar
    if (state.mode === 'speed') {
      document.getElementById('speed-live-bar').classList.remove('hidden');
      Game.updateSpeedBar(state);
    }

    // Save score to Firestore (delta)
    const uid = window.currentUser?.uid;
    if (uid && !window.currentUser?.isAdmin && points > 0) {
      updateDoc(doc(db, 'players', uid), {
        score: increment(points),
        correctAnswers: increment(1)
      }).catch(() => {});
      // Update team score if in team
      if (window.currentUser?.teamId) {
        updateDoc(doc(db, 'teams', window.currentUser.teamId), {
          score: increment(points)
        }).catch(() => {});
      }
    }
  },

  updateSpeedBar(state) {
    const list = document.getElementById('speed-live-list');
    const ranked = Object.entries(state.answers || {})
      .filter(([,v]) => v.isCorrect)
      .sort((a,b) => a[1].answeredAt - b[1].answeredAt)
      .slice(0, 3);
    const icons = ['🥇','🥈','🥉'];
    list.innerHTML = ranked.map(([uid, data], i) =>
      `<div class="speed-winner-row"><span class="speed-pos">${icons[i]}</span><span>${data.pseudo}</span></div>`
    ).join('') || '<div style="color:var(--text3);font-size:13px">Personne encore…</div>';
  },

  // ──────────────────────────────────────────
  // END SCREEN
  // ──────────────────────────────────────────
  async showEndScreen(state) {
    cancelAnimationFrame(local.rafId);
    const uid = window.currentUser?.uid;
    if (uid && !window.currentUser?.isAdmin) {
      await updateDoc(doc(db, 'players', uid), { gamesPlayed: increment(1) }).catch(() => {});
    }

    document.getElementById('end-score').textContent = local.sessionScore;
    const pct = local.sessionTotal ? Math.round((local.sessionCorrect/local.sessionTotal)*100) : 0;
    document.getElementById('end-stats').innerHTML = `
      ✅ ${local.sessionCorrect} bonne${local.sessionCorrect>1?'s':''} réponse${local.sessionCorrect>1?'s':''}<br>
      ❌ ${local.sessionTotal - local.sessionCorrect} erreur${local.sessionTotal-local.sessionCorrect!==1?'s':''}<br>
      📊 ${pct}% de réussite
    `;

    const sorted = Object.entries(state.finalScores || {})
      .sort((a,b) => b[1].score - a[1].score).slice(0, 3);
    const icons = ['🥇','🥈','🥉'];
    document.getElementById('end-podium').innerHTML = sorted.length ? `
      <div class="admin-section-title" style="margin-bottom:12px">Podium de la partie</div>
      ${sorted.map(([,d], i) => `
        <div class="podium-item" style="${i===0?'border-color:#ffd700':''}">
          <span class="podium-rank">${icons[i]}</span>
          <span class="podium-name">${d.pseudo}</span>
          <span class="podium-score">${d.score}</span>
        </div>
      `).join('')}
    ` : '';

    local.sessionScore = 0; local.sessionCorrect = 0; local.sessionTotal = 0;
    window.App.showScreen('game-end');
  }
};

window.Game = Game;
