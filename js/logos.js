// ============================================================
// FIRM LOGO LIBRARY — SVG wordmarks matching real brand styles
// Each returns an SVG string sized to fit a 36px tall container
// ============================================================
const FIRM_LOGOS = {

  // ── LENDERS ─────────────────────────────────────────────────

  'Barclays Structured Finance': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <!-- Eagle icon simplified -->
    <rect x="0" y="6" width="16" height="16" rx="2" fill="#00AEEF"/>
    <text x="8" y="18" font-family="serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">B</text>
    <text x="21" y="11" font-family="Arial,sans-serif" font-size="8.5" font-weight="700" fill="#00AEEF" letter-spacing="0.5">BARCLAYS</text>
    <text x="21" y="22" font-family="Arial,sans-serif" font-size="6.5" fill="#555" letter-spacing="0.2">Structured Finance</text>
  </svg>`,

  'M&G Investments – Private Credit': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 105 28">
    <rect width="105" height="28" fill="none"/>
    <rect x="0" y="4" width="38" height="20" rx="2" fill="#C8002D"/>
    <text x="19" y="18" font-family="Arial,sans-serif" font-size="11" font-weight="900" fill="white" text-anchor="middle" letter-spacing="1">M&amp;G</text>
    <text x="44" y="13" font-family="Arial,sans-serif" font-size="8" font-weight="600" fill="#C8002D">Investments</text>
    <text x="44" y="23" font-family="Arial,sans-serif" font-size="6.5" fill="#555">Private Credit</text>
  </svg>`,

  'Viola Credit': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 90 28">
    <rect width="90" height="28" fill="none"/>
    <circle cx="12" cy="14" r="10" fill="#6B2D8B"/>
    <text x="12" y="18" font-family="serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">V</text>
    <text x="27" y="18" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#6B2D8B">Viola</text>
    <text x="60" y="18" font-family="Arial,sans-serif" font-size="9" fill="#888">Credit</text>
  </svg>`,

  'NatWest Markets – Securitisation': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <!-- NatWest purple cube mark -->
    <rect x="0" y="3" width="11" height="11" rx="1" fill="#42145F"/>
    <rect x="12" y="3" width="11" height="11" rx="1" fill="#42145F" opacity="0.7"/>
    <rect x="0" y="15" width="11" height="11" rx="1" fill="#42145F" opacity="0.7"/>
    <rect x="12" y="15" width="11" height="11" rx="1" fill="#42145F" opacity="0.4"/>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#42145F" letter-spacing="0.3">NatWest</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="6.5" fill="#666">Markets · Securitisation</text>
  </svg>`,

  'Permira Credit': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28">
    <rect width="100" height="28" fill="none"/>
    <rect x="0" y="5" width="3" height="18" fill="#E31837"/>
    <text x="9" y="18" font-family="Arial,sans-serif" font-size="13" font-weight="300" fill="#1a1a1a" letter-spacing="0.5">PERMIRA</text>
    <text x="9" y="26" font-family="Arial,sans-serif" font-size="7" fill="#888" letter-spacing="1">CREDIT</text>
  </svg>`,

  'Cavendish Capital Partners': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <text x="0" y="13" font-family="Georgia,serif" font-size="11" font-weight="700" fill="#1a3a5c" letter-spacing="0.5">CAVENDISH</text>
    <line x1="0" y1="16" x2="80" y2="16" stroke="#b9975b" stroke-width="0.8"/>
    <text x="0" y="25" font-family="Georgia,serif" font-size="8" fill="#555" letter-spacing="2">CAPITAL PARTNERS</text>
  </svg>`,

  'AXA Investment Managers – Structured Finance': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <rect x="0" y="3" width="42" height="22" rx="1" fill="#00008F"/>
    <text x="21" y="19" font-family="Arial,sans-serif" font-size="13" font-weight="900" fill="white" text-anchor="middle" letter-spacing="1">AXA</text>
    <text x="47" y="13" font-family="Arial,sans-serif" font-size="8" font-weight="600" fill="#00008F">Investment</text>
    <text x="47" y="23" font-family="Arial,sans-serif" font-size="6.5" fill="#555">Managers · SF</text>
  </svg>`,

  // ── ADVISORS ─────────────────────────────────────────────────

  'Rothschild & Co': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <rect x="0" y="3" width="3" height="22" fill="#8B0000"/>
    <text x="9" y="14" font-family="Georgia,serif" font-size="11.5" font-weight="400" fill="#1a1a1a" letter-spacing="0.3">ROTHSCHILD</text>
    <text x="9" y="25" font-family="Georgia,serif" font-size="9" fill="#8B0000">&amp; Co</text>
  </svg>`,

  'Houlihan Lokey': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <rect x="0" y="8" width="18" height="13" rx="1" fill="#003865"/>
    <text x="9" y="18.5" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">HL</text>
    <text x="23" y="13" font-family="Arial,sans-serif" font-size="8.5" font-weight="600" fill="#003865" letter-spacing="0.2">HOULIHAN</text>
    <text x="23" y="23" font-family="Arial,sans-serif" font-size="8.5" font-weight="300" fill="#003865" letter-spacing="0.2">LOKEY</text>
  </svg>`,

  'Peel Hunt': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 95 28">
    <rect width="95" height="28" fill="none"/>
    <rect x="0" y="5" width="22" height="18" rx="2" fill="#004B87"/>
    <text x="11" y="17.5" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">PH</text>
    <text x="27" y="15" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#004B87">Peel Hunt</text>
  </svg>`,

  'Lazard': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 85 28">
    <rect width="85" height="28" fill="none"/>
    <text x="0" y="19" font-family="Georgia,serif" font-size="18" font-weight="400" fill="#1a1a1a" letter-spacing="1">LAZARD</text>
    <line x1="0" y1="23" x2="75" y2="23" stroke="#c0a060" stroke-width="1"/>
  </svg>`,

  'Arrowpoint Advisory': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <!-- Arrow mark -->
    <polygon points="0,14 10,7 10,11 20,11 20,17 10,17 10,21" fill="#E8451A"/>
    <text x="25" y="13" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="#1a1a1a" letter-spacing="0.3">ARROWPOINT</text>
    <text x="25" y="24" font-family="Arial,sans-serif" font-size="7.5" fill="#555" letter-spacing="0.5">ADVISORY</text>
  </svg>`,

  'PwC Deals – Debt & Capital Advisory': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 95 28">
    <rect width="95" height="28" fill="none"/>
    <!-- PwC stacked squares mark -->
    <rect x="0" y="3" width="9" height="9" rx="1" fill="#E0301E"/>
    <rect x="10" y="3" width="9" height="9" rx="1" fill="#FFB600"/>
    <rect x="0" y="13" width="9" height="9" rx="1" fill="#EB8B2A"/>
    <rect x="10" y="13" width="9" height="9" rx="1" fill="#E0301E" opacity="0.6"/>
    <text x="24" y="13" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#E0301E">PwC</text>
    <text x="24" y="24" font-family="Arial,sans-serif" font-size="6.5" fill="#555">Deals · Debt &amp; Capital</text>
  </svg>`,

  'Greenhill & Co': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 105 28">
    <rect width="105" height="28" fill="none"/>
    <rect x="0" y="5" width="20" height="18" rx="2" fill="#2E5E2E"/>
    <text x="10" y="18" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">GHL</text>
    <text x="25" y="14" font-family="Arial,sans-serif" font-size="9" font-weight="600" fill="#2E5E2E">GREENHILL</text>
    <text x="25" y="24" font-family="Arial,sans-serif" font-size="7.5" fill="#555">&amp; Co</text>
  </svg>`,
  // ── AU CLIENT TARGETS ───────────────────────────────────────

  'Elders Limited': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28">
    <rect width="100" height="28" fill="none"/>
    <rect x="0" y="4" width="20" height="20" rx="2" fill="#D4202B"/>
    <text x="10" y="18.5" font-family="Arial,sans-serif" font-size="10" font-weight="900" fill="white" text-anchor="middle">ELD</text>
    <text x="26" y="18" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#D4202B" letter-spacing="0.3">ELDERS</text>
  </svg>`,

  'Nutrien Ag Solutions AU': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <rect x="0" y="3" width="20" height="22" rx="2" fill="#5A8A00"/>
    <text x="10" y="18" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">NTR</text>
    <text x="26" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#5A8A00" letter-spacing="0.2">NUTRIEN</text>
    <text x="26" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.3">Ag Solutions</text>
  </svg>`,

  'Macquarie Pastoral Fund': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <rect x="0" y="5" width="18" height="18" rx="9" fill="#CC0000"/>
    <text x="9" y="17.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">M</text>
    <text x="24" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#CC0000" letter-spacing="0.2">MACQUARIE</text>
    <text x="24" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555">Pastoral Fund</text>
  </svg>`,

  'Consolidated Pastoral Company': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <rect x="0" y="5" width="22" height="18" rx="2" fill="#5C3A1E"/>
    <text x="11" y="17.5" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">CPC</text>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="#5C3A1E" letter-spacing="0.3">CONSOLIDATED</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.3">PASTORAL CO.</text>
  </svg>`,

  'GrainCorp Limited': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 105 28">
    <rect width="105" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#F5A800"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">GNC</text>
    <text x="28" y="18" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#3A3A3A" letter-spacing="0.2">GrainCorp</text>
  </svg>`,

  'Latitude Financial Services': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <rect x="0" y="3" width="4" height="22" rx="2" fill="#00A6A0"/>
    <rect x="6" y="3" width="4" height="16" rx="2" fill="#00A6A0" opacity="0.6"/>
    <rect x="12" y="3" width="4" height="11" rx="2" fill="#00A6A0" opacity="0.35"/>
    <text x="22" y="18" font-family="Arial,sans-serif" font-size="11.5" font-weight="700" fill="#00A6A0" letter-spacing="0.2">LATITUDE</text>
  </svg>`,

  'Pepper Money': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 105 28">
    <rect width="105" height="28" fill="none"/>
    <circle cx="12" cy="14" r="11" fill="#FF0066"/>
    <text x="12" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">PP</text>
    <text x="28" y="18" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#FF0066">Pepper</text>
    <text x="74" y="18" font-family="Arial,sans-serif" font-size="12" font-weight="300" fill="#333"> Money</text>
  </svg>`,

  'Plenti Group': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 95 28">
    <rect width="95" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="4" fill="#1A1F71"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">PLT</text>
    <text x="28" y="18" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#1A1F71">Plenti</text>
  </svg>`,

  'MA Financial Group': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 105 28">
    <rect width="105" height="28" fill="none"/>
    <rect x="0" y="3" width="24" height="22" rx="2" fill="#1D1D1B"/>
    <text x="12" y="18.5" font-family="Arial,sans-serif" font-size="10" font-weight="900" fill="white" text-anchor="middle">MA</text>
    <text x="30" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="600" fill="#1D1D1B">MA Financial</text>
    <text x="30" y="23" font-family="Arial,sans-serif" font-size="7" fill="#666">Group</text>
  </svg>`,

  'Columbus Capital': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <!-- compass rose simplified -->
    <circle cx="12" cy="14" r="10" fill="none" stroke="#0047BB" stroke-width="1.5"/>
    <line x1="12" y1="5" x2="12" y2="23" stroke="#0047BB" stroke-width="1.2"/>
    <line x1="3" y1="14" x2="21" y2="14" stroke="#0047BB" stroke-width="1.2"/>
    <circle cx="12" cy="14" r="2" fill="#0047BB"/>
    <text x="27" y="13" font-family="Arial,sans-serif" font-size="8.5" font-weight="700" fill="#0047BB">COLUMBUS</text>
    <text x="27" y="23" font-family="Arial,sans-serif" font-size="7.5" fill="#555">CAPITAL</text>
  </svg>`,

  'Charter Hall Group': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <rect x="0" y="3" width="4" height="22" fill="#003DA5"/>
    <rect x="6" y="3" width="4" height="22" fill="#003DA5" opacity="0.5"/>
    <text x="16" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#003DA5" letter-spacing="0.3">CHARTER HALL</text>
    <line x1="16" y1="16" x2="112" y2="16" stroke="#003DA5" stroke-width="0.7"/>
    <text x="16" y="24" font-family="Arial,sans-serif" font-size="7" fill="#666" letter-spacing="1.5">PROPERTY GROUP</text>
  </svg>`,

  'Qualitas Group': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28">
    <rect width="100" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#2C2C54"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">QAL</text>
    <text x="28" y="18" font-family="Georgia,serif" font-size="13" font-weight="400" fill="#2C2C54" letter-spacing="0.3">Qualitas</text>
  </svg>`,

  'Peet Limited': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 85 28">
    <rect width="85" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#E4002B"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">PPC</text>
    <text x="28" y="19" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#E4002B" letter-spacing="0.5">PEET</text>
  </svg>`,

  'Centuria Capital Group': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <!-- C arc mark -->
    <path d="M18,6 A10,10 0 1,0 18,22" fill="none" stroke="#E8831A" stroke-width="3.5" stroke-linecap="round"/>
    <text x="24" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#E8831A" letter-spacing="0.3">CENTURIA</text>
    <text x="24" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.5">CAPITAL GROUP</text>
  </svg>`,

  'Mirvac Group': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 95 28">
    <rect width="95" height="28" fill="none"/>
    <!-- M diamond mark -->
    <polygon points="12,3 21,14 12,25 3,14" fill="#B5121B"/>
    <text x="12" y="18" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">M</text>
    <text x="27" y="18" font-family="Arial,sans-serif" font-size="12" font-weight="300" fill="#B5121B" letter-spacing="0.5">MIRVAC</text>
  </svg>`,

  // ── AUSTRALIAN FINANCIERS ────────────────────────────────────

  'Commonwealth Bank of Australia': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <circle cx="13" cy="14" r="11" fill="#FDD400"/>
    <text x="13" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#000" text-anchor="middle">CBA</text>
    <text x="30" y="13" font-family="Arial,sans-serif" font-size="8.5" font-weight="700" fill="#000" letter-spacing="0.2">COMMONWEALTH</text>
    <text x="30" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.5">BANK OF AUSTRALIA</text>
  </svg>`,

  'Westpac Banking Corporation': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 105 28">
    <rect width="105" height="28" fill="none"/>
    <rect x="0" y="3" width="20" height="22" rx="2" fill="#DA1710"/>
    <text x="10" y="18.5" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">WBC</text>
    <text x="26" y="18" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#DA1710">Westpac</text>
  </svg>`,

  'ANZ Group Holdings': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 85 28">
    <rect width="85" height="28" fill="none"/>
    <rect x="0" y="3" width="30" height="22" rx="2" fill="#007DBA"/>
    <text x="15" y="18.5" font-family="Arial,sans-serif" font-size="11" font-weight="900" fill="white" text-anchor="middle" letter-spacing="1">ANZ</text>
    <text x="36" y="18" font-family="Arial,sans-serif" font-size="10" font-weight="300" fill="#007DBA" letter-spacing="0.5">GROUP</text>
  </svg>`,

  'National Australia Bank': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 85 28">
    <rect width="85" height="28" fill="none"/>
    <rect x="0" y="3" width="30" height="22" rx="2" fill="#E60028"/>
    <text x="15" y="18.5" font-family="Arial,sans-serif" font-size="11" font-weight="900" fill="white" text-anchor="middle" letter-spacing="1">NAB</text>
    <text x="36" y="18" font-family="Arial,sans-serif" font-size="10" font-weight="300" fill="#E60028" letter-spacing="0.5">GROUP</text>
  </svg>`,

  'Macquarie Group — Asset Finance & Capital': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <circle cx="13" cy="14" r="11" fill="#CC0000"/>
    <text x="13" y="18" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">MQG</text>
    <text x="30" y="18" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#CC0000">MACQUARIE</text>
  </svg>`,

  'AustralianSuper': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 120 28">
    <rect width="120" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#003DA5"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="7.5" font-weight="900" fill="white" text-anchor="middle">AUS</text>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#003DA5">AustralianSuper</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="6.5" fill="#555" letter-spacing="0.3">SUPERANNUATION</text>
  </svg>`,

  'Aware Super': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28">
    <rect width="100" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="11" fill="#00A86B"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="7.5" font-weight="900" fill="white" text-anchor="middle">AW</text>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#00A86B">Aware</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="8" fill="#555">Super</text>
  </svg>`,

  'UniSuper': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 95 28">
    <rect width="95" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#1B3F6E"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="7.5" font-weight="900" fill="white" text-anchor="middle">UNI</text>
    <text x="28" y="18" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#1B3F6E">UniSuper</text>
  </svg>`,

  'HESTA': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 90 28">
    <rect width="90" height="28" fill="none"/>
    <rect x="0" y="3" width="28" height="22" rx="2" fill="#7C2D8E"/>
    <text x="14" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle" letter-spacing="0.5">HESTA</text>
    <text x="34" y="18" font-family="Arial,sans-serif" font-size="9" font-weight="300" fill="#7C2D8E" letter-spacing="0.3">SUPER</text>
  </svg>`,

  'Metrics Credit Partners': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <rect x="0" y="3" width="4" height="22" fill="#1E3A5F"/>
    <rect x="6" y="3" width="4" height="16" fill="#1E3A5F" opacity="0.65"/>
    <rect x="12" y="3" width="4" height="10" fill="#1E3A5F" opacity="0.35"/>
    <text x="22" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#1E3A5F" letter-spacing="0.4">METRICS</text>
    <text x="22" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.8">CREDIT PARTNERS</text>
  </svg>`,

  'Revolution Asset Management': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <!-- circular arrow -->
    <path d="M14,5 A9,9 0 1,1 5,14" fill="none" stroke="#E8451A" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="14,2 17,7 11,7" fill="#E8451A"/>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="8.5" font-weight="700" fill="#1A1A1A" letter-spacing="0.3">REVOLUTION</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.5">ASSET MANAGEMENT</text>
  </svg>`,

  'MA Financial Group — Credit': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <rect x="0" y="3" width="24" height="22" rx="2" fill="#1D1D1B"/>
    <text x="12" y="18.5" font-family="Arial,sans-serif" font-size="10" font-weight="900" fill="white" text-anchor="middle">MA</text>
    <text x="30" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="600" fill="#1D1D1B">MA Financial</text>
    <text x="30" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555">Group — Credit</text>
  </svg>`,

  'Challenger Investment Management': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#F04E23"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">CGF</text>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#F04E23" letter-spacing="0.3">CHALLENGER</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555">Investment Management</text>
  </svg>`,

  'Qualitas Group — Real Estate Credit': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 120 28">
    <rect width="120" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#2C2C54"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">QAL</text>
    <text x="28" y="13" font-family="Georgia,serif" font-size="10" font-weight="400" fill="#2C2C54">Qualitas</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="6.5" fill="#555">Real Estate Credit</text>
  </svg>`,

  'Pallas Capital': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28">
    <rect width="100" height="28" fill="none"/>
    <polygon points="12,3 22,14 12,25 2,14" fill="none" stroke="#2C3E50" stroke-width="2"/>
    <polygon points="12,8 18,14 12,20 6,14" fill="#2C3E50"/>
    <text x="28" y="13" font-family="Georgia,serif" font-size="10" font-weight="400" fill="#2C3E50" letter-spacing="0.5">PALLAS</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="7.5" fill="#555" letter-spacing="0.5">CAPITAL</text>
  </svg>`,

  'Fortress Investment Group — Australia': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 110 28">
    <rect width="110" height="28" fill="none"/>
    <!-- castle turret simplified -->
    <rect x="1" y="8" width="5" height="17" fill="#1A1A1A"/>
    <rect x="8" y="12" width="5" height="13" fill="#1A1A1A"/>
    <rect x="1" y="4" width="3" height="5" fill="#1A1A1A"/>
    <rect x="5" y="4" width="3" height="5" fill="#1A1A1A" opacity="0"/>
    <rect x="10" y="7" width="3" height="5" fill="#1A1A1A"/>
    <text x="20" y="13" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#1A1A1A" letter-spacing="0.5">FORTRESS</text>
    <text x="20" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.3">Investment Group</text>
  </svg>`,

  'Barings Australia': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28">
    <rect width="100" height="28" fill="none"/>
    <rect x="0" y="3" width="3" height="22" fill="#C8102E"/>
    <text x="9" y="15" font-family="Georgia,serif" font-size="13" font-weight="400" fill="#1A1A1A" letter-spacing="0.5">BARINGS</text>
    <text x="9" y="24" font-family="Arial,sans-serif" font-size="7" fill="#555" letter-spacing="0.5">AUSTRALIA</text>
  </svg>`,

  'First Sentier Investors — Infrastructure Debt': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 120 28">
    <rect width="120" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#003087"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">FSI</text>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="8.5" font-weight="700" fill="#003087" letter-spacing="0.2">FIRST SENTIER</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="6.5" fill="#555">Infrastructure Debt</text>
  </svg>`,

  'Bank of Queensland': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28">
    <rect width="100" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#E4002B"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="white" text-anchor="middle">BOQ</text>
    <text x="28" y="18" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#E4002B">BOQ</text>
  </svg>`,

  'Bendigo and Adelaide Bank': `<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 115 28">
    <rect width="115" height="28" fill="none"/>
    <rect x="0" y="3" width="22" height="22" rx="2" fill="#E87722"/>
    <text x="11" y="18.5" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="white" text-anchor="middle">BEN</text>
    <text x="28" y="13" font-family="Arial,sans-serif" font-size="8.5" font-weight="700" fill="#E87722">BENDIGO</text>
    <text x="28" y="23" font-family="Arial,sans-serif" font-size="7" fill="#555">& Adelaide Bank</text>
  </svg>`,

};

// HTML helper — returns a small inline logo chip for use next to firm names
function firmLogo(name, height = 24) {
  // Try exact match first
  if (FIRM_LOGOS[name]) {
    const encoded = btoa(unescape(encodeURIComponent(FIRM_LOGOS[name])));
    return `<img src="data:image/svg+xml;base64,${encoded}" height="${height}" style="display:inline-block;vertical-align:middle;object-fit:contain;" alt="${name} logo" />`;
  }
  // Partial match
  // Normalize & vs &amp; for matching
  const normName = name.replace(/&amp;/g,'&').replace(/–/g,'-');
  const normKeys = Object.keys(FIRM_LOGOS).map(k => ({ key: k, norm: k.replace(/&amp;/g,'&').replace(/–/g,'-') }));
  const exactMatch = normKeys.find(k => k.norm === normName);
  if (exactMatch) {
    const encoded = btoa(unescape(encodeURIComponent(FIRM_LOGOS[exactMatch.key])));
    return `<img src="data:image/svg+xml;base64,${encoded}" height="${height}" style="display:inline-block;vertical-align:middle;object-fit:contain;" alt="${name} logo" />`;
  }
  const key = normKeys.find(k => normName.toLowerCase().includes(k.norm.toLowerCase().split(' ')[0]) || k.norm.toLowerCase().includes(normName.toLowerCase().split(' ')[0]))?.key;
  if (key) {
    const encoded = btoa(unescape(encodeURIComponent(FIRM_LOGOS[key])));
    return `<img src="data:image/svg+xml;base64,${encoded}" height="${height}" style="display:inline-block;vertical-align:middle;object-fit:contain;" alt="${name} logo" />`;
  }
  // Fallback initials badge
  const initials = name.split(/\s+/).filter(w => /^[A-Z&]/.test(w)).slice(0,2).map(w=>w[0]).join('');
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${height+8}px;height:${height}px;background:#1a1a1a;color:#fff;font-size:${Math.floor(height*0.45)}px;font-weight:700;border-radius:3px;letter-spacing:0.5px;font-family:Arial,sans-serif;vertical-align:middle;">${initials}</span>`;
}

// Make firmLogo available globally
window.firmLogo = firmLogo;
