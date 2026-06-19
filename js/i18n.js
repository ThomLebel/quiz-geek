// ═══════════════════════════════════════════
// i18n.js — Internationalization (FR / EN)
// ═══════════════════════════════════════════

// ── UI Strings ────────────────────────────
const STRINGS = {
  fr: {
    // Loading
    loading_sub: 'Quiz multijoueur',

    // Home
    home_sub: 'Questions · Mangas · Jeux Vidéo · Séries',
    btn_create: '🎮 Créer un salon',
    btn_join: '🔑 Rejoindre un salon',

    // Create room
    screen_create_title: 'Créer un salon',
    label_room_code: 'Code du salon',
    placeholder_room_code: 'ex: NARUTO42',
    hint_room_code: 'Tes amis devront entrer ce code pour rejoindre',
    label_room_password: 'Mot de passe du salon (optionnel)',
    placeholder_room_password: 'Laisser vide = salon public',
    label_host_pseudo: 'Ton pseudo (host)',
    placeholder_host_pseudo: 'ex: NarutoFan42',
    label_player_password: 'Mot de passe de ton profil (optionnel)',
    placeholder_player_password: 'Pour protéger ton profil',
    hint_player_password: 'Les autres joueurs ne pourront pas utiliser ton profil sans ce mot de passe',
    label_avatar: 'Ton avatar',
    btn_create_room: '🚀 Créer le salon',

    // Join room
    screen_join_title: 'Rejoindre un salon',
    label_open_rooms: 'Salons ouverts',
    loading_rooms: 'Chargement…',
    label_join_code: 'Code du salon',
    label_join_salon_password: 'Mot de passe du salon',
    btn_see_profiles: 'Voir les profils →',
    label_choose_profile: 'Choisir un profil',
    new_player: 'Nouveau joueur',
    label_profile_password: 'Mot de passe du profil',
    btn_join_with_profile: '🎮 Rejoindre avec ce profil',
    label_pseudo: 'Ton pseudo',
    btn_join: '🎮 Rejoindre',

    // Lobby
    lobby_title: 'Salon',
    host_panel_title: '⚙️ Configuration de la partie',
    btn_add_round: '+ Ajouter une manche',
    btn_start: '🚀 Lancer la partie !',
    waiting_title: 'En attente…',
    waiting_sub: 'Le host configure la partie',
    btn_rejoin: '🎮 Retourner dans la partie',
    section_teams: '👥 Équipes',
    btn_add_team: '+ Créer une équipe',
    section_players: 'Joueurs dans le salon',

    // Game
    game_leave: 'Quitter ✕',
    pause_title: '⏸ PAUSE',
    pause_sub: 'Le host reprendra bientôt…',
    btn_resume: '▶ Reprendre la partie',
    blind_placeholder: 'Ta réponse…',
    btn_blind_reveal: '👁 Voir les propositions',
    first_to_answer: 'Premiers à répondre',

    // Reveal
    correct_answer_label: 'Bonne réponse',
    players_answers_label: 'Réponses des joueurs',
    next_countdown_sub: 'secondes…',

    // End
    end_title: 'Partie terminée !',
    end_score_label: 'points gagnés',

    // Leaderboard
    leaderboard_title: '🏆 Classement',
    tab_players: 'Joueurs',
    tab_teams: 'Équipes',

    // Buttons
    back: '← Retour',
    btn_host_advance: '➡ Continuer',
    btn_force_reveal: '⏭ Corriger',
    btn_final_leaderboard: '🏆 Classement final',
    btn_back_lobby: '🏠 Retour au salon',

    // Dynamic
    result_miss: 'Raté',
    result_no_answer: 'Pas répondu',
    end_of_game: 'Fin de la partie !',
    question_n: (n, total) => `Question ${n} / ${total}`,
    round_toast: (n, total, mode) => `Manche ${n} / ${total} — ${mode}`,
    answers_count: (n) => `${n} réponses`,
    correct_answers: (n) => `${n} bonne${n > 1 ? 's' : ''} réponse${n > 1 ? 's' : ''}`,
    wrong_answers: (n) => `${n} erreur${n !== 1 ? 's' : ''}`,
    success_pct: (pct) => `${pct}% de réussite`,
    blind_correct: '✅ Bonne réponse !',
    toast_preparing: 'Préparation de la partie…',
    toast_local_questions: 'Utilisation des questions locales (Firestore vide)',
    toast_no_questions: 'Aucune question disponible !',
    toast_no_questions_filter: 'Aucune question disponible pour ces filtres !',
    toast_pool_reset: 'Pool réinitialisé pour ce thème !',
    toast_host_stopped: "L'host a arrêté la partie.",
    toast_resume: 'Reprise !',
    toast_pause: 'Pause',
    toast_blind_input: 'Entre une réponse !',
    team_placeholder: 'ex: Les Otakus',

    // Modals — game
    modal_stop_title: 'Arrêter la partie ?',
    modal_stop_body: '<p>Tous les joueurs seront renvoyés dans le lobby. Le salon reste ouvert.</p>',
    modal_stop_confirm: 'Arrêter la partie',
    modal_leave_title: 'Quitter la partie ?',
    modal_leave_body: '<p>Tu retourneras dans le lobby. Tu pourras rejoindre si la partie est toujours en cours.</p>',

    // Modals — room
    modal_create_team_title: 'Créer une équipe',
    modal_create_team_label: "Nom de l'équipe",
    modal_leave_room_title: 'Quitter le salon ?',
    modal_leave_room_host: '<p>Tu es le host. <strong>Quitter ferme le salon pour tout le monde.</strong></p>',
    modal_leave_room_player: '<p>Ton score sera conservé si tu reviens avec le même code.</p>',

    // Modal buttons
    modal_cancel: 'Annuler',
    modal_continue: 'Continuer',
    modal_stay: 'Rester',
    modal_leave: 'Quitter',
    modal_create: '✅ Créer',


    // Room errors
    err_room_exists: (code) => `Le salon "${code}" existe déjà. Choisis un autre code.`,
    err_room_not_found: (code) => `Salon "${code}" introuvable.`,
    room_label: (code) => `Salon : ${code}`,

    // Teams
    no_teams_yet: 'Aucune équipe pour l\'instant.',
    no_members: 'Aucun membre',

    // Leaderboard
    lb_no_players: 'Aucun joueur dans ce salon.',
    lb_no_teams: 'Aucune équipe dans ce salon.',
    lb_error: 'Erreur de chargement.',
    lb_team_prefix: 'Équipe :',
    lb_no_team: 'Sans équipe',

    // Room list
    no_open_rooms: 'Aucun salon ouvert pour le moment.',
    room_load_error: 'Erreur de chargement. Réessaie.',
    room_password_hint: (code) => `Salon ${code} — entre le mot de passe pour continuer`,
    room_closed: 'Le salon a été fermé par le host.',

    // Themes
    theme_all: 'Tous',
    theme_manga: 'Mangas',
    theme_jv: 'JV',
    theme_roman: 'Romans',
    theme_series: 'Séries',
    theme_gameplay: 'Gameplay',
    round_count_all: 'Toutes',
    round_label_config: (n) => `Manche ${n}`,
    config_label_mode: 'Mode',
    config_label_questions: 'Questions',
    config_label_theme: 'Thème',
    config_label_difficulty: 'Difficulté',
    config_label_timer: 'Timer',

    // Teams
    team_name_required: 'Nom requis !',
    team_name_duplicate: 'Une équipe avec ce nom existe déjà !',
    team_created: (name) => `Équipe "${name}" créée !`,
    team_joined: (name) => `Équipe "${name}" rejointe !`,
    team_deleted: 'Équipe supprimée',
    btn_join_team: 'Rejoindre',

    // Validation errors
    err_code_short: 'Code trop court (min. 2 caractères).',
    err_pseudo_short: 'Entre un pseudo (min. 2 caractères).',
    err_code_invalid: 'Code invalide (lettres, chiffres, - et _ uniquement).',
    err_no_avatar: 'Choisis un avatar.',
    err_no_code: 'Entre le code du salon.',
    err_room_closed: 'Ce salon est fermé.',
    err_room_password: 'Mot de passe du salon incorrect.',
    err_profile_not_found: 'Profil introuvable.',
    err_profile_password: 'Mot de passe incorrect.',
    err_pseudo_taken: 'Ce pseudo est déjà pris.',


    // Dynamic badges & misc
    online_badge: 'En ligne',
    team_joined_badge: 'Rejoint',
    host_badge: 'Host',
    speed_no_one_yet: 'Personne encore…',
    section_players: 'Joueurs dans le salon',
    btn_force_reveal: '⏭ Corriger',

    // Modes
    mode_normal: '🎯 Normal',
    mode_blind: '🙈 Aveugle',
    mode_speed: '⚡ Vitesse',

    // Difficulties
    diff_all: 'Toutes',
    diff_debutant: 'Débutant',
    diff_connaisseur: 'Connaisseur',
    diff_otaku: 'Otaku',

    // Round config labels
    round_label: (n) => `Manche ${n}`,
    round_mode_label: 'Mode',
    round_theme_label: 'Difficulté',
    round_count_label: 'Questions',
    round_theme_questions: (n) => `${n} q.`,
    btn_delete_round: '🗑',

    // Host game bar
    host_btn_pause: '⏸',
    host_btn_correct: '⏭ Corriger',
  },

  en: {
    // Loading
    loading_sub: 'Multiplayer Quiz',

    // Home
    home_sub: 'Questions · Manga · Video Games · Series',
    btn_create: '🎮 Create a room',
    btn_join: '🔑 Join a room',

    // Create room
    screen_create_title: 'Create a room',
    label_room_code: 'Room code',
    placeholder_room_code: 'e.g. NARUTO42',
    hint_room_code: 'Your friends will need to enter this code to join',
    label_room_password: 'Room password (optional)',
    placeholder_room_password: 'Leave empty = public room',
    label_host_pseudo: 'Your username (host)',
    placeholder_host_pseudo: 'e.g. NarutoFan42',
    label_player_password: 'Profile password (optional)',
    placeholder_player_password: 'To protect your profile',
    hint_player_password: 'Other players won\'t be able to use your profile without this password',
    label_avatar: 'Your avatar',
    btn_create_room: '🚀 Create room',

    // Join room
    screen_join_title: 'Join a room',
    label_open_rooms: 'Open rooms',
    loading_rooms: 'Loading…',
    label_join_code: 'Room code',
    label_join_salon_password: 'Room password',
    btn_see_profiles: 'See profiles →',
    label_choose_profile: 'Choose a profile',
    new_player: 'New player',
    label_profile_password: 'Profile password',
    btn_join_with_profile: '🎮 Join with this profile',
    label_pseudo: 'Your username',
    btn_join: '🎮 Join',

    // Lobby
    lobby_title: 'Room',
    host_panel_title: '⚙️ Game settings',
    btn_add_round: '+ Add a round',
    btn_start: '🚀 Start the game!',
    waiting_title: 'Waiting…',
    waiting_sub: 'The host is setting up the game',
    btn_rejoin: '🎮 Rejoin the game',
    section_teams: '👥 Teams',
    btn_add_team: '+ Create a team',
    section_players: 'Players in room',

    // Game
    game_leave: 'Leave ✕',
    pause_title: '⏸ PAUSE',
    pause_sub: 'The host will resume soon…',
    btn_resume: '▶ Resume game',
    blind_placeholder: 'Your answer…',
    btn_blind_reveal: '👁 Show choices',
    first_to_answer: 'First to answer',

    // Reveal
    correct_answer_label: 'Correct answer',
    players_answers_label: 'Player answers',
    next_countdown_sub: 'seconds…',

    // End
    end_title: 'Game over!',
    end_score_label: 'points earned',

    // Leaderboard
    leaderboard_title: '🏆 Leaderboard',
    tab_players: 'Players',
    tab_teams: 'Teams',

    // Buttons
    back: '← Back',
    btn_host_advance: '➡ Continue',
    btn_force_reveal: '⏭ Reveal',
    btn_final_leaderboard: '🏆 Final leaderboard',
    btn_back_lobby: '🏠 Back to room',

    // Dynamic
    result_miss: 'Missed',
    result_no_answer: 'No answer',
    end_of_game: 'End of game!',
    question_n: (n, total) => `Question ${n} / ${total}`,
    round_toast: (n, total, mode) => `Round ${n} / ${total} — ${mode}`,
    answers_count: (n) => `${n} answer${n !== 1 ? 's' : ''}`,
    correct_answers: (n) => `${n} correct answer${n !== 1 ? 's' : ''}`,
    wrong_answers: (n) => `${n} wrong answer${n !== 1 ? 's' : ''}`,
    success_pct: (pct) => `${pct}% success rate`,
    blind_correct: '✅ Correct!',
    toast_preparing: 'Preparing game…',
    toast_local_questions: 'Using local questions (Firestore empty)',
    toast_no_questions: 'No questions available!',
    toast_no_questions_filter: 'No questions available for these filters!',
    toast_pool_reset: 'Pool reset for this theme!',
    toast_host_stopped: 'The host stopped the game.',
    toast_resume: 'Resumed!',
    toast_pause: 'Paused',
    toast_blind_input: 'Enter an answer!',
    team_placeholder: 'e.g. The Otakus',

    // Modals — game
    modal_stop_title: 'Stop the game?',
    modal_stop_body: '<p>All players will be sent back to the lobby. The room will stay open.</p>',
    modal_stop_confirm: 'Stop the game',
    modal_leave_title: 'Leave the game?',
    modal_leave_body: '<p>You will return to the lobby. You can rejoin if the game is still running.</p>',

    // Modals — room
    modal_create_team_title: 'Create a team',
    modal_create_team_label: 'Team name',
    modal_leave_room_title: 'Leave the room?',
    modal_leave_room_host: '<p>You are the host. <strong>Leaving will close the room for everyone.</strong></p>',
    modal_leave_room_player: '<p>Your score will be kept if you come back with the same code.</p>',

    // Modal buttons
    modal_cancel: 'Cancel',
    modal_continue: 'Continue',
    modal_stay: 'Stay',
    modal_leave: 'Leave',
    modal_create: '✅ Create',


    // Room errors
    err_room_exists: (code) => `Room "${code}" already exists. Choose a different code.`,
    err_room_not_found: (code) => `Room "${code}" not found.`,
    room_label: (code) => `Room: ${code}`,

    // Teams
    no_teams_yet: 'No teams yet.',
    no_members: 'No members',

    // Leaderboard
    lb_no_players: 'No players in this room.',
    lb_no_teams: 'No teams in this room.',
    lb_error: 'Loading error.',
    lb_team_prefix: 'Team:',
    lb_no_team: 'No team',

    // Room list
    no_open_rooms: 'No open rooms at the moment.',
    room_load_error: 'Loading error. Please try again.',
    room_password_hint: (code) => `Room ${code} — enter the password to continue`,
    room_closed: 'The room was closed by the host.',

    // Themes
    theme_all: 'All',
    theme_manga: 'Manga',
    theme_jv: 'Video Games',
    theme_roman: 'Novels',
    theme_series: 'Series',
    theme_gameplay: 'Gameplay',
    round_count_all: 'All',
    round_label_config: (n) => `Round ${n}`,
    config_label_mode: 'Mode',
    config_label_questions: 'Questions',
    config_label_theme: 'Theme',
    config_label_difficulty: 'Difficulty',
    config_label_timer: 'Timer',

    // Teams
    team_name_required: 'Name required!',
    team_name_duplicate: 'A team with this name already exists!',
    team_created: (name) => `Team "${name}" created!`,
    team_joined: (name) => `Team "${name}" joined!`,
    team_deleted: 'Team deleted',
    btn_join_team: 'Join',

    // Validation errors
    err_code_short: 'Code too short (min. 2 characters).',
    err_pseudo_short: 'Enter a username (min. 2 characters).',
    err_code_invalid: 'Invalid code (letters, numbers, - and _ only).',
    err_no_avatar: 'Please choose an avatar.',
    err_no_code: 'Enter the room code.',
    err_room_closed: 'This room is closed.',
    err_room_password: 'Incorrect room password.',
    err_profile_not_found: 'Profile not found.',
    err_profile_password: 'Incorrect password.',
    err_pseudo_taken: 'This username is already taken.',


    // Dynamic badges & misc
    online_badge: 'En ligne',
    team_joined_badge: 'Rejoint',
    host_badge: 'Host',
    speed_no_one_yet: 'Personne encore…',
    section_players: 'Joueurs dans le salon',
    btn_force_reveal: '⏭ Corriger',


    // Dynamic badges & misc
    online_badge: 'Online',
    team_joined_badge: 'Joined',
    host_badge: 'Host',
    speed_no_one_yet: 'No one yet…',
    section_players: 'Players in room',
    btn_force_reveal: '⏭ Reveal',

    // Modes
    mode_normal: '🎯 Normal',
    mode_blind: '🙈 Blind',
    mode_speed: '⚡ Speed',

    // Difficulties
    diff_all: 'All',
    diff_debutant: 'Beginner',
    diff_connaisseur: 'Expert',
    diff_otaku: 'Otaku',

    // Round config labels
    round_label: (n) => `Round ${n}`,
    round_mode_label: 'Mode',
    round_theme_label: 'Difficulty',
    round_count_label: 'Questions',
    round_theme_questions: (n) => `${n} q.`,
    btn_delete_round: '🗑',

    // Host game bar
    host_btn_pause: '⏸',
    host_btn_correct: '⏭ Reveal',
  }
};

// ── EN question overrides ──────────────────
// Questions not listed here fall back to FR
const QUESTIONS_EN = {
  1: { question: "In the manga Naruto, what is Naruto Uzumaki’s ultimate dream?", answers: ["To become Hokage", "To avenge his clan", "To become the King of Ninjas", "To capture all the Tailed Beasts"], correct: 0, focus: "Naruto wants to become the leader of his village to finally be recognized and respected by everyone." },
  2: { question: "In World of Warcraft, which city is the main capital of the Humans?", answers: ["Stormwind", "Orgrimmar", "Ironforge", "Darnassus"], correct: 0, focus: "Stormwind is the heart of the Alliance on the Eastern Kingdoms continent." },
  3: { question: "In One Piece, what is the main power of Luffy’s Devil Fruit?", answers: ["Elasticity (Rubber)", "Fire", "Invisibility", "Flight"], correct: 0, focus: "Luffy ate the Gomu Gomu no Mi, turning him into a Rubber Man." },
  4: { question: "In Final Fantasy VII, what is the name of Cloud Strife’s massive sword?", answers: ["The Buster Sword", "Masamune", "Lionheart", "Excalibur"], correct: 0, focus: "The Buster Sword was passed down to him by Zack Fair." },
  5: { question: "In Kingdom Hearts, what is the name of Sora’s key-shaped weapon?", answers: ["The Keyblade", "Soul Eater", "Light Sword", "Royal Scepter"], correct: 0, focus: "The Keyblade is a mysterious weapon capable of sealing the locks of worlds." },
  6: { question: "In GTO (Great Teacher Onizuka), what was Eikichi Onizuka’s former job/hobby?", answers: ["Leader of a biker gang", "Police officer", "Rock singer", "Professional boxer"], correct: 0, focus: "Onizuka was a legendary delinquent, part of the Onibaku Combi duo." },
  7: { question: "In Berserk, what is Guts’ nickname after leaving the Band of the Hawk?", answers: ["The Black Swordsman", "The White Hawk", "The Dragon Slayer", "The Iron Warrior"], correct: 0, focus: "Guts roams the world alone, dressed in black, hunting apostles." },
  8: { question: "In the novel It, what form does the monster most often take?", answers: ["A clown", "A werewolf", "A giant spider", "A mummy"], correct: 0, focus: "It uses the form of Pennywise the Dancing Clown to lure children." },
  9: { question: "In Golden Sun, what is the spiritual energy used by the Adepts called?", answers: ["Psynergy", "Mana", "Chakra", "Alchemy"], correct: 0, focus: "Psynergy allows users to manipulate elements and interact with the environment." },
  10: { question: "In Final Fantasy X, what underwater sport is Tidus passionate about?", answers: ["Blitzball", "Water Polo", "Sphere Break", "Chocobo Racing"], correct: 0, focus: "Blitzball is played in a giant water sphere and is a major institution in Spira." },
  11: { question: "In Tower of God, what are those who enter the Tower on their own called?", answers: ["Irregulars", "Regulars", "Guardians", "High Rankers"], correct: 0, focus: "Irregulars are those who open the Tower’s doors by their own will." },
  12: { question: "In Samurai Deeper Kyo, who possesses Kyoshiro Mibu’s body at the beginning?", answers: ["Purple-Eyed Kyo", "The Red King", "Muramasa", "Nobunaga Oda"], correct: 0, focus: "Kyo’s spirit is trapped in the body of his rival, Kyoshiro, at the start of the story." },
  13: { question: "In Final Fantasy IX, what is Djidane’s distinctive physical trait?", answers: ["He has a monkey tail", "He has wings", "He has red eyes", "He has pointed ears"], correct: 0, focus: "Djidane’s tail is a remnant of his origin as a Genome." },
  14: { question: "In 20th Century Boys, what is the name of the movement led by \"Ami\"?", answers: ["The Friendship Party", "The Children’s Club", "The New Century Organization", "The Symbol Cult"], correct: 0, focus: "Ami created this party to take control of Japan and the world." },
  15: { question: "In Kingdom Hearts II, what is the connection between Roxas and Sora?", answers: ["Roxas is Sora’s Nobody", "Twin brother", "Dark form", "Reincarnation"], correct: 0, focus: "Roxas was created when Sora became a Heartless in the first game." },
  16: { question: "In World of Warcraft, which dragon is the antagonist of Cataclysm?", answers: ["Deathwing", "Malygos", "Alexstrasza", "Nozdormu"], correct: 0, focus: "Deathwing returned to destroy Azeroth after being corrupted by the Old Gods." },
  17: { question: "In The Greatest Estate Developer, what did Kim Suho study before his reincarnation?", answers: ["Civil Engineering", "Architecture", "Finance", "Cooking"], correct: 0, focus: "His knowledge of civil engineering is key to his success in construction." },
  18: { question: "In the manhwa Ares, what is the name of the hero’s mercenary group?", answers: ["The Temple Mercenaries", "The Icaros Knights", "The Hawk Troop", "The Chronos Squadron"], correct: 0, focus: "Ares, Michael, and Baruna are part of this unit based at the Temple." },
  19: { question: "In The Book of Stars, which sorcerer takes Guillemot under his wing?", answers: ["Qadehar", "Agathe", "Bertram", "The Shadow"], correct: 0, focus: "Qadehar is a powerful sorcerer from the Land of Ys who discovers Guillemot’s talent." },
  20: { question: "In One Piece, who is the first crew member to join Luffy?", answers: ["Roronoa Zoro", "Nami", "Usopp", "Coby"], correct: 0, focus: "Luffy saves Zoro in Shells Town, and he becomes his first companion." },
  21: { question: "In Berserk, what is the name of the Band of the Hawk’s sacrifice ritual?", answers: ["The Eclipse", "The Cataclysm", "The Sabbath", "The Convergence"], correct: 0, focus: "The Eclipse is the ritual where a God Hand member is born from a Brand bearer." },
  22: { question: "In Final Fantasy VII, where does Aerith’s death scene take place?", answers: ["The Forgotten City", "The Northern Crater", "Midgar", "Wutai"], correct: 0, focus: "It is in the Forgotten Capital that Aerith prays before being struck down by Sephiroth." },
  23: { question: "In Golden Sun: The Lost Age, which is the last lighthouse to be lit?", answers: ["Mars Lighthouse", "Jupiter Lighthouse", "Mercury Lighthouse", "Venus Lighthouse"], correct: 0, focus: "Lighting the Mars Lighthouse in the north marks the return of Alchemy." },
  24: { question: "In Naruto, who is the creator of Ninshū (the Sage of the Six Paths)?", answers: ["Hagoromo Ōtsutsuki", "Hamura Ōtsutsuki", "Hashirama Senju", "Indra Ōtsutsuki"], correct: 0, focus: "Hagoromo taught Ninshū to connect people through chakra." },
  25: { question: "In 20th Century Boys, what is the real name of the second \"Ami\"?", answers: ["Katsumata", "Fukubee", "Sadakiyo", "Manjome"], correct: 0, focus: "Katsumata is the boy no one remembered, who takes over from Fukubee." },
  26: { question: "In WoW, which advisor of Azshara became the first Satyr?", answers: ["Xavius", "Cenarius", "Malfurion", "Peroth’arn"], correct: 0, focus: "Xavius was transformed by Sargeras after the War of the Ancients." },
  27: { question: "In Tower of God, which weapon does Yuri lend to Bam at the beginning?", answers: ["Black March", "Green April", "Crystal October", "Silver January"], correct: 0, focus: "Black March is a needle from the 13 Months series, with a feminine spirit." },
  28: { question: "In Samurai Deeper Kyo, what is the name of the Mumyo Jin’s ultimate technique?", answers: ["Shin Seiryu (Divine Azure Dragon)", "Moon Dance", "Suzaku", "Phoenix Cry"], correct: 0, focus: "Shin Seiryu is the devastating evolved form of the Seiryu technique." },
  29: { question: "In The Book of Stars, where do the Gommons reside?", answers: ["The Uncertain World", "The Limbo", "The Void", "The Shadow Kingdom"], correct: 0, focus: "The Uncertain World is an unstable dimension between the Real World and the Land of Ys." },
  31: { question: "In One Piece, from whom did Luffy receive his iconic straw hat?", answers: ["Shanks the Red-Hair", "Gol D. Roger", "Monkey D. Garp", "Portgas D. Ace"], correct: 0, focus: "Shanks entrusted his hat to Luffy, asking him to return it once he became a great pirate." },
  32: { question: "In Naruto, what is the name of Team 7's mentor, famous for his masked eye?", answers: ["Kakashi Hatake", "Jiraiya", "Might Guy", "Iruka Umino"], correct: 0, focus: "Kakashi is the Jonin in charge of Naruto, Sasuke and Sakura at the start of the series." },
  33: { question: "In World of Warcraft, who was the Warchief of the Horde at the start of the game (Vanilla)?", answers: ["Thrall", "Garrosh Hellscream", "Sylvanas Windrunner", "Vol'jin"], correct: 0, focus: "Thrall freed the Orcs and founded the new Horde on the continent of Kalimdor." },
  34: { question: "In Final Fantasy VII, what is the name of the corporation draining the planet's life energy?", answers: ["Shinra", "Avalanche", "SOLDIER", "Galbadia"], correct: 0, focus: "The Shinra Electric Power Company controls Midgar and harvests Mako energy." },
  35: { question: "In Kingdom Hearts, what are the names of Sora's two childhood best friends on the Destiny Islands?", answers: ["Riku and Kairi", "Donald and Goofy", "Terra and Aqua", "Axel and Roxas"], correct: 0, focus: "The inseparable trio at the start of the adventure consists of Sora, Riku and Kairi." },
  36: { question: "In Golden Sun, which element is associated with the main protagonist, Isaac?", answers: ["Venus", "Mars", "Mercury", "Jupiter"], correct: 0, focus: "In Golden Sun, the earth element is called Venus." },
  37: { question: "In Berserk, what is the name of the massive sword Guts uses to hunt apostles?", answers: ["The Dragon Slayer", "Zul'Gurub", "The Vorpal Blade", "Berserker Blade"], correct: 0, focus: "Forged by Godot, this enormous sword is the only one capable of wounding astral creatures." },
  38: { question: "In GTO, what is Onizuka's main reason for becoming a teacher?", answers: ["To meet cute high school girls", "To reform the school system", "To earn a lot of money", "To take revenge"], correct: 0, focus: "Initially, Onizuka wants to become a teacher to be surrounded by pretty girls before finding his true calling." },
  39: { question: "In the novel 'It', in which town in Maine does the story take place?", answers: ["Derry", "Castle Rock", "Portland", "Silent Hill"], correct: 0, focus: "Derry is the cursed town where Pennywise reappears every 27 years." },
  40: { question: "In Final Fantasy X, what is Summoner Yuna's ultimate mission?", answers: ["To destroy Sin", "To become Queen", "To find her father", "To master Blitzball"], correct: 0, focus: "Yuna must obtain the Final Aeon to bring the Calm by defeating Sin." },
  41: { question: "In Tower of God, what is the true name given to the protagonist Bam at the beginning?", answers: ["Twenty-Fifth Bam", "Jyu Viole Grace", "Urek Mazino", "Phantaminum"], correct: 0, focus: "He is named this because he was born on the 25th night (Bam means night in Korean)." },
  42: { question: "In Samurai Deeper Kyo, who is the first member of the 'Five Planets' that Kyo must face?", answers: ["Akira", "Hotaru", "Shinrei", "Bontenmaru"], correct: 0, focus: "Akira is the first of Kyo's former companions he encounters in the Aokigahara forest." },
  43: { question: "In 20th Century Boys, what is the title of the rock song composed by Kenji?", answers: ["Bob Lennon", "Imagine", "20th Century Boy", "Sudala"], correct: 0, focus: "This simple song becomes the anthem of resistance against Friend." },
  44: { question: "In the manhwa Ares, what physical trait does Ares display when in a rage?", answers: ["His eyes turn red", "He cries blood", "His pupils disappear", "He goes blind"], correct: 0, focus: "It is the mark of his bloodline and the killer instinct inherited from his father." },
  45: { question: "In 'The Greatest Estate Developer', what is the name of Lloyd's bodyguard knight?", answers: ["Javier Asrahan", "Yulian Provoke", "Cale Henituse", "Arthur Pendragon"], correct: 0, focus: "Javier is a sword prodigy who eventually comes to respect Lloyd despite his character." },
  46: { question: "In 'The Book of Stars', what is Guillemot's main magical ability?", answers: ["Drawing graphies (runes)", "Telepathy", "Shapeshifting", "Time travel"], correct: 0, focus: "Guillemot can draw runes (graphies) in the air to produce magical effects." },
  47: { question: "In World of Warcraft, who takes Arthas's place on the Frozen Throne?", answers: ["Bolvar Fordragon", "Tirion Fordring", "Uther", "Varian Wrynn"], correct: 0, focus: "Bolvar sacrifices himself to become the new Lich King and warden of the dead." },
  48: { question: "In Final Fantasy IX, what is Vivi's true nature?", answers: ["A Black Mage prototype", "A transformed human", "A forest spirit", "A cursed child"], correct: 0, focus: "Vivi is an artificial being created from Mist, gifted with a unique consciousness." },
  49: { question: "In Kingdom Hearts II, who is the leader of Organization XIII?", answers: ["Xemnas", "Xigbar", "Saïx", "Marluxia"], correct: 0, focus: "Xemnas is the Nobody of Xehanort, seeking to create an artificial Kingdom Hearts." },
  50: { question: "In Naruto, what is the family relationship between the Fourth Hokage and Naruto?", answers: ["He is his father", "He is his uncle", "He is his godfather", "No relation"], correct: 0, focus: "Minato Namikaze sacrificed his life to seal Kyubi within his newborn son." },
  51: { question: "In Berserk, what is the name of the mystical object that belongs to Griffith?", answers: ["The Crimson Beherit", "The Eye of Odin", "The Philosopher's Stone", "The Eclipse Seal"], correct: 0, focus: "It is a unique artifact destined for those who will join the God Hand." },
  52: { question: "In Final Fantasy VII, in which laboratory was Sephiroth created?", answers: ["Nibelheim (Mansion)", "Gongaga", "Junon", "Icicle Inn"], correct: 0, focus: "This is where the Jenova Project began under the direction of Professor Hojo." },
  53: { question: "In One Piece, what is the name of the Ancient Weapon hidden in Alabasta?", answers: ["Pluton", "Poseidon", "Uranus", "Noah"], correct: 0, focus: "Crocodile was searching for the blueprints of Pluton, a massive warship." },
  54: { question: "In Golden Sun, which duo of warriors do you face at the top of the Venus Lighthouse?", answers: ["Saturos and Menardi", "Karst and Agatio", "Alex and Piers", "Dullahan and Valukar"], correct: 0, focus: "They are the antagonists of the first game and fuse to form the Fusion Dragon." },
  55: { question: "In Tower of God, what is the name of the floor where Bam 'died'?", answers: ["The Floor of Tests", "The Floor of Death", "Hell Train", "The Ground Floor"], correct: 0, focus: "It is on the 2nd floor that Rachel pushes him into the void during the final exam." },
  56: { question: "In Samurai Deeper Kyo, who is the 'Last of the Five Planets'?", answers: ["Saisei", "Chinmei", "Anri", "Yuan"], correct: 0, focus: "Saisei is a woman who wields threads and healing powers." },
  57: { question: "In World of Warcraft, what is the name of the Orcs' home world?", answers: ["Draenor", "Argus", "Azeroth", "K'aresh"], correct: 0, focus: "Draenor was shattered to become Outland (the Outlands)." },
  58: { question: "In 20th Century Boys, what catastrophic event is predicted for the year 2000?", answers: ["A robot spreading a virus", "A nuclear explosion", "An alien invasion", "An earthquake"], correct: 0, focus: "Friend carries out this childhood prediction to pose as the world's savior." },
  59: { question: "In 'The Book of Stars', what is the secret of Qadehar's 'True Magic'?", answers: ["Drawing runes on his skin", "Using Gommon blood", "Spelling names in reverse", "Merging with a spirit"], correct: 0, focus: "By tracing the runes on himself, the sorcerer becomes the direct channel for magical energy." },
  60: { question: "In Final Fantasy X, what is the true nature of the Fayth?", answers: ["Frozen souls who dream", "Ancient machines", "Children of Yu Yevon", "Purified monsters"], correct: 0, focus: "Their dreams allow the Aeons and the city of Zanarkand to be manifested." },
  30: { question: "In The Greatest Estate Developer, what is the name of the giant hamster summoned?", answers: ["Ppodong", "Javier", "Hammy", "Groot"], correct: 0, focus: "Ppodong is the earth spirit who helps Lloyd with excavation work." },
  61: { question: "In WoW, what does Leroy Jenkins yell as he charges alone into battle?", answers: ["Leeeeeroy Jeeenkins!", "For the Horde!", "Death to the Alliance!", "I’m coming for you!"], correct: 0, focus: "This legendary meme originated from a video where a player charges into a dungeon while screaming his name." },
  62: { question: "In Final Fantasy, which iconic item is used to revive a character?", answers: ["Phoenix Down", "Elixir", "Potion", "Unicorn Horn"], correct: 0, focus: "The phoenix symbolizes rebirth, and this item is a classic of the series." },
  63: { question: "In Kingdom Hearts, what is the name of Sora’s main weapon?", answers: ["The Keyblade", "Light Sword", "Destiny Key", "Heart Scepter"], correct: 0, focus: "It is a key-shaped weapon capable of sealing or unlocking the doors of worlds." },
  64: { question: "In Kingdom Hearts, what are the enemies born from the loss of a heart called?", answers: ["The Heartless", "The Nobodies", "The Dream Eaters", "The Unversed"], correct: 0, focus: "Heartless are the shadows of those who have succumbed to darkness." },
  65: { question: "In WoW (Vanilla), what was the maximum level achievable?", answers: ["60", "70", "80", "100"], correct: 0, focus: "Level 60 was the ultimate cap before the first expansion was released." },
  66: { question: "In 2005, which WoW incident saw a virtual epidemic devastate the capitals?", answers: ["Corrupted Blood", "The Plague of Lordaeron", "The Scourge of Orgrimmar", "The Curse of Hakkar"], correct: 0, focus: "A debuff from the Hakkar boss accidentally spread, creating a global pandemic." },
  67: { question: "In Final Fantasy, which battle system uses bars that fill up?", answers: ["ATB (Active Time Battle)", "Turn-Based", "Real-Time Action", "Gambit System"], correct: 0, focus: "Introduced in *FF IV*, it adds dynamism by managing action recharge times." },
  68: { question: "In Kingdom Hearts II, what is the name of Sora’s \"Nobody\"?", answers: ["Roxas", "Ventus", "Vanitas", "Riku"], correct: 0, focus: "Roxas was born when Sora became a Heartless; he also wields the Keyblade." },
  69: { question: "Who is the \"Red Shirt Guy\" who became famous for correcting lore at BlizzCon?", answers: ["Ian Bates", "Leroy Jenkins", "Metzen", "Ghostcrawler"], correct: 0, focus: "His precise question about Falstad Wildhammer was so accurate that an NPC was added in-game." },
  70: { question: "In Final Fantasy VII, where does the famous \"date\" mini-game take place?", answers: ["Gold Saucer", "Midgar", "Costa del Sol", "Wutai"], correct: 0, focus: "Depending on your choices, you can end up at the amusement park with Aerith, Tifa, Yuffie, or Barret." },
  71: { question: "Which cheating item did a GM accidentally send to a WoW player in 2009?", answers: ["Martin Fury", "Sword of a Thousand Truths", "Ashbringer", "The Instakiller"], correct: 0, focus: "This shirt allowed the player to kill any entity within 30 meters. The player was banned." },
  72: { question: "Which event marked the cataclysmic end of FF XIV 1.0?", answers: ["The Fall of Dalamud", "The Advent of Zenos", "The Garlean Invasion", "The Flood of Light"], correct: 0, focus: "Naoki Yoshida destroyed the game with an epic cutscene to relaunch *A Realm Reborn*." },
  73: { question: "What is the title of the secret ending of Kingdom Hearts 1?", answers: ["Another Side, Another Story", "Blank Points", "The Gathering", "Deep Dive"], correct: 0, focus: "It first showed Roxas and Riku fighting in the rain in Twilight Town." },
  74: { question: "What was the name of the infamous Alliance \"ganker\" on the Sargeras server?", answers: ["Angwe", "Swifty", "Kungen", "Athene"], correct: 0, focus: "Angwe camped Menethil Harbor for months, becoming a legend (or nightmare)." },
  75: { question: "Which Final Fantasy class learns spells by being attacked?", answers: ["Blue Mage", "Red Mage", "Mime", "Freelancer"], correct: 0, focus: "The Blue Mage must endure certain enemy attacks to add them to their repertoire." },
  76: { question: "[HIMYM] In which bar does Ted’s gang spend most of their time?", answers: ["MacLaren’s Pub", "Puzzles", "Central Perk", "Cheers"], correct: 0, focus: "MacLaren’s is located right below Ted and Marshall’s apartment." },
  77: { question: "[Parks and Rec] In which fictional Indiana town does the series take place?", answers: ["Pawnee", "Eagleton", "Scranton", "Springfield"], correct: 0, focus: "Leslie Knope is a fierce advocate for her hometown, Pawnee." },
  78: { question: "[RPDR] What is the iconic phrase RuPaul says to eliminate a contestant?", answers: ["Sashay Away", "Shantay You Stay", "Lip Sync for Your Life", "You’re Fired"], correct: 0, focus: "\"Sashay Away\" means it’s time to leave the stage and the competition." },
  79: { question: "[Rick and Morty] What object does Rick use to travel instantly between dimensions?", answers: ["The Portal Gun", "The TARDIS", "The Meeseeks Box", "The Garbage Spaceship"], correct: 0, focus: "The Portal Gun projects a green liquid that creates a dimensional tunnel." },
  80: { question: "[Archer] What is the name of Archer’s mother, who is also the director of the spy agency?", answers: ["Malory Archer", "Lana Kane", "Cheryl Tunt", "Pam Poovey"], correct: 0, focus: "Malory is the cynical, alcoholic matriarch who runs the ISIS agency (later the detective agency)." },
  81: { question: "[Big Mouth] Which famous deceased jazz musician lives as a ghost in Nick’s attic?", answers: ["Duke Ellington", "Louis Armstrong", "Miles Davis", "Ray Charles"], correct: 0, focus: "Duke Ellington often serves as a spiritual (or clumsy) guide to Nick through his puberty struggles." },
  82: { question: "[Parks and Rec] What is Ron Swanson’s alter ego when he plays saxophone in jazz clubs?", answers: ["Duke Silver", "Burt Macklin", "Ronny S", "Jazz Man"], correct: 0, focus: "Duke Silver is Ron’s best-kept secret, as he is a sensual icon for mature women in Eagleton." },
  83: { question: "[HIMYM] What is the name of the blog (actually created by the production) that Barney Stinson regularly updates?", answers: ["The Barney’s Blog", "The Bro Code Online", "Legendary Journal", "Suit Up Now"], correct: 0, focus: "Barney posted dating advice and far-fetched theories about \"bros\" there." },
  84: { question: "[Rick and Morty] In which memorable episode does Rick turn himself into a vegetable to avoid family therapy?", answers: ["Pickle Rick", "Rickmurai Jack", "Cronenberg Rick", "The Ricklantis Mixup"], correct: 0, focus: "Rick would rather become a pickle and fight rats and Russian agents than talk about his feelings." },
  85: { question: "[RPDR] What is the name of the famous celebrity impersonation challenge that happens every season?", answers: ["The Snatch Game", "The Shade Tree", "Drag Race Idol", "Queens on Fire"], correct: 0, focus: "The Snatch Game is the ultimate test of humor, improvisation, and charisma for the queens." },
  86: { question: "[Archer] What is the name of Archer’s butler, a WWI veteran and Sterling’s punching bag?", answers: ["Woodhouse", "Alfred", "Geoffrey", "Jarvis"], correct: 0, focus: "Woodhouse has a fascinating history as a war pilot, despite the terrible treatment he endures from Archer." },
  87: { question: "[HIMYM] Barney works for GNB, but what is the exact acronym for his job title (P.L.E.A.S.E)?", answers: ["Provide Legal Exculpation And Sign Everything", "Professional Lawyer Exposing All Sales Errors", "Permanent Liaison Engineering And Security Expert", "Please Leave Every Area Safe Everyday"], correct: 0, focus: "Barney always responded with \"Please!\" when asked about his job; it was actually an acronym meaning he signed compromising documents without asking questions." },
  88: { question: "[Parks and Rec] What is the name of the miniature pony that the entire town of Pawnee idolizes?", answers: ["Li’l Sebastian", "Pony Danza", "Silver", "Champ"], correct: 0, focus: "Li’l Sebastian’s death is a massive municipal mourning, marked by the song *5,000 Candles in the Wind*." },
  89: { question: "[Big Mouth] Who is the \"Shame Wizard,\" the sworn enemy of the Hormone Monsters?", answers: ["Lionel", "Maurice", "Connie", "Caleb"], correct: 0, focus: "Lionel feeds on the shame of teenagers and tries to make them feel bad about their desires." },
  90: { question: "[RPDR] Which queen was the very first to be eliminated in the show’s history (Season 1)?", answers: ["Victoria \"Porkchop\" Parker", "Bebe Zahara Benet", "Nina Flowers", "Akashia"], correct: 0, focus: "Victoria \"Porkchop\" Parker became a recurring legend, saluted by RuPaul at every finale." },
  91: { question: "[HIMYM] What is Barney Stinson’s favorite expression to say that something will be awesome?", answers: ["Legen—wait for it—dary!", "Awesome!", "High Five!", "Challenge Accepted!"], correct: 0, focus: "This phrase is Barney’s trademark for emphasizing the epic nature of a night out." },
  92: { question: "[Parks and Rec] What is Leslie Knope’s favorite dish that she always eats at JJ’s Diner?", answers: ["Waffles", "Pancakes", "Bacon", "Calzone"], correct: 0, focus: "Leslie considers JJ’s Diner waffles the best food in the world." },
  93: { question: "[Big Mouth] What is the name of the main Hormone Monster that follows Andrew?", answers: ["Maurice", "Connie", "Rick", "Gavin"], correct: 0, focus: "Maurice (Maury) is the lustful, hairy monster who pushes Andrew to make often embarrassing choices." },
  94: { question: "[Archer] What is Sterling Archer’s code name?", answers: ["Duchess", "Lancelot", "Falcon", "Sterling"], correct: 0, focus: "It was the name of his mother’s dog, which is a constant source of mockery." },
  95: { question: "[Rick and Morty] What is the relationship between Rick and Morty?", answers: ["Grandfather and grandson", "Father and son", "Uncle and nephew", "Brothers"], correct: 0, focus: "Rick Sanchez is the father of Beth, Morty’s mother." },
  96: { question: "[RPDR] What does the acronym C.U.N.T. stand for, the four qualities sought by RuPaul?", answers: ["Charisma, Uniqueness, Nerve, Talent", "Class, Uniqueness, Nice, Taste", "Courage, Unity, Night, Trick", "Creative, Ugly, Nice, Tough"], correct: 0, focus: "These four pillars define the \"Next Drag Superstar.\"" },
  97: { question: "[HIMYM] Under what pseudonym was Robin Scherbatsky a pop star in Canada?", answers: ["Robin Sparkles", "Robin Daggers", "Pop Robin", "Canadian Star"], correct: 0, focus: "Her hit *Let’s Go to the Mall* is one of the biggest secrets revealed by the gang." },
  98: { question: "[Parks and Rec] What is the name of the rock band led by Andy Dwyer?", answers: ["Mouse Rat", "Scarecrow Boat", "Threeskin", "Fleetwood Mac Sex Tape"], correct: 0, focus: "The band had many names before settling on Mouse Rat for good." },
  99: { question: "[Rick and Morty] What is the name of the original dimension of \"our\" Rick and Morty?", answers: ["C-137", "Z-402", "Earth-Prime", "Dimension 35-C"], correct: 0, focus: "Rick often brags about being the Rick from dimension C-137, the \"purest.\"" },
  100: { question: "[Archer] What is Archer’s recurring obsession/fear regarding nature?", answers: ["Alligators", "Sharks", "Bears", "Jellyfish"], correct: 0, focus: "Archer has a list of irrational fears, but alligators and crocodiles are at the top." },
  101: { question: "[Big Mouth] In which department do the monsters and shame wizards work?", answers: ["Human Resources", "Department of Puberty", "Teen Management", "Soul Control"], correct: 0, focus: "The spin-off *Human Resources* explores this fantastical administrative place." },
  102: { question: "[RPDR] Which Season 4 contestant was the first in history to be disqualified?", answers: ["Willam Belli", "Sharon Needles", "Phi Phi O’Hara", "Latrice Royale"], correct: 0, focus: "Willam was disqualified for receiving visits from her husband, violating strict production rules." },
  103: { question: "[HIMYM] In the \"Slap Bet\" episode, how many slaps does Barney have to receive in total?", answers: ["8 slaps", "5 slaps", "10 slaps", "12 slaps"], correct: 0, focus: "Initially 5, but Marshall wins the right to add 3 more during the Thanksgiving episode." },
  104: { question: "[Parks and Rec] What is the title of the ultra-complex board game invented by Ben Wyatt?", answers: ["The Cones of Dunshire", "Quest for Pawnee", "Mace and Chain", "Wizard’s Journey"], correct: 0, focus: "Ben created this game out of pure boredom, and it later becomes a cult hit." },
  105: { question: "[Rick and Morty] What does the phrase \"Wubba Lubba Dub-Dub\" actually mean in Birdperson language?", answers: ["I am in great pain, please help me", "Party time!", "I am the king of the world", "Morty is an idiot"], correct: 0, focus: "It’s not a party phrase, but a cry for help hidden by Rick." }
};

// ── I18n public API ───────────────────────
export const I18n = {
  _lang: localStorage.getItem('quiz_lang') || 'fr',

  get lang() { return this._lang; },

  setLang(lang) {
    this._lang = lang;
    localStorage.setItem('quiz_lang', lang);
    this._updateDOM();
    this._updateLangBtn();
    document.documentElement.lang = lang;
    // Re-render all dynamic components that contain translated strings
    if (window.Room?._renderRoundsUI) window.Room._renderRoundsUI();
    if (window.Room?._teams) window.Room._renderTeams(window.Room._teams);
    // Re-run room list if the join screen is currently visible
    const joinScreen = document.getElementById('screen-join');
    if (joinScreen?.classList.contains('active')) {
      window.Room?.loadRoomList();
    }
    // Re-render lobby players section label (dynamic count span)
    const sectionLabel = document.querySelector('.lobby-players-section .lobby-section-label span[data-i18n="section_players"]');
    if (sectionLabel) sectionLabel.textContent = this.t('section_players');
    // Re-render the join team buttons if visible
    document.querySelectorAll('.team-join-btn').forEach(btn => {
      btn.textContent = this.t('btn_join_team');
    });
    // Update DIFFICULTY_LABELS for badge rendering
    if (window.DIFFICULTY_LABELS) {
      window.DIFFICULTY_LABELS.debutant    = this.t('diff_debutant');
      window.DIFFICULTY_LABELS.connaisseur = this.t('diff_connaisseur');
      window.DIFFICULTY_LABELS.otaku       = this.t('diff_otaku');
    }
  },

  t(key, ...args) {
    const str = STRINGS[this._lang]?.[key] ?? STRINGS.fr[key];
    if (typeof str === 'function') return str(...args);
    return str ?? key;
  },

  // Get question in current language (falls back to FR if no EN translation)
  // Priority: 1) Firestore inline fields (question_en/answers_en/focus_en)
  //           2) QUESTIONS_EN lookup by localId or id
  //           3) FR original
  getQuestion(frQuestion) {
    if (this._lang === 'fr') return frQuestion;
    // Check Firestore inline EN fields (added by admin translate tool)
    if (frQuestion.question_en) {
      return {
        ...frQuestion,
        question: frQuestion.question_en,
        answers: frQuestion.answers_en || frQuestion.answers,
        focus: frQuestion.focus_en || frQuestion.focus
      };
    }
    // Fallback: local QUESTIONS_EN lookup (by localId from migration, or id from data.js)
    const lookupId = frQuestion.localId ?? frQuestion.id;
    const en = QUESTIONS_EN[lookupId];
    if (!en) return frQuestion;
    return { ...frQuestion, question: en.question, answers: en.answers, focus: en.focus };
  },

  // Apply data-i18n attributes to the DOM
  _updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const val = this.t(key);
      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
  },

  _updateLangBtn() {
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) btn.textContent = this._lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR';
  },

  init() {
    this._updateDOM();
    this._updateLangBtn();
    document.documentElement.lang = this._lang;
    if (window.DIFFICULTY_LABELS) {
      window.DIFFICULTY_LABELS.debutant    = this.t('diff_debutant');
      window.DIFFICULTY_LABELS.connaisseur = this.t('diff_connaisseur');
      window.DIFFICULTY_LABELS.otaku       = this.t('diff_otaku');
    }
  }
};

// Expose globally
window.I18n = I18n;
