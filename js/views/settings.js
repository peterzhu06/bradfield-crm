// ============================================================
// SETTINGS PAGE
// ============================================================
function renderSettings() {
  var sectorMeta = {
    agri:       { label:'Agriculture',           color:'#3a6b4a' },
    fig:        { label:'Financial Institutions', color:'#1e4a6e' },
    realestate: { label:'Real Estate',           color:'#6b4a2a' },
  };

  var html = '<div style="max-width:780px;">';
  html += renderSettingsAccountCard() + renderSettingsDataCard();
  html += '<div style="margin:28px 0 16px;">'
    + '<div style="font-family:\'Spectral\',serif;font-size:18px;color:#000;margin-bottom:4px;">Industry Sub-Types</div>'
    + '<div style="font-size:12px;color:var(--muted);">Edit the sub-type categories for each sector. These drive the filter pills on the Client Targets page. Changes save automatically.</div>'
    + '</div>';

  Object.entries(sectorMeta).forEach(function(entry) {
    var key = entry[0], meta = entry[1];
    var types = (SF_SUBTYPES[key] || []).filter(function(s){ return s !== 'All Types'; });

    html += '<div class="card" style="margin-bottom:16px;padding:20px 24px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">';
    html += '<div style="display:flex;align-items:center;gap:10px;">';
    html += '<div style="width:10px;height:10px;border-radius:50%;background:' + meta.color + ';flex-shrink:0;"></div>';
    html += '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;">' + meta.label + '</div>';
    html += '<div style="font-size:11px;color:var(--muted);">' + types.length + ' sub-type' + (types.length!==1?'s':'') + '</div>';
    html += '</div>';
    html += '<button class="btn sm" onclick="addSettingsSubType(\'' + key + '\')">+ Add</button>';
    html += '</div>';

    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;min-height:36px;">';
    if (types.length === 0) {
      html += '<div style="font-size:11.5px;color:var(--muted);padding:6px 0;">No sub-types yet — click + Add to create one.</div>';
    } else {
      types.forEach(function(t, i) {
        html += '<div style="display:inline-flex;align-items:center;gap:5px;background:var(--cream);border:1px solid var(--border);border-radius:20px;padding:4px 10px 4px 12px;">';
        html += '<span style="font-size:11.5px;color:var(--text-2);">' + escHtml(t) + '</span>';
        html += '<button onclick="editSettingsSubType(\'' + key + '\',' + i + ')" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:11px;padding:0 2px;" title="Edit">✎</button>';
        html += '<button onclick="deleteSettingsSubType(\'' + key + '\',' + i + ')" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;line-height:1;padding:0 2px;" title="Remove">×</button>';
        html += '</div>';
      });
    }
    html += '</div></div>';
  });

  html += '</div>';
  return html;
}

function addSettingsSubType(sector) {
  var name = prompt('New sub-type name:');
  if (!name || !name.trim()) return;
  name = name.trim();
  if (!SF_SUBTYPES[sector]) SF_SUBTYPES[sector] = ['All Types'];
  if (!SF_SUBTYPES[sector].includes(name)) {
    SF_SUBTYPES[sector].push(name);
    saveState(); renderView();
  }
}

function editSettingsSubType(sector, index) {
  var types = SF_SUBTYPES[sector].filter(function(s){ return s !== 'All Types'; });
  var current = types[index];
  var name = prompt('Edit sub-type:', current);
  if (!name || !name.trim() || name.trim() === current) return;
  name = name.trim();
  var fullIdx = SF_SUBTYPES[sector].indexOf(current);
  if (fullIdx >= 0) SF_SUBTYPES[sector][fullIdx] = name;
  CLIENT_TARGETS = CLIENT_TARGETS.map(function(t){
    return t.subType === current ? Object.assign({}, t, { subType: name }) : t;
  });
  saveState(); renderView();
}

function deleteSettingsSubType(sector, index) {
  var types = SF_SUBTYPES[sector].filter(function(s){ return s !== 'All Types'; });
  var name = types[index];
  if (!confirm('Remove "' + name + '"? Targets with this sub-type will become unclassified.')) return;
  SF_SUBTYPES[sector] = SF_SUBTYPES[sector].filter(function(s){ return s !== name; });
  saveState(); renderView();
}

function openEditTypesModal(sector) {
  var sectorName = { agri:'Agriculture', fig:'Financial Institutions', realestate:'Real Estate' }[sector] || sector;
  var types = (SF_SUBTYPES[sector] || []).filter(function(s){ return s !== 'All Types'; });

  function buildRows() {
    return types.map(function(t, i) {
      return '<div class="list-editor-item" style="gap:8px;margin-bottom:6px;">'
        + '<input class="form-input le-input" id="etype-' + i + '" value="' + escHtml(t) + '" style="flex:1;" />'
        + '<button class="remove-btn" onclick="this.closest(\'.list-editor-item\').remove()">×</button>'
        + '</div>';
    }).join('');
  }

  var body = '<div style="margin-bottom:10px;font-size:11.5px;color:var(--text-2);">Add, rename or remove sub-types for <strong>' + sectorName + '</strong>. Renaming a type will update all targets assigned to it.</div>'
    + '<div id="etype-rows">' + buildRows() + '</div>'
    + '<button class="add-item-btn" style="margin-top:8px;" onclick="addETypeRow()">+ Add sub-type</button>';

  var footer = '<div></div><div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveEditedTypes(\'' + sector + '\')">Save</button>'
    + '</div>';

  openModal('Edit Sub-Types — ' + sectorName, body, footer);
}

function addETypeRow() {
  var container = document.getElementById('etype-rows');
  var div = document.createElement('div');
  div.className = 'list-editor-item';
  div.style.cssText = 'gap:8px;margin-bottom:6px;';
  var i = 'new' + Date.now();
  div.innerHTML = '<input class="form-input le-input" id="etype-' + i + '" placeholder="New sub-type" style="flex:1;" />'
    + '<button class="remove-btn" onclick="this.closest(\'.list-editor-item\').remove()">×</button>';
  container.appendChild(div);
  div.querySelector('input').focus();
}

function saveEditedTypes(sector) {
  var oldTypes = (SF_SUBTYPES[sector] || []).filter(function(s){ return s !== 'All Types'; });
  var inputs   = document.querySelectorAll('#etype-rows .le-input');
  var newTypes = [];
  inputs.forEach(function(inp) {
    var v = inp.value.trim();
    if (v) newTypes.push(v);
  });

  // Remap targets: if old type at same position got renamed, update targets
  oldTypes.forEach(function(oldName, i) {
    var newName = newTypes[i];
    if (newName && newName !== oldName) {
      CLIENT_TARGETS = CLIENT_TARGETS.map(function(t) {
        return (t.sector === sector && t.subType === oldName) ? Object.assign({}, t, { subType: newName }) : t;
      });
    }
  });

  SF_SUBTYPES[sector] = ['All Types'].concat(newTypes);
  state.targetSubType = '';
  saveState(); closeModal(); renderView();
}


// ── Account card ──────────────────────────────────────────────
function renderSettingsAccountCard() {
  var shared = store.mode === 'supabase';
  var email  = shared && auth.user ? escHtml(auth.user.email || '') : '';
  var html = '<div style="margin-bottom:16px;">'
    + '<div style="font-family:\'Spectral\',serif;font-size:18px;color:#000;margin-bottom:4px;">Account</div>'
    + '<div style="font-size:12px;color:var(--muted);">' + (shared ? 'Signed in to the shared Bradfield database.' : 'Running in local mode — data is stored in this browser only.') + '</div>'
    + '</div>';
  html += '<div class="card" style="padding:18px 22px;margin-bottom:16px;">';
  if (shared) {
    html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">'
      + '<div><div class="f-label">Signed in as</div><div style="font-size:13.5px;color:#000;margin-top:2px;">' + email + '</div></div>'
      + '<div style="display:flex;gap:8px;"><button class="btn" onclick="openChangePasswordModal()">Change password</button><button class="btn danger" onclick="signOut()">Sign out</button></div>'
      + '</div>';
  } else {
    html += '<div style="font-size:12.5px;color:var(--text-2);line-height:1.6;">To share data across the team, create a Supabase project, run <code>supabase/schema.sql</code>, and enter the project URL and anon key in <code>js/config.js</code>. See <strong>README.md</strong> for the full setup.</div>';
  }
  html += '</div>';
  return html;
}

// ── Data tools card ───────────────────────────────────────────
function renderSettingsDataCard() {
  var counts = Object.keys(COLLECTIONS).map(function(c){ return { name: c.replace(/_/g,' ').toLowerCase(), n: (COLLECTIONS[c].get()||[]).length }; });
  var total  = counts.reduce(function(s,c){ return s + c.n; }, 0);
  var last   = store.lastSyncAt ? store.lastSyncAt.toLocaleString('en-AU', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';
  var html = '<div style="margin:24px 0 16px;">'
    + '<div style="font-family:\'Spectral\',serif;font-size:18px;color:#000;margin-bottom:4px;">Data</div>'
    + '<div style="font-size:12px;color:var(--muted);">Backups, migration and reset. Exports are plain JSON and re-importable.</div>'
    + '</div>';
  html += '<div class="card" style="padding:18px 22px;margin-bottom:16px;">'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;">'
    + '<div><div class="f-label">Records</div><div style="font-family:\'Spectral\',serif;font-size:22px;">' + total + '</div></div>'
    + '<div><div class="f-label">Storage</div><div style="font-size:13px;margin-top:4px;">' + (store.mode === 'supabase' ? 'Shared database' : 'This browser') + '</div></div>'
    + '<div><div class="f-label">Last sync</div><div style="font-size:13px;margin-top:4px;">' + last + '</div></div>'
    + '</div>'
    + '<div style="font-size:11px;color:var(--muted);margin-bottom:12px;">' + counts.filter(function(c){ return c.n; }).map(function(c){ return c.n + ' ' + c.name; }).join(' · ') + '</div>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap;">'
    + '<button class="btn" onclick="exportData()">Export backup (JSON)</button>'
    + '<button class="btn" onclick="importData()">Import JSON</button>'
    + '<button class="btn danger" onclick="resetToDefaults()">Reset to sample dataset</button>'
    + '</div>'
    + '</div>';
  return html;
}
