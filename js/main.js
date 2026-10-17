// ============================================================
// BOOT — wiring, auth gate, data load
// ============================================================

// Sidebar navigation
document.querySelectorAll('.nav-item').forEach(function(el) {
  el.addEventListener('click', function(){ navigate(el.dataset.view); });
});

// Global search box → the current view's search field
document.getElementById('global-search').addEventListener('input', function(e) {
  var q = e.target.value;
  var map = { lenders:'lenderSearch', pipeline:'pipelineSearch', archive:'archiveSearch', advisors:'advisorSearch', targets:'targetSearch',
              providers:'providerSearch', contacts:'contactSearch', activity:'activitySearch', library:'librarySearch', tasks:'taskSearch' };
  if (map[state.view]) { state[map[state.view]] = q; renderView(); }
});

document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' });

// Escape closes modals
document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && isModalOpen()) closeModal(); });

function reseedIdCounter() {
  var ids = [];
  Object.keys(COLLECTIONS).forEach(function(c){ (COLLECTIONS[c].get() || []).forEach(function(r){ if (r && r.id) ids.push(r.id); }); });
  ids.forEach(function(id) {
    var m = String(id).match(/^x(\d+)$/);
    if (m) { var n = parseInt(m[1], 10); if (n >= _idCounter) _idCounter = n + 1; }
  });
}

function setBodyMode(mode) { // 'login' | 'loading' | 'app'
  document.body.classList.remove('auth-pending', 'auth-login', 'auth-loading', 'auth-app');
  document.body.classList.add('auth-' + mode);
}

function setUserChip() {
  var chip = document.getElementById('user-chip');
  if (!chip) return;
  if (store.mode === 'supabase' && auth.user) {
    var email = auth.user.email || '';
    chip.textContent = email.split('@')[0];
    chip.title = email + ' — click for account settings';
    chip.style.display = '';
  } else {
    chip.textContent = 'Local mode';
    chip.title = 'Data is stored in this browser only. Configure Supabase in js/config.js for shared use.';
    chip.style.display = '';
  }
}

function startApp() {
  setBodyMode('loading');
  return loadState().then(function(info) {
    reseedIdCounter();
    store.adapter.subscribe(onRemoteChange);
    setUserChip();
    setBodyMode('app');
    navigate('overview');

    // One-time offer: pull data left behind by the old single-file version
    var legacy = detectLegacyLocalData();
    if (legacy && !sessionStorage.getItem('legacy_import_offered')) {
      sessionStorage.setItem('legacy_import_offered', '1');
      setTimeout(function() {
        if (confirm('Data from the previous single-file dashboard was found in this browser (saved ' + (legacy.savedAt || 'earlier') + ').\n\nImport it into the ' + (store.mode === 'supabase' ? 'shared database' : 'new app') + ' now? This replaces the current records.')) {
          applyImportPayload(legacy); saveState(); renderView(); showToast('Previous data imported.');
        }
      }, 600);
    }
  }).catch(function(e) {
    console.error(e);
    setBodyMode('app');
    showToast('Could not load data: ' + (e.message || e), true);
  });
}

(function boot() {
  if (isSupabaseConfigured()) {
    store.mode = 'supabase';
    setBodyMode('login');
    var client = initAuth({
      onSignedIn: function() {
        store.adapter = new SupabaseAdapter(client);
        startApp();
      },
      onSignedOut: function() {
        if (store.adapter) store.adapter.unsubscribe();
        store.adapter = null;
        setBodyMode('login');
        var pw = document.getElementById('login-password'); if (pw) pw.value = '';
      },
    });
  } else {
    store.mode = 'local';
    store.adapter = new LocalAdapter();
    startApp();
  }
})();
