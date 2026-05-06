// ═══════════════════════════════════════════
// AVATARS SVG — Personnages iconiques des univers
// ═══════════════════════════════════════════

export const AVATARS = [
  // ─── NARUTO
  {
    id: 'naruto',
    name: 'Naruto',
    universe: 'Naruto',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#F4A623"/>
      <circle cx="50" cy="45" r="22" fill="#FDDBA0"/>
      <rect x="28" y="65" width="44" height="35" rx="22" fill="#FF6600"/>
      <!-- Headband -->
      <rect x="22" y="28" width="56" height="10" rx="5" fill="#6ea8d8"/>
      <rect x="38" y="29" width="24" height="8" rx="2" fill="#c8d8e8"/>
      <line x1="50" y1="29" x2="50" y2="37" stroke="#6ea8d8" stroke-width="1.5"/>
      <!-- Eyes -->
      <circle cx="40" cy="48" r="4" fill="#3a7bd5"/>
      <circle cx="60" cy="48" r="4" fill="#3a7bd5"/>
      <circle cx="41" cy="47" r="1.5" fill="#fff"/>
      <circle cx="61" cy="47" r="1.5" fill="#fff"/>
      <!-- Whiskers -->
      <line x1="20" y1="50" x2="36" y2="51" stroke="#c4a882" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="20" y1="55" x2="36" y2="54" stroke="#c4a882" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="64" y1="51" x2="80" y2="50" stroke="#c4a882" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="64" y1="54" x2="80" y2="55" stroke="#c4a882" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Smile -->
      <path d="M42 58 Q50 64 58 58" stroke="#c07850" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`
  },

  // ─── LUFFY
  {
    id: 'luffy',
    name: 'Luffy',
    universe: 'One Piece',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#e63946"/>
      <circle cx="50" cy="46" r="22" fill="#FDDBA0"/>
      <rect x="28" y="66" width="44" height="34" rx="22" fill="#1a1a2e"/>
      <!-- Straw hat -->
      <ellipse cx="50" cy="30" rx="32" ry="8" fill="#d4a017"/>
      <ellipse cx="50" cy="28" rx="18" ry="12" fill="#f0c020"/>
      <rect x="18" y="28" width="64" height="6" rx="3" fill="#d4a017"/>
      <!-- Red band -->
      <path d="M22 31 Q50 35 78 31" stroke="#cc2020" stroke-width="3" fill="none"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="48" rx="5" ry="5.5" fill="#1a1a1a"/>
      <ellipse cx="59" cy="48" rx="5" ry="5.5" fill="#1a1a1a"/>
      <circle cx="42" cy="46" r="2" fill="#fff"/>
      <circle cx="60" cy="46" r="2" fill="#fff"/>
      <!-- Scar -->
      <path d="M57 54 L62 62" stroke="#cc2020" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Smile -->
      <path d="M36 58 Q50 70 64 58" stroke="#c07850" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`
  },

  // ─── GUTS
  {
    id: 'guts',
    name: 'Guts',
    universe: 'Berserk',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#1a1a2e"/>
      <circle cx="50" cy="44" r="22" fill="#d4a882"/>
      <rect x="28" y="64" width="44" height="36" rx="0" fill="#1a1a1a"/>
      <!-- Dark hair -->
      <path d="M28 36 Q50 22 72 36 Q72 24 50 20 Q28 24 28 36Z" fill="#1a1a1a"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="46" rx="4.5" ry="4" fill="#2a1a0a"/>
      <ellipse cx="59" cy="46" rx="4.5" ry="4" fill="#2a1a0a"/>
      <circle cx="42" cy="45" r="1.5" fill="#fff"/>
      <circle cx="60" cy="45" r="1.5" fill="#fff"/>
      <!-- Scar -->
      <path d="M38 40 L44 56" stroke="#8b3030" stroke-width="2" stroke-linecap="round"/>
      <!-- Missing eye effect -->
      <path d="M55 42 L63 50" stroke="#8b3030" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Determined expression -->
      <path d="M40 56 L60 56" stroke="#a07050" stroke-width="2" stroke-linecap="round"/>
      <!-- Sword silhouette behind -->
      <rect x="70" y="5" width="6" height="60" rx="3" fill="#444" opacity="0.8"/>
      <rect x="62" y="18" width="22" height="5" rx="2" fill="#666"/>
    </svg>`
  },

  // ─── CLOUD
  {
    id: 'cloud',
    name: 'Cloud',
    universe: 'Final Fantasy VII',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#4a6fa5"/>
      <circle cx="50" cy="46" r="22" fill="#f0d5b0"/>
      <rect x="28" y="66" width="44" height="34" rx="0" fill="#1a3a6a"/>
      <!-- Spiky blonde hair -->
      <path d="M30 40 L20 20 L35 32Z" fill="#d4c020"/>
      <path d="M42 32 L38 10 L55 28Z" fill="#d4c020"/>
      <path d="M58 32 L62 10 L45 28Z" fill="#d4c020"/>
      <path d="M70 40 L80 20 L65 32Z" fill="#d4c020"/>
      <ellipse cx="50" cy="35" rx="22" ry="15" fill="#d4c020"/>
      <!-- Mako eyes -->
      <ellipse cx="41" cy="47" rx="4.5" ry="5" fill="#00e5ff"/>
      <ellipse cx="59" cy="47" rx="4.5" ry="5" fill="#00e5ff"/>
      <circle cx="41" cy="46" r="2" fill="#007fa8"/>
      <circle cx="59" cy="46" r="2" fill="#007fa8"/>
      <circle cx="42" cy="45" r="1" fill="#fff"/>
      <circle cx="60" cy="45" r="1" fill="#fff"/>
      <!-- Serious expression -->
      <path d="M42 57 L58 57" stroke="#a07050" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },

  // ─── SORA
  {
    id: 'sora',
    name: 'Sora',
    universe: 'Kingdom Hearts',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#3d5a99"/>
      <circle cx="50" cy="46" r="21" fill="#FDDBA0"/>
      <rect x="29" y="65" width="42" height="35" rx="21" fill="#cc1a1a"/>
      <!-- Brown spiky hair -->
      <path d="M28 38 Q50 20 72 38 Q72 24 50 18 Q28 24 28 38Z" fill="#5c3a1e"/>
      <path d="M25 42 L18 22 L32 36Z" fill="#5c3a1e"/>
      <path d="M75 42 L82 22 L68 36Z" fill="#5c3a1e"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="48" rx="4.5" ry="4.5" fill="#3d6b9f"/>
      <ellipse cx="59" cy="48" rx="4.5" ry="4.5" fill="#3d6b9f"/>
      <circle cx="42" cy="47" r="1.5" fill="#fff"/>
      <circle cx="60" cy="47" r="1.5" fill="#fff"/>
      <!-- Happy smile -->
      <path d="M40 57 Q50 64 60 57" stroke="#c07850" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Crown necklace hint -->
      <path d="M44 66 L50 70 L56 66" stroke="#ffd700" stroke-width="2" fill="none"/>
    </svg>`
  },

  // ─── KAKASHI
  {
    id: 'kakashi',
    name: 'Kakashi',
    universe: 'Naruto',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#607080"/>
      <circle cx="50" cy="46" r="22" fill="#FDDBA0"/>
      <rect x="28" y="66" width="44" height="34" rx="0" fill="#3a4a5a"/>
      <!-- Silver hair -->
      <path d="M28 36 Q50 16 72 36 Q60 20 50 18 Q40 20 28 36Z" fill="#d0d8e0"/>
      <path d="M26 40 L16 20 L30 35Z" fill="#d0d8e0"/>
      <!-- Mask -->
      <rect x="28" y="50" width="44" height="20" rx="4" fill="#e8e8e8"/>
      <!-- Headband covering one eye -->
      <rect x="22" y="34" width="56" height="10" rx="5" fill="#3a4a5a"/>
      <rect x="38" y="35" width="24" height="8" rx="2" fill="#5a6a7a"/>
      <line x1="50" y1="35" x2="50" y2="43" stroke="#3a4a5a" stroke-width="1.5"/>
      <!-- One visible eye -->
      <ellipse cx="59" cy="48" rx="4" ry="4" fill="#2a2a2a"/>
      <circle cx="60" cy="47" r="1.5" fill="#fff"/>
      <!-- Sharingan under headband hint -->
      <circle cx="41" cy="43" r="3" fill="#cc0000" opacity="0.7"/>
      <!-- Focused expression -->
      <path d="M35 58 L65 58" stroke="#c0c0c0" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },

  // ─── ZORO
  {
    id: 'zoro',
    name: 'Zoro',
    universe: 'One Piece',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#2d6a4f"/>
      <circle cx="50" cy="46" r="22" fill="#d4a882"/>
      <rect x="28" y="66" width="44" height="34" rx="0" fill="#1a1a1a"/>
      <!-- Green hair -->
      <path d="M28 38 Q50 22 72 38 Q72 26 50 22 Q28 26 28 38Z" fill="#2d6a4f"/>
      <!-- Scar over left eye -->
      <path d="M38 38 L46 58" stroke="#cc2020" stroke-width="3" stroke-linecap="round"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="47" rx="4" ry="4.5" fill="#1a4a1a"/>
      <ellipse cx="59" cy="47" rx="4" ry="4.5" fill="#1a4a1a"/>
      <circle cx="42" cy="46" r="1.5" fill="#fff"/>
      <circle cx="60" cy="46" r="1.5" fill="#fff"/>
      <!-- Stern expression -->
      <path d="M40 57 L60 57" stroke="#a07050" stroke-width="2" stroke-linecap="round"/>
      <!-- Three swords -->
      <rect x="76" y="8" width="4" height="50" rx="2" fill="#8a8a8a"/>
      <rect x="82" y="12" width="4" height="46" rx="2" fill="#8a8a8a"/>
      <rect x="88" y="8" width="4" height="50" rx="2" fill="#8a8a8a"/>
    </svg>`
  },

  // ─── AERITH
  {
    id: 'aerith',
    name: 'Aerith',
    universe: 'Final Fantasy VII',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#c084dc"/>
      <circle cx="50" cy="46" r="21" fill="#f5d5b5"/>
      <rect x="29" y="65" width="42" height="35" rx="21" fill="#c04070"/>
      <!-- Brown hair with ribbon -->
      <path d="M29 38 Q50 20 71 38 Q71 24 50 18 Q29 24 29 38Z" fill="#5c3a1e"/>
      <path d="M29 42 L22 24 L34 36Z" fill="#5c3a1e"/>
      <path d="M71 42 L78 24 L66 36Z" fill="#5c3a1e"/>
      <!-- Pink ribbon -->
      <rect x="30" y="28" width="40" height="6" rx="3" fill="#ff80b0"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="48" rx="4.5" ry="4.5" fill="#2d6a2d"/>
      <ellipse cx="59" cy="48" rx="4.5" ry="4.5" fill="#2d6a2d"/>
      <circle cx="42" cy="47" r="1.5" fill="#fff"/>
      <circle cx="60" cy="47" r="1.5" fill="#fff"/>
      <!-- Gentle smile -->
      <path d="M42 58 Q50 63 58 58" stroke="#c07050" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`
  },

  // ─── BAM (Tower of God)
  {
    id: 'bam',
    name: 'Bam',
    universe: 'Tower of God',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#1a1a40"/>
      <circle cx="50" cy="46" r="21" fill="#e8d0a0"/>
      <rect x="29" y="65" width="42" height="35" rx="21" fill="#2a2a60"/>
      <!-- Dark brown hair -->
      <path d="M29 38 Q50 20 71 38 Q71 24 50 18 Q29 24 29 38Z" fill="#2a1a08"/>
      <!-- Golden eyes -->
      <ellipse cx="41" cy="48" rx="5" ry="5" fill="#d4a017"/>
      <ellipse cx="59" cy="48" rx="5" ry="5" fill="#d4a017"/>
      <circle cx="42" cy="47" r="2" fill="#f5c030"/>
      <circle cx="60" cy="47" r="2" fill="#f5c030"/>
      <circle cx="42.5" cy="46.5" r="1" fill="#fff"/>
      <circle cx="60.5" cy="46.5" r="1" fill="#fff"/>
      <!-- Innocent expression -->
      <path d="M43 57 Q50 62 57 57" stroke="#c07050" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Shinsu glow hint -->
      <circle cx="50" cy="50" r="48" fill="none" stroke="#d4a017" stroke-width="1" opacity="0.3"/>
    </svg>`
  },

  // ─── GRIFFITH
  {
    id: 'griffith',
    name: 'Griffith',
    universe: 'Berserk',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#c0c0d0"/>
      <circle cx="50" cy="45" r="22" fill="#f5e8d0"/>
      <rect x="28" y="65" width="44" height="35" rx="22" fill="#e8e8f0"/>
      <!-- White hair -->
      <path d="M29 36 Q50 18 71 36 Q71 22 50 16 Q29 22 29 36Z" fill="#f0f0f8"/>
      <path d="M29 40 L20 18 L33 34Z" fill="#f0f0f8"/>
      <path d="M71 40 L80 18 L67 34Z" fill="#f0f0f8"/>
      <!-- Cold blue eyes -->
      <ellipse cx="41" cy="47" rx="4.5" ry="4.5" fill="#4080c0"/>
      <ellipse cx="59" cy="47" rx="4.5" ry="4.5" fill="#4080c0"/>
      <circle cx="42" cy="46" r="1.5" fill="#fff"/>
      <circle cx="60" cy="46" r="1.5" fill="#fff"/>
      <!-- Beherit -->
      <ellipse cx="50" cy="72" rx="8" ry="6" fill="#cc2020"/>
      <circle cx="50" cy="72" r="3" fill="#880000"/>
      <!-- Slight smile -->
      <path d="M43 56 Q50 60 57 56" stroke="#b09080" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`
  },

  // ─── TIDUS
  {
    id: 'tidus',
    name: 'Tidus',
    universe: 'Final Fantasy X',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#4090c0"/>
      <circle cx="50" cy="46" r="21" fill="#f0d5b0"/>
      <rect x="29" y="65" width="42" height="35" rx="21" fill="#1a60a0"/>
      <!-- Blonde hair -->
      <path d="M29 36 Q50 20 71 36 Q71 22 50 18 Q29 22 29 36Z" fill="#d4c020"/>
      <path d="M26 40 L18 22 L30 35Z" fill="#d4c020"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="48" rx="4.5" ry="4.5" fill="#2060a0"/>
      <ellipse cx="59" cy="48" rx="4.5" ry="4.5" fill="#2060a0"/>
      <circle cx="42" cy="47" r="1.5" fill="#fff"/>
      <circle cx="60" cy="47" r="1.5" fill="#fff"/>
      <!-- Cheerful smile -->
      <path d="M38 57 Q50 66 62 57" stroke="#c07850" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Blitzball -->
      <circle cx="76" cy="70" r="10" fill="#4090c0" stroke="#fff" stroke-width="2"/>
      <path d="M70 70 Q76 66 82 70" stroke="#fff" stroke-width="1.5" fill="none"/>
    </svg>`
  },

  // ─── RICK SANCHEZ
  {
    id: 'rick',
    name: 'Rick',
    universe: 'Rick & Morty',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#00b4d8"/>
      <circle cx="50" cy="45" r="22" fill="#e8d8c0"/>
      <rect x="28" y="65" width="44" height="35" rx="0" fill="#f0f0f0"/>
      <!-- Wild white/blue hair -->
      <path d="M22 32 L14 10 L26 28Z" fill="#c0c8d8"/>
      <path d="M33 26 L28 6 L42 24Z" fill="#c0c8d8"/>
      <path d="M55 24 L58 4 L68 22Z" fill="#c0c8d8"/>
      <path d="M70 30 L82 12 L72 28Z" fill="#c0c8d8"/>
      <ellipse cx="50" cy="35" rx="24" ry="14" fill="#c0c8d8"/>
      <!-- Eyes -->
      <ellipse cx="40" cy="47" rx="5" ry="5" fill="#f0f0e0"/>
      <ellipse cx="60" cy="47" rx="5" ry="5" fill="#f0f0e0"/>
      <circle cx="40" cy="47" r="3" fill="#1a1a1a"/>
      <circle cx="60" cy="47" r="3" fill="#1a1a1a"/>
      <circle cx="41" cy="46" r="1" fill="#fff"/>
      <circle cx="61" cy="46" r="1" fill="#fff"/>
      <!-- Unibrow -->
      <path d="M32 40 Q40 37 48 40" stroke="#808090" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M52 40 Q60 37 68 40" stroke="#808090" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Mouth with drool -->
      <path d="M38 57 L62 57" stroke="#a08060" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 57 L52 65" stroke="#c0e0ff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    </svg>`
  },

  // ─── LESLIE KNOPE
  {
    id: 'leslie',
    name: 'Leslie',
    universe: 'Parks & Rec',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#f4a261"/>
      <circle cx="50" cy="46" r="21" fill="#f8d5b0"/>
      <rect x="29" y="65" width="42" height="35" rx="21" fill="#264653"/>
      <!-- Blonde hair -->
      <path d="M29 38 Q50 20 71 38 Q71 24 50 18 Q29 24 29 38Z" fill="#d4c020"/>
      <path d="M29 42 L21 25 L33 36Z" fill="#d4c020"/>
      <path d="M71 42 L79 25 L67 36Z" fill="#d4c020"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="47" rx="4.5" ry="4.5" fill="#3d6b9f"/>
      <ellipse cx="59" cy="47" rx="4.5" ry="4.5" fill="#3d6b9f"/>
      <circle cx="42" cy="46" r="1.5" fill="#fff"/>
      <circle cx="60" cy="46" r="1.5" fill="#fff"/>
      <!-- Determined smile -->
      <path d="M38 56 Q50 64 62 56" stroke="#c07850" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Waffles! -->
      <rect x="38" y="68" width="24" height="18" rx="3" fill="#d4a017" opacity="0.9"/>
      <line x1="44" y1="68" x2="44" y2="86" stroke="#a07010" stroke-width="1"/>
      <line x1="50" y1="68" x2="50" y2="86" stroke="#a07010" stroke-width="1"/>
      <line x1="56" y1="68" x2="56" y2="86" stroke="#a07010" stroke-width="1"/>
      <line x1="38" y1="74" x2="62" y2="74" stroke="#a07010" stroke-width="1"/>
      <line x1="38" y1="80" x2="62" y2="80" stroke="#a07010" stroke-width="1"/>
    </svg>`
  },

  // ─── BARNEY STINSON
  {
    id: 'barney',
    name: 'Barney',
    universe: 'HIMYM',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#1a1a2e"/>
      <circle cx="50" cy="46" r="21" fill="#f0d5b0"/>
      <rect x="29" y="65" width="42" height="35" rx="0" fill="#1a1a1a"/>
      <!-- Slick dark hair -->
      <path d="M29 36 Q50 20 71 36 Q65 22 50 18 Q35 22 29 36Z" fill="#1a1a1a"/>
      <!-- Suit collar -->
      <path d="M34 65 L44 78 L50 70 L56 78 L66 65" fill="#1a1a1a"/>
      <!-- Tie -->
      <path d="M46 70 L50 90 L54 70 L50 66Z" fill="#cc2020"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="47" rx="4" ry="4" fill="#2a2a2a"/>
      <ellipse cx="59" cy="47" rx="4" ry="4" fill="#2a2a2a"/>
      <circle cx="42" cy="46" r="1.5" fill="#fff"/>
      <circle cx="60" cy="46" r="1.5" fill="#fff"/>
      <!-- Suave smile -->
      <path d="M40 57 Q50 63 60 57" stroke="#c07850" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`
  },

  // ─── STERLING ARCHER
  {
    id: 'archer',
    name: 'Archer',
    universe: 'Archer',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#8b0000"/>
      <circle cx="50" cy="45" r="22" fill="#f0d5b0"/>
      <rect x="28" y="65" width="44" height="35" rx="0" fill="#1a1a1a"/>
      <!-- Dark hair, perfectly combed -->
      <path d="M29 35 Q50 18 71 35 Q71 22 50 18 Q29 22 29 35Z" fill="#1a0808"/>
      <rect x="29" y="30" width="42" height="5" rx="2" fill="#1a0808"/>
      <!-- Strong jaw square -->
      <rect x="30" y="48" width="40" height="18" rx="4" fill="#f0d5b0"/>
      <!-- Eyes -->
      <ellipse cx="41" cy="44" rx="4.5" ry="4" fill="#2a1a0a"/>
      <ellipse cx="59" cy="44" rx="4.5" ry="4" fill="#2a1a0a"/>
      <circle cx="42" cy="43" r="1.5" fill="#fff"/>
      <circle cx="60" cy="43" r="1.5" fill="#fff"/>
      <!-- Smirk -->
      <path d="M40 58 Q55 64 62 57" stroke="#c07850" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Turtleneck -->
      <rect x="30" y="65" width="40" height="10" rx="4" fill="#1a1a1a"/>
    </svg>`
  }
];

// Expose globally
window.AVATARS = AVATARS;
