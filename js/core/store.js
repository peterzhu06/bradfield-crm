// ============================================================
// STORE — shared persistence layer
// ------------------------------------------------------------
// The app keeps its data in plain global arrays (DEALS, LENDERS,
// TASKS, ...) exactly as before. Every mutation site calls
// saveState(). This module turns that into a *diff* against the
// last-known server state and pushes only the rows that changed
// (upserts + deletes) to the backend, then listens for realtime
// changes made by other users and merges them in.
//
// Backends ("adapters"):
//   - SupabaseAdapter : shared, multi-user (production)
//   - LocalAdapter    : localStorage, single browser (preview)
// ============================================================

var STORE_SCHEMA_VERSION = 3;
var SETTINGS_COLLECTION  = '_settings';

// ── Collections: name → accessor for the global array ────────
var COLLECTIONS = {
  DEALS:             { get: function(){ return DEALS; },             set: function(v){ DEALS = v; } },
  ARCHIVED_DEALS:    { get: function(){ return ARCHIVED_DEALS; },    set: function(v){ ARCHIVED_DEALS = v; } },
  BROKING_DEALS:     { get: function(){ return BROKING_DEALS; },     set: function(v){ BROKING_DEALS = v; } },
  BROKING_TARGETS:   { get: function(){ return BROKING_TARGETS; },   set: function(v){ BROKING_TARGETS = v; } },
  CLIENT_TARGETS:    { get: function(){ return CLIENT_TARGETS; },    set: function(v){ CLIENT_TARGETS = v; } },
  LENDERS:           { get: function(){ return LENDERS; },           set: function(v){ LENDERS = v; } },
  ADVISORS:          { get: function(){ return ADVISORS; },          set: function(v){ ADVISORS = v; } },
  SERVICE_PROVIDERS: { get: function(){ return SERVICE_PROVIDERS; }, set: function(v){ SERVICE_PROVIDERS = v; } },
  CONTACTS:          { get: function(){ return CONTACTS; },          set: function(v){ CONTACTS = v; } },
  ACTIVITY_LOG:      { get: function(){ return ACTIVITY_LOG; },      set: function(v){ ACTIVITY_LOG = v; } },
  DOC_LIBRARY:       { get: function(){ return DOC_LIBRARY; },       set: function(v){ DOC_LIBRARY = v; } },
  DD_LIBRARY:        { get: function(){ return DD_LIBRARY; },        set: function(v){ DD_LIBRARY = v; } },
  TASKS:             { get: function(){ return TASKS; },             set: function(v){ TASKS = v; } },
  DEAL_MILESTONES:   { get: function(){ return DEAL_MILESTONES; },   set: function(v){ DEAL_MILESTONES = v; },
                       key: 'dealId' },   // milestones are keyed by deal, not id
};

// ── Settings: single-value documents ──────────────────────────
var SETTINGS = {
  SF_SUBTYPES:       { get: function(){ return SF_SUBTYPES; },       set: function(v){ SF_SUBTYPES = v; } },
  DASHBOARD_CONFIG:  { get: function(){ return DASHBOARD_CONFIG; },  set: function(v){ DASHBOARD_CONFIG = v; } },
  SNAPSHOT_SECTIONS: { get: function(){ return (typeof state !== 'undefined' && state.snapshotSections) || null; },
                       set: function(v){ if (typeof state !== 'undefined') state.snapshotSections = v; } },
};

// Snapshot of the bundled defaults, taken before anything is loaded
var DEFAULT_DATASET = (function() {
  var out = { collections: {}, settings: {} };
  Object.keys(COLLECTIONS).forEach(function(c){ out.collections[c] = deepClone(COLLECTIONS[c].get()); });
  Object.keys(SETTINGS).forEach(function(s){ var v = SETTINGS[s].get(); if (v != null) out.settings[s] = deepClone(v); });
  return out;
})();

function deepClone(v) { return JSON.parse(JSON.stringify(v)); }
function recordKey(collection, r) { var k = COLLECTIONS[collection] && COLLECTIONS[collection].key || 'id'; return r && r[k]; }

// ── Sync state ────────────────────────────────────────────────
var store = {
  adapter:   null,
  synced:    {},        // { collection: { id: { pos:n, json:'...' } } }
  queue:     Promise.resolve(),
  dirty:     false,
  pendingRender: false,
  lastSyncAt: null,
  mode:      'local',   // 'local' | 'supabase'
  _renderTimer: null,
};

// Build the row representation we persist for a collection
function buildRows(collection) {
  var arr = COLLECTIONS[collection].get() || [];
  var rows = [];
  arr.forEach(function(r, i) {
    var id = recordKey(collection, r);
    if (!id) return;
    rows.push({ collection: collection, id: String(id), position: i, data: r });
  });
  return rows;
}
function settingsRows() {
  return Object.keys(SETTINGS).map(function(k) {
    var v = SETTINGS[k].get();
    return v == null ? null : { collection: SETTINGS_COLLECTION, id: k, position: 0, data: { value: v } };
  }).filter(Boolean);
}

function rowSig(row) { return row.position + '|' + JSON.stringify(row.data); }

// ── SAVE: diff + push ─────────────────────────────────────────
function saveState() {
  if (!store.adapter) return Promise.resolve();
  var upserts = [], deletes = [];
  var groups = Object.keys(COLLECTIONS).map(buildRows);
  groups.push(settingsRows());
  var collectionsSeen = Object.keys(COLLECTIONS).concat([SETTINGS_COLLECTION]);

  groups.forEach(function(rows, gi) {
    var collection = collectionsSeen[gi];
    var prev = store.synced[collection] || (store.synced[collection] = {});
    var seen = {};
    rows.forEach(function(row) {
      var sig = rowSig(row);
      seen[row.id] = true;
      if (!prev[row.id] || prev[row.id] !== sig) { upserts.push(row); prev[row.id] = sig; }
    });
    Object.keys(prev).forEach(function(id) {
      if (!seen[id]) { deletes.push({ collection: collection, id: id }); delete prev[id]; }
    });
  });

  if (!upserts.length && !deletes.length) return Promise.resolve();

  store.queue = store.queue.then(function() {
    return store.adapter.write(upserts, deletes);
  }).then(function() {
    store.lastSyncAt = new Date();
    showSavePulse();
  }).catch(function(e) {
    console.error('Save failed', e);
    store.dirty = true;
    // forget the optimistic signatures so the next save retries them
    upserts.forEach(function(r){ if (store.synced[r.collection]) delete store.synced[r.collection][r.id]; });
    showToast('Save failed — ' + (e && e.message ? e.message : 'check your connection') + '. Changes will retry on next save.', true);
  });
  return store.queue;
}

// ── LOAD: pull everything, replace globals ────────────────────
function applyRows(rows) {
  var byCol = {};
  rows.forEach(function(r){ (byCol[r.collection] = byCol[r.collection] || []).push(r); });
  store.synced = {};
  Object.keys(COLLECTIONS).forEach(function(c) {
    var list = (byCol[c] || []).sort(function(a,b){ return (a.position||0) - (b.position||0); });
    store.synced[c] = {};
    list.forEach(function(r){ store.synced[c][r.id] = rowSig(r); });
    COLLECTIONS[c].set(list.map(function(r){ return r.data; }));
  });
  store.synced[SETTINGS_COLLECTION] = {};
  (byCol[SETTINGS_COLLECTION] || []).forEach(function(r) {
    store.synced[SETTINGS_COLLECTION][r.id] = rowSig(r);
    if (SETTINGS[r.id] && r.data && r.data.value != null) SETTINGS[r.id].set(r.data.value);
  });
  migrateLoadedData();
}

function migrateLoadedData() {
  // Stage keys from older versions
  var STAGE_MIGRATE = { due_diligence: 'mandate' };
  DEALS = DEALS.map(function(d){ return STAGE_MIGRATE[d.stage] ? Object.assign({}, d, { stage: STAGE_MIGRATE[d.stage] }) : d; })
               .filter(function(d){ return d.stage !== 'closed_won' && d.stage !== 'closed_lost'; });
  // Dashboard widgets added in later versions
  var defaults = DEFAULT_DATASET.settings.DASHBOARD_CONFIG || [];
  defaults.forEach(function(w) {
    if (!DASHBOARD_CONFIG.some(function(x){ return x.id === w.id; })) DASHBOARD_CONFIG.push(Object.assign({}, w));
  });
}

function loadState() {
  return store.adapter.load().then(function(rows) {
    if (!rows.length) {
      // Brand-new database: seed it with the bundled dataset
      resetToDefaults(true);
      return saveState().then(function(){ showToast('Initial dataset loaded into the shared database.'); return { seeded: true }; });
    }
    applyRows(rows);
    store.lastSyncAt = new Date();
    return { seeded: false, count: rows.length };
  });
}

// ── Realtime merge ────────────────────────────────────────────
function onRemoteChange(change) {
  // change: { type:'upsert'|'delete', collection, id, position, data }
  var c = change.collection;
  if (c === SETTINGS_COLLECTION) {
    if (change.type === 'upsert' && SETTINGS[change.id]) {
      var sig = rowSig(change);
      if (store.synced[c] && store.synced[c][change.id] === sig) return; // our own write echoing back
      store.synced[c][change.id] = sig;
      SETTINGS[change.id].set(change.data.value);
      scheduleRender();
    }
    return;
  }
  if (!COLLECTIONS[c]) return;
  var prev = store.synced[c] || (store.synced[c] = {});
  var arr = COLLECTIONS[c].get().slice();
  var keyName = COLLECTIONS[c].key || 'id';
  var idx = arr.findIndex(function(r){ return String(r[keyName]) === String(change.id); });

  if (change.type === 'delete') {
    if (!prev[change.id] && idx < 0) return;
    delete prev[change.id];
    if (idx >= 0) arr.splice(idx, 1);
  } else {
    var sig2 = rowSig(change);
    if (prev[change.id] === sig2) return; // own write
    prev[change.id] = sig2;
    if (idx >= 0) arr[idx] = change.data;
    else {
      var pos = typeof change.position === 'number' ? Math.min(Math.max(change.position, 0), arr.length) : arr.length;
      arr.splice(pos, 0, change.data);
    }
  }
  COLLECTIONS[c].set(arr);
  store.lastSyncAt = new Date();
  scheduleRender();
}

function scheduleRender() {
  if (isModalOpen()) { store.pendingRender = true; return; }
  clearTimeout(store._renderTimer);
  store._renderTimer = setTimeout(function() {
    if (typeof renderView === 'function') renderView();
    if (typeof state !== 'undefined' && state.view === 'overview' && typeof drawOverviewCharts === 'function') setTimeout(drawOverviewCharts, 80);
    flashSyncIndicator('Updated by team');
  }, 250);
}
function isModalOpen() {
  var el = document.getElementById('modal-overlay');
  return !!(el && el.classList.contains('open'));
}
function onModalClosed() {
  if (store.pendingRender) { store.pendingRender = false; scheduleRender(); }
}
function flashSyncIndicator(text) {
  var el = document.getElementById('save-indicator');
  if (!el) return;
  el.textContent = text; el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(function(){ el.style.opacity = '0'; }, 2200);
}

// ── RESET / EXPORT / IMPORT ───────────────────────────────────
function resetToDefaults(silent) {
  if (!silent) {
    var msg = store.mode === 'supabase'
      ? 'This will REPLACE the shared database for EVERYONE with the bundled sample dataset. All current records will be lost.\n\nExport a backup first. Are you absolutely sure?'
      : 'This will clear all your saved data and reload the sample data. This cannot be undone.\n\nAre you sure?';
    if (!confirm(msg)) return;
    if (store.mode === 'supabase' && prompt('Type RESET to confirm') !== 'RESET') return;
  }
  Object.keys(COLLECTIONS).forEach(function(c){ COLLECTIONS[c].set(deepClone(DEFAULT_DATASET.collections[c])); });
  Object.keys(DEFAULT_DATASET.settings).forEach(function(s){ SETTINGS[s].set(deepClone(DEFAULT_DATASET.settings[s])); });
  if (!silent) { saveState(); if (typeof renderView === 'function') renderView(); showToast('Reset to default dataset.'); }
}

function buildExportPayload() {
  var payload = { version: STORE_SCHEMA_VERSION, exportedAt: new Date().toISOString(), exportedBy: 'Bradfield Advisors CRM v' + (window.BRADFIELD_CONFIG && window.BRADFIELD_CONFIG.APP_VERSION || '') };
  Object.keys(COLLECTIONS).forEach(function(c){ payload[c] = COLLECTIONS[c].get(); });
  Object.keys(SETTINGS).forEach(function(s){ var v = SETTINGS[s].get(); if (v != null) payload[s] = v; });
  return payload;
}

function exportData() {
  try {
    var json = JSON.stringify(buildExportPayload(), null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var filename = 'bradfield-crm-' + new Date().toISOString().slice(0,10) + '.json';
    var a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported to ' + filename);
  } catch(e) { showToast('Export failed: ' + e.message, true); }
}

function applyImportPayload(payload) {
  var applied = 0;
  Object.keys(COLLECTIONS).forEach(function(c) {
    if (Array.isArray(payload[c])) { COLLECTIONS[c].set(payload[c]); applied++; }
  });
  Object.keys(SETTINGS).forEach(function(s) {
    if (payload[s] != null && typeof payload[s] === 'object') { SETTINGS[s].set(payload[s]); applied++; }
  });
  migrateLoadedData();
  return applied;
}

function importData() {
  var input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var payload = JSON.parse(ev.target.result);
        if (!payload || !payload.DEALS) { showToast('Invalid file — not a Bradfield CRM export.', true); return; }
        var warn = store.mode === 'supabase'
          ? 'Import data from "' + file.name + '"?\n\nThis replaces the SHARED database for everyone. Collections present in the file overwrite the current ones.'
          : 'Import data from "' + file.name + '"?\n\nThis will replace all current data.';
        if (!confirm(warn)) return;
        var n = applyImportPayload(payload);
        saveState(); if (typeof renderView === 'function') renderView();
        showToast('Imported ' + n + ' collections from ' + file.name);
      } catch(err) { showToast('Import failed: ' + err.message, true); }
    };
    reader.readAsText(file);
  };
  document.body.appendChild(input); input.click(); document.body.removeChild(input);
}

// Legacy single-browser data (v1/v2 localStorage) → offer to import it once
function detectLegacyLocalData() {
  try {
    var raw = localStorage.getItem('bradfield_crm_v1');
    if (!raw) return null;
    var p = JSON.parse(raw);
    return (p && Array.isArray(p.DEALS)) ? p : null;
  } catch(e) { return null; }
}

// ============================================================
// ADAPTERS
// ============================================================

// ── Supabase (shared) ─────────────────────────────────────────
function SupabaseAdapter(client) {
  this.client = client;
  this.channel = null;
}
SupabaseAdapter.prototype.load = function() {
  var client = this.client, all = [], from = 0, page = 1000;
  function next() {
    return client.from('records').select('collection,id,position,data').order('collection').order('position').range(from, from + page - 1)
      .then(function(res) {
        if (res.error) throw res.error;
        all = all.concat(res.data || []);
        if ((res.data || []).length < page) return all;
        from += page; return next();
      });
  }
  return next();
};
SupabaseAdapter.prototype.write = function(upserts, deletes) {
  var client = this.client, p = Promise.resolve();
  if (upserts.length) {
    var uid = (currentUser() || {}).id || null, now = new Date().toISOString();
    var rows = upserts.map(function(r){ return { collection: r.collection, id: r.id, position: r.position, data: r.data, updated_at: now, updated_by: uid }; });
    p = p.then(function(){ return client.from('records').upsert(rows, { onConflict: 'collection,id' }).then(function(res){ if (res.error) throw res.error; }); });
  }
  deletes.forEach(function(d) {
    p = p.then(function(){ return client.from('records').delete().eq('collection', d.collection).eq('id', d.id).then(function(res){ if (res.error) throw res.error; }); });
  });
  return p;
};
SupabaseAdapter.prototype.subscribe = function(cb) {
  var self = this;
  this.unsubscribe();
  this.channel = this.client.channel('records-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'records' }, function(payload) {
      if (payload.eventType === 'DELETE') {
        var o = payload.old || {};
        cb({ type: 'delete', collection: o.collection, id: o.id });
      } else {
        var n = payload.new || {};
        cb({ type: 'upsert', collection: n.collection, id: n.id, position: n.position, data: n.data });
      }
    })
    .subscribe(function(status) {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') console.warn('Realtime channel:', status);
    });
  return self.channel;
};
SupabaseAdapter.prototype.unsubscribe = function() {
  if (this.channel) { try { this.client.removeChannel(this.channel); } catch(e) {} this.channel = null; }
};

// ── Local (single browser) ────────────────────────────────────
var LOCAL_KEY = 'bradfield_crm_v3_rows';
function LocalAdapter() {}
LocalAdapter.prototype._read = function() { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch(e) { return []; } };
LocalAdapter.prototype._write = function(rows) { localStorage.setItem(LOCAL_KEY, JSON.stringify(rows)); };
LocalAdapter.prototype.load = function() { return Promise.resolve(this._read()); };
LocalAdapter.prototype.write = function(upserts, deletes) {
  var rows = this._read();
  var map = {}; rows.forEach(function(r){ map[r.collection + '|' + r.id] = r; });
  upserts.forEach(function(r){ map[r.collection + '|' + r.id] = { collection: r.collection, id: r.id, position: r.position, data: r.data }; });
  deletes.forEach(function(d){ delete map[d.collection + '|' + d.id]; });
  this._write(Object.keys(map).map(function(k){ return map[k]; }));
  return Promise.resolve();
};
LocalAdapter.prototype.subscribe = function(cb) {
  // Other tabs in the same browser
  window.addEventListener('storage', function(e) { if (e.key === LOCAL_KEY && !isModalOpen()) { store.adapter.load().then(function(rows){ applyRows(rows); scheduleRender(); }); } });
};
LocalAdapter.prototype.unsubscribe = function() {};
