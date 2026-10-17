// ============================================================
// SERVICE PROVIDERS DATA
// ============================================================
const PROVIDER_TYPE_LABELS = {
  legal:        'Legal',
  trustee:      'Trustee',
  hedge:        'Hedge Provider',
  rating:       'Rating Agency',
  account_bank: 'Account Bank / Paying Agent',
  auditor:      'Auditor / Verifier',
};

const PROVIDER_TYPE_COLORS = {
  legal:        '#1E3A5F',
  trustee:      '#3A5F1E',
  hedge:        '#5F3A1E',
  rating:       '#5F1E3A',
  account_bank: '#1E5F5A',
  auditor:      '#3A1E5F',
};

const PROVIDER_TIER_BADGE = { 'Tier 1': 'blue', 'Tier 2': 'stone' };

state.providerSearch      = '';
state.providerTypeFilter  = '';
state.providerTierFilter  = '';

PAGE_TITLES['providers'] = ['Service Providers', 'Transaction service provider directory'];

function renderProviders() {
  var f = SERVICE_PROVIDERS;
  if (state.providerSearch) {
    var q = state.providerSearch.toLowerCase();
    f = f.filter(function(p) {
      return p.name.toLowerCase().includes(q) ||
             p.specialisation.toLowerCase().includes(q) ||
             p.notes.toLowerCase().includes(q) ||
             p.contacts.toLowerCase().includes(q);
    });
  }
  if (state.providerTypeFilter) f = f.filter(function(p) { return p.typeKey === state.providerTypeFilter; });
  if (state.providerTierFilter) f = f.filter(function(p) { return p.tier === state.providerTierFilter; });

  // KPI strip
  var typeOptions = Object.entries(PROVIDER_TYPE_LABELS).map(function(e) {
    return '<option value="' + e[0] + '"' + (state.providerTypeFilter === e[0] ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');

  var kpis = '<div class="stat-grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:20px;">';
  Object.entries(PROVIDER_TYPE_LABELS).forEach(function(e) {
    var count = SERVICE_PROVIDERS.filter(function(p) { return p.typeKey === e[0]; }).length;
    kpis += '<div class="stat-card"><div class="s-label">' + e[1] + '</div><div class="s-value" style="font-size:24px;">' + count + '</div></div>';
  });
  kpis += '</div>';

  var toolbar = '<div class="toolbar">'
    + '<input type="text" placeholder="Search providers, specialisation, contacts..." value="' + escHtml(state.providerSearch) + '" oninput="state.providerSearch=this.value;renderView()" />'
    + '<select onchange="state.providerTypeFilter=this.value;renderView()">'
    + '<option value="">All provider types</option>'
    + typeOptions
    + '</select>'
    + '<select onchange="state.providerTierFilter=this.value;renderView()">'
    + '<option value="">All tiers</option>'
    + '<option value="Tier 1"' + (state.providerTierFilter === 'Tier 1' ? ' selected' : '') + '>Tier 1</option>'
    + '<option value="Tier 2"' + (state.providerTierFilter === 'Tier 2' ? ' selected' : '') + '>Tier 2</option>'
    + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">' + f.length + ' provider' + (f.length !== 1 ? 's' : '') + '</div>'
    + '<button class="btn primary" onclick="openProviderModal()">+ Add Provider</button>'
    + '<button class="btn" onclick="openProvidersSnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  if (f.length === 0) {
    return kpis + toolbar + '<div class="empty-state">No providers match your filters.</div>';
  }

  // Group by type for display
  var html = kpis + toolbar;

  var grouped = {};
  f.forEach(function(p) {
    if (!grouped[p.typeKey]) grouped[p.typeKey] = [];
    grouped[p.typeKey].push(p);
  });

  Object.entries(grouped).forEach(function(entry) {
    var typeKey = entry[0], providers = entry[1];
    var typeLabel = PROVIDER_TYPE_LABELS[typeKey] || typeKey;
    var typeColor = PROVIDER_TYPE_COLORS[typeKey] || '#333';

    html += '<div style="margin-bottom:6px;padding:10px 0 6px;">'
      + '<div style="display:flex;align-items:center;gap:8px;">'
      + '<div style="width:3px;height:16px;background:' + typeColor + ';border-radius:2px;"></div>'
      + '<div style="font-family:\'Spectral\',serif;font-size:13px;font-weight:400;color:#000;">' + typeLabel + '</div>'
      + '<span style="font-size:10px;color:var(--muted);background:var(--cream-d);padding:1px 7px;border-radius:8px;">' + providers.length + '</span>'
      + '</div></div>';

    providers.forEach(function(p) {
      var recentBadges = p.recentDeals.map(function(d) {
        return '<span class="badge gold">' + d + '</span>';
      }).join('');

      html += '<div class="card" style="overflow:hidden;padding:0;margin-bottom:10px;">'
        + '<div style="padding:16px 20px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">'
        + '<div style="flex:1;">'
        + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px;">'
        + '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;">' + p.name + '</div>'
        + '<span class="badge ' + (PROVIDER_TIER_BADGE[p.tier] || 'stone') + '">' + p.tier + '</span>'
        + '</div>'
        + '<div style="font-size:11px;color:var(--muted);">' + p.specialisation + '</div>'
        + '</div>'
        + '<div style="text-align:right;flex-shrink:0;margin-left:16px;">'
        + '<div style="font-size:10px;color:var(--muted);margin-bottom:3px;">Geography</div>'
        + '<div style="font-size:12px;color:var(--text-2);">' + p.geography + '</div>'
        + '<div class="last-updated" style="margin-top:6px;">Updated ' + p.lastUpdated + '</div>'
        + '</div>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">'
        + '<div><div class="f-label" style="margin-bottom:4px;">Key Contacts</div><div style="font-size:11.5px;color:var(--text-2);">' + p.contacts + '</div></div>'
        + '<div><div class="f-label" style="margin-bottom:4px;">Fees / Pricing</div><div style="font-size:11.5px;color:var(--text-2);">' + p.fees + '</div></div>'
        + '</div>'
        + '<div style="display:flex;justify-content:space-between;align-items:center;">'
        + '<div><div class="f-label" style="margin-bottom:4px;">Recent Deals</div><div class="tag-row">' + recentBadges + '</div></div>'
        + '<button class="btn sm" onclick="openProviderModal(\'' + p.id + '\')">Edit</button>'
        + '</div>'
        + '</div>'
        + '<div style="padding:9px 20px;background:var(--cream);border-top:1px solid var(--border);font-size:11.5px;color:var(--text-2);line-height:1.5;">'
        + '<span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Notes · </span>' + p.notes
        + '</div></div>';
    });
  });

  return html;
}

function openProviderModal(id) {
  var p = id ? SERVICE_PROVIDERS.find(function(x) { return x.id === id; }) : null;
  var isNew = !p;
  var typeOpts = Object.entries(PROVIDER_TYPE_LABELS).map(function(e) {
    return '<option value="' + e[0] + '"' + ((p && p.typeKey === e[0]) ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Firm Name</label><input class="form-input" id="pr-name" value="' + escHtml(p ? p.name : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Provider Type</label><select class="form-select" id="pr-typeKey"><option value="">Select type</option>' + typeOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Tier</label><select class="form-select" id="pr-tier"><option value="Tier 1"' + (p && p.tier === 'Tier 1' ? ' selected' : '') + '>Tier 1</option><option value="Tier 2"' + (p && p.tier === 'Tier 2' ? ' selected' : '') + '>Tier 2</option></select></div>'
    + '<div class="form-group"><label class="form-label">Geography</label><input class="form-input" id="pr-geography" value="' + escHtml(p ? p.geography : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Key Contacts</label><input class="form-input" id="pr-contacts" value="' + escHtml(p ? p.contacts : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Last Updated</label><input class="form-input" id="pr-updated" type="date" value="' + (p ? p.lastUpdated : '') + '" /></div>'
    + '<div class="form-group full"><label class="form-label">Specialisation</label><input class="form-input" id="pr-spec" value="' + escHtml(p ? p.specialisation : '') + '" /></div>'
    + '<div class="form-group full"><label class="form-label">Fees / Pricing</label><textarea class="form-textarea" id="pr-fees">' + escHtml(p ? p.fees : '') + '</textarea></div>'
    + '<div class="form-group full"><label class="form-label">Notes</label><textarea class="form-textarea" id="pr-notes">' + escHtml(p ? p.notes : '') + '</textarea></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Recent Deals</div>'
    + '<div class="form-group full">' + listEditorHTML('pr-recentDeals', p ? p.recentDeals : [], 'e.g. Deal name (year)') + '</div>'
    + '</div>';

  var footer = '<div>' + (!isNew ? '<button class="btn danger" onclick="deleteProvider(\'' + p.id + '\')">Delete</button>' : '') + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveProvider(\'' + (p ? p.id : '') + '\')">Save Provider</button>'
    + '</div>';

  openModal(isNew ? 'New Service Provider' : 'Edit \u2014 ' + p.name, body, footer);
}

function saveProvider(id) {
  var typeKey = mval('pr-typeKey');
  var record = {
    id: id || genId(),
    name: mval('pr-name'),
    shortName: mval('pr-name').split(' ')[0],
    type: PROVIDER_TYPE_LABELS[typeKey] || typeKey,
    typeKey: typeKey,
    tier: mval('pr-tier'),
    geography: mval('pr-geography'),
    contacts: mval('pr-contacts'),
    lastUpdated: mval('pr-updated'),
    specialisation: mval('pr-spec'),
    fees: mval('pr-fees'),
    notes: mval('pr-notes'),
    recentDeals: collectList('pr-recentDeals'),
  };
  if (!record.name) { alert('Firm name is required.'); return; }
  if (id) {
    SERVICE_PROVIDERS = SERVICE_PROVIDERS.map(function(p) { return p.id === id ? record : p; });
  } else {
    SERVICE_PROVIDERS.push(record);
  }
  saveState();
  closeModal();
  renderView();
}

function deleteProvider(id) {
  if (!confirm('Delete this provider? This cannot be undone.')) return;
  SERVICE_PROVIDERS = SERVICE_PROVIDERS.filter(function(p) { return p.id !== id; });
  saveState();
  closeModal();
  renderView();
}

