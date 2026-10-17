// ============================================================
// APP STATE & ROUTING
// ============================================================
// ============================================================
// STATE
// ============================================================
const state = {
  view: 'overview',
  pipelineViewMode: 'kanban',
  pipelineTab: 'board',
  pipelineBusiness: 'sf',
  lenderSearch: '', lenderTypeFilter: '', lenderAssetFilter: '',
  pipelineSearch: '', pipelineStageFilter: '',
  ddSearch: '', expandedDD: null,
  advisorSearch: '', advisorTypeFilter: '', advisorTierFilter: '',
  contactSearch: '', contactFirmFilter: '', contactRoleFilter: '',
  activitySearch: '', activityTypeFilter: '', activityDealFilter: '',
  librarySearch: '', libraryTypeFilter: '', libraryDealFilter: '',
  taskSearch: '', taskStatusFilter: '', taskPriorityFilter: '', taskOwnerFilter: '', taskViewMode: 'list',
  brokingSearch: '', brokingStageFilter: '',
};

// ============================================================
// ROUTING
// ============================================================
const PAGE_TITLES = {
  overview:  ['Overview','Platform summary'],
  lenders:   ['Financiers','Buy-side capital provider intelligence database'],
  pipeline:  ['Deal Pipeline','Active mandates & tracked transactions'],
  archive:   ['Archive','Deals removed from the active pipeline & the reasons why'],
  advisors:  ['Advisory Landscape','Market intelligence — competitor & peer tracking'],
  targets:   ['Client Targets','Agri, FIG & Real Estate mandate pipeline'],
  providers: ['Service Providers','Transaction service provider directory — lawyers, trustees, hedge providers & more'],
  contacts:  ['Contacts','People directory — counterparties, lenders, advisors & clients'],
  activity:  ['Activity Log','Meeting notes, calls & interactions across all deals and relationships'],
  library:   ['Document Library','IP library — precedents, templates, research & transaction materials'],
  tasks:     ['Tasks','Next actions & outstanding items across all deals and relationships'],
  settings:  ['Settings','Account, data tools & configuration'],
};

function navigate(view) {
  state.view = view;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  const [title, sub] = PAGE_TITLES[view];
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-subtitle').textContent = sub;
  document.getElementById('global-search').value = '';
  renderView();
  if (view === 'overview') setTimeout(drawOverviewCharts, 80);
}

function renderView() {
  const c = document.getElementById('content');
  switch (state.view) {
    case 'overview':  c.innerHTML = renderOverview();  break;
    case 'lenders':   c.innerHTML = renderLenders();   break;
    case 'pipeline':  c.innerHTML = renderPipeline();  break;
    case 'archive':   c.innerHTML = renderArchive();   break;
    case 'advisors':  c.innerHTML = renderAdvisors();  break;
    case 'targets':   c.innerHTML = renderTargets();   break;
    case 'providers': c.innerHTML = renderProviders(); break;
    case 'contacts':  c.innerHTML = renderContacts();  break;
    case 'activity':  c.innerHTML = renderActivity();  break;
    case 'library':   c.innerHTML = renderLibrary();   break;
    case 'tasks':     c.innerHTML = renderTasks();     break;
    case 'settings':  c.innerHTML = renderSettings();  break;
  }
}

// ============================================================
// CLIENT TARGETS DATA — Agri, FIG, Real Estate
// ============================================================
// ── SF Sector sub-type taxonomies ────────────────────────────
// ── Pitch status config ──────────────────────────────────────
const PITCH_STATUS_CONFIG = {
  Identified: { color:'#888',    bg:'#f5f5f5',  badge:'stone' },
  Engaged:    { color:'#1e4a6e', bg:'#e8f0f8',  badge:'blue'  },
  Pitching:   { color:'#8b7a2a', bg:'#fef3c7',  badge:'amber' },
  Mandated:   { color:'#3a6b4a', bg:'#e8f3eb',  badge:'teal'  },
};

// ── Broking client targets ────────────────────────────────────// ============================================================
// avgDealSizeMn = avg deal size in A$m, dealsPerYear = avg deals closed per year (last 2 FY)
// These are representative estimates for illustrative purposes
const ADVISOR_CHART_DATA = [
  { name:'Rothschild & Co',    avgDealSizeMn:420, dealsPerYear:18, tier:'Tier 1', typeKey:'independent',  color:'#8B0000' },
  { name:'Houlihan Lokey',     avgDealSizeMn:280, dealsPerYear:22, tier:'Tier 1', typeKey:'independent',  color:'#003865' },
  { name:'Lazard',             avgDealSizeMn:650, dealsPerYear:12, tier:'Tier 1', typeKey:'independent',  color:'#c0a060' },
  { name:'Greenhill & Co',     avgDealSizeMn:320, dealsPerYear:9,  tier:'Tier 2', typeKey:'independent',  color:'#2E5E2E' },
  { name:'Peel Hunt',          avgDealSizeMn:90,  dealsPerYear:28, tier:'Tier 2', typeKey:'boutique',     color:'#004B87' },
  { name:'Arrowpoint Advisory',avgDealSizeMn:120, dealsPerYear:14, tier:'Tier 2', typeKey:'boutique',     color:'#E8451A' },
  { name:'PwC Deals',          avgDealSizeMn:200, dealsPerYear:35, tier:'Tier 2', typeKey:'big4',         color:'#E0301E' },
];

// ============================================================
// PAGE STATE EXTENSIONS
// ============================================================
state.lenderViewMode    = 'list';
state.advisorViewMode   = 'list';
state.targetSector      = 'agri';
state.targetBusiness    = 'sf';
state.targetSubType     = '';
state.targetViewMode    = 'list';
state.targetSearch      = '';
state.targetPriority    = '';
state.targetStatus      = '';

// ============================================================
// NAV PAGE TITLES EXTENSION
// ============================================================
PAGE_TITLES['targets'] = ['Client Targets', 'Market intelligence — Agri, FIG & Real Estate pipeline'];
