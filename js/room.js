// ═══════════════════════════════════════════
// ROOM MODULE v2 — Salons multijoueurs
// Nouveautés :
//   • Liste des salons ouverts
//   • Manches configurables
//   • Scores persistants (pas de reset entre parties)
//   • Host quitte → salon fermé → tous renvoyés
//   • Session restaurable (rejoin avec score conservé)
// ═══════════════════════════════════════════
import { db } from './firebase-config.js?v=1';
import {
  doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  collection, onSnapshot, serverTimestamp,
  query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.session = {
  roomCode: null, uid: null, pseudo: null,
  avatarId: null, isHost: false, teamId: null
};

let _unsubPlayers = null;
let _unsubGame    = null;
let _unsubTeams   = null;
let _unsubRoom    = null;  // écoute le salon lui-même (status: closed)

async function hashPw(pw) {
  if (!pw) return '';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function genUid() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).substr(2,5);
}

// ── Round config par défaut
const DEFAULT_ROUND = {
  mode: 'normal', count: 10, theme: 'all',
  difficulty: 'all', timer: 20
};

export const Room = {

  // ──────────────────────────────────────────
  // LISTE DES SALONS OUVERTS
  // ──────────────────────────────────────────
  async loadRoomList() {
    const container = document.getElementById('room-list');
    if (!container) return;
    container.innerHTML = '<div class="spinner"></div>';

    try {
      // Query simple sans index composé : on filtre status côté client
      const snap = await getDocs(
        query(collection(db, 'rooms'), orderBy('createdAt', 'desc'), limit(150))
      );

      const openRooms = snap.docs
        .map(d => d.data())
        .filter(r => r.status === 'lobby')
        .slice(0, 100);

      if (!openRooms.length) {
        container.innerHTML = '<div class="empty-state">Aucun salon ouvert pour le moment.</div>';
        return;
      }

      // Compter les joueurs pour chaque salon
      const rooms = await Promise.all(openRooms.map(async r => {
        const pSnap = await getDocs(collection(db, 'rooms', r.code, 'players'));
        return { ...r, playerCount: pSnap.size };
      }));

      container.innerHTML = rooms.map(r => `
        <div class="room-list-item" onclick="Room.selectRoom('${r.code}', ${!!r.passwordHash})">
          <div class="room-list-left">
            <div class="room-list-code">${r.code}</div>
            <div class="room-list-host">👑 ${r.hostPseudo}</div>
          </div>
          <div class="room-list-right">
            <span class="room-list-players">👥 ${r.playerCount}</span>
            ${r.passwordHash ? '<span class="room-list-lock">🔒</span>' : '<span class="room-list-open">🔓</span>'}
          </div>
        </div>
      `).join('');
    } catch(e) {
      container.innerHTML = '<div class="empty-state">Erreur de chargement. Réessaie.</div>';
      console.error(e);
    }
  },

  selectRoom(code, hasPassword) {
    document.getElementById('join-code').value = code;
    document.getElementById('join-password-row').classList.toggle('hidden', !hasPassword);
    if (hasPassword) {
      // Mot de passe requis → scroll vers le champ et laisser l'utilisateur le saisir
      document.getElementById('join-form-section')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('join-password')?.focus();
      window.App.toast(`Salon ${code} — entre le mot de passe pour continuer`);
    } else {
      // Pas de mot de passe → aller directement à la sélection de profils
      Room.checkRoom();
    }
  },

  // ──────────────────────────────────────────
  // CRÉER UN SALON
  // ──────────────────────────────────────────
  async createRoom() {
    const code   = document.getElementById('create-code').value.trim().toUpperCase();
    const pw     = document.getElementById('create-password').value;
    const pseudo = document.getElementById('create-pseudo').value.trim();
    const errEl  = document.getElementById('create-error');
    errEl.classList.add('hidden');

    if (!code || code.length < 2)   { errEl.textContent = 'Code trop court (min. 2 caractères).'; errEl.classList.remove('hidden'); return; }
    if (!pseudo || pseudo.length < 2){ errEl.textContent = 'Entre un pseudo (min. 2 caractères).';  errEl.classList.remove('hidden'); return; }
    if (!/^[A-Z0-9_\-]{2,20}$/i.test(code)) { errEl.textContent = 'Code invalide (lettres, chiffres, - et _ uniquement).'; errEl.classList.remove('hidden'); return; }

    const selAv = document.querySelector('#avatar-grid-create .avatar-item-wrap.selected');
    if (!selAv) { errEl.textContent = 'Choisis un avatar.'; errEl.classList.remove('hidden'); return; }
    const avatarId = selAv.dataset.avatarId;

    const existing = await getDoc(doc(db, 'rooms', code));
    if (existing.exists()) {
      errEl.textContent = `Le salon "${code}" existe déjà. Choisis un autre code.`;
      errEl.classList.remove('hidden'); return;
    }

    const uid = genUid();
    const passwordHash = await hashPw(pw);
    const playerPw = document.getElementById('create-player-pw').value;
    const playerPasswordHash = await hashPw(playerPw);

    await setDoc(doc(db, 'rooms', code), {
      code, passwordHash,
      hostUid: uid, hostPseudo: pseudo,
      status: 'lobby',
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, 'rooms', code, 'players', uid), {
      uid, pseudo, avatarId, isHost: true,
      score: 0, teamId: null,
      passwordHash: playerPasswordHash,
      online: true, joinedAt: serverTimestamp()
    });

    window.session = { roomCode: code, uid, pseudo, avatarId, isHost: true, teamId: null };
    localStorage.setItem('quiz_session', JSON.stringify(window.session));
    Room._enterLobby();
  },

  // ──────────────────────────────────────────
  // ÉTAPE 1 : Vérifier le salon et afficher les profils
  // ──────────────────────────────────────────
  async checkRoom() {
    const code  = document.getElementById('join-code').value.trim().toUpperCase();
    const pw    = document.getElementById('join-password').value;
    const errEl = document.getElementById('join-error');
    errEl.classList.add('hidden');

    if (!code) { errEl.textContent = 'Entre le code du salon.'; errEl.classList.remove('hidden'); return; }

    const roomSnap = await getDoc(doc(db, 'rooms', code));
    if (!roomSnap.exists()) { errEl.textContent = `Salon "${code}" introuvable.`; errEl.classList.remove('hidden'); return; }
    const roomData = roomSnap.data();

    if (roomData.status === 'closed') { errEl.textContent = 'Ce salon est fermé.'; errEl.classList.remove('hidden'); return; }
    if (roomData.passwordHash) {
      const hash = await hashPw(pw);
      if (hash !== roomData.passwordHash) { errEl.textContent = 'Mot de passe du salon incorrect.'; errEl.classList.remove('hidden'); return; }
    }

    // Charger les joueurs existants
    const pSnap = await getDocs(collection(db, 'rooms', code, 'players'));
    const players = pSnap.docs.map(d => d.data());
    Room._joiningPlayers = players;

    // Stocker le code validé pour l'étape 2
    Room._joiningCode = code;

    // Label étape 2
    const label = document.getElementById('step2-code-label');
    if (label) label.textContent = `Salon : ${code}`;

    // Afficher la sélection de profil
    Room._showProfileSelector(players);
  },

  backToStep1() {
    document.getElementById('join-step1').classList.remove('hidden');
    document.getElementById('join-step2').classList.add('hidden');
    document.getElementById('join-error').classList.add('hidden');
    Room._selectedProfileUid = null;
    Room._joiningCode = null;
  },

  _joiningPlayers: [],

  _showProfileSelector(players) {
    document.getElementById('join-step1').classList.add('hidden');
    document.getElementById('join-step2').classList.remove('hidden');
    document.getElementById('new-profile-section').classList.add('hidden');
    document.getElementById('existing-profile-section').classList.add('hidden');

    const grid = document.getElementById('existing-profiles-grid');
    if (!players.length) {
      grid.innerHTML = '';
    } else {
      grid.innerHTML = players.map(p => {
        const av = (window.AVATARS||[]).find(a => a.id === p.avatarId);
        const hasPassword = !!p.passwordHash;
        const isOnline = p.online === true;
        const clickAttr = isOnline ? '' : `onclick="Room.selectExistingProfile('${p.uid}')"`;
        return `<div class="profile-card ${isOnline ? 'profile-occupied' : ''}" ${clickAttr} data-uid="${p.uid}">
          <div class="profile-avatar">${av ? av.svg : ''}</div>
          <div class="profile-name">${p.pseudo}</div>
          ${isOnline
            ? `<div class="profile-online-badge">🟢 En ligne</div>`
            : `<div class="profile-score">${p.score > 0 ? p.score+' pts' : ''}</div>
               ${hasPassword ? '<div class="profile-lock">🔒</div>' : ''}`
          }
        </div>`;
      }).join('');
    }

    window.App.renderAvatarGrid('join2');
  },

  _selectedProfileUid: null,

  selectExistingProfile(uid) {
    Room._selectedProfileUid = uid;
    document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.profile-card[data-uid="${uid}"]`)?.classList.add('selected');
    const player = Room._joiningPlayers?.find(p => p.uid === uid);
    document.getElementById('new-profile-section').classList.add('hidden');
    document.getElementById('existing-profile-section').classList.remove('hidden');
    document.getElementById('existing-profile-pw-row').classList.toggle('hidden', !player?.passwordHash);
    document.getElementById('existing-profile-pw').value = '';
    document.getElementById('join-error2').classList.add('hidden');
  },

  selectNewProfile() {
    Room._selectedProfileUid = null;
    document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('selected'));
    document.querySelector('.profile-card-new')?.classList.add('selected');
    document.getElementById('new-profile-section').classList.remove('hidden');
    document.getElementById('existing-profile-section').classList.add('hidden');
  },

  _renderAvatarGridJoin() {
    window.App.renderAvatarGrid('join2');
  },

  // ──────────────────────────────────────────
  // ÉTAPE 2 : Rejoindre avec profil choisi
  // ──────────────────────────────────────────
  async joinRoom() {
    const code  = Room._joiningCode;
    const errEl = document.getElementById('join-error2');
    errEl.classList.add('hidden');

    if (Room._selectedProfileUid) {
      // ── Rejoindre un profil existant
      const pSnap = await getDoc(doc(db, 'rooms', code, 'players', Room._selectedProfileUid));
      if (!pSnap.exists()) { errEl.textContent = 'Profil introuvable.'; errEl.classList.remove('hidden'); return; }
      const player = pSnap.data();

      if (player.passwordHash) {
        const pw = document.getElementById('existing-profile-pw').value;
        const hash = await hashPw(pw);
        if (hash !== player.passwordHash) { errEl.textContent = 'Mot de passe incorrect.'; errEl.classList.remove('hidden'); return; }
      }

      // Marquer online
      await updateDoc(doc(db,'rooms',code,'players',player.uid), { online: true });
      window.session = { roomCode:code, uid:player.uid, pseudo:player.pseudo, avatarId:player.avatarId, isHost:player.isHost||false, teamId:player.teamId||null };
      localStorage.setItem('quiz_session', JSON.stringify(window.session));
      Room._enterLobby();

    } else {
      // ── Créer un nouveau profil
      const pseudo = document.getElementById('join-new-pseudo').value.trim();
      const playerPw = document.getElementById('join-new-pw').value;
      if (!pseudo || pseudo.length < 2) { errEl.textContent = 'Entre un pseudo (min. 2 caractères).'; errEl.classList.remove('hidden'); return; }

      const selAv = document.querySelector('#avatar-grid-join2 .avatar-item-wrap.selected');
      if (!selAv) { errEl.textContent = 'Choisis un avatar.'; errEl.classList.remove('hidden'); return; }
      const avatarId = selAv.dataset.avatarId;

      // Vérifier pseudo unique
      const pSnap = await getDocs(collection(db,'rooms',code,'players'));
      Room._joiningPlayers = pSnap.docs.map(d => d.data());
      const taken = Room._joiningPlayers.some(p => p.pseudo.toLowerCase() === pseudo.toLowerCase());
      if (taken) { errEl.textContent = 'Ce pseudo est déjà pris.'; errEl.classList.remove('hidden'); return; }

      const uid = genUid();
      const passwordHash = await hashPw(playerPw);
      await setDoc(doc(db,'rooms',code,'players',uid), {
        uid, pseudo, avatarId, isHost: false,
        score: 0, teamId: null, passwordHash,
        online: true, joinedAt: serverTimestamp()
      });

      window.session = { roomCode:code, uid, pseudo, avatarId, isHost:false, teamId:null };
      localStorage.setItem('quiz_session', JSON.stringify(window.session));
      Room._enterLobby();
    }
  },

  // Aussi : stocker passwordHash à la création du host
  async _saveHostPassword(roomCode, uid, playerPw) {
    const passwordHash = await hashPw(playerPw);
    if (passwordHash) await updateDoc(doc(db,'rooms',roomCode,'players',uid), { passwordHash });
  },

  // ──────────────────────────────────────────
  // ENTRER DANS LE LOBBY
  // ──────────────────────────────────────────
  _enterLobby() {
    const { roomCode, isHost, uid } = window.session;

    // Marquer le joueur comme en ligne dès l'entrée dans le lobby
    updateDoc(doc(db, 'rooms', roomCode, 'players', uid), { online: true }).catch(()=>{});

    document.getElementById('lobby-code-badge').textContent = `CODE: ${roomCode}`;
    document.getElementById('lobby-title').textContent = roomCode;
    document.getElementById('host-controls').classList.toggle('hidden', !isHost);
    document.getElementById('player-waiting').classList.toggle('hidden', isHost);
    document.getElementById('btn-add-team')?.classList.toggle('hidden', !isHost);

    // Init rounds UI si host
    if (isHost) Room._initRoundsUI();

    App.showScreen('lobby');

    // Listeners
    if (_unsubPlayers) _unsubPlayers();
    _unsubPlayers = onSnapshot(
      query(collection(db, 'rooms', roomCode, 'players'), orderBy('joinedAt')),
      snap => Room._renderPlayers(snap.docs.map(d => d.data()))
    );

  // Écouter les équipes — affiché pour TOUS les joueurs
    if (_unsubTeams) _unsubTeams();
    _unsubTeams = onSnapshot(
      collection(db, 'rooms', roomCode, 'teams'),
      snap => Room._renderTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    if (_unsubGame) _unsubGame();
    _unsubGame = onSnapshot(doc(db, 'rooms', roomCode, 'game', 'current'), snap => {
      if (!snap.exists()) {
        // Pas de partie en cours — cacher le bouton rejoin
        document.getElementById('rejoin-game-btn')?.classList.add('hidden');
        return;
      }
      const state = snap.data();
      const inProgress = ['question','reveal','paused'].includes(state.status);
      // Bouton rejoin visible pour les non-host seulement si partie en cours
      const rejoignBtn = document.getElementById('rejoin-game-btn');
      if (rejoignBtn && !window.session.isHost) {
        rejoignBtn.classList.toggle('hidden', !(inProgress && window.Game?.isPlayerOut()));
      }
      // Déléguer au moteur de jeu
      window.Game._handleGameState(state);
    });

    // Écouter le salon lui-même (pour détecter fermeture par host)
    if (_unsubRoom) _unsubRoom();
    _unsubRoom = onSnapshot(doc(db, 'rooms', roomCode), snap => {
      if (!snap.exists() || snap.data().status === 'closed') {
        Room._onRoomClosed();
      }
    });
  },

  // ──────────────────────────────────────────
  // SALON FERMÉ (host parti)
  // ──────────────────────────────────────────
  _onRoomClosed() {
    if (_unsubPlayers) { _unsubPlayers(); _unsubPlayers = null; }
    if (_unsubGame)    { _unsubGame();    _unsubGame    = null; }
    if (_unsubTeams)   { _unsubTeams();   _unsubTeams   = null; }
    if (_unsubRoom)    { _unsubRoom();    _unsubRoom    = null; }
    // Stopper le timer de jeu si en cours
    if (window.Game?._hostTimer) clearTimeout(window.Game._hostTimer);
    if (window.Game?._hostAnswerWatcher) { window.Game._hostAnswerWatcher(); window.Game._hostAnswerWatcher = null; }
    localStorage.removeItem('quiz_session');
    window.session = { roomCode:null, uid:null, pseudo:null, avatarId:null, isHost:false, teamId:null };
    window.App.toast('Le salon a été fermé par le host.');
    // Retour au menu depuis n'importe quel écran
    App.showScreen('home');
  },

  // ──────────────────────────────────────────
  // AFFICHER LES JOUEURS
  // ──────────────────────────────────────────
  _renderPlayers(players) {
    document.getElementById('player-count').textContent = players.length;

    // Classement trié par score
    const sorted = [...players].sort((a,b) => (b.score||0) - (a.score||0));
    const maxScore = sorted[0]?.score || 0;
    const rankIcons = ['🥇','🥈','🥉'];

    document.getElementById('lobby-players-grid').innerHTML = sorted.map((p, rank) => {
      const av = (window.AVATARS||[]).find(a => a.id === p.avatarId);
      const isMe = p.uid === window.session.uid;
      const rankDisplay = maxScore > 0
        ? (rank < 3 ? rankIcons[rank] : `${rank+1}`)
        : '';
      return `<div class="lobby-player-card ${p.isHost?'is-host':''} ${isMe?'is-me':''}" >
        ${rankDisplay ? `<div class="lobby-player-rank">${rankDisplay}</div>` : ''}
        <div class="lobby-player-avatar">${av ? av.svg : ''}</div>
        <div class="lobby-player-name">${p.pseudo}${isMe?' 👈':''}</div>
        ${p.isHost ? '<div class="lobby-player-host-badge">👑 Host</div>' : ''}
        <div class="lobby-player-score">${p.score > 0 ? p.score+' pts' : ''}</div>
        ${p.teamName ? `<div class="lobby-player-team">${p.teamName}</div>` : ''}
      </div>`;
    }).join('');
  },

  // ──────────────────────────────────────────
  // SYSTÈME DE MANCHES
  // ──────────────────────────────────────────
  _rounds: [{ ...DEFAULT_ROUND }],  // tableau des manches configurées

  _initRoundsUI() {
    Room._rounds = [{ ...DEFAULT_ROUND }];
    Room._renderRoundsUI();
  },

  _renderRoundsUI() {
    const container = document.getElementById('rounds-container');
    if (!container) return;
    container.innerHTML = Room._rounds.map((r, i) => `
      <div class="round-card" id="round-card-${i}">
        <div class="round-card-header">
          <span class="round-card-title">Manche ${i+1}</span>
          ${Room._rounds.length > 1
            ? `<button class="round-delete-btn" onclick="Room.deleteRound(${i})">✕</button>`
            : ''}
        </div>
        <div class="round-config">
          <div class="config-row">
            <span class="config-label">Mode</span>
            <div class="btn-group">${['normal','blind','speed'].map(v =>
              `<button class="btn-toggle${r.mode===v?' active':''}"
                onclick="Room.setRound(${i},'mode','${v}')">${{normal:'🎯 Normal',blind:'🙈 Aveugle',speed:'⚡ Vitesse'}[v]}</button>`
            ).join('')}</div>
          </div>
          <div class="config-row">
            <span class="config-label">Questions</span>
            <div class="btn-group">${[5,10,15,0].map(v =>
              `<button class="btn-toggle${r.count===v?' active':''}"
                onclick="Room.setRound(${i},'count',${v})">${v===0?'Toutes':v}</button>`
            ).join('')}</div>
          </div>
          <div class="config-row">
            <span class="config-label">Thème</span>
            <div class="btn-group">${[['all','Tous'],['manga','Mangas'],['jv','JV'],['roman','Romans'],['series','Séries'],['gameplay','Gameplay']].map(([v,l]) =>
              `<button class="btn-toggle${r.theme===v?' active':''}"
                onclick="Room.setRound(${i},'theme','${v}')">${l}</button>`
            ).join('')}</div>
          </div>
          <div class="config-row">
            <span class="config-label">Difficulté</span>
            <div class="btn-group">${[['all','Toutes'],['debutant','Débutant'],['connaisseur','Connaisseur'],['otaku','Otaku']].map(([v,l]) =>
              `<button class="btn-toggle${r.difficulty===v?' active':''}"
                onclick="Room.setRound(${i},'difficulty','${v}')">${l}</button>`
            ).join('')}</div>
          </div>
          <div class="config-row">
            <span class="config-label">Timer</span>
            <div class="btn-group">${[10,15,20,30,45].map(v =>
              `<button class="btn-toggle${r.timer===v?' active':''}"
                onclick="Room.setRound(${i},'timer',${v})">${v}s</button>`
            ).join('')}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  setRound(idx, key, value) {
    Room._rounds[idx][key] = value;
    Room._renderRoundsUI();
  },

  addRound() {
    Room._rounds.push({ ...DEFAULT_ROUND });
    Room._renderRoundsUI();
    // Scroll vers la nouvelle manche
    setTimeout(() => {
      const last = document.getElementById(`round-card-${Room._rounds.length-1}`);
      last?.scrollIntoView({ behavior:'smooth' });
    }, 100);
  },

  deleteRound(idx) {
    if (Room._rounds.length <= 1) return;
    Room._rounds.splice(idx, 1);
    Room._renderRoundsUI();
  },

  // ──────────────────────────────────────────
  // ÉQUIPES
  // ──────────────────────────────────────────
  _teams: [],

  _renderTeams(teams) {
    Room._teams = teams;
    const container = document.getElementById('teams-list');
    if (!container) return;

    // Synchroniser session.teamId depuis les données Firestore
    // (source de vérité : le doc joueur dans Firestore)
    const myUid = window.session.uid;
    for (const t of teams) {
      if ((t.memberUids||[]).includes(myUid)) {
        window.session.teamId = t.id;
        break;
      }
    }
    // Si on n'est dans aucune équipe
    if (!teams.some(t => (t.memberUids||[]).includes(myUid))) {
      window.session.teamId = null;
    }
    const myTeamId = window.session.teamId;

    if (!teams.length) {
      container.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:8px 0">Aucune équipe pour l\'instant.</div>';
      return;
    }

    // Trier par score décroissant pour le classement
    const sorted = [...teams].sort((a,b) => (b.score||0) - (a.score||0));
    const maxScore = sorted[0]?.score || 0;

    container.innerHTML = sorted.map((t, rank) => {
      const isMyTeam = myTeamId === t.id;
      const members = (t.memberNames||[]).join(', ') || 'Aucun membre';
      const isLeading = maxScore > 0 && t.score === maxScore;
      // Stocker id et nom dans data attributes pour éviter le bug apostrophe
      return `<div class="team-card-lobby ${isMyTeam ? 'team-card-mine' : ''}">
        <span class="team-rank">${rank === 0 && maxScore > 0 ? '⭐' : rank+1}</span>
        <div class="team-card-info">
          <span class="team-card-name">👥 ${t.name}</span>
          <span class="team-card-members">${members}</span>
        </div>
        <span class="team-card-score">${t.score > 0 ? t.score+' pts' : ''}</span>
        ${isMyTeam
          ? `<span class="team-joined-badge">✓ Rejoint</span>`
          : `<button class="team-join-btn"
               data-team-id="${t.id}"
               data-team-name="${t.name.replace(/"/g,'&quot;')}"
               onclick="Room._onJoinTeamClick(this)">Rejoindre</button>`}
        ${window.session.isHost
          ? `<button class="team-delete-btn" data-team-id="${t.id}" onclick="Room._onDeleteTeamClick(this)">✕</button>`
          : ''}
      </div>`;
    }).join('');
  },

  // Handlers utilisant data attributes — évite tout bug d'apostrophe
  _onJoinTeamClick(btn) {
    const teamId   = btn.dataset.teamId;
    const teamName = btn.dataset.teamName;
    Room.joinTeam(teamId, teamName, btn);
  },

  _onDeleteTeamClick(btn) {
    Room.deleteTeam(btn.dataset.teamId);
  },

  async addTeam() {
    window.Modal.show('Créer une équipe', `
      <div class="form-group"><label>Nom de l'équipe</label>
      <input type="text" id="new-team-name" placeholder="ex: Les Otakus" maxlength="30"/></div>
    `, [
      { label: 'Annuler', class: 'btn btn-ghost', onclick: 'Modal.close()' },
      { label: '✅ Créer', class: 'btn btn-primary', onclick: 'Room.confirmAddTeam()' }
    ]);
  },

  async confirmAddTeam() {
    const name = document.getElementById('new-team-name').value.trim();
    if (!name) { window.App.toast('Nom requis !'); return; }
    // Vérifier nom unique
    if (Room._teams.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      window.App.toast('Une équipe avec ce nom existe déjà !'); return;
    }
    const id = 'team_' + Date.now().toString(36);
    await setDoc(doc(db, 'rooms', window.session.roomCode, 'teams', id), {
      name, memberUids: [], memberNames: [], score: 0
    });
    window.Modal.close();
    window.App.toast(`Équipe "${name}" créée !`);
  },

  async joinTeam(teamId, teamName, btn) {
    // Empêcher le double-clic
    if (btn) { btn.disabled = true; btn.textContent = '…'; }

    const { roomCode, uid, pseudo } = window.session;
    // Vérifier qu'on n'est pas déjà dans cette équipe
    if (window.session.teamId === teamId) {
      if (btn) { btn.disabled = false; btn.textContent = 'Rejoindre'; }
      return;
    }
    const team = Room._teams.find(t => t.id === teamId);
    if (!team) { if (btn) { btn.disabled = false; btn.textContent = 'Rejoindre'; } return; }

    // Quitter l'ancienne équipe si besoin
    if (window.session.teamId && window.session.teamId !== teamId) {
      const old = Room._teams.find(t => t.id === window.session.teamId);
      if (old) await updateDoc(doc(db,'rooms',roomCode,'teams',window.session.teamId), {
        memberUids: (old.memberUids||[]).filter(i => i !== uid),
        memberNames: (old.memberNames||[]).filter(n => n !== pseudo)
      }).catch(()=>{});
    }

    // Vérifier qu'on n'est pas déjà membre (double-clic réseau)
    if ((team.memberUids||[]).includes(uid)) {
      window.session.teamId = teamId;
      localStorage.setItem('quiz_session', JSON.stringify(window.session));
      return;
    }

    await updateDoc(doc(db,'rooms',roomCode,'teams',teamId), {
      memberUids: [...(team.memberUids||[]), uid],
      memberNames: [...(team.memberNames||[]), pseudo]
    });
    await updateDoc(doc(db,'rooms',roomCode,'players',uid), { teamId, teamName });
    window.session.teamId = teamId;
    localStorage.setItem('quiz_session', JSON.stringify(window.session));
    window.App.toast(`Équipe "${teamName}" rejointe !`);
  },

  async deleteTeam(teamId) {
    const { roomCode } = window.session;
    const team = Room._teams.find(t => t.id === teamId);
    if (team?.memberUids?.length) {
      await Promise.all(team.memberUids.map(uid =>
        updateDoc(doc(db,'rooms',roomCode,'players',uid), { teamId:null, teamName:null }).catch(()=>{})
      ));
    }
    await deleteDoc(doc(db,'rooms',roomCode,'teams',teamId));
    window.App.toast('Équipe supprimée');
  },

  // ──────────────────────────────────────────
  // QUITTER LE SALON
  // ──────────────────────────────────────────
  async leaveRoom() {
    window.Modal.show('Quitter le salon ?',
      window.session.isHost
        ? '<p>Tu es le host. <strong>Quitter ferme le salon pour tout le monde.</strong></p>'
        : '<p>Ton score sera conservé si tu reviens avec le même code.</p>',
      [
        { label: 'Rester', class: 'btn btn-ghost', onclick: 'Modal.close()' },
        { label: 'Quitter', class: 'btn btn-danger', onclick: 'Room._confirmLeave()' }
      ]
    );
  },

  async _confirmLeave() {
    window.Modal.close();
    const { roomCode, uid, isHost } = window.session;

    try {
      if (isHost) {
        // 1. D'abord écrire dans Firestore — les listeners des joueurs reçoivent AVANT qu'on les coupe
        await updateDoc(doc(db,'rooms',roomCode,'game','current'), { status: 'host_left' }).catch(()=>{});
        // 2. Laisser le temps aux clients de recevoir le snapshot
        await new Promise(r => setTimeout(r, 2000));
        // 3. Maintenant seulement couper nos propres listeners
        if (_unsubPlayers) { _unsubPlayers(); _unsubPlayers = null; }
        if (_unsubGame)    { _unsubGame();    _unsubGame    = null; }
        if (_unsubTeams)   { _unsubTeams();   _unsubTeams   = null; }
        if (_unsubRoom)    { _unsubRoom();    _unsubRoom    = null; }
        // 4. Marquer le salon fermé
        await updateDoc(doc(db,'rooms',roomCode), { status:'closed' });
        await new Promise(r => setTimeout(r, 500));
        // 5. Supprimer toutes les sous-collections
        const [pSnap, tSnap] = await Promise.all([
          getDocs(collection(db,'rooms',roomCode,'players')),
          getDocs(collection(db,'rooms',roomCode,'teams'))
        ]);
        await Promise.all([
          ...pSnap.docs.map(d => deleteDoc(d.ref)),
          ...tSnap.docs.map(d => deleteDoc(d.ref)),
          deleteDoc(doc(db,'rooms',roomCode,'game','current')).catch(()=>{})
        ]);
        await deleteDoc(doc(db,'rooms',roomCode)).catch(()=>{});
      } else {
        // Joueur simple : couper les listeners puis marquer offline
        if (_unsubPlayers) { _unsubPlayers(); _unsubPlayers = null; }
        if (_unsubGame)    { _unsubGame();    _unsubGame    = null; }
        if (_unsubTeams)   { _unsubTeams();   _unsubTeams   = null; }
        if (_unsubRoom)    { _unsubRoom();    _unsubRoom    = null; }
        await updateDoc(doc(db,'rooms',roomCode,'players',uid), { online: false }).catch(()=>{});
      }
    } catch(e) { console.error('leaveRoom error:', e); }

    localStorage.removeItem('quiz_session');
    window.session = { roomCode:null, uid:null, pseudo:null, avatarId:null, isHost:false, teamId:null };
    App.showScreen('home');
  },

  // ──────────────────────────────────────────
  // RETOUR AU LOBBY (fin de partie)
  // ──────────────────────────────────────────
  async backToLobby() {
    // Les scores s'accumulent — PAS de remise à zéro
    App.showScreen('lobby');
    await updateDoc(doc(db,'rooms',window.session.roomCode), { status:'lobby' }).catch(()=>{});
  },

  // ──────────────────────────────────────────
  // RESTAURER SESSION
  // ──────────────────────────────────────────
  async restoreSession() {
    const saved = localStorage.getItem('quiz_session');
    if (!saved) return false;
    try {
      const sess = JSON.parse(saved);
      if (!sess.roomCode || !sess.uid) return false;
      const [roomSnap, playerSnap] = await Promise.all([
        getDoc(doc(db,'rooms',sess.roomCode)),
        getDoc(doc(db,'rooms',sess.roomCode,'players',sess.uid))
      ]);
      if (!roomSnap.exists() || roomSnap.data().status === 'closed') {
        localStorage.removeItem('quiz_session');
        return false;
      }
      if (!playerSnap.exists()) {
        // Recréer le joueur avec les infos sauvegardées (score conservé dans sess)
        await setDoc(doc(db,'rooms',sess.roomCode,'players',sess.uid), {
          uid: sess.uid, pseudo: sess.pseudo, avatarId: sess.avatarId,
          isHost: sess.isHost, score: sess.score || 0,
          teamId: sess.teamId || null, joinedAt: serverTimestamp(), online: true
        });
        window.session = { ...sess };
      } else {
        window.session = { ...sess, ...playerSnap.data() };
      }
      localStorage.setItem('quiz_session', JSON.stringify(window.session));
      Room._enterLobby();
      return true;
    } catch(e) {
      localStorage.removeItem('quiz_session');
      return false;
    }
  }
};

window.Room = Room;