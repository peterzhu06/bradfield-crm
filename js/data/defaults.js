// ============================================================
// DEFAULT DATASET — seeded into the shared database on first run
// ============================================================
let LENDERS = [

  {
    "id": "l1",
    "name": "Commonwealth Bank of Australia",
    "shortName": "CBA",
    "type": "Major Bank",
    "typeKey": "major_bank",
    "sizeMin": "A$20m",
    "sizeMax": "A$2,000m+",
    "assetClasses": [
      "Residential Mortgage",
      "Commercial Real Estate",
      "Infrastructure",
      "Corporate Lending",
      "Agribusiness",
      "Asset Finance"
    ],
    "transactionTypes": [
      "Senior Secured Facility",
      "RMBS Warehouse",
      "Term Loan",
      "Syndicated Facility",
      "Project Finance",
      "Sustainability-Linked Loan"
    ],
    "geographies": [
      "Australia",
      "New Zealand"
    ],
    "preferredStructure": "Dominant relationship lender. Lead arranger or sole lender on large bilateral facilities. Strong preference for full banking relationship (transactional, FX, deposits). Securitisation arm (CBA Securitisation) active in RMBS and ABS warehouses.",
    "pricing": "BBSW + 120–280bps depending on credit quality, tenor and security. Relationship pricing available.",
    "recentDeals": [
      "A$1.2bn syndicated facility for Charter Hall (2024)",
      "A$500m RMBS warehouse for Pepper Money",
      "A$350m agri finance facility for Elders"
    ],
    "contacts": "Andrew Hinchliff (Group Executive Institutional Banking), Michael Vacy-Lyle (Business Banking)",
    "notes": "Largest Australian bank by assets. Strong in retail, agri and institutional. Appetite constrained by APRA capital requirements post-2023. Sustainability-linked products growing significantly.",
    "lastUpdated": "2025-03-15",
    "status": "Active"
  },
  {
    "id": "l2",
    "name": "Westpac Banking Corporation",
    "shortName": "Westpac",
    "type": "Major Bank",
    "typeKey": "major_bank",
    "sizeMin": "A$20m",
    "sizeMax": "A$2,000m+",
    "assetClasses": [
      "Residential Mortgage",
      "Commercial Real Estate",
      "Structured Finance",
      "Infrastructure",
      "Agribusiness"
    ],
    "transactionTypes": [
      "RMBS",
      "Warehouse Facility",
      "Syndicated Loan",
      "Project Finance",
      "Covered Bond",
      "Green Bond"
    ],
    "geographies": [
      "Australia",
      "New Zealand",
      "Pacific Islands"
    ],
    "preferredStructure": "Strong institutional and structured finance franchise. Westpac Institutional Bank active across debt capital markets, securitisation, and project finance. RMBS and covered bond issuance active.",
    "pricing": "BBSW + 130–270bps. Greenium on sustainability-linked transactions.",
    "recentDeals": [
      "A$750m RMBS (WST 2024-1)",
      "A$400m green bond issuance",
      "A$600m property fund syndication"
    ],
    "contacts": "Anthony Miller (CEO), Curt Zuber (CEO Westpac Institutional Bank)",
    "notes": "Second-largest Australian bank. Restructured post-AUSTRAC issues. Institutional bank strong on DCM and structured finance. Good relationship historically — revisit following leadership stabilisation.",
    "lastUpdated": "2025-03-10",
    "status": "Active"
  },
  {
    "id": "l3",
    "name": "ANZ Group Holdings",
    "shortName": "ANZ",
    "type": "Major Bank",
    "typeKey": "major_bank",
    "sizeMin": "A$20m",
    "sizeMax": "A$2,000m+",
    "assetClasses": [
      "Corporate Lending",
      "Infrastructure",
      "Real Estate",
      "Agribusiness",
      "Natural Resources",
      "Trade Finance"
    ],
    "transactionTypes": [
      "Syndicated Loan",
      "Project Finance",
      "Infrastructure Debt",
      "Green Bond",
      "Sustainability-Linked Loan",
      "RMBS"
    ],
    "geographies": [
      "Australia",
      "New Zealand",
      "Asia-Pacific"
    ],
    "preferredStructure": "Strongest of the majors in institutional and Asia-Pacific cross-border transactions. Infrastructure and project finance a key strength. Large international network differentiates from other majors.",
    "pricing": "BBSW + 120–260bps. Competitive on large institutional and cross-border.",
    "recentDeals": [
      "A$1bn infrastructure finance for Transurban",
      "A$500m sustainability-linked facility for Mirvac",
      "A$800m syndicated agri finance"
    ],
    "contacts": "Shayne Elliott (CEO), Mark Whelan (Group Executive Institutional)",
    "notes": "Best major bank for cross-border and infrastructure mandates. Recent ANZ Plus digital focus — less impact on institutional. Appetite for ESG and sustainability-linked transactions strong.",
    "lastUpdated": "2025-03-12",
    "status": "Active"
  },
  {
    "id": "l4",
    "name": "National Australia Bank",
    "shortName": "NAB",
    "type": "Major Bank",
    "typeKey": "major_bank",
    "sizeMin": "A$20m",
    "sizeMax": "A$2,000m+",
    "assetClasses": [
      "Agribusiness",
      "Commercial Real Estate",
      "SME Lending",
      "Structured Finance",
      "Infrastructure",
      "Healthcare"
    ],
    "transactionTypes": [
      "Senior Secured Facility",
      "RMBS Warehouse",
      "Syndicated Loan",
      "Project Finance",
      "Asset Finance",
      "Green Bond"
    ],
    "geographies": [
      "Australia",
      "New Zealand"
    ],
    "preferredStructure": "Dominant in agribusiness and SME banking. Markets division (NAB Corporate & Institutional) active in debt capital markets and structured finance. Strong in healthcare and social infrastructure.",
    "pricing": "BBSW + 125–275bps. Agri pricing competitive given scale.",
    "recentDeals": [
      "A$900m agribusiness syndication for GrainCorp",
      "A$400m healthcare facility",
      "A$300m RMBS warehouse for Columbus Capital"
    ],
    "contacts": "Andrew Irvine (CEO), David Gall (Chief Customer Officer Corporate)",
    "notes": "Go-to bank for agribusiness. New CEO since 2024 — strong institutional ambition. Markets business growing aggressively. Good fit for agri and SME-adjacent structured mandates.",
    "lastUpdated": "2025-03-14",
    "status": "Active"
  },
  {
    "id": "l5",
    "name": "Macquarie Group — Asset Finance & Capital",
    "shortName": "Macquarie",
    "type": "Major Bank / Investment Bank",
    "typeKey": "major_bank",
    "sizeMin": "A$10m",
    "sizeMax": "A$5,000m+",
    "assetClasses": [
      "Infrastructure",
      "Real Assets",
      "Asset Finance",
      "Aviation",
      "Energy Transition",
      "Real Estate"
    ],
    "transactionTypes": [
      "Infrastructure Debt",
      "Asset-Backed Finance",
      "Equity Co-invest",
      "Green Finance",
      "Structured Credit",
      "Fund Finance"
    ],
    "geographies": [
      "Australia",
      "Global"
    ],
    "preferredStructure": "Unique hybrid — principal investor and financier. Macquarie Asset Management and Macquarie Capital both deploy capital. Highly structured and return-driven. Not a traditional relationship bank.",
    "pricing": "IRR target 10–20%+ depending on asset and structure. Not BBSW-based — return-driven.",
    "recentDeals": [
      "A$2bn infrastructure fund finance",
      "A$500m green energy debt",
      "A$300m aviation asset finance"
    ],
    "contacts": "Shemara Wikramanayake (CEO), Nick O'Kane (Head of Commodities & Global Markets)",
    "notes": "Relationship requires access through sector-specific bankers. Highly sophisticated counterparty — needs bespoke pitch. Strong ESG and infrastructure appetite globally.",
    "lastUpdated": "2025-03-08",
    "status": "Active"
  },
  {
    "id": "l6",
    "name": "AustralianSuper",
    "shortName": "AustralianSuper",
    "type": "Superannuation Fund",
    "typeKey": "super",
    "sizeMin": "A$100m",
    "sizeMax": "A$5,000m+",
    "assetClasses": [
      "Infrastructure Debt",
      "Private Credit",
      "Real Estate Debt",
      "Corporate Direct Lending"
    ],
    "transactionTypes": [
      "Direct Debt Placement",
      "Infrastructure Debt",
      "Co-investment",
      "Whole Loan Purchase"
    ],
    "geographies": [
      "Australia",
      "Global"
    ],
    "preferredStructure": "Largest Australian super fund with ~A$340bn AUM. Significant private credit and infrastructure debt allocation growing. Prefers large-ticket direct lending — minimum A$100m. Long duration. Buy-and-hold.",
    "pricing": "Yield target 5–9% (senior infra/RE debt). Higher for private credit: 8–13%. Fixed rate or inflation-linked preferred.",
    "recentDeals": [
      "A$500m infrastructure debt co-invest (2024)",
      "A$300m direct real estate debt",
      "A$200m private credit facility"
    ],
    "contacts": "Paul Schroder (CEO), Nik Kemp (Head of Infrastructure), Damian Moloney (Head of Private Credit)",
    "notes": "Rapidly internalising investment capability. Decision can be slow — 3–6 months for new counterparties. Prefer repeat relationships. ESG/stewardship mandatory.",
    "lastUpdated": "2025-03-10",
    "status": "Active"
  },
  {
    "id": "l7",
    "name": "Aware Super",
    "shortName": "Aware Super",
    "type": "Superannuation Fund",
    "typeKey": "super",
    "sizeMin": "A$50m",
    "sizeMax": "A$1,000m",
    "assetClasses": [
      "Real Estate Debt",
      "Infrastructure Debt",
      "Private Credit",
      "Social Infrastructure"
    ],
    "transactionTypes": [
      "Direct Debt",
      "Infrastructure Debt",
      "Affordable Housing Finance",
      "Social Bond"
    ],
    "geographies": [
      "Australia",
      "New Zealand"
    ],
    "preferredStructure": "A$170bn fund with strong social and impact mandate. Active in affordable housing, social infrastructure, and private credit. Prefers investments aligned with fund ESG strategy.",
    "pricing": "Yield target 5–8% fixed or CPI-linked for infrastructure. Private credit: 7–11%.",
    "recentDeals": [
      "A$150m affordable housing debt facility",
      "A$200m social infrastructure finance",
      "A$100m private credit co-invest"
    ],
    "contacts": "Deanne Stewart (CEO), Damien Webb (CIO)",
    "notes": "Strong impact/ESG alignment required. Good fit for social and affordable housing transactions. Governance-heavy — allow 3–4 months for IC approval.",
    "lastUpdated": "2025-02-28",
    "status": "Active"
  },
  {
    "id": "l8",
    "name": "UniSuper",
    "shortName": "UniSuper",
    "type": "Superannuation Fund",
    "typeKey": "super",
    "sizeMin": "A$50m",
    "sizeMax": "A$800m",
    "assetClasses": [
      "Infrastructure Debt",
      "Real Estate",
      "Private Equity",
      "Corporate Direct Lending"
    ],
    "transactionTypes": [
      "Infrastructure Debt",
      "Direct Lending",
      "Real Estate Debt",
      "Green Bond"
    ],
    "geographies": [
      "Australia",
      "Global"
    ],
    "preferredStructure": "A$130bn fund. Highly sophisticated institutional investor. Infrastructure and real assets core allocation. Growing private credit exposure. Strong governance and stewardship focus.",
    "pricing": "Yield target 5–8% (infrastructure). Private credit 7–12%.",
    "recentDeals": [
      "A$200m infrastructure debt participation",
      "A$120m green bond subscription",
      "A$80m direct real estate debt"
    ],
    "contacts": "Peter Chun (CEO), Sandra Lee (CIO)",
    "notes": "University sector heritage — strong on social license and ESG. Patient capital. Infrastructure and real assets preferred. Quarterly IC cycle.",
    "lastUpdated": "2025-02-20",
    "status": "Active"
  },
  {
    "id": "l9",
    "name": "HESTA",
    "shortName": "HESTA",
    "type": "Superannuation Fund",
    "typeKey": "super",
    "sizeMin": "A$30m",
    "sizeMax": "A$500m",
    "assetClasses": [
      "Real Estate",
      "Infrastructure",
      "Private Credit",
      "Healthcare Real Assets"
    ],
    "transactionTypes": [
      "Infrastructure Debt",
      "Direct Lending",
      "Real Estate Debt",
      "Impact Investment"
    ],
    "geographies": [
      "Australia"
    ],
    "preferredStructure": "A$75bn healthcare and community sector fund. Strong impact investment mandate. Healthcare real estate and social infrastructure preferred. Impact measurement required.",
    "pricing": "Yield target 5–9%. Impact premium accepted for aligned assets.",
    "recentDeals": [
      "A$80m healthcare property finance",
      "A$60m social infrastructure debt",
      "A$40m impact private credit"
    ],
    "contacts": "Debby Blakey (CEO), Garry Weaven (Chair)",
    "notes": "Healthcare and community sector focus. Excellent fit for social infrastructure, aged care, and health facility finance. Impact credentials must be documented.",
    "lastUpdated": "2025-02-15",
    "status": "Active"
  },
  {
    "id": "l10",
    "name": "Metrics Credit Partners",
    "shortName": "Metrics",
    "type": "Private Credit Fund",
    "typeKey": "private_credit",
    "sizeMin": "A$10m",
    "sizeMax": "A$500m",
    "assetClasses": [
      "Corporate Direct Lending",
      "Real Estate Debt",
      "Infrastructure Debt",
      "Trade Finance"
    ],
    "transactionTypes": [
      "Senior Secured",
      "Unitranche",
      "Mezzanine",
      "Real Estate Senior Debt",
      "Construction Finance"
    ],
    "geographies": [
      "Australia",
      "New Zealand"
    ],
    "preferredStructure": "Australia's largest private credit fund manager (~A$20bn AUM). Broad mandate — corporate, real estate, infrastructure. Flexible on structure. Both public unlisted trusts and separately managed accounts.",
    "pricing": "BBSW + 300–700bps depending on credit quality and structure. Target gross return 7–14%.",
    "recentDeals": [
      "A$120m real estate senior debt (2024)",
      "A$80m corporate unitranche",
      "A$200m infrastructure debt participation",
      "A$50m trade finance facility"
    ],
    "contacts": "Andrew Lockhart (Managing Partner), Justin Davey (Partner — Real Estate), Graham McNamara (Partner)",
    "notes": "Key relationship in Australian private credit. Fast decision-making (2–4 weeks). Active across the capital structure. Well-known for real estate and corporate lending. Excellent partner for club deals.",
    "lastUpdated": "2025-03-18",
    "status": "Active"
  },
  {
    "id": "l11",
    "name": "Revolution Asset Management",
    "shortName": "Revolution",
    "type": "Private Credit Fund",
    "typeKey": "private_credit",
    "sizeMin": "A$10m",
    "sizeMax": "A$200m",
    "assetClasses": [
      "Asset-Backed Lending",
      "SME Lending",
      "Real Estate Debt",
      "Specialty Finance"
    ],
    "transactionTypes": [
      "Warehouse Facility",
      "Senior Secured",
      "Asset-Backed Finance",
      "Mezzanine"
    ],
    "geographies": [
      "Australia",
      "New Zealand"
    ],
    "preferredStructure": "Specialist asset-backed and structured credit lender (~A$3bn AUM). Strong in non-bank lender funding (warehouse), SME, and specialty finance. Nimble decision-making.",
    "pricing": "BBSW + 350–600bps. Asset-backed facilities tighter end. Specialty finance wider.",
    "recentDeals": [
      "A$60m warehouse for fintech lender",
      "A$40m SME asset-backed facility",
      "A$30m real estate mezzanine"
    ],
    "contacts": "Bob Sahota (CIO), Kevin Hua (Director)",
    "notes": "Strong fit for non-bank lender funding and specialty finance mandates. Relationship-driven. Happy to co-invest with other funds. Quick IC — decisions in 2–3 weeks.",
    "lastUpdated": "2025-03-05",
    "status": "Active"
  },
  {
    "id": "l12",
    "name": "MA Financial Group — Credit",
    "shortName": "MA Financial Credit",
    "type": "Private Credit Fund",
    "typeKey": "private_credit",
    "sizeMin": "A$15m",
    "sizeMax": "A$300m",
    "assetClasses": [
      "Real Estate Debt",
      "Corporate Direct Lending",
      "Hospitality Finance",
      "Asset Finance"
    ],
    "transactionTypes": [
      "Senior Debt",
      "Mezzanine",
      "Construction Finance",
      "Unitranche",
      "Preferred Equity"
    ],
    "geographies": [
      "Australia",
      "New Zealand"
    ],
    "preferredStructure": "Listed alternative asset manager (~A$8bn AUM). Private credit division focused on real estate (residential, commercial, hospitality) and corporate. Managed funds and SMAs. Good flexibility on structure.",
    "pricing": "Target return 8–14% gross. Real estate senior: BBSW + 350–500bps. Mezz: 12–16%.",
    "recentDeals": [
      "A$80m construction finance (residential)",
      "A$50m corporate unitranche",
      "A$35m hospitality senior debt"
    ],
    "contacts": "Robert Fry (MD Private Credit), Julian Biggins (Group CEO), Tim Neele (Director)",
    "notes": "Growing platform with listed capital base. Strong in real estate credit and hospitality. Relationship building — met management team Feb 2025. Potential co-lender and client.",
    "lastUpdated": "2025-02-28",
    "status": "Active"
  },
  {
    "id": "l13",
    "name": "Challenger Investment Management",
    "shortName": "Challenger",
    "type": "Insurance / Life Company",
    "typeKey": "insurance",
    "sizeMin": "A$30m",
    "sizeMax": "A$1,000m",
    "assetClasses": [
      "Infrastructure Debt",
      "Real Estate Debt",
      "Corporate Direct Lending",
      "Structured Credit"
    ],
    "transactionTypes": [
      "Infrastructure Debt",
      "Real Estate Senior Debt",
      "Direct Lending",
      "Private Placement"
    ],
    "geographies": [
      "Australia",
      "Global"
    ],
    "preferredStructure": "Australia's largest annuity provider. Long-duration, investment grade bias required for annuity book. Infrastructure and real estate debt core. Private credit via dedicated investment management business.",
    "pricing": "Yield target 4.5–7% (investment grade), 7–10% (sub-IG). Fixed rate strongly preferred for duration matching.",
    "recentDeals": [
      "A$200m infrastructure debt (toll road)",
      "A$150m real estate senior debt",
      "A$100m private placement corporate debt"
    ],
    "contacts": "Nick Hamilton (CEO), Simon Etherington (CIO — Challenger IM)",
    "notes": "Long duration and investment grade focus means limited appetite for construction or speculative assets. Fixed rate preferred. Process 6–10 weeks. Strong for infrastructure and stabilised real estate.",
    "lastUpdated": "2025-03-01",
    "status": "Active"
  },
  {
    "id": "l14",
    "name": "Qualitas Group — Real Estate Credit",
    "shortName": "Qualitas",
    "type": "Real Estate Credit Manager",
    "typeKey": "real_estate_credit",
    "sizeMin": "A$10m",
    "sizeMax": "A$300m",
    "assetClasses": [
      "Construction Finance",
      "Real Estate Senior Debt",
      "Mezzanine",
      "Preferred Equity"
    ],
    "transactionTypes": [
      "Construction Facility",
      "Senior Debt",
      "Mezzanine",
      "Preferred Equity",
      "Bridge Loan"
    ],
    "geographies": [
      "Australia",
      "New Zealand"
    ],
    "preferredStructure": "Listed real estate credit investment manager (~A$7bn AUM). Entire capital stack — senior, mezz, preferred equity. Strong in construction and development. Fast decision-making. Public trusts (QRI) and private SMAs.",
    "pricing": "Senior: BBSW + 350–550bps. Mezz: 12–18%. Preferred equity: 14–20%.",
    "recentDeals": [
      "A$90m construction facility (Melbourne residential)",
      "A$60m mezzanine (commercial office)",
      "A$40m bridge loan (Sydney residential)"
    ],
    "contacts": "Andrew Schwartz (Group MD), Mark Fischer (CFO), Zacary Say (Head of Origination)",
    "notes": "First meeting March 2025. Strong alignment — both a client (advisory) and a lender (for RE debt deals). Potential to develop dual relationship. Active originator with quick IC.",
    "lastUpdated": "2025-03-18",
    "status": "Active"
  },
  {
    "id": "l15",
    "name": "Pallas Capital",
    "shortName": "Pallas",
    "type": "Private Credit Fund",
    "typeKey": "private_credit",
    "sizeMin": "A$5m",
    "sizeMax": "A$100m",
    "assetClasses": [
      "Real Estate Debt",
      "Construction Finance",
      "Mezzanine",
      "Bridging Finance"
    ],
    "transactionTypes": [
      "Construction Loan",
      "Bridge Finance",
      "Mezzanine",
      "Senior Secured"
    ],
    "geographies": [
      "Australia"
    ],
    "preferredStructure": "Boutique real estate credit fund. Small ticket, fast execution. Fills the gap between banks and larger credit funds. Typical LVR up to 75% senior, 85% mezz. 6–24 month tenor preferred.",
    "pricing": "Senior: 8–11% p.a. Mezz: 12–18% p.a. No BBSW — fixed or floating all-in rate.",
    "recentDeals": [
      "A$20m construction bridge (Brisbane)",
      "A$15m residential development mezzanine",
      "A$8m commercial bridging loan"
    ],
    "contacts": "Steve Tucker (Managing Director), Sean Aylmer (Director)",
    "notes": "Ideal co-lender for smaller real estate transactions where major banks won't participate. Quick (1–2 week) decision. Useful for complex or transitional real estate assets.",
    "lastUpdated": "2025-02-10",
    "status": "Active"
  },
  {
    "id": "l16",
    "name": "Fortress Investment Group — Australia",
    "shortName": "Fortress",
    "type": "Global Credit Fund",
    "typeKey": "private_credit",
    "sizeMin": "A$50m",
    "sizeMax": "A$1,000m",
    "assetClasses": [
      "Real Estate Debt",
      "Corporate Lending",
      "Specialty Finance",
      "Distressed Credit"
    ],
    "transactionTypes": [
      "Senior Secured",
      "Mezzanine",
      "Whole Loan",
      "Special Situations",
      "DIP Finance"
    ],
    "geographies": [
      "Australia",
      "Global"
    ],
    "preferredStructure": "Global alternative asset manager with Australian presence. Opportunistic and value-oriented. Appetite for complex, structured, and special situation transactions. Strong in real estate and corporate credit.",
    "pricing": "Target return 12–20%+. Opportunistic — will pay up for complexity and control.",
    "recentDeals": [
      "A$200m real estate whole loan acquisition",
      "A$150m corporate special situation",
      "A$80m distressed debt purchase"
    ],
    "contacts": "Adam Tester (MD Australia), Global: Pete Briger (Co-CEO)",
    "notes": "Good for complex or special situation transactions. Not a traditional lender — acts as principal. Longer process due to global IC requirement. Useful for deals other lenders won't touch.",
    "lastUpdated": "2025-01-20",
    "status": "Active"
  },
  {
    "id": "l17",
    "name": "Barings Australia",
    "shortName": "Barings",
    "type": "Global Asset Manager / Credit Fund",
    "typeKey": "private_credit",
    "sizeMin": "A$30m",
    "sizeMax": "A$500m",
    "assetClasses": [
      "Private Credit",
      "Infrastructure Debt",
      "Real Estate Debt",
      "Structured Credit"
    ],
    "transactionTypes": [
      "Direct Lending",
      "Infrastructure Debt",
      "Real Estate Debt",
      "ABS / Structured Credit"
    ],
    "geographies": [
      "Australia",
      "Asia-Pacific",
      "Global"
    ],
    "preferredStructure": "Global alternative asset manager (~US$420bn AUM). Australian presence growing. Private credit focus: senior secured direct lending, infrastructure debt, real estate. Long duration and investment grade appetite.",
    "pricing": "BBSW + 280–550bps. Investment grade closer. Sub-IG wider.",
    "recentDeals": [
      "A$100m infrastructure debt (renewable energy)",
      "A$80m direct lending corporate",
      "A$60m real estate debt"
    ],
    "contacts": "Nick Bishop (Head of Australia), Jamie Maclure (MD Private Finance)",
    "notes": "Excellent for infrastructure and real estate debt mandates. Global platform with Asian LPs increasingly allocating to AU market. IC process 4–6 weeks. Prefers repeat counterparties.",
    "lastUpdated": "2025-02-25",
    "status": "Active"
  },
  {
    "id": "l18",
    "name": "First Sentier Investors — Infrastructure Debt",
    "shortName": "First Sentier",
    "type": "Infrastructure Asset Manager",
    "typeKey": "infrastructure",
    "sizeMin": "A$50m",
    "sizeMax": "A$1,000m",
    "assetClasses": [
      "Infrastructure Debt",
      "Renewable Energy Finance",
      "Social Infrastructure",
      "Utilities"
    ],
    "transactionTypes": [
      "Project Finance",
      "Infrastructure Debt",
      "Green Bond",
      "Social Bond",
      "Refinancing"
    ],
    "geographies": [
      "Australia",
      "New Zealand",
      "Europe"
    ],
    "preferredStructure": "Infrastructure-focused asset manager (~A$230bn AUM). Debt platform focused on investment-grade infrastructure debt. Long duration, fixed or inflation-linked. Green and social infrastructure a strategic priority.",
    "pricing": "Yield target 4–7% (investment grade infrastructure). Greenium available for certified green transactions.",
    "recentDeals": [
      "A$200m renewable energy project finance",
      "A$150m social housing debt",
      "A$100m utilities refinancing"
    ],
    "contacts": "Mark Steinberg (Global Head of Infrastructure Debt), Angela Karl (Director)",
    "notes": "Best fit for large-ticket, investment-grade infrastructure debt. Particularly strong on renewable energy and social infrastructure given ESG mandate. Allow 8–12 weeks for IC.",
    "lastUpdated": "2025-03-02",
    "status": "Active"
  },
  {
    "id": "l19",
    "name": "Bank of Queensland",
    "shortName": "BOQ",
    "type": "Regional Bank",
    "typeKey": "regional_bank",
    "sizeMin": "A$5m",
    "sizeMax": "A$300m",
    "assetClasses": [
      "Commercial Real Estate",
      "SME Lending",
      "Healthcare Finance",
      "Agribusiness"
    ],
    "transactionTypes": [
      "Senior Secured",
      "Commercial Property Loan",
      "Asset Finance",
      "Trade Finance"
    ],
    "geographies": [
      "Australia (QLD focus)"
    ],
    "preferredStructure": "Queensland-based regional bank with national SME and healthcare lending franchise. Virgin Money brand for consumer. ME Bank for digital. Good appetite for mid-market corporate and property transactions.",
    "pricing": "BBSW + 200–380bps. Healthcare and BOQ Specialist competitive.",
    "recentDeals": [
      "A$40m healthcare facility (specialist medical)",
      "A$25m QLD commercial property",
      "A$30m SME term loan"
    ],
    "contacts": "Patrick Allaway (CEO), Rino Grollo (Chief Customer Officer)",
    "notes": "BOQ Specialist (medical) is differentiated. Less competition for healthcare-adjacent mandates. Regional focus limits large syndicated appetite but good for Queensland/mid-market transactions.",
    "lastUpdated": "2025-02-05",
    "status": "Active"
  },
  {
    "id": "l20",
    "name": "Bendigo and Adelaide Bank",
    "shortName": "Bendigo Bank",
    "type": "Regional Bank",
    "typeKey": "regional_bank",
    "sizeMin": "A$5m",
    "sizeMax": "A$200m",
    "assetClasses": [
      "Agribusiness",
      "Residential Mortgage",
      "SME Lending",
      "Community Finance"
    ],
    "transactionTypes": [
      "Agri Finance",
      "Home Loan Warehouse",
      "Community Lending",
      "Asset Finance"
    ],
    "geographies": [
      "Australia"
    ],
    "preferredStructure": "Regionally focused bank with strong agribusiness and community banking heritage. Rural Bank subsidiary is a major agri lender. Growing digital capability via Up Bank. Appetite for socially-aligned transactions.",
    "pricing": "BBSW + 180–340bps. Agri pricing competitive via Rural Bank.",
    "recentDeals": [
      "A$60m agri finance portfolio",
      "A$20m community housing",
      "A$35m SME portfolio"
    ],
    "contacts": "Marnie Baker (CEO), Taso Corolis (Chief Commercial Officer)",
    "notes": "Rural Bank is a go-to for agri lending. Social and community credentials strong. Less appetite for complex structured finance — more traditional banking relationship. Good for agri-adjacent mandates.",
    "lastUpdated": "2025-01-30",
    "status": "Active"
  }

];

// ============================================================
// FINANCIER CHART DATA — FUM (A$bn) and mandate size range
// ============================================================
const FINANCIER_CHART_DATA = [
  { name:'CBA',              fullName:'Commonwealth Bank of Australia',      fum:1150, minDeal:20,  maxDeal:2000, typeKey:'major_bank',        color:'#FDD400', textColor:'#000' },
  { name:'Westpac',          fullName:'Westpac Banking Corporation',         fum:880,  minDeal:20,  maxDeal:2000, typeKey:'major_bank',        color:'#DA1710', textColor:'#fff' },
  { name:'ANZ',              fullName:'ANZ Group Holdings',                  fum:960,  minDeal:20,  maxDeal:2000, typeKey:'major_bank',        color:'#007DBA', textColor:'#fff' },
  { name:'NAB',              fullName:'National Australia Bank',             fum:1020, minDeal:20,  maxDeal:2000, typeKey:'major_bank',        color:'#E60028', textColor:'#fff' },
  { name:'Macquarie',        fullName:'Macquarie Group',                     fum:940,  minDeal:10,  maxDeal:5000, typeKey:'major_bank',        color:'#CC0000', textColor:'#fff' },
  { name:'AustralianSuper',  fullName:'AustralianSuper',                     fum:340,  minDeal:100, maxDeal:5000, typeKey:'super',             color:'#003DA5', textColor:'#fff' },
  { name:'Aware Super',      fullName:'Aware Super',                         fum:170,  minDeal:50,  maxDeal:1000, typeKey:'super',             color:'#00A86B', textColor:'#fff' },
  { name:'UniSuper',         fullName:'UniSuper',                            fum:130,  minDeal:50,  maxDeal:800,  typeKey:'super',             color:'#1B3F6E', textColor:'#fff' },
  { name:'HESTA',            fullName:'HESTA',                               fum:75,   minDeal:30,  maxDeal:500,  typeKey:'super',             color:'#7C2D8E', textColor:'#fff' },
  { name:'Metrics',          fullName:'Metrics Credit Partners',             fum:20,   minDeal:10,  maxDeal:500,  typeKey:'private_credit',    color:'#1E3A5F', textColor:'#fff' },
  { name:'Revolution',       fullName:'Revolution Asset Management',         fum:3,    minDeal:10,  maxDeal:200,  typeKey:'private_credit',    color:'#E8451A', textColor:'#fff' },
  { name:'MA Financial',     fullName:'MA Financial Group — Credit',         fum:8,    minDeal:15,  maxDeal:300,  typeKey:'private_credit',    color:'#1D1D1B', textColor:'#fff' },
  { name:'Challenger',       fullName:'Challenger Investment Management',    fum:120,  minDeal:30,  maxDeal:1000, typeKey:'insurance',         color:'#F04E23', textColor:'#fff' },
  { name:'Qualitas',         fullName:'Qualitas Group',                      fum:7,    minDeal:10,  maxDeal:300,  typeKey:'real_estate_credit',color:'#2C2C54', textColor:'#fff' },
  { name:'Pallas',           fullName:'Pallas Capital',                      fum:0.8,  minDeal:5,   maxDeal:100,  typeKey:'real_estate_credit',color:'#2C3E50', textColor:'#fff' },
  { name:'Fortress',         fullName:'Fortress Investment Group',           fum:45,   minDeal:50,  maxDeal:1000, typeKey:'private_credit',    color:'#1A1A1A', textColor:'#fff' },
  { name:'Barings',          fullName:'Barings Australia',                   fum:420,  minDeal:30,  maxDeal:500,  typeKey:'private_credit',    color:'#C8102E', textColor:'#fff' },
  { name:'First Sentier',    fullName:'First Sentier Investors',             fum:230,  minDeal:50,  maxDeal:1000, typeKey:'infrastructure',    color:'#003087', textColor:'#fff' },
  { name:'BOQ',              fullName:'Bank of Queensland',                  fum:110,  minDeal:5,   maxDeal:300,  typeKey:'regional_bank',     color:'#E4002B', textColor:'#fff' },
  { name:'Bendigo',          fullName:'Bendigo and Adelaide Bank',           fum:100,  minDeal:5,   maxDeal:200,  typeKey:'regional_bank',     color:'#E87722', textColor:'#fff' },
];

const FINANCIER_TYPE_COLORS = {
  major_bank:        '#1E3A5F',
  regional_bank:     '#5A6B7A',
  private_credit:    '#6B3A5A',
  super:             '#1A5A3A',
  insurance:         '#8B4500',
  real_estate_credit:'#4A2C6B',
  infrastructure:    '#1A4A6B',
};

let DEALS = [];  // firm records are not bundled — import your dataset via Settings

let DD_LIBRARY = [];  // firm records are not bundled — import your dataset via Settings

let ADVISORS = [

  {
    "id": "a1",
    "name": "Rothschild & Co",
    "type": "Independent Advisory",
    "typeKey": "independent",
    "focus": [
      "M&A Advisory",
      "Debt Advisory",
      "Restructuring",
      "ECM"
    ],
    "geography": [
      "UK",
      "Europe",
      "Global"
    ],
    "dealSizeMin": "A$100m",
    "dealSizeMax": "A$5,000m+",
    "sectors": [
      "Financial Services",
      "Infrastructure",
      "Real Estate",
      "Corporate"
    ],
    "recentMandates": [
      "Santander UK portfolio sale advisory (2024)",
      "WS Atkins refinancing (2024)",
      "Pension fund de-risking advisory"
    ],
    "keyPeople": "Iain Drayton (Head of Debt Advisory UK), Charlotte Moore (Director)",
    "competitive": "Strongest on large-cap M&A and restructuring. Less active in structured finance / ABS. Broad sector coverage.",
    "relationship": "Referred Helix Infrastructure mandate. Good working relationship with debt advisory team.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-01"
  },
  {
    "id": "a2",
    "name": "Houlihan Lokey",
    "type": "Independent Advisory",
    "typeKey": "independent",
    "focus": [
      "Restructuring",
      "M&A Advisory",
      "Capital Markets Advisory",
      "Fairness Opinions"
    ],
    "geography": [
      "UK",
      "Europe",
      "US"
    ],
    "dealSizeMin": "A$30m",
    "dealSizeMax": "A$2,000m",
    "sectors": [
      "Financial Sponsor",
      "Real Estate",
      "Healthcare",
      "Technology"
    ],
    "recentMandates": [
      "Thames Water restructuring advisory (2024)",
      "Morrisons refinancing (2024)",
      "Multiple PE-backed restructurings"
    ],
    "keyPeople": "Philip Gould (Managing Director – Restructuring), Anna Walsh (Director)",
    "competitive": "Dominant in restructuring and special situations. Growing M&A franchise. Less focused on primary structured finance.",
    "relationship": "No active relationship. Met at ELFA conference. Worth developing — active in restructuring mandates.",
    "tier": "Tier 1",
    "lastUpdated": "2025-02-15"
  },
  {
    "id": "a3",
    "name": "Peel Hunt",
    "type": "Boutique / Mid-Market",
    "typeKey": "boutique",
    "focus": [
      "Equity Capital Markets",
      "Debt Advisory",
      "M&A",
      "Structured Finance"
    ],
    "geography": [
      "UK focused"
    ],
    "dealSizeMin": "A$10m",
    "dealSizeMax": "A$300m",
    "sectors": [
      "Financial Services",
      "Consumer",
      "Real Estate",
      "Fintech"
    ],
    "recentMandates": [
      "Multiple SME lending platform fundraises",
      "AIM-listed fintech advisory",
      "Specialist lender M&A"
    ],
    "keyPeople": "James Rutherford (Head of Structured Finance), Sarah Lin (Director)",
    "competitive": "Strong in mid-market and fintech-adjacent transactions. Relationship-driven model. Good for smaller tickets where big banks won't commit.",
    "relationship": "Regular dialogue with structured finance team. Co-advised on one transaction in 2023.",
    "tier": "Tier 2",
    "lastUpdated": "2025-01-20"
  },
  {
    "id": "a4",
    "name": "Lazard",
    "type": "Independent Advisory",
    "typeKey": "independent",
    "focus": [
      "M&A Advisory",
      "Debt Advisory",
      "Restructuring",
      "Sovereign Advisory"
    ],
    "geography": [
      "UK",
      "Europe",
      "Global"
    ],
    "dealSizeMin": "A$200m",
    "dealSizeMax": "Unlimited",
    "sectors": [
      "Infrastructure",
      "Financial Services",
      "Energy",
      "Government"
    ],
    "recentMandates": [
      "National Grid financing advisory",
      "Insurance sector M&A",
      "Infrastructure debt refinancing"
    ],
    "keyPeople": "David Armstrong (Head of Debt Advisory), Francesca Ruiz (Director – SF)",
    "competitive": "Premier brand for large-cap and sovereign mandates. Strong in infrastructure and public sector. Not typically competing in ABS / structured finance space.",
    "relationship": "No direct relationship. Potential conflict on some mandates — large deals they won't touch below A$200m.",
    "tier": "Tier 1",
    "lastUpdated": "2025-01-10"
  },
  {
    "id": "a5",
    "name": "Arrowpoint Advisory",
    "type": "Boutique / Specialist",
    "typeKey": "boutique",
    "focus": [
      "M&A Advisory",
      "Financial Sponsor Coverage",
      "Buy-side Advisory"
    ],
    "geography": [
      "UK",
      "Northern Europe"
    ],
    "dealSizeMin": "A$20m",
    "dealSizeMax": "A$500m",
    "sectors": [
      "Specialty Finance",
      "Consumer Finance",
      "Fintech",
      "Insurance"
    ],
    "recentMandates": [
      "Specialist lender sale process (2024)",
      "Consumer finance platform M&A",
      "Buy-side advisory for PE-backed acquisition"
    ],
    "keyPeople": "Mark Denton (Founder & Managing Partner), Lucy Shaw (Director)",
    "competitive": "Highly focused on specialty finance and consumer lending M&A. Strong relationships in PE and financial sponsor community. Limited in primary structured finance.",
    "relationship": "Active referral relationship. Referred two mandates in the past 12 months. Complementary not competitive.",
    "tier": "Tier 2",
    "lastUpdated": "2025-02-28"
  },
  {
    "id": "a6",
    "name": "PwC Deals – Debt & Capital Advisory",
    "type": "Big Four Advisory",
    "typeKey": "big4",
    "focus": [
      "Debt Advisory",
      "Refinancing",
      "Project Finance",
      "Infrastructure Advisory"
    ],
    "geography": [
      "UK",
      "Europe"
    ],
    "dealSizeMin": "A$20m",
    "dealSizeMax": "A$2,000m",
    "sectors": [
      "Infrastructure",
      "Real Estate",
      "Healthcare",
      "Public Sector"
    ],
    "recentMandates": [
      "NHS trust refinancing advisory",
      "Housing association funding advisory",
      "Multiple infrastructure project finance mandates"
    ],
    "keyPeople": "Robert Clarke (Partner – Debt Advisory), Emily Tan (Director)",
    "competitive": "Strong on public sector and regulated asset mandates. Audit conflict restricts some private sector mandates. Broad process capability.",
    "relationship": "Met on Helix Infrastructure Fund pitch. No current active relationship. Competing on some public sector-adjacent deals.",
    "tier": "Tier 2",
    "lastUpdated": "2025-02-01"
  },
  {
    "id": "a7",
    "name": "Greenhill & Co",
    "type": "Independent Advisory",
    "typeKey": "independent",
    "focus": [
      "M&A Advisory",
      "Restructuring",
      "Capital Raising"
    ],
    "geography": [
      "UK",
      "Europe",
      "US"
    ],
    "dealSizeMin": "A$50m",
    "dealSizeMax": "A$3,000m",
    "sectors": [
      "Financial Services",
      "Real Estate",
      "Technology",
      "Consumer"
    ],
    "recentMandates": [
      "Financial services M&A advisory",
      "Cross-border restructuring",
      "Minority stake advisory"
    ],
    "keyPeople": "Andrew Strang (Managing Director), Kate Palmer (Vice President)",
    "competitive": "Premium independent with US heritage. Smaller UK team. Not typically focused on structured finance or debt products.",
    "relationship": "No current relationship. Potential referral source for M&A-adjacent transactions.",
    "tier": "Tier 2",
    "lastUpdated": "2025-01-05"
  }

];

const ACTIVITY = [
  { type:'green', text:'Nova Consumer Credit ABS closed successfully — A$120m, 2.4x covered. Tombstone in progress.', time:'28 Mar 2025' },
  { type:'gold', text:'New mandate: Lendbrook Finance warehouse — A$75m. Barclays and NatWest as target lenders.', time:'22 Mar 2025' },
  { type:'navy', text:'DD pack sent to Barclays SF for Sentinel Mortgage Services. Awaiting credit review.', time:'18 Mar 2025' },
  { type:'gold', text:'M&G Investments — lender appetite and ESG requirements updated following meeting with Priya Mehta.', time:'14 Mar 2025' },
  { type:'navy', text:'Helix Infrastructure Fund: information memorandum first draft complete. Circulated for internal review.', time:'10 Mar 2025' },
  { type:'red', text:'Atlas Development Finance: mandate lost to incumbent. Lessons noted in DD library.', time:'28 Feb 2025' },
];

// ============================================================
// CONTACTS DATA
// ============================================================
let CONTACTS = [];  // firm records are not bundled — import your dataset via Settings

const CONTACT_TYPE_LABELS = { lender:'Lender / Financier', advisor:'Advisor', client:'Client / Prospect', other:'Other' };
const CONTACT_TYPE_BADGE  = { lender:'blue', advisor:'purple', client:'green', other:'stone' };

// ============================================================
// ACTIVITY LOG DATA
// ============================================================
let ACTIVITY_LOG = [];  // firm records are not bundled — import your dataset via Settings

const ACTIVITY_TYPE_LABELS = { meeting:'Meeting', call:'Call', email:'Email', conference:'Conference / Event', other:'Other' };
const ACTIVITY_TYPE_ICON   = { meeting:'🤝', call:'📞', email:'✉️', conference:'🏛️', other:'📋' };
const ACTIVITY_TYPE_BADGE  = { meeting:'blue', call:'green', email:'stone', conference:'purple', other:'stone' };

// ============================================================
// TASKS DATA
// ============================================================
let TASKS = [];  // firm records are not bundled — import your dataset via Settings

const TASK_PRIORITY_BADGE  = { High:'red', Medium:'amber', Low:'stone' };
const TASK_PRIORITY_ORDER  = { High:0, Medium:1, Low:2 };

// ============================================================
// BROKING PIPELINE DATA
// ============================================================
const BROKING_STAGE_CONFIG = {
  enquiry:    { label:'Enquiry',    color:'#3a6b8b', badgeClass:'blue'   },
  assessment: { label:'Assessment', color:'#6b5a8b', badgeClass:'purple' },
  approved:   { label:'Approved',   color:'#8b7a2a', badgeClass:'amber'  },
  settled:    { label:'Settled',    color:'#2a6b5a', badgeClass:'teal'   },
};
function brokingStageConf(stage) { return BROKING_STAGE_CONFIG[stage] || { label:'Unknown', color:'#888', badgeClass:'stone' }; }

let BROKING_DEALS = [];  // firm records are not bundled — import your dataset via Settings

// ============================================================
// DEAL MILESTONES DATA
// ============================================================
let DEAL_MILESTONES = [];  // firm records are not bundled — import your dataset via Settings

let DOC_LIBRARY = [];  // firm records are not bundled — import your dataset via Settings

const DOC_TYPE_LABELS    = { template:'Template', transaction:'Transaction Document', precedent:'Legal Precedent', research:'Research / Analysis', marketing:'Marketing / BD', other:'Other' };
const DOC_TYPE_BADGE     = { template:'teal', transaction:'blue', precedent:'purple', research:'amber', marketing:'green', other:'stone' };
const DOC_CAT_LABELS     = { transaction:'Transaction', business_development:'Business Development', market_intelligence:'Market Intelligence', legal:'Legal', other:'Other' };
const DOC_FILETYPE_ICON  = { docx:'📄', pptx:'📊', pdf:'📕', xlsx:'📗', other:'📁' };

const STAGE_CONFIG = {
  origination: { label:'Origination',      color:'#3a6b8b', badgeClass:'blue'   },
  mandate:     { label:'Mandated',   color:'#8b7a2a', badgeClass:'amber'  },
  live:        { label:'Execution',  color:'#2a6b5a', badgeClass:'teal'   },
  paused:      { label:'On Pause',          color:'#888',    badgeClass:'stone'  },
};
const STAGE_CONFIG_FALLBACK = { label:'Unknown', color:'#888', badgeClass:'stone' };
function stageConf(stage) { return STAGE_CONFIG[stage] || STAGE_CONFIG_FALLBACK; }
const DEAL_STATUS_COLORS = { green:'#3a6b4a', amber:'#8b7a2a', red:'#8b3a3a' };

let _idCounter = 300;
function genId() {
  _idCounter++;
  var candidate = 'x' + _idCounter;
  // Collect all IDs currently in memory, guarding against variables declared later
  var arrays = [];
  try { if (typeof DEALS            !== 'undefined') arrays.push(DEALS); } catch(e){}
  try { if (typeof LENDERS          !== 'undefined') arrays.push(LENDERS); } catch(e){}
  try { if (typeof DD_LIBRARY       !== 'undefined') arrays.push(DD_LIBRARY); } catch(e){}
  try { if (typeof ADVISORS         !== 'undefined') arrays.push(ADVISORS); } catch(e){}
  try { if (typeof CLIENT_TARGETS   !== 'undefined') arrays.push(CLIENT_TARGETS); } catch(e){}
  try { if (typeof SERVICE_PROVIDERS!== 'undefined') arrays.push(SERVICE_PROVIDERS); } catch(e){}
  try { if (typeof CONTACTS         !== 'undefined') arrays.push(CONTACTS); } catch(e){}
  try { if (typeof ACTIVITY_LOG     !== 'undefined') arrays.push(ACTIVITY_LOG); } catch(e){}
  try { if (typeof DOC_LIBRARY      !== 'undefined') arrays.push(DOC_LIBRARY); } catch(e){}
  try { if (typeof TASKS            !== 'undefined') arrays.push(TASKS); } catch(e){}
  try { if (typeof DEAL_MILESTONES  !== 'undefined') arrays.push(DEAL_MILESTONES); } catch(e){}
  try { if (typeof BROKING_DEALS    !== 'undefined') arrays.push(BROKING_DEALS); } catch(e){}
  try { if (typeof BROKING_TARGETS  !== 'undefined') arrays.push(BROKING_TARGETS); } catch(e){}
  try { if (typeof ARCHIVED_DEALS   !== 'undefined') arrays.push(ARCHIVED_DEALS); } catch(e){}
  var allIds = new Set(arrays.flat().map(function(r){ return r && r.id; }).filter(Boolean));
  while (allIds.has(candidate)) {
    _idCounter++;
    candidate = 'x' + _idCounter;
  }
  return candidate;
}

let CLIENT_TARGETS = [];  // firm records are not bundled — import your dataset via Settings


let SF_SUBTYPES = {

  "agri": [
    "All Types",
    "Processors & Meatworks",
    "Wool & Cropping",
    "Agri Lenders",
    "Input Suppliers",
    "Agents & Brokers",
    "Irrigation & Infrastructure",
    "Pastoral & Grazing",
    "Diversified Agribusiness"
  ],
  "fig": [
    "All Types",
    "Non-Bank Lenders",
    "Mortgage Originators",
    "Asset Finance",
    "Consumer Finance",
    "Litigation Funding",
    "Insurance & Super"
  ],
  "realestate": [
    "All Types",
    "Pubs & Clubs",
    "Single Asset Syndicates",
    "Property Developers",
    "Commercial Landlords",
    "Construction Finance",
    "Bridging Lenders",
    "Fund Managers"
  ]

};


let BROKING_TARGETS = [];  // firm records are not bundled — import your dataset via Settings

let ARCHIVED_DEALS = [];  // firm records are not bundled — import your dataset via Settings

var DASHBOARD_CONFIG = [
  { id:'kpis',           label:'KPI Summary',             enabled:true  },
  { id:'attention',      label:'Deals Needing Attention',  enabled:true  },
  { id:'tasks',          label:'Open Tasks',               enabled:true  },
  { id:'upcoming',       label:'Closing Soon',             enabled:true  },
  { id:'charts',         label:'Pipeline Charts',          enabled:true  },
  { id:'pipeline_table', label:'Active Deal Pipeline',     enabled:true  },
  { id:'activity',       label:'Recent Activity',          enabled:true  },
  { id:'owner',          label:'Pipeline by Owner',        enabled:false },
];

let SERVICE_PROVIDERS = [

  {
    "id": "sp1",
    "name": "King & Wood Mallesons",
    "shortName": "KWM",
    "type": "Legal",
    "typeKey": "legal",
    "specialisation": "Structured Finance, ABS, RMBS, Project Finance, Banking & Finance",
    "geography": "Australia, Asia-Pacific",
    "contacts": "Michael Ziegelaar (Partner – Structured Finance), Felicity Karageorge (Partner – Banking)",
    "recentDeals": [
      "Pepper Money RMBS (2024)",
      "Charter Hall debt facility (2024)",
      "Macquarie infrastructure finance"
    ],
    "fees": "Partner rates A$800–1,200/hr. Cap or fixed-fee arrangements available for repeat work.",
    "notes": "Go-to firm for complex structured finance and ABS transactions in Australia. Strong APRA regulatory expertise. Good working relationship with SF team.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-10"
  },
  {
    "id": "sp2",
    "name": "Herbert Smith Freehills",
    "shortName": "HSF",
    "type": "Legal",
    "typeKey": "legal",
    "specialisation": "Banking & Finance, Debt Capital Markets, Restructuring, Real Estate Finance",
    "geography": "Australia, Global",
    "contacts": "Tony Damian (Partner – Finance), Andrew Rich (Partner – DCM)",
    "recentDeals": [
      "ANZ syndicated facility documentation",
      "Qualitas real estate credit documentation",
      "Large infrastructure project finance"
    ],
    "fees": "Partner rates A$900–1,300/hr. Strong on-panel relationship pricing for banks.",
    "notes": "Excellent for large syndicated and DCM transactions. Strong bank-side practice. Less active in ABS/structured finance vs KWM.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-05"
  },
  {
    "id": "sp3",
    "name": "Allens",
    "shortName": "Allens",
    "type": "Legal",
    "typeKey": "legal",
    "specialisation": "Structured Finance, ABS, Project Finance, Agribusiness Finance, Real Estate",
    "geography": "Australia, South-East Asia",
    "contacts": "Diccon Loxton (Partner – Structured Finance), James Darcy (Partner – Real Estate Finance)",
    "recentDeals": [
      "GrainCorp agri finance facility",
      "Westpac RMBS documentation",
      "Infrastructure debt transaction"
    ],
    "fees": "Partner rates A$750–1,100/hr. Linklaters alliance for cross-border work.",
    "notes": "Strong structured finance and agribusiness finance practice. Linklaters alliance adds cross-border capability for European investor transactions.",
    "tier": "Tier 1",
    "lastUpdated": "2025-02-28"
  },
  {
    "id": "sp4",
    "name": "Clayton Utz",
    "shortName": "Clayton Utz",
    "type": "Legal",
    "typeKey": "legal",
    "specialisation": "Banking & Finance, Structured Finance, Real Estate, Government Finance",
    "geography": "Australia",
    "contacts": "Stuart Byrne (Partner – Finance), Deborah Johns (Partner – Real Estate Finance)",
    "recentDeals": [
      "Non-bank lender warehouse documentation",
      "Real estate senior debt documentation",
      "Government infrastructure finance"
    ],
    "fees": "Partner rates A$650–1,000/hr. Competitive on mid-market transactions.",
    "notes": "Strong mid-market and government finance practice. More competitive pricing than Magic Circle-affiliated firms. Good for real estate and mid-market mandates.",
    "tier": "Tier 2",
    "lastUpdated": "2025-02-15"
  },
  {
    "id": "sp5",
    "name": "Gilbert + Tobin",
    "shortName": "G+T",
    "type": "Legal",
    "typeKey": "legal",
    "specialisation": "M&A, Private Equity, Technology, Debt Finance, Capital Markets",
    "geography": "Australia",
    "contacts": "Peter Cook (Partner – Finance), Rachael Bassil (Partner – Capital Markets)",
    "recentDeals": [
      "Fintech lender finance documentation",
      "PE-backed acquisition finance",
      "Listed company capital raise"
    ],
    "fees": "Partner rates A$700–1,100/hr. Innovative fee arrangements for tech and fintech clients.",
    "notes": "Strongest M&A and tech/fintech practice in Australia. Less structured finance depth than KWM/Allens but growing. Good for fintech-adjacent transactions.",
    "tier": "Tier 2",
    "lastUpdated": "2025-01-30"
  },
  {
    "id": "sp6",
    "name": "Perpetual Corporate Trust",
    "shortName": "Perpetual",
    "type": "Trustee",
    "typeKey": "trustee",
    "specialisation": "Note Trustee, Security Trustee, Bare Trustee, Fund Administration, ABS/RMBS Trustee",
    "geography": "Australia",
    "contacts": "Richard McCarthy (Head of Corporate Trust), Lisa Chen (Relationship Manager)",
    "recentDeals": [
      "Pepper Money RMBS trustee",
      "Latitude Financial ABS trustee",
      "Multiple warehouse facility security trustees"
    ],
    "fees": "Trustee acceptance fee A$5–15k, annual trustee fee A$15–50k+ depending on complexity.",
    "notes": "Market-leading trustee for Australian ABS and RMBS transactions. APRA-regulated. Required for most public securitisation transactions. Strong operational capability.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-12"
  },
  {
    "id": "sp7",
    "name": "The Trust Company (Computershare)",
    "shortName": "Computershare Trust",
    "type": "Trustee",
    "typeKey": "trustee",
    "specialisation": "Note Trustee, Paying Agent, Registrar, Security Trustee, Escrow Agent",
    "geography": "Australia, Global",
    "contacts": "Peter Apostolou (Head of Corporate Trust AU), James Liu (Director)",
    "recentDeals": [
      "NatWest-arranged RMBS trustee",
      "Charter Hall bond trustee",
      "Infrastructure debt security trustee"
    ],
    "fees": "Acceptance fee A$5–20k. Annual fees vary by deal size and complexity.",
    "notes": "Global platform with strong local capability. Computershare acquisition has added tech capability. Competitive with Perpetual on most transaction types.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-01"
  },
  {
    "id": "sp8",
    "name": "Equity Trustees",
    "shortName": "EQT",
    "type": "Trustee",
    "typeKey": "trustee",
    "specialisation": "Responsible Entity, Fund Trustee, Superannuation Trustee, Corporate Trust",
    "geography": "Australia",
    "contacts": "Harvey Kalman (EGM Corporate Trust), Sarah Maguire (Senior Manager)",
    "recentDeals": [
      "Unlisted property fund RE trustee",
      "Private credit fund responsible entity",
      "Managed fund trustee arrangements"
    ],
    "fees": "RE and trustee fees negotiated case-by-case. Fund trustee from A$20k p.a.",
    "notes": "Strong RE and managed fund trustee practice. Less active in ABS/RMBS vs Perpetual and Computershare. Good for unlisted fund and private credit structures.",
    "tier": "Tier 2",
    "lastUpdated": "2025-02-20"
  },
  {
    "id": "sp9",
    "name": "Commonwealth Bank – Markets",
    "shortName": "CBA Markets",
    "type": "Hedge Provider",
    "typeKey": "hedge",
    "specialisation": "Interest Rate Swap, Cross Currency Swap, FX Hedge, Basis Swap, Cap/Floor",
    "geography": "Australia, Global",
    "contacts": "Michael Chen (Head of Structured Derivatives), Anna Park (Director – ABS Hedging)",
    "recentDeals": [
      "Pepper Money RMBS interest rate swap",
      "Latitude ABS cross-currency swap",
      "Multiple warehouse facility caps"
    ],
    "fees": "Swap pricing market-competitive. Negotiated ISDAs for repeat counterparties. Margin threshold negotiation standard.",
    "notes": "Largest swap provider for Australian ABS/RMBS market. ISDA/CSA required. Fast execution and strong operational capability. Preferred hedge counterparty for many ABS deals.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-15"
  },
  {
    "id": "sp10",
    "name": "NAB Markets",
    "shortName": "NAB Markets",
    "type": "Hedge Provider",
    "typeKey": "hedge",
    "specialisation": "Interest Rate Swap, FX Hedge, Commodity Hedge, Agri Derivatives, Basis Swap",
    "geography": "Australia, New Zealand",
    "contacts": "David Walsh (Head of Financial Institutions Derivatives), Karen Tran (Associate Director)",
    "recentDeals": [
      "GrainCorp commodity hedge",
      "Agri lending facility interest rate cap",
      "RMBS transaction swap provider"
    ],
    "fees": "Market-standard swap pricing. Strong relationship pricing for existing bank clients.",
    "notes": "Strong agri derivatives capability differentiates from other big-4 swap desks. Good for agri-linked transactions. Standard ISDA/CSA documentation.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-08"
  },
  {
    "id": "sp11",
    "name": "Westpac Institutional Bank – Markets",
    "shortName": "Westpac Markets",
    "type": "Hedge Provider",
    "typeKey": "hedge",
    "specialisation": "Interest Rate Swap, Cross Currency Swap, Green Derivatives, Inflation Swap",
    "geography": "Australia, NZ, UK",
    "contacts": "James Thornton (Head of Rates & Credit Derivatives)",
    "recentDeals": [
      "Green RMBS swap provider",
      "Infrastructure debt hedging",
      "Real estate senior debt cap"
    ],
    "fees": "Market-competitive. Green/ESG derivative expertise increasingly available.",
    "notes": "Growing ESG derivatives capability. Good for green bond and sustainability-linked swap overlays. Standard big-4 swap desk capability.",
    "tier": "Tier 2",
    "lastUpdated": "2025-02-25"
  },
  {
    "id": "sp12",
    "name": "S&P Global Ratings",
    "shortName": "S&P",
    "type": "Rating Agency",
    "typeKey": "rating",
    "specialisation": "RMBS, ABS, CDO, Corporate, Infrastructure, Financial Institution Ratings",
    "geography": "Global",
    "contacts": "Kate Thompson (Head of SF Ratings Australia), James McKeon (Director – RMBS)",
    "recentDeals": [
      "Pepper Money RMBS (AAA rated)",
      "Latitude ABS programme rating",
      "Infrastructure debt rating"
    ],
    "fees": "Initial rating fee A$80–300k+ depending on deal size and complexity. Surveillance fee ongoing.",
    "notes": "Largest rating agency by Australian ABS market share. Required for most public securitisation transactions. Allow 6–8 weeks for new issuer/programme setup.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-10"
  },
  {
    "id": "sp13",
    "name": "Fitch Ratings",
    "shortName": "Fitch",
    "type": "Rating Agency",
    "typeKey": "rating",
    "specialisation": "RMBS, ABS, Structured Finance, Corporate, Financial Institution Ratings",
    "geography": "Global",
    "contacts": "James Bradley (Head of SF Australia), Sarah Collins (Director – ABS)",
    "recentDeals": [
      "Columbus Capital RMBS rating",
      "Non-bank lender ABS rating",
      "Real estate CDO rating"
    ],
    "fees": "Initial rating fee A$70–250k+. Often used as second rating alongside S&P or Moodys.",
    "notes": "Strong competition with S&P for Australian RMBS/ABS mandates. STS assessment capability. Fitch criteria differs from S&P — important to understand for credit enhancement levels.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-05"
  },
  {
    "id": "sp14",
    "name": "Moody's Ratings",
    "shortName": "Moody's",
    "type": "Rating Agency",
    "typeKey": "rating",
    "specialisation": "RMBS, ABS, Corporate, Infrastructure, Covered Bond, CDO Ratings",
    "geography": "Global",
    "contacts": "Structured finance team Australia (general enquiries)",
    "recentDeals": [
      "Covered bond rating (major bank)",
      "Infrastructure project finance rating",
      "Corporate debt programme rating"
    ],
    "fees": "Initial rating fee A$75–280k+. Moody's criteria particularly relevant for covered bonds and infrastructure.",
    "notes": "Less dominant than S&P and Fitch in Australian ABS but strong on covered bonds and infrastructure debt. Moody's MILAN model used for RMBS credit enhancement.",
    "tier": "Tier 2",
    "lastUpdated": "2025-02-10"
  },
  {
    "id": "sp15",
    "name": "BNY Mellon – Corporate Trust",
    "shortName": "BNY Mellon",
    "type": "Account Bank / Paying Agent",
    "typeKey": "account_bank",
    "specialisation": "Account Bank, Paying Agent, Calculation Agent, Registrar, Custody",
    "geography": "Global",
    "contacts": "Michael Doyle (Head of Corporate Trust APAC), Rachel Wong (Director – Structured Finance)",
    "recentDeals": [
      "Multiple RMBS account bank mandates",
      "ABS paying agent arrangements",
      "Covered bond calculation agent"
    ],
    "fees": "Account bank fee A$10–30k p.a. Paying agent fees depend on note classes and payment frequency.",
    "notes": "Market-leading account bank and paying agent for Australian and cross-border structured finance. Strong operational systems. Required for most public ABS transactions.",
    "tier": "Tier 1",
    "lastUpdated": "2025-03-01"
  },
  {
    "id": "sp16",
    "name": "Citibank – Agency & Trust",
    "shortName": "Citibank Agency",
    "type": "Account Bank / Paying Agent",
    "typeKey": "account_bank",
    "specialisation": "Account Bank, Paying Agent, Custody, Document Custody, Cash Management",
    "geography": "Global",
    "contacts": "David Park (Head of Agency & Trust APAC), Emma Clarke (VP – Structured Finance)",
    "recentDeals": [
      "Infrastructure bond paying agent",
      "Real estate debt account bank",
      "Cross-border ABS custody"
    ],
    "fees": "Competitive with BNY on most mandates. Package pricing available for multi-function roles.",
    "notes": "Strong alternative to BNY. Often competitive on complex cross-border transactions. Good for transactions with Asian investor base.",
    "tier": "Tier 1",
    "lastUpdated": "2025-02-20"
  },
  {
    "id": "sp17",
    "name": "KPMG – Structured Finance",
    "shortName": "KPMG",
    "type": "Auditor / Verifier",
    "typeKey": "auditor",
    "specialisation": "ABS Auditor, Portfolio Verification, Due Diligence, Financial Model Audit, Tax Structuring",
    "geography": "Australia",
    "contacts": "Stephen Martin (Partner – Structured Finance), Michelle Lee (Director)",
    "recentDeals": [
      "Portfolio tape verification (non-bank lender)",
      "Financial model audit (ABS transaction)",
      "Tax structure review (real estate debt)"
    ],
    "fees": "Engagement-based. DD/verification A$50–200k. Ongoing audit arrangements separately.",
    "notes": "Strong structured finance practice within Big Four. Portfolio tape verification and model audit common pre-deal services. Audit independence constraints for existing audit clients.",
    "tier": "Tier 1",
    "lastUpdated": "2025-02-28"
  },
  {
    "id": "sp18",
    "name": "Deloitte – Financial Advisory",
    "shortName": "Deloitte",
    "type": "Auditor / Verifier",
    "typeKey": "auditor",
    "specialisation": "Financial Model Review, Portfolio Audit, Restructuring, Valuation, Tax",
    "geography": "Australia, Global",
    "contacts": "Robert Hines (Partner – Financial Advisory), James Tan (Director – Structured Finance)",
    "recentDeals": [
      "Warehouse facility financial model review",
      "Distressed debt portfolio valuation",
      "Tax structuring for ABS transaction"
    ],
    "fees": "Engagement-based. Typically similar to KPMG. Restructuring mandates separately priced.",
    "notes": "Strong in financial advisory and restructuring. Good alternative to KPMG for model review and portfolio audit where audit independence applies. Growing structured finance capability.",
    "tier": "Tier 2",
    "lastUpdated": "2025-02-15"
  }

];

