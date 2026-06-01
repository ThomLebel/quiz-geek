// ═══════════════════════════════════════════
// AVATARS SVG — bustes sans bannière, viewBox 120×210
// Le nom est affiché en HTML (pas dans le SVG)
// ═══════════════════════════════════════════

export const AVATARS = [

  // ─── NARUTO
  {
    id: 'naruto', name: 'Naruto', universe: 'Naruto',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <rect x="18" y="130" width="84" height="80" rx="8" fill="#E8720A"/>
      <line x1="60" y1="130" x2="60" y2="210" stroke="#CC5500" stroke-width="2"/>
      <path d="M30 130 L44 145 L60 133 L76 145 L90 130" fill="#CC5500"/>
      <text x="60" y="180" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="900" fill="#CC5500">7</text>
      <rect x="2" y="140" width="16" height="60" rx="7" fill="#E8720A"/>
      <rect x="102" y="140" width="16" height="60" rx="7" fill="#E8720A"/>
      <rect x="50" y="112" width="20" height="20" rx="4" fill="#FAD9A0"/>
      <ellipse cx="60" cy="80" rx="38" ry="42" fill="#FAD9A0"/>
      <ellipse cx="60" cy="46" rx="40" ry="20" fill="#F5C800"/>
      <path d="M22 62 L6 22 L24 52Z" fill="#F5C800"/>
      <path d="M32 54 L16 8 L34 44Z" fill="#F5C800"/>
      <path d="M44 48 L30 0 L46 38Z" fill="#F5C800"/>
      <path d="M56 46 L50 0 L64 36Z" fill="#F5C800"/>
      <path d="M68 48 L68 0 L78 38Z" fill="#F5C800"/>
      <path d="M80 54 L86 8 L90 44Z" fill="#F5C800"/>
      <path d="M92 62 L102 22 L96 52Z" fill="#F5C800"/>
      <rect x="22" y="60" width="76" height="15" rx="7" fill="#7BAFD4"/>
      <rect x="32" y="61" width="56" height="13" rx="4" fill="#C5D9EC"/>
      <path d="M57 66 Q60 63 63 66 Q60 70 57 66Z" fill="#7BAFD4"/>
      <ellipse cx="46" cy="82" rx="7.5" ry="8" fill="white"/>
      <ellipse cx="74" cy="82" rx="7.5" ry="8" fill="white"/>
      <ellipse cx="46" cy="82" rx="5.5" ry="6" fill="#3A78D5"/>
      <ellipse cx="74" cy="82" rx="5.5" ry="6" fill="#3A78D5"/>
      <circle cx="46" cy="82" r="3" fill="#1A3A8A"/>
      <circle cx="74" cy="82" r="3" fill="#1A3A8A"/>
      <circle cx="44" cy="79" r="1.5" fill="white"/>
      <circle cx="72" cy="79" r="1.5" fill="white"/>
      <path d="M38 72 Q46 69 54 72" stroke="#8B6A30" stroke-width="1.5" fill="none"/>
      <path d="M66 72 Q74 69 82 72" stroke="#8B6A30" stroke-width="1.5" fill="none"/>
      <line x1="6" y1="90" x2="34" y2="91" stroke="#C4925A" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="95" x2="34" y2="94" stroke="#C4925A" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="100" x2="34" y2="98" stroke="#C4925A" stroke-width="2" stroke-linecap="round"/>
      <line x1="86" y1="91" x2="114" y2="90" stroke="#C4925A" stroke-width="2" stroke-linecap="round"/>
      <line x1="86" y1="94" x2="114" y2="95" stroke="#C4925A" stroke-width="2" stroke-linecap="round"/>
      <line x1="86" y1="98" x2="114" y2="100" stroke="#C4925A" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="60" cy="98" rx="3" ry="2" fill="#D4A870"/>
      <path d="M44 108 Q60 122 76 108" fill="#E8905A" stroke="#B07840" stroke-width="1.5"/>
      <path d="M44 108 Q60 115 76 108" fill="white"/>
      <ellipse cx="22" cy="82" rx="7" ry="9" fill="#FAD9A0"/>
      <ellipse cx="98" cy="82" rx="7" ry="9" fill="#FAD9A0"/>
    </svg>`
  },

  // ─── LUFFY
  {
    id: 'luffy', name: 'Luffy', universe: 'One Piece',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <path d="M15 124 L38 124 L60 172 L82 124 L105 124 L105 210 L15 210Z" fill="#CC1111"/>
      <path d="M38 124 L60 148 L82 124" fill="#AA0000"/>
      <ellipse cx="60" cy="163" rx="22" ry="32" fill="#FAD5A0"/>
      <line x1="50" y1="150" x2="70" y2="174" stroke="#AA1100" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="70" y1="150" x2="50" y2="174" stroke="#AA1100" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="2" y="132" width="15" height="65" rx="7" fill="#CC1111"/>
      <rect x="103" y="106" width="15" height="60" rx="7" fill="#CC1111"/>
      <ellipse cx="110" cy="108" rx="10" ry="12" fill="#FAD5A0"/>
      <rect x="50" y="110" width="20" height="18" rx="4" fill="#FAD5A0"/>
      <ellipse cx="60" cy="74" rx="40" ry="44" fill="#FAD5A0"/>
      <ellipse cx="60" cy="41" rx="54" ry="11" fill="#C8900A"/>
      <ellipse cx="60" cy="36" rx="30" ry="17" fill="#DFA010"/>
      <rect x="6" y="39" width="108" height="7" rx="3.5" fill="#C8900A"/>
      <path d="M10 42 Q60 48 110 42" stroke="#AA1010" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="48" rx="36" ry="13" fill="#111"/>
      <path d="M28 55 Q32 34 40 32 Q39 42 33 53Z" fill="#111"/>
      <path d="M36 49 Q40 24 50 22 Q48 36 42 48Z" fill="#111"/>
      <path d="M50 45 Q53 18 63 18 Q61 34 55 44Z" fill="#111"/>
      <path d="M64 46 Q70 20 79 22 Q76 36 69 45Z" fill="#111"/>
      <path d="M76 50 Q82 26 90 28 Q86 40 80 51Z" fill="#111"/>
      <ellipse cx="44" cy="72" rx="9" ry="10" fill="white"/>
      <ellipse cx="76" cy="72" rx="9" ry="10" fill="white"/>
      <ellipse cx="44" cy="72" rx="7" ry="8" fill="#111"/>
      <ellipse cx="76" cy="72" rx="7" ry="8" fill="#111"/>
      <circle cx="41" cy="68" r="2.5" fill="white"/>
      <circle cx="73" cy="68" r="2.5" fill="white"/>
      <path d="M57 80 L62 92" stroke="#CC2020" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M57 88 L63 88" stroke="#D4A870" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M32 100 Q60 127 88 100" fill="#E8905A"/>
      <path d="M32 100 Q60 115 88 100" fill="white"/>
      <ellipse cx="20" cy="74" rx="7" ry="9" fill="#FAD5A0"/>
      <ellipse cx="100" cy="74" rx="7" ry="9" fill="#FAD5A0"/>
    </svg>`
  },

  // ─── ZORO
  {
    id: 'zoro', name: 'Zoro', universe: 'One Piece',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <path d="M15 122 L38 122 L60 160 L82 122 L105 122 L105 210 L15 210Z" fill="#1E6B3A"/>
      <path d="M38 122 L60 150 L82 122" fill="#155228"/>
      <ellipse cx="60" cy="160" rx="20" ry="28" fill="#E8D8B8"/>
      <rect x="28" y="175" width="64" height="10" rx="5" fill="#CC2200"/>
      <rect x="2" y="175" width="6" height="55" rx="3" fill="#888"/>
      <rect x="-4" y="175" width="6" height="52" rx="3" fill="#AAA"/>
      <ellipse cx="5" cy="179" rx="8" ry="5" fill="#D4A017"/>
      <rect x="2" y="130" width="14" height="60" rx="7" fill="#1E6B3A"/>
      <rect x="104" y="130" width="14" height="60" rx="7" fill="#1E6B3A"/>
      <rect x="50" y="106" width="20" height="18" rx="4" fill="#C8906A"/>
      <ellipse cx="60" cy="72" rx="38" ry="42" fill="#C8906A"/>
      <ellipse cx="60" cy="40" rx="40" ry="20" fill="#1E8A30"/>
      <path d="M22 58 L10 12 L26 46Z" fill="#1E8A30"/>
      <path d="M32 50 L20 0 L36 38Z" fill="#1E8A30"/>
      <path d="M44 44 L34 0 L48 32Z" fill="#1E8A30"/>
      <path d="M56 42 L52 0 L66 32Z" fill="#1E8A30"/>
      <path d="M70 44 L72 0 L80 34Z" fill="#1E8A30"/>
      <path d="M82 50 L88 4 L90 40Z" fill="#1E8A30"/>
      <path d="M92 58 L100 16 L96 48Z" fill="#1E8A30"/>
      <ellipse cx="44" cy="72" rx="8" ry="7" fill="white"/>
      <ellipse cx="76" cy="72" rx="8" ry="7" fill="white"/>
      <ellipse cx="44" cy="72" rx="6" ry="5" fill="#1A3A1A"/>
      <ellipse cx="76" cy="72" rx="6" ry="5" fill="#1A3A1A"/>
      <circle cx="44" cy="72" r="3" fill="#0A1A0A"/>
      <circle cx="76" cy="72" r="3" fill="#0A1A0A"/>
      <circle cx="42" cy="69" r="1.5" fill="white"/>
      <circle cx="74" cy="69" r="1.5" fill="white"/>
      <path d="M34 61 Q44 57 54 61" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M66 61 Q76 57 86 61" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>
      <line x1="42" y1="56" x2="48" y2="90" stroke="#881111" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="60" cy="84" rx="3" ry="2" fill="#AA7050"/>
      <path d="M46 96 L74 96" stroke="#906040" stroke-width="3" stroke-linecap="round"/>
      <circle cx="98" cy="74" r="6" fill="none" stroke="#D4A017" stroke-width="2.5"/>
      <ellipse cx="22" cy="72" rx="7" ry="9" fill="#C8906A"/>
      <ellipse cx="98" cy="72" rx="7" ry="9" fill="#C8906A"/>
    </svg>`
  },

  // ─── KAKASHI
  {
    id: 'kakashi', name: 'Kakashi', universe: 'Naruto',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <rect x="15" y="125" width="90" height="85" rx="8" fill="#1A2530"/>
      <rect x="30" y="132" width="60" height="50" rx="6" fill="#3A4A5A"/>
      <rect x="38" y="140" width="44" height="35" rx="4" fill="#2A3A4A"/>
      <rect x="2" y="135" width="15" height="65" rx="7" fill="#1A2530"/>
      <rect x="103" y="135" width="15" height="65" rx="7" fill="#1A2530"/>
      <rect x="48" y="110" width="24" height="18" rx="5" fill="#D8C8B0"/>
      <path d="M22 105 Q22 135 60 138 Q98 135 98 105 Q82 113 60 113 Q38 113 22 105Z" fill="#1A2530"/>
      <ellipse cx="60" cy="72" rx="38" ry="40" fill="#D8C8B0"/>
      <ellipse cx="60" cy="42" rx="40" ry="18" fill="#C0C8D0"/>
      <path d="M22 58 L8 12 L24 48Z" fill="#C0C8D0"/>
      <path d="M30 52 L16 2 L32 42Z" fill="#C0C8D0"/>
      <path d="M40 46 L28 0 L44 36Z" fill="#C0C8D0"/>
      <path d="M52 43 L44 0 L58 34Z" fill="#C0C8D0"/>
      <path d="M66 43 L68 0 L76 34Z" fill="#C0C8D0"/>
      <path d="M78 46 L84 0 L88 38Z" fill="#C0C8D0"/>
      <path d="M90 54 L98 10 L96 46Z" fill="#C0C8D0"/>
      <rect x="18" y="56" width="84" height="18" rx="8" fill="#1A2530"/>
      <rect x="28" y="57" width="64" height="16" rx="5" fill="#2A3A4A"/>
      <rect x="36" y="58" width="48" height="14" rx="3" fill="#8899AA"/>
      <path d="M57 63 Q60 60 63 63 Q60 67 57 63Z" fill="#445566"/>
      <circle cx="60" cy="64" r="3" fill="none" stroke="#445566" stroke-width="1.2"/>
      <ellipse cx="74" cy="80" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="74" cy="80" rx="7" ry="6.5" fill="#2A2A2A"/>
      <circle cx="74" cy="80" r="3.5" fill="#111"/>
      <circle cx="72" cy="77" r="2" fill="white"/>
      <ellipse cx="46" cy="70" rx="5" ry="5" fill="#CC0000" opacity="0.35"/>
      <path d="M55 95 Q60 98 65 95" stroke="#AAAAAA" stroke-width="1.5" fill="none"/>
      <ellipse cx="22" cy="78" rx="7" ry="9" fill="#D8C8B0"/>
      <ellipse cx="98" cy="78" rx="7" ry="9" fill="#D8C8B0"/>
    </svg>`
  },

  // ─── GUTS
  {
    id: 'guts', name: 'Guts', universe: 'Berserk',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#222"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#333"/>
      <rect x="28" y="134" width="64" height="42" rx="4" fill="#2A2A2A"/>
      <circle cx="34" cy="146" r="3" fill="#555"/>
      <circle cx="86" cy="146" r="3" fill="#555"/>
      <circle cx="34" cy="168" r="3" fill="#555"/>
      <circle cx="86" cy="168" r="3" fill="#555"/>
      <ellipse cx="14" cy="130" rx="12" ry="18" fill="#333"/>
      <ellipse cx="106" cy="130" rx="12" ry="18" fill="#333"/>
      <path d="M8 135 Q0 175 4 210 L15 210 L15 135Z" fill="#7A5020"/>
      <rect x="-10" y="20" width="18" height="180" rx="4" fill="#888"/>
      <rect x="-20" y="135" width="38" height="12" rx="5" fill="#666"/>
      <rect x="2" y="138" width="16" height="65" rx="7" fill="#333"/>
      <rect x="102" y="138" width="16" height="65" rx="7" fill="#333"/>
      <rect x="48" y="108" width="24" height="18" rx="5" fill="#C8A070"/>
      <ellipse cx="60" cy="74" rx="38" ry="42" fill="#C8A070"/>
      <ellipse cx="60" cy="44" rx="40" ry="20" fill="#111"/>
      <path d="M22 60 L12 20 L26 50Z" fill="#111"/>
      <path d="M32 54 L22 10 L36 44Z" fill="#111"/>
      <path d="M44 50 L36 2 L48 40Z" fill="#111"/>
      <path d="M56 48 L52 0 L64 38Z" fill="#111"/>
      <path d="M68 50 L70 2 L78 40Z" fill="#111"/>
      <path d="M80 54 L86 12 L88 46Z" fill="#111"/>
      <path d="M92 60 L100 24 L96 52Z" fill="#111"/>
      <ellipse cx="44" cy="74" rx="8.5" ry="8" fill="white"/>
      <ellipse cx="76" cy="74" rx="8.5" ry="8" fill="white"/>
      <ellipse cx="44" cy="74" rx="6.5" ry="6" fill="#3A2010"/>
      <ellipse cx="76" cy="74" rx="6.5" ry="6" fill="#3A2010"/>
      <circle cx="44" cy="74" r="3.5" fill="#1A0808"/>
      <circle cx="76" cy="74" r="3.5" fill="#1A0808"/>
      <circle cx="42" cy="71" r="2" fill="white"/>
      <circle cx="74" cy="71" r="2" fill="white"/>
      <line x1="44" y1="58" x2="50" y2="95" stroke="#881111" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M32 62 Q44 57 56 62" stroke="#1A0A00" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M64 62 Q76 57 88 62" stroke="#1A0A00" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="86" rx="3.5" ry="2.5" fill="#AA8050"/>
      <path d="M44 100 L76 100" stroke="#9A7050" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="22" cy="76" rx="7" ry="9" fill="#C8A070"/>
      <ellipse cx="98" cy="76" rx="7" ry="9" fill="#C8A070"/>
    </svg>`
  },

  // ─── CLOUD
  {
    id: 'cloud', name: 'Cloud', universe: 'FF VII',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#1A2A4A"/>
      <rect x="22" y="128" width="76" height="55" rx="5" fill="#223055"/>
      <rect x="30" y="135" width="60" height="42" rx="4" fill="#1A2540"/>
      <rect x="14" y="122" width="14" height="55" rx="5" fill="#445577"/>
      <rect x="92" y="122" width="14" height="55" rx="5" fill="#445577"/>
      <path d="M30 128 L90 165" stroke="#334" stroke-width="4"/>
      <ellipse cx="14" cy="128" rx="14" ry="10" fill="#556688"/>
      <ellipse cx="106" cy="128" rx="14" ry="10" fill="#556688"/>
      <rect x="92" y="10" width="20" height="170" rx="5" fill="#7A8A9A"/>
      <rect x="82" y="116" width="40" height="14" rx="5" fill="#556"/>
      <rect x="2" y="132" width="16" height="65" rx="7" fill="#1A2A4A"/>
      <rect x="102" y="132" width="16" height="65" rx="7" fill="#1A2A4A"/>
      <rect x="48" y="108" width="24" height="18" rx="5" fill="#EAD0A0"/>
      <ellipse cx="60" cy="72" rx="38" ry="42" fill="#EAD0A0"/>
      <ellipse cx="60" cy="38" rx="40" ry="22" fill="#C8B800"/>
      <path d="M18 58 L0 0 L20 46Z" fill="#C8B800"/>
      <path d="M26 50 L8 0 L28 38Z" fill="#C8B800"/>
      <path d="M36 44 L20 0 L38 32Z" fill="#C8B800"/>
      <path d="M48 40 L38 0 L52 30Z" fill="#C8B800"/>
      <path d="M60 38 L58 0 L70 28Z" fill="#C8B800"/>
      <path d="M72 40 L74 0 L82 30Z" fill="#C8B800"/>
      <path d="M84 46 L88 0 L92 36Z" fill="#C8B800"/>
      <path d="M96 56 L102 8 L100 46Z" fill="#C8B800"/>
      <ellipse cx="44" cy="72" rx="9" ry="9.5" fill="white"/>
      <ellipse cx="76" cy="72" rx="9" ry="9.5" fill="white"/>
      <ellipse cx="44" cy="72" rx="7" ry="7.5" fill="#00CCEE"/>
      <ellipse cx="76" cy="72" rx="7" ry="7.5" fill="#00CCEE"/>
      <circle cx="44" cy="72" r="4" fill="#00889A"/>
      <circle cx="76" cy="72" r="4" fill="#00889A"/>
      <circle cx="42" cy="69" r="2" fill="white"/>
      <circle cx="74" cy="69" r="2" fill="white"/>
      <path d="M33 60 Q44 56 55 60" stroke="#8A7030" stroke-width="2.5" fill="none"/>
      <path d="M65 60 Q76 56 87 60" stroke="#8A7030" stroke-width="2.5" fill="none"/>
      <ellipse cx="60" cy="85" rx="3" ry="2.5" fill="#C0A070"/>
      <path d="M46 98 L74 98" stroke="#A07848" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="22" cy="74" rx="7" ry="9" fill="#EAD0A0"/>
      <ellipse cx="98" cy="74" rx="7" ry="9" fill="#EAD0A0"/>
    </svg>`
  },

  // ─── SORA
  {
    id: 'sora', name: 'Sora', universe: 'Kingdom Hearts',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <rect x="26" y="178" width="68" height="32" rx="6" fill="#CC2211"/>
      <path d="M14 124 L38 124 L60 170 L82 124 L106 124 L106 210 L14 210Z" fill="#1A1A1A"/>
      <path d="M38 124 L60 148 L82 124 L82 170 L60 185 L38 170Z" fill="#EEEEEE"/>
      <path d="M38 124 L60 135 L82 124" fill="#CC2211"/>
      <ellipse cx="38" cy="206" rx="20" ry="10" fill="#FFCC00"/>
      <ellipse cx="82" cy="206" rx="20" ry="10" fill="#FFCC00"/>
      <rect x="100" y="20" width="12" height="140" rx="4" fill="#C0C0C0"/>
      <rect x="96" y="18" width="20" height="10" rx="3" fill="#D4A017"/>
      <path d="M104 20 L116 4 L108 18Z" fill="#D4A017"/>
      <path d="M104 20 L92 4 L100 18Z" fill="#C0A010"/>
      <rect x="2" y="132" width="15" height="65" rx="7" fill="#1A1A1A"/>
      <rect x="48" y="108" width="24" height="18" rx="5" fill="#FAD8A0"/>
      <ellipse cx="60" cy="72" rx="38" ry="42" fill="#FAD8A0"/>
      <ellipse cx="60" cy="40" rx="40" ry="22" fill="#4A2A0A"/>
      <path d="M18 60 L4 10 L22 48Z" fill="#4A2A0A"/>
      <path d="M28 52 L12 0 L30 40Z" fill="#4A2A0A"/>
      <path d="M40 46 L26 0 L42 34Z" fill="#4A2A0A"/>
      <path d="M52 42 L46 0 L60 32Z" fill="#4A2A0A"/>
      <path d="M66 42 L68 0 L76 32Z" fill="#4A2A0A"/>
      <path d="M78 48 L84 2 L88 38Z" fill="#4A2A0A"/>
      <path d="M90 56 L98 8 L96 46Z" fill="#4A2A0A"/>
      <path d="M46 28 L50 34 L55 26 L60 36 L65 26 L70 34 L74 28" stroke="#FFD700" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="44" cy="74" rx="9" ry="9.5" fill="white"/>
      <ellipse cx="76" cy="74" rx="9" ry="9.5" fill="white"/>
      <ellipse cx="44" cy="74" rx="7" ry="7.5" fill="#2A5A9A"/>
      <ellipse cx="76" cy="74" rx="7" ry="7.5" fill="#2A5A9A"/>
      <circle cx="44" cy="74" r="4" fill="#1A3A7A"/>
      <circle cx="76" cy="74" r="4" fill="#1A3A7A"/>
      <circle cx="42" cy="71" r="2" fill="white"/>
      <circle cx="74" cy="71" r="2" fill="white"/>
      <ellipse cx="60" cy="86" rx="3" ry="2" fill="#D4A870"/>
      <path d="M40 98 Q60 118 80 98" fill="#E89060" stroke="#B07840" stroke-width="1.5"/>
      <path d="M40 98 Q60 108 80 98" fill="white"/>
      <ellipse cx="22" cy="74" rx="7" ry="9" fill="#FAD8A0"/>
      <ellipse cx="98" cy="74" rx="7" ry="9" fill="#FAD8A0"/>
    </svg>`
  },

  // ─── GRIFFITH
  {
    id: 'griffith', name: 'Griffith', universe: 'Berserk',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <path d="M8 130 Q4 180 8 210 L30 210 L20 130Z" fill="#2244AA"/>
      <path d="M112 130 Q116 180 112 210 L90 210 L100 130Z" fill="#2244AA"/>
      <rect x="18" y="120" width="84" height="88" rx="6" fill="#D0D8E0"/>
      <rect x="24" y="126" width="72" height="55" rx="5" fill="#E0E8F0"/>
      <rect x="30" y="132" width="60" height="42" rx="4" fill="#CCD4DC"/>
      <ellipse cx="60" cy="156" rx="10" ry="8" fill="#CC2222"/>
      <circle cx="60" cy="156" r="5" fill="#880000"/>
      <path d="M8 124 Q4 108 12 100 Q18 108 22 120Z" fill="#E0E8F0"/>
      <path d="M112 124 Q116 108 108 100 Q102 108 98 120Z" fill="#E0E8F0"/>
      <ellipse cx="15" cy="124" rx="13" ry="10" fill="#CCD4DC"/>
      <ellipse cx="105" cy="124" rx="13" ry="10" fill="#CCD4DC"/>
      <rect x="2" y="130" width="15" height="65" rx="7" fill="#C0C8D0"/>
      <rect x="103" y="130" width="15" height="65" rx="7" fill="#C0C8D0"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#F0E8D8"/>
      <ellipse cx="60" cy="70" rx="38" ry="44" fill="#F0E8D8"/>
      <path d="M22 68 Q10 30 14 0 L24 40Z" fill="#E8EEF8"/>
      <path d="M16 80 Q4 40 8 8 L18 55Z" fill="#E8EEF8"/>
      <path d="M22 68 Q60 46 98 68 Q96 36 60 28 Q24 36 22 68Z" fill="#E8EEF8"/>
      <path d="M98 68 Q110 30 106 0 L96 40Z" fill="#E8EEF8"/>
      <path d="M104 80 Q116 40 112 8 L102 55Z" fill="#E8EEF8"/>
      <ellipse cx="44" cy="68" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="76" cy="68" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="44" cy="68" rx="7" ry="6.5" fill="#2A60AA"/>
      <ellipse cx="76" cy="68" rx="7" ry="6.5" fill="#2A60AA"/>
      <circle cx="44" cy="68" r="4" fill="#1A4080"/>
      <circle cx="76" cy="68" r="4" fill="#1A4080"/>
      <circle cx="42" cy="65" r="2" fill="white"/>
      <circle cx="74" cy="65" r="2" fill="white"/>
      <path d="M57 80 L60 84 L63 80" stroke="#C0A888" stroke-width="1.5" fill="none"/>
      <path d="M46 94 Q60 101 74 94" stroke="#A08870" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="70" rx="7" ry="9" fill="#F0E8D8"/>
      <ellipse cx="98" cy="70" rx="7" ry="9" fill="#F0E8D8"/>
    </svg>`
  },

  // ─── BAM
  {
    id: 'bam', name: 'Bam', universe: 'Tower of God',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#080820"/>
      <circle cx="60" cy="105" r="100" fill="none" stroke="#C8A000" stroke-width="0.8" opacity="0.3"/>
      <path d="M14 122 L28 122 L60 175 L92 122 L106 122 L106 210 L14 210Z" fill="#111122"/>
      <path d="M14 210 L106 210" stroke="#CC2200" stroke-width="3"/>
      <path d="M28 122 L60 165 L92 122 Q92 140 60 155 Q28 140 28 122Z" fill="#0D0D22"/>
      <path d="M22 190 L30 182 L38 190 L30 198Z" fill="#CC2200" opacity="0.7"/>
      <path d="M62 195 L70 187 L78 195 L70 203Z" fill="#CC2200" opacity="0.7"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#EAD090"/>
      <rect x="40" y="118" width="40" height="12" rx="6" fill="#111122"/>
      <rect x="2" y="130" width="14" height="65" rx="7" fill="#111122"/>
      <rect x="104" y="130" width="14" height="65" rx="7" fill="#111122"/>
      <ellipse cx="60" cy="70" rx="38" ry="42" fill="#EAD090"/>
      <path d="M22 66 Q10 28 12 0 L22 40Z" fill="#180E02"/>
      <path d="M28 60 Q16 18 18 0 L28 34Z" fill="#180E02"/>
      <path d="M22 66 Q60 44 98 66 Q96 32 60 24 Q24 32 22 66Z" fill="#180E02"/>
      <ellipse cx="44" cy="70" rx="10" ry="10.5" fill="white"/>
      <ellipse cx="76" cy="70" rx="10" ry="10.5" fill="white"/>
      <ellipse cx="44" cy="70" rx="8" ry="8.5" fill="#D4A000"/>
      <ellipse cx="76" cy="70" rx="8" ry="8.5" fill="#D4A000"/>
      <circle cx="44" cy="70" r="5" fill="#F0C020"/>
      <circle cx="76" cy="70" r="5" fill="#F0C020"/>
      <circle cx="44" cy="70" r="2.5" fill="#1A0A00"/>
      <circle cx="76" cy="70" r="2.5" fill="#1A0A00"/>
      <circle cx="42" cy="67" r="2" fill="white"/>
      <circle cx="74" cy="67" r="2" fill="white"/>
      <ellipse cx="60" cy="83" rx="3" ry="2" fill="#C4A060"/>
      <path d="M46 96 Q60 104 74 96" stroke="#B09040" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="70" rx="7" ry="9" fill="#EAD090"/>
      <ellipse cx="98" cy="70" rx="7" ry="9" fill="#EAD090"/>
    </svg>`
  },

  // ─── BIBI
  {
    id: 'bibi', name: 'Bibi', universe: 'FF IX',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#0a0a2a"/>
      <rect x="24" y="148" width="72" height="62" rx="8" fill="#3355BB"/>
      <rect x="24" y="175" width="72" height="11" rx="5" fill="#8B5A20"/>
      <rect x="46" y="172" width="28" height="17" rx="4" fill="#AA7730"/>
      <rect x="8" y="180" width="16" height="18" rx="5" fill="#FFFFFF"/>
      <rect x="96" y="180" width="16" height="18" rx="5" fill="#FFFFFF"/>
      <ellipse cx="16" cy="200" rx="10" ry="10" fill="#CC4422"/>
      <ellipse cx="104" cy="200" rx="10" ry="10" fill="#CC4422"/>
      <rect x="8" y="150" width="16" height="50" rx="7" fill="#3355BB"/>
      <rect x="96" y="150" width="16" height="50" rx="7" fill="#3355BB"/>
      <ellipse cx="60" cy="128" rx="36" ry="38" fill="#111"/>
      <path d="M10 115 L60 0 L110 115 Q85 107 60 107 Q35 107 10 115Z" fill="#B89030"/>
      <path d="M12 114 L60 4 L108 114 Q84 106 60 106 Q36 106 12 114Z" fill="#C8A040"/>
      <ellipse cx="60" cy="113" rx="52" ry="10" fill="#B89030"/>
      <rect x="14" y="108" width="92" height="9" rx="4" fill="#8B5A20"/>
      <ellipse cx="45" cy="125" rx="13" ry="13" fill="#F0C000"/>
      <ellipse cx="75" cy="125" rx="13" ry="13" fill="#F0C000"/>
      <ellipse cx="45" cy="125" rx="9" ry="9" fill="#CC9900"/>
      <ellipse cx="75" cy="125" rx="9" ry="9" fill="#CC9900"/>
      <circle cx="45" cy="125" r="4" fill="#1A0A00"/>
      <circle cx="75" cy="125" r="4" fill="#1A0A00"/>
      <circle cx="43" cy="121" r="2.5" fill="white"/>
      <circle cx="73" cy="121" r="2.5" fill="white"/>
    </svg>`
  },

  // ─── KOON
  {
    id: 'koon', name: 'Koon', universe: 'Tower of God',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#0a1a3a"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#F0F4F8"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#FFFFFF"/>
      <path d="M54 122 L60 175 L66 122 L60 114Z" fill="#111"/>
      <rect x="2" y="132" width="14" height="65" rx="7" fill="#F0F4F8"/>
      <rect x="104" y="132" width="14" height="65" rx="7" fill="#F0F4F8"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#F0E8D8"/>
      <ellipse cx="60" cy="70" rx="38" ry="42" fill="#F0E8D8"/>
      <ellipse cx="60" cy="40" rx="40" ry="18" fill="#D0DCE8"/>
      <path d="M22 62 Q28 30 38 26 Q36 46 28 62Z" fill="#D0DCE8"/>
      <path d="M30 56 Q36 20 48 18 Q44 38 36 54Z" fill="#D0DCE8"/>
      <path d="M44 52 Q50 16 62 16 Q58 36 50 50Z" fill="#D0DCE8"/>
      <path d="M60 52 Q66 16 78 18 Q72 38 64 50Z" fill="#D0DCE8"/>
      <path d="M76 58 Q82 28 90 28 Q86 46 80 58Z" fill="#D0DCE8"/>
      <path d="M78 56 Q90 24 98 18 L96 40Z" fill="#1A2A9A"/>
      <path d="M86 58 Q100 26 106 22 L102 46Z" fill="#1A2A9A"/>
      <ellipse cx="44" cy="68" rx="9.5" ry="9" fill="white"/>
      <ellipse cx="76" cy="68" rx="9.5" ry="9" fill="white"/>
      <ellipse cx="44" cy="68" rx="7.5" ry="7" fill="#2244CC"/>
      <ellipse cx="76" cy="68" rx="7.5" ry="7" fill="#2244CC"/>
      <circle cx="44" cy="68" r="4" fill="#1133AA"/>
      <circle cx="76" cy="68" r="4" fill="#1133AA"/>
      <circle cx="42" cy="65" r="2" fill="white"/>
      <circle cx="74" cy="65" r="2" fill="white"/>
      <path d="M46 83 Q60 90 74 83" stroke="#A07848" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M57 76 L60 81 L63 76" stroke="#C0A888" stroke-width="1.5" fill="none"/>
      <ellipse cx="22" cy="70" rx="7" ry="9" fill="#F0E8D8"/>
      <ellipse cx="98" cy="70" rx="7" ry="9" fill="#F0E8D8"/>
    </svg>`
  },

  // ─── RICK
  {
    id: 'rick', name: 'Rick', universe: 'Rick & Morty',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#0a1a10"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#F0F0F0"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#FFFFFF"/>
      <path d="M36 122 L60 142 L84 122 Q84 130 60 148 Q36 130 36 122Z" fill="#80CCCC"/>
      <rect x="94" y="165" width="22" height="14" rx="4" fill="#9AA8B0"/>
      <ellipse cx="116" cy="158" rx="8" ry="12" fill="#80CC80"/>
      <rect x="100" y="132" width="15" height="62" rx="7" fill="#F0F0F0"/>
      <rect x="5" y="132" width="15" height="62" rx="7" fill="#F0F0F0"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#E8D8B8"/>
      <ellipse cx="60" cy="68" rx="38" ry="42" fill="#E8D8B8"/>
      <ellipse cx="60" cy="38" rx="40" ry="18" fill="#9AB8CC"/>
      <path d="M20 62 L2 14 L18 52Z" fill="#9AB8CC"/>
      <path d="M24 56 L6 2 L22 46Z" fill="#9AB8CC"/>
      <path d="M30 50 L14 0 L30 40Z" fill="#9AB8CC"/>
      <path d="M38 46 L26 0 L42 36Z" fill="#9AB8CC"/>
      <path d="M46 44 L38 0 L52 34Z" fill="#9AB8CC"/>
      <path d="M56 42 L52 0 L66 32Z" fill="#9AB8CC"/>
      <path d="M66 44 L68 0 L78 34Z" fill="#9AB8CC"/>
      <path d="M76 46 L82 0 L88 38Z" fill="#9AB8CC"/>
      <path d="M86 52 L94 0 L96 46Z" fill="#9AB8CC"/>
      <path d="M92 60 L102 10 L100 54Z" fill="#9AB8CC"/>
      <ellipse cx="44" cy="68" rx="10" ry="9.5" fill="#F0F0E8"/>
      <ellipse cx="76" cy="68" rx="10" ry="9.5" fill="#F0F0E8"/>
      <circle cx="44" cy="68" r="6" fill="#111"/>
      <circle cx="76" cy="68" r="6" fill="#111"/>
      <circle cx="42" cy="65" r="2.5" fill="white"/>
      <circle cx="74" cy="65" r="2.5" fill="white"/>
      <path d="M28 56 Q60 52 92 56" stroke="#706A60" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="80" rx="6" ry="5" fill="#C8A878"/>
      <path d="M38 92 Q60 100 82 92" stroke="#888" stroke-width="2" fill="none"/>
      <path d="M56 95 L58 108" stroke="#66BB88" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="22" cy="70" rx="7" ry="9" fill="#E8D8B8"/>
      <ellipse cx="98" cy="70" rx="7" ry="9" fill="#E8D8B8"/>
    </svg>`
  },

  // ─── EVIL MORTY
  {
    id: 'evilmorty', name: 'Evil Morty', universe: 'Rick & Morty',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a0a"/>
      <rect x="26" y="178" width="68" height="32" rx="6" fill="#1A2A5A"/>
      <rect x="18" y="124" width="84" height="70" rx="8" fill="#D4CC44"/>
      <path d="M42 124 Q60 136 78 124" stroke="#B8B030" stroke-width="2" fill="none"/>
      <rect x="4" y="134" width="15" height="60" rx="7" fill="#D4CC44"/>
      <rect x="101" y="134" width="15" height="60" rx="7" fill="#D4CC44"/>
      <rect x="48" y="108" width="24" height="18" rx="5" fill="#E8D890"/>
      <ellipse cx="60" cy="72" rx="36" ry="38" fill="#E8D890"/>
      <ellipse cx="24" cy="72" rx="7.5" ry="9" fill="#E8D890"/>
      <ellipse cx="96" cy="72" rx="7.5" ry="9" fill="#E8D890"/>
      <ellipse cx="60" cy="46" rx="36" ry="14" fill="#6A4A1A"/>
      <path d="M24 64 Q30 38 40 34 Q38 50 30 64Z" fill="#6A4A1A"/>
      <path d="M32 58 Q38 28 50 26 Q47 44 40 58Z" fill="#6A4A1A"/>
      <path d="M48 54 Q52 24 64 24 Q60 40 52 52Z" fill="#6A4A1A"/>
      <path d="M64 54 Q70 26 80 28 Q75 44 68 54Z" fill="#6A4A1A"/>
      <path d="M78 60 Q84 34 92 38 Q88 52 82 60Z" fill="#6A4A1A"/>
      <ellipse cx="44" cy="68" rx="14" ry="11" fill="#111"/>
      <path d="M30 68 Q28 62 30 56 Q38 50 44 50 Q50 50 58 56 Q60 62 58 68" stroke="#111" stroke-width="2.5" fill="none"/>
      <ellipse cx="76" cy="68" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="76" cy="68" rx="7" ry="6.5" fill="#7A8898"/>
      <circle cx="76" cy="68" r="4" fill="#2A3A4A"/>
      <circle cx="74" cy="65" r="2" fill="white"/>
      <path d="M64 56 Q76 52 88 56" stroke="#4A3A1A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="82" rx="3.5" ry="2.5" fill="#C8A870"/>
      <path d="M46 94 L74 94" stroke="#A09060" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },

  // ─── PENNYWISE
  {
    id: 'pennywise', name: 'Pennywise', universe: 'Ça',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#0a0a0a"/>
      <rect x="14" y="135" width="92" height="75" rx="6" fill="#E0E0E0"/>
      <ellipse cx="60" cy="134" rx="52" ry="16" fill="#EEEEEE"/>
      <ellipse cx="60" cy="130" rx="46" ry="13" fill="#F8F8F8"/>
      <path d="M14 134 Q8 124 16 118 Q24 114 30 122 Q36 112 42 120 Q48 110 54 119 Q60 108 66 119 Q72 110 78 120 Q84 112 90 122 Q96 114 104 118 Q112 124 106 134Z" fill="#EEEEEE"/>
      <circle cx="60" cy="152" r="4" fill="#FFDD00"/>
      <circle cx="60" cy="170" r="4" fill="#FFDD00"/>
      <circle cx="60" cy="188" r="4" fill="#FFDD00"/>
      <rect x="2" y="142" width="14" height="60" rx="7" fill="#E0E0E0"/>
      <rect x="104" y="142" width="14" height="60" rx="7" fill="#E0E0E0"/>
      <rect x="48" y="112" width="24" height="26" rx="5" fill="#E0E0E0"/>
      <ellipse cx="60" cy="72" rx="42" ry="44" fill="#E2E2E2"/>
      <ellipse cx="10" cy="60" rx="22" ry="28" fill="#CC4400"/>
      <ellipse cx="110" cy="60" rx="22" ry="28" fill="#CC4400"/>
      <ellipse cx="24" cy="34" rx="18" ry="20" fill="#DD5500"/>
      <ellipse cx="96" cy="34" rx="18" ry="20" fill="#DD5500"/>
      <ellipse cx="44" cy="62" rx="13" ry="13" fill="#F8F000"/>
      <ellipse cx="76" cy="62" rx="13" ry="13" fill="#F8F000"/>
      <circle cx="44" cy="62" r="8" fill="#DD6600"/>
      <circle cx="76" cy="62" r="8" fill="#DD6600"/>
      <circle cx="44" cy="62" r="4" fill="#111"/>
      <circle cx="76" cy="62" r="4" fill="#111"/>
      <circle cx="42" cy="59" r="2" fill="white"/>
      <circle cx="74" cy="59" r="2" fill="white"/>
      <line x1="34" y1="69" x2="38" y2="82" stroke="#880000" stroke-width="3" stroke-linecap="round"/>
      <line x1="86" y1="69" x2="82" y2="82" stroke="#880000" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="60" cy="82" rx="9" ry="8" fill="#CC2222"/>
      <path d="M22 96 Q60 128 98 96" fill="#CC2222"/>
      <path d="M22 96 Q60 115 98 96" fill="#DDC000"/>
      <line x1="28" y1="96" x2="27" y2="110" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="34" y1="98" x2="33" y2="113" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="40" y1="100" x2="39" y2="115" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="46" y1="102" x2="45" y2="116" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="52" y1="103" x2="51" y2="116" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="58" y1="104" x2="57" y2="117" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="64" y1="103" x2="63" y2="116" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="70" y1="102" x2="69" y2="115" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="76" y1="100" x2="75" y2="114" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="82" y1="98" x2="81" y2="112" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="88" y1="96" x2="87" y2="109" stroke="#E0E0E0" stroke-width="2"/>
      <line x1="94" y1="96" x2="93" y2="107" stroke="#E0E0E0" stroke-width="2"/>
      <ellipse cx="18" cy="70" rx="7" ry="9" fill="#E2E2E2"/>
      <ellipse cx="102" cy="70" rx="7" ry="9" fill="#E2E2E2"/>
    </svg>`
  },

  // ─── BARNEY
  {
    id: 'barney', name: 'Barney', universe: 'HIMYM',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#0a0a1a"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#1A1A2A"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#222235"/>
      <path d="M36 122 L44 130 L60 124 L76 130 L84 122 Q84 136 60 142 Q36 136 36 122Z" fill="#F8F8F8"/>
      <path d="M52 124 L60 210 L68 124 L60 116Z" fill="#2244AA"/>
      <line x1="52" y1="140" x2="68" y2="140" stroke="#C8D4E8" stroke-width="2.5"/>
      <line x1="52" y1="152" x2="68" y2="152" stroke="#C8D4E8" stroke-width="2.5"/>
      <line x1="52" y1="164" x2="68" y2="164" stroke="#C8D4E8" stroke-width="2.5"/>
      <rect x="72" y="130" width="14" height="8" rx="2" fill="#FFFFFF"/>
      <circle cx="60" cy="183" r="3" fill="#333"/>
      <rect x="2" y="132" width="14" height="65" rx="7" fill="#1A1A2A"/>
      <ellipse cx="111" cy="145" rx="9" ry="8" fill="#F0D090"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#F0D090"/>
      <ellipse cx="60" cy="70" rx="38" ry="42" fill="#F0D090"/>
      <ellipse cx="60" cy="42" rx="38" ry="16" fill="#C8A820"/>
      <path d="M22 60 Q28 34 38 30 Q36 46 28 60Z" fill="#C8A820"/>
      <path d="M30 54 Q36 22 48 20 Q45 40 37 53Z" fill="#C8A820"/>
      <path d="M46 50 Q50 18 62 18 Q59 38 51 48Z" fill="#C8A820"/>
      <path d="M62 50 Q68 18 78 20 Q73 40 65 50Z" fill="#C8A820"/>
      <path d="M78 54 Q86 24 93 28 Q87 46 79 56Z" fill="#C8A820"/>
      <ellipse cx="44" cy="70" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="76" cy="70" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="44" cy="70" rx="7" ry="6.5" fill="#2A5A9A"/>
      <ellipse cx="76" cy="70" rx="7" ry="6.5" fill="#2A5A9A"/>
      <circle cx="44" cy="70" r="3.5" fill="#1A3A7A"/>
      <circle cx="76" cy="70" r="3.5" fill="#1A3A7A"/>
      <circle cx="42" cy="67" r="2" fill="white"/>
      <circle cx="74" cy="67" r="2" fill="white"/>
      <path d="M57 82 L60 87 L63 82" stroke="#C0A068" stroke-width="1.5" fill="none"/>
      <path d="M42 96 Q60 108 78 96" fill="#E89060" stroke="#B07840" stroke-width="1.5"/>
      <path d="M42 96 Q60 103 78 96" fill="white"/>
      <ellipse cx="22" cy="70" rx="7" ry="9" fill="#F0D090"/>
      <ellipse cx="98" cy="70" rx="7" ry="9" fill="#F0D090"/>
    </svg>`
  },

  // ─── RON SWANSON
  {
    id: 'ron', name: 'Ron Swanson', universe: 'Parks & Rec',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1208"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#A08050"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#B09060"/>
      <path d="M36 122 L44 132 L60 124 L76 132 L84 122 Q84 138 60 144 Q36 138 36 122Z" fill="#E8E4DC"/>
      <path d="M52 124 L60 190 L68 124 L60 116Z" fill="#1A2A4A"/>
      <rect x="2" y="132" width="14" height="65" rx="7" fill="#A08050"/>
      <rect x="104" y="132" width="14" height="65" rx="7" fill="#A08050"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#D4A870"/>
      <ellipse cx="60" cy="68" rx="38" ry="42" fill="#D4A870"/>
      <ellipse cx="60" cy="40" rx="38" ry="16" fill="#2A1A0A"/>
      <path d="M22 60 Q26 32 36 28 Q34 46 26 60Z" fill="#2A1A0A"/>
      <path d="M28 54 Q34 22 46 20 Q43 40 35 52Z" fill="#2A1A0A"/>
      <path d="M44 50 Q48 18 60 18 Q57 38 49 48Z" fill="#2A1A0A"/>
      <path d="M60 50 Q66 18 76 20 Q71 40 63 50Z" fill="#2A1A0A"/>
      <path d="M76 54 Q82 24 90 26 Q85 46 79 56Z" fill="#2A1A0A"/>
      <ellipse cx="44" cy="66" rx="8.5" ry="8" fill="white"/>
      <ellipse cx="76" cy="66" rx="8.5" ry="8" fill="white"/>
      <ellipse cx="44" cy="66" rx="6.5" ry="6" fill="#4A5A6A"/>
      <ellipse cx="76" cy="66" rx="6.5" ry="6" fill="#4A5A6A"/>
      <circle cx="44" cy="66" r="3.5" fill="#2A3A4A"/>
      <circle cx="76" cy="66" r="3.5" fill="#2A3A4A"/>
      <circle cx="42" cy="63" r="2" fill="white"/>
      <circle cx="74" cy="63" r="2" fill="white"/>
      <path d="M32 54 Q44 49 56 54" stroke="#1A0A00" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M64 54 Q76 49 88 54" stroke="#1A0A00" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M55 76 L60 85 L65 76" fill="#B88050" stroke="#A07040" stroke-width="1"/>
      <path d="M28 96 Q60 110 92 96 Q84 86 60 88 Q36 86 28 96Z" fill="#2A1A0A"/>
      <ellipse cx="22" cy="68" rx="7" ry="9" fill="#D4A870"/>
      <ellipse cx="98" cy="68" rx="7" ry="9" fill="#D4A870"/>
    </svg>`
  },

  // ─── ARCHER
  {
    id: 'archer', name: 'Archer', universe: 'Archer',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a0000"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#1A1A1A"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#222222"/>
      <path d="M36 122 L44 134 L60 126 L76 134 L84 122 Q84 140 60 146 Q36 140 36 122Z" fill="#F0F0F0"/>
      <path d="M52 126 L60 210 L68 126 L60 118Z" fill="#111"/>
      <rect x="56" y="156" width="8" height="4" rx="2" fill="#4488CC"/>
      <rect x="72" y="130" width="14" height="8" rx="2" fill="#FFFFFF"/>
      <circle cx="60" cy="178" r="3.5" fill="#333"/>
      <rect x="96" y="105" width="10" height="24" rx="3" fill="#555"/>
      <rect x="88" y="112" width="10" height="8" rx="2" fill="#444"/>
      <rect x="98" y="125" width="14" height="55" rx="7" fill="#1A1A1A"/>
      <rect x="8" y="132" width="14" height="65" rx="7" fill="#1A1A1A"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#F0D0A0"/>
      <rect x="22" y="30" width="76" height="80" rx="22" fill="#F0D0A0"/>
      <rect x="22" y="86" width="76" height="26" rx="14" fill="#F0D0A0"/>
      <rect x="22" y="30" width="76" height="22" rx="18" fill="#0A0804"/>
      <path d="M22 38 Q60 22 98 38 Q90 26 60 22 Q30 26 22 38Z" fill="#0A0804"/>
      <ellipse cx="44" cy="64" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="76" cy="64" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="44" cy="64" rx="7" ry="6.5" fill="#2A5A80"/>
      <ellipse cx="76" cy="64" rx="7" ry="6.5" fill="#2A5A80"/>
      <circle cx="44" cy="64" r="3.5" fill="#1A3A60"/>
      <circle cx="76" cy="64" r="3.5" fill="#1A3A60"/>
      <circle cx="42" cy="61" r="2" fill="white"/>
      <circle cx="74" cy="61" r="2" fill="white"/>
      <path d="M32 50 Q44 46 56 50" stroke="#0A0804" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M64 50 Q76 46 88 50" stroke="#0A0804" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M57 70 L60 80 L63 70" fill="#D4A070" stroke="#C09060" stroke-width="1"/>
      <path d="M40 98 Q58 108 76 96" stroke="#A07040" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="68" rx="7" ry="9" fill="#F0D0A0"/>
      <ellipse cx="98" cy="68" rx="7" ry="9" fill="#F0D0A0"/>
    </svg>`
  },

  // ─── LESLIE
  {
    id: 'leslie', name: 'Leslie', universe: 'Parks & Rec',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a0808"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#888890"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#999AA2"/>
      <path d="M36 122 L44 136 L60 128 L76 136 L84 122 Q84 142 60 148 Q36 142 36 122Z" fill="#CC4422"/>
      <circle cx="82" cy="138" r="6" fill="#2244AA"/>
      <path d="M79 138 L82 134 L85 138 L82 142Z" fill="#CC2211"/>
      <rect x="2" y="132" width="14" height="65" rx="7" fill="#888890"/>
      <rect x="104" y="132" width="14" height="65" rx="7" fill="#888890"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#F5D0A0"/>
      <ellipse cx="60" cy="68" rx="36" ry="40" fill="#F5D0A0"/>
      <ellipse cx="60" cy="34" rx="36" ry="14" fill="#D4B820"/>
      <ellipse cx="60" cy="58" rx="42" ry="48" fill="#D4B820"/>
      <path d="M18 68 Q12 90 16 118 Q22 112 24 95 Q22 82 18 68Z" fill="#D4B820"/>
      <path d="M102 68 Q108 90 104 118 Q98 112 96 95 Q98 82 102 68Z" fill="#D4B820"/>
      <ellipse cx="20" cy="105" rx="12" ry="18" fill="#C8AC18"/>
      <ellipse cx="100" cy="105" rx="12" ry="18" fill="#C8AC18"/>
      <ellipse cx="60" cy="68" rx="36" ry="40" fill="#F5D0A0"/>
      <ellipse cx="60" cy="34" rx="36" ry="14" fill="#D4B820"/>
      <path d="M24 52 Q18 60 20 70" stroke="#C8AC18" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M96 52 Q102 60 100 70" stroke="#C8AC18" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="44" cy="66" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="76" cy="66" rx="9" ry="8.5" fill="white"/>
      <ellipse cx="44" cy="66" rx="7" ry="6.5" fill="#2A5A9A"/>
      <ellipse cx="76" cy="66" rx="7" ry="6.5" fill="#2A5A9A"/>
      <circle cx="44" cy="66" r="3.5" fill="#1A3A7A"/>
      <circle cx="76" cy="66" r="3.5" fill="#1A3A7A"/>
      <circle cx="42" cy="63" r="2" fill="white"/>
      <circle cx="74" cy="63" r="2" fill="white"/>
      <path d="M57 78 L60 83 L63 78" stroke="#C0A068" stroke-width="1.5" fill="none"/>
      <path d="M40 92 Q60 106 80 92" fill="#E89060" stroke="#B07840" stroke-width="1.5"/>
      <path d="M40 92 Q60 100 80 92" fill="white"/>
      <ellipse cx="24" cy="68" rx="6" ry="8" fill="#F5D0A0"/>
      <ellipse cx="96" cy="68" rx="6" ry="8" fill="#F5D0A0"/>
      <circle cx="22" cy="74" r="3" fill="#FFD700"/>
      <circle cx="98" cy="74" r="3" fill="#FFD700"/>
    </svg>`
  },

  // ─── THRALL
  {
    id: 'thrall', name: 'Thrall', universe: 'World of Warcraft',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#0a1a08"/>
      <rect x="14" y="120" width="92" height="90" rx="6" fill="#5A3A18"/>
      <rect x="20" y="126" width="80" height="55" rx="5" fill="#6A4A22"/>
      <rect x="14" y="156" width="92" height="14" rx="4" fill="#8B6A30"/>
      <ellipse cx="14" cy="130" rx="16" ry="22" fill="#CC2200"/>
      <ellipse cx="106" cy="130" rx="16" ry="22" fill="#CC2200"/>
      <ellipse cx="14" cy="128" rx="12" ry="17" fill="#AA1A00"/>
      <ellipse cx="106" cy="128" rx="12" ry="17" fill="#AA1A00"/>
      <circle cx="8" cy="122" r="3" fill="#888"/>
      <circle cx="20" cy="116" r="3" fill="#888"/>
      <circle cx="112" cy="122" r="3" fill="#888"/>
      <circle cx="100" cy="116" r="3" fill="#888"/>
      <ellipse cx="10" cy="195" rx="12" ry="12" fill="#66DDCC" opacity="0.9"/>
      <ellipse cx="10" cy="195" rx="8" ry="8" fill="#88FFEE"/>
      <ellipse cx="10" cy="195" rx="4" ry="4" fill="white"/>
      <rect x="2" y="138" width="16" height="65" rx="7" fill="#4A8A2A"/>
      <rect x="102" y="138" width="16" height="65" rx="7" fill="#4A8A2A"/>
      <rect x="46" y="106" width="28" height="18" rx="5" fill="#4A8A2A"/>
      <path d="M18 94 Q18 70 30 62 Q34 72 28 90Z" fill="#6A4A20"/>
      <path d="M102 94 Q102 70 90 62 Q86 72 92 90Z" fill="#6A4A20"/>
      <ellipse cx="60" cy="68" rx="40" ry="46" fill="#4A8A2A"/>
      <path d="M20 58 Q60 40 100 58 Q96 38 60 30 Q24 38 20 58Z" fill="#3A7820"/>
      <ellipse cx="44" cy="64" rx="11" ry="10" fill="#FF2200"/>
      <ellipse cx="76" cy="64" rx="11" ry="10" fill="#FF2200"/>
      <ellipse cx="44" cy="64" rx="8" ry="7.5" fill="#CC1100"/>
      <ellipse cx="76" cy="64" rx="8" ry="7.5" fill="#CC1100"/>
      <circle cx="44" cy="64" r="4.5" fill="#880000"/>
      <circle cx="76" cy="64" r="4.5" fill="#880000"/>
      <circle cx="42" cy="61" r="2" fill="white"/>
      <circle cx="74" cy="61" r="2" fill="white"/>
      <path d="M28 50 Q44 44 60 50" stroke="#1A4A0A" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M60 50 Q76 44 92 50" stroke="#1A4A0A" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M44 100 L40 118" stroke="#F0E8C0" stroke-width="5" stroke-linecap="round"/>
      <path d="M76 100 L80 118" stroke="#F0E8C0" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="60" cy="82" rx="7" ry="6" fill="#3A7020"/>
      <circle cx="55" cy="81" r="3" fill="#2A5A18"/>
      <circle cx="65" cy="81" r="3" fill="#2A5A18"/>
      <path d="M38 98 Q60 105 82 98" stroke="#2A5A10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="20" cy="68" rx="7" ry="9" fill="#4A8A2A"/>
      <ellipse cx="100" cy="68" rx="7" ry="9" fill="#4A8A2A"/>
    </svg>`
  },

  // ─── DR. KRIEGER
  {
    id: 'krieger', name: 'Dr. Krieger', universe: 'Archer',
    svg: `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="-50" y="-50" width="220" height="310" fill="#1a1a2e"/>
      <rect x="14" y="122" width="92" height="88" rx="6" fill="#F0F0F0"/>
      <rect x="20" y="128" width="80" height="55" rx="5" fill="#FFFFFF"/>
      <rect x="24" y="135" width="24" height="20" rx="3" fill="#E0E0E0"/>
      <rect x="26" y="133" width="20" height="4" rx="2" fill="#C0C0C0"/>
      <rect x="28" y="134" width="3" height="16" rx="1" fill="#CC2200"/>
      <rect x="33" y="134" width="3" height="16" rx="1" fill="#2244AA"/>
      <rect x="38" y="134" width="3" height="16" rx="1" fill="#111"/>
      <path d="M52 122 L60 210 L68 122 L60 114Z" fill="#5A3A1A"/>
      <rect x="42" y="122" width="36" height="10" rx="3" fill="#E8E0D0"/>
      <rect x="2" y="132" width="14" height="65" rx="7" fill="#F0F0F0"/>
      <ellipse cx="111" cy="192" rx="10" ry="8" fill="#D09060"/>
      <rect x="104" y="132" width="14" height="65" rx="7" fill="#F0F0F0"/>
      <rect x="48" y="106" width="24" height="18" rx="5" fill="#D09060"/>
      <ellipse cx="60" cy="70" rx="38" ry="42" fill="#D09060"/>
      <ellipse cx="60" cy="42" rx="38" ry="15" fill="#2A1A0A"/>
      <path d="M22 62 Q28 30 38 26 Q36 44 28 62Z" fill="#2A1A0A"/>
      <path d="M30 56 Q36 20 48 18 Q44 38 36 54Z" fill="#2A1A0A"/>
      <path d="M46 52 Q50 16 62 16 Q58 36 50 50Z" fill="#2A1A0A"/>
      <path d="M62 52 Q68 16 80 20 Q74 38 66 52Z" fill="#2A1A0A"/>
      <path d="M78 56 Q86 24 94 28 Q88 44 82 58Z" fill="#2A1A0A"/>
      <ellipse cx="44" cy="70" rx="8.5" ry="8" fill="white"/>
      <ellipse cx="76" cy="70" rx="8.5" ry="8" fill="white"/>
      <ellipse cx="44" cy="70" rx="6.5" ry="6" fill="#2A5A2A"/>
      <ellipse cx="76" cy="70" rx="6.5" ry="6" fill="#2A5A2A"/>
      <circle cx="44" cy="70" r="3.5" fill="#1A3A1A"/>
      <circle cx="76" cy="70" r="3.5" fill="#1A3A1A"/>
      <circle cx="42" cy="67" r="2" fill="white"/>
      <circle cx="74" cy="67" r="2" fill="white"/>
      <path d="M24 90 Q24 125 60 128 Q96 125 96 90 Q84 98 60 100 Q36 98 24 90Z" fill="#2A1A0A"/>
      <path d="M36 88 Q60 94 84 88 Q78 80 60 82 Q42 80 36 88Z" fill="#2A1A0A"/>
      <path d="M55 76 L60 86 L65 76" fill="#B87848" stroke="#A06838" stroke-width="1"/>
      <ellipse cx="22" cy="70" rx="7" ry="9" fill="#D09060"/>
      <ellipse cx="98" cy="70" rx="7" ry="9" fill="#D09060"/>
    </svg>`
  }

];

window.AVATARS = AVATARS;