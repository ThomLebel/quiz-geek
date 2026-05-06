// ═══════════════════════════════════════════
// GAME ENGINE
// ═══════════════════════════════════════════
import { db } from './firebase-config.js';
import {
  doc, updateDoc, increment, collection, addDoc, serverTimestamp, getDoc, getDocs, query, orderBy, limit, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const TIMER_NORMAL = 20;
const TIMER_BLIND = 24;
const TIMER_SPEED = 15;
const CIRCUMFERENCE = 2 * Math.PI * 19; // ~119.4

let state = {
  mode: 'normal',       // 'normal' | 'blind' | 'speed'
  questions: [],
  currentIndex: 0,
  score: 0,
  correct: 0,
  incorrect: 0,
  timerInterval: null,
  timeLeft: 20,
  totalTime: 20,
  answered: false,
  blindAnswered: false,
  blindRevealed: false,
  speedAnswers: []      // for speed mode: [{uid, pseudo, time, correct}]
};

export const Game = {
  // ── Setup
  initSetupUI(mode) {
    state.mode = mode;
    const titles = { normal: '🎯 Mode Normal', blind: '🙈 Mode Aveugle', speed: '⚡ Mode Rapidité' };
    document.getElementById('setup-title').textContent = titles[mode];
    document.getElementById('setup-back-btn').onclick = () => window.App.backToLobby();

    // btn-group logic
    document.querySelectorAll('.btn-group').forEach(group => {
      group.querySelectorAll('.btn-toggle').forEach(btn => {
        btn.onclick = () => {
          group.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        };
      });
    });
  },

  getSetupOptions() {
    const count = parseInt(document.querySelector('#setup-count .btn-toggle.active')?.dataset.val || '10');
    const theme = document.querySelector('#setup-theme .btn-toggle.active')?.dataset.val || 'all';
    const difficulty = document.querySelector('#setup-difficulty .btn-toggle.active')?.dataset.val || 'all';
    return { count, theme, difficulty };
  },

  buildQuestionList(count, theme, difficulty) {
    let pool = [...window.QUESTIONS];

    if (theme !== 'all') {
      pool = pool.filter(q => q.theme === theme);
    }
    if (difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    // Sort by difficulty ascending, then shuffle within same difficulty
    const order = { debutant: 1, connaisseur: 2, otaku: 3 };
    pool.sort((a, b) => order[a.difficulty] - order[b.difficulty] || Math.random() - 0.5);

    if (count === 105) return pool;
    return pool.slice(0, Math.min(count, pool.length));
  },

  startGame() {
    const { count, theme, difficulty } = Game.getSetupOptions();
    const questions = Game.buildQuestionList(count, theme, difficulty);

    if (questions.length === 0) {
      window.App.toast('Aucune question pour ces filtres !');
      return;
    }

    state.questions = questions;
    state.currentIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.incorrect = 0;
    state.speedAnswers = [];

    window.App.showScreen('game');
    Game.showQuestion();
  },

  showQuestion() {
    if (state.currentIndex >= state.questions.length) {
      Game.endGame();
      return;
    }

    const q = state.questions[state.currentIndex];
    state.answered = false;
    state.blindAnswered = false;
    state.blindRevealed = false;
    state.speedAnswers = [];

    // Update header
    document.getElementById('game-q-num').textContent = `Q${state.currentIndex + 1}`;
    document.getElementById('game-q-total').textContent = state.questions.length;
    document.getElementById('game-current-score').textContent = state.score;

    // Difficulty badge
    const badge = document.getElementById('game-difficulty-badge');
    badge.textContent = window.DIFFICULTY_LABELS[q.difficulty];
    badge.className = `difficulty-badge ${q.difficulty}`;

    // Question text
    document.getElementById('game-question').textContent = q.question;

    // Hide feedback
    document.getElementById('answer-feedback').classList.add('hidden');

    // Shuffle answers for display
    const shuffled = q.answers.map((text, idx) => ({ text, originalIdx: idx }));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    state.shuffledAnswers = shuffled;

    // Timer
    const totalTime = state.mode === 'blind' ? TIMER_BLIND : state.mode === 'speed' ? TIMER_SPEED : TIMER_NORMAL;
    state.totalTime = totalTime;
    state.timeLeft = totalTime;

    // Blind mode setup
    const blindZone = document.getElementById('blind-input-zone');
    const answersGrid = document.getElementById('answers-grid');

    if (state.mode === 'blind') {
      blindZone.classList.remove('hidden');
      answersGrid.innerHTML = '';
      answersGrid.style.display = 'none';
      document.getElementById('blind-answer').value = '';
      document.getElementById('blind-countdown').textContent = `Réponse libre pendant ${Math.floor(totalTime / 2)}s`;
    } else {
      blindZone.classList.add('hidden');
      answersGrid.style.display = 'grid';
      Game.renderAnswerButtons(shuffled, false);
    }

    Game.startTimer();
  },

  renderAnswerButtons(shuffled, disabled) {
    const letters = ['A', 'B', 'C', 'D'];
    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';
    shuffled.forEach((ans, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.disabled = disabled;
      btn.innerHTML = `<span class="answer-letter">${letters[i]}</span>${ans.text}`;
      btn.onclick = () => Game.selectAnswer(ans.originalIdx, btn);
      grid.appendChild(btn);
    });
  },

  selectAnswer(originalIdx, btn) {
    if (state.answered) return;
    const q = state.questions[state.currentIndex];

    if (state.mode === 'speed') {
      // Speed mode: record answer
      state.speedAnswers.push({
        uid: window.currentUser.uid,
        pseudo: window.currentUser.pseudo,
        time: state.totalTime - state.timeLeft,
        correct: originalIdx === q.correct
      });
    }

    state.answered = true;
    clearInterval(state.timerInterval);
    Game.evaluateAnswer(originalIdx, btn);
  },

  evaluateAnswer(originalIdx, btn) {
    const q = state.questions[state.currentIndex];
    const isCorrect = originalIdx === q.correct;

    // Highlight correct/wrong
    const allBtns = document.querySelectorAll('.answer-btn');
    allBtns.forEach(b => { b.disabled = true; });

    // Find correct button
    state.shuffledAnswers.forEach((ans, i) => {
      if (ans.originalIdx === q.correct) {
        allBtns[i]?.classList.add('correct');
      }
    });

    if (btn) {
      const btnOriginalIdx = parseInt(btn.dataset?.idx ?? '') ||
        state.shuffledAnswers.findIndex(a => btn.textContent.includes(a.text));
      if (!isCorrect) btn.classList.add('wrong');
    }

    // Calculate points
    let points = 0;
    if (isCorrect) {
      const base = window.DIFFICULTY_POINTS[q.difficulty];
      if (state.mode === 'blind' && state.blindAnswered && !state.blindRevealed) {
        points = base * 4;
      } else if (state.mode === 'speed') {
        // Will be handled after all players answer in speed mode
        // For solo, give full points
        const positionPoints = [5, 4, 3];
        points = positionPoints[0] || 0;
      } else {
        points = base;
      }
      state.score += points;
      state.correct++;
    } else {
      state.incorrect++;
    }

    // Show feedback
    Game.showFeedback(isCorrect, points, q.focus);

    // Auto next
    setTimeout(() => Game.nextQuestion(), 2800);
  },

  showFeedback(isCorrect, points, focus) {
    const fb = document.getElementById('answer-feedback');
    document.getElementById('feedback-icon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('feedback-text').textContent = isCorrect
      ? `Bravo ! +${points} point${points > 1 ? 's' : ''}`
      : 'Raté !';
    document.getElementById('feedback-focus').textContent = focus;
    fb.classList.remove('hidden');
    document.getElementById('game-current-score').textContent = state.score;
  },

  nextQuestion() {
    state.currentIndex++;
    Game.showQuestion();
  },

  // ── Blind mode
  submitBlindAnswer() {
    if (state.answered || state.blindAnswered) return;
    const input = document.getElementById('blind-answer').value.trim().toLowerCase();
    if (!input) { window.App.toast('Entre une réponse !'); return; }

    const q = state.questions[state.currentIndex];
    const correctAnswer = q.answers[q.correct].toLowerCase();

    // Fuzzy match: check if input is contained in correct answer or vice versa
    const isCorrect = correctAnswer.includes(input) || input.includes(correctAnswer) ||
      Game.levenshtein(input, correctAnswer) <= 2;

    state.blindAnswered = true;
    state.answered = true;
    clearInterval(state.timerInterval);

    // Reveal answers
    document.getElementById('blind-input-zone').classList.add('hidden');
    const grid = document.getElementById('answers-grid');
    grid.style.display = 'grid';
    Game.renderAnswerButtons(state.shuffledAnswers, true);

    // Highlight correct
    const allBtns = document.querySelectorAll('.answer-btn');
    state.shuffledAnswers.forEach((ans, i) => {
      if (ans.originalIdx === q.correct) allBtns[i]?.classList.add('correct');
    });

    const points = isCorrect ? window.DIFFICULTY_POINTS[q.difficulty] * 4 : 0;
    if (isCorrect) state.score += points;
    isCorrect ? state.correct++ : state.incorrect++;
    Game.showFeedback(isCorrect, points, q.focus);
    setTimeout(() => Game.nextQuestion(), 2800);
  },

  levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i || j));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
  },

  // ── Timer
  startTimer() {
    const arcEl = document.getElementById('timer-arc');
    const timerEl = document.getElementById('game-timer');
    const q = state.questions[state.currentIndex];

    const updateArc = () => {
      const pct = state.timeLeft / state.totalTime;
      arcEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
      timerEl.textContent = state.timeLeft;

      if (pct <= 0.25) {
        arcEl.className = 'timer-arc danger';
      } else if (pct <= 0.5) {
        arcEl.className = 'timer-arc warning';
      } else {
        arcEl.className = 'timer-arc';
      }
    };

    updateArc();
    arcEl.style.strokeDasharray = CIRCUMFERENCE;

    // Blind: reveal answers at half time
    if (state.mode === 'blind') {
      const halfTime = Math.floor(state.totalTime / 2);
      const countdown = document.getElementById('blind-countdown');
      countdown.textContent = `Réponse libre pendant ${halfTime}s`;
    }

    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timeLeft--;
      updateArc();

      // Blind mode: reveal at half
      if (state.mode === 'blind' && !state.blindRevealed) {
        const halfTime = Math.floor(state.totalTime / 2);
        const remaining = state.timeLeft - halfTime;
        if (remaining <= 0 && !state.blindAnswered) {
          state.blindRevealed = true;
          document.getElementById('blind-input-zone').classList.add('hidden');
          const grid = document.getElementById('answers-grid');
          grid.style.display = 'grid';
          Game.renderAnswerButtons(state.shuffledAnswers, false);
          document.getElementById('blind-countdown').textContent = '';
        } else if (!state.blindAnswered) {
          document.getElementById('blind-countdown').textContent =
            `Réponse libre pendant encore ${Math.abs(remaining)}s`;
        }
      }

      if (state.timeLeft <= 0) {
        clearInterval(state.timerInterval);
        if (!state.answered) {
          state.answered = true;
          state.incorrect++;

          // Show correct answer
          if (state.mode === 'blind') {
            document.getElementById('blind-input-zone').classList.add('hidden');
            const grid = document.getElementById('answers-grid');
            grid.style.display = 'grid';
            Game.renderAnswerButtons(state.shuffledAnswers, true);
          }
          const allBtns = document.querySelectorAll('.answer-btn');
          allBtns.forEach(b => { b.disabled = true; });
          state.shuffledAnswers.forEach((ans, i) => {
            if (ans.originalIdx === q.correct) allBtns[i]?.classList.add('correct');
          });
          Game.showFeedback(false, 0, q.focus);
          setTimeout(() => Game.nextQuestion(), 2800);
        }
      }
    }, 1000);
  },

  // ── End game
  async endGame() {
    clearInterval(state.timerInterval);

    // Save score to Firebase
    try {
      const uid = window.currentUser?.uid;
      const isAdmin = window.currentUser?.isAdmin;
      if (uid && !isAdmin) {
        const playerRef = doc(db, 'players', uid);
        await updateDoc(playerRef, {
          score: increment(state.score),
          gamesPlayed: increment(1),
          correctAnswers: increment(state.correct)
        });
        window.currentUser.score = (window.currentUser.score || 0) + state.score;

        // Update team score if in team
        if (window.currentUser.teamId) {
          const teamRef = doc(db, 'teams', window.currentUser.teamId);
          await updateDoc(teamRef, { score: increment(state.score) });
        }

        // Log game session
        await addDoc(collection(db, 'gameSessions'), {
          uid, pseudo: window.currentUser.pseudo,
          mode: state.mode, score: state.score,
          correct: state.correct, total: state.questions.length,
          timestamp: serverTimestamp()
        });
      }
    } catch (e) { console.error('Score save error:', e); }

    // Show end screen
    document.getElementById('end-score').textContent = state.score;
    document.getElementById('end-stats').innerHTML = `
      ✅ ${state.correct} bonne${state.correct > 1 ? 's' : ''} réponse${state.correct > 1 ? 's' : ''}<br>
      ❌ ${state.incorrect} erreur${state.incorrect > 1 ? 's' : ''}<br>
      📊 ${Math.round((state.correct / state.questions.length) * 100)}% de réussite
    `;
    window.App.showScreen('game-end');
  }
};

window.Game = Game;
