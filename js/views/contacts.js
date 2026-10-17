// ============================================================
// CONTACTS — RENDER & CRUD
// ============================================================
function renderContacts() {
  var f = CONTACTS;
  if (state.contactSearch) {
    var q = state.contactSearch.toLowerCase();
    f = f.filter(function(c) {
      return c.name.toLowerCase().includes(q) || c.firm.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q) || c.tags.some(function(t) { return t.toLowerCase().includes(q); });
    });
  }
  if (state.contactFirmFilter) f = f.filter(function(c) { return c.firm === state.contactFirmFilter; });
  if (state.contactRoleFilter) f = f.filter(function(c) { return c.type === state.contactRoleFilter; });

  var firms = Array.from(new Set(CONTACTS.map(function(c) { return c.firm; }))).sort();
  var firmOpts = firms.map(function(fm) { return '<option value="' + escHtml(fm) + '"' + (state.contactFirmFilter === fm ? ' selected' : '') + '>' + escHtml(fm) + '</option>'; }).join('');
  var typeOpts = Object.entries(CONTACT_TYPE_LABELS).map(function(e) { return '<option value="' + e[0] + '"' + (state.contactRoleFilter === e[0] ? ' selected' : '') + '>' + e[1] + '</option>'; }).join('');

  var kpis = '<div class="stat-grid" style="margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Total Contacts</div><div class="s-value">' + CONTACTS.length + '</div><div class="s-sub">Across all categories</div></div>'
    + '<div class="stat-card"><div class="s-label">Lenders / Financiers</div><div class="s-value">' + CONTACTS.filter(function(c){return c.type==='lender';}).length + '</div></div>'
    + '<div class="stat-card"><div class="s-label">Advisors</div><div class="s-value">' + CONTACTS.filter(function(c){return c.type==='advisor';}).length + '</div></div>'
    + '<div class="stat-card"><div class="s-label">Clients / Prospects</div><div class="s-value">' + CONTACTS.filter(function(c){return c.type==='client';}).length + '</div></div>'
    + '</div>';

  var toolbar = '<div class="toolbar">'
    + '<input type="text" placeholder="Search contacts, firm, role, notes..." value="' + escHtml(state.contactSearch) + '" oninput="state.contactSearch=this.value;renderView()" />'
    + '<select onchange="state.contactFirmFilter=this.value;renderView()"><option value="">All firms</option>' + firmOpts + '</select>'
    + '<select onchange="state.contactRoleFilter=this.value;renderView()"><option value="">All types</option>' + typeOpts + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">' + f.length + ' contact' + (f.length!==1?'s':'') + '</div>'
    + '<button class="btn primary" onclick="openContactModal()">+ Add Contact</button>'
    + '<button class="btn" onclick="openContactsSnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  if (f.length === 0) return kpis + toolbar + '<div class="empty-state">No contacts match your filters.</div>';

  var cards = f.map(function(c) {
    var typeBadge = '<span class="badge ' + (CONTACT_TYPE_BADGE[c.type]||'stone') + '">' + (CONTACT_TYPE_LABELS[c.type]||c.type) + '</span>';
    var tagBadges = c.tags.map(function(t) { return '<span class="badge stone" style="font-size:9px;">' + t + '</span>'; }).join('');
    var linkedDeals = c.dealIds.map(function(did) {
      var d = DEALS.find(function(x){return x.id===did;});
      return d ? '<span class="badge navy" style="font-size:9px;cursor:pointer;" onclick="navigate(\'pipeline\')">' + d.company + '</span>' : '';
    }).join('');
    var initials = c.name.split(' ').map(function(w){return w[0];}).slice(0,2).join('');

    return '<div class="card" style="display:flex;gap:18px;align-items:flex-start;">'
      + '<div style="width:42px;height:42px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;font-family:DM Sans,sans-serif;flex-shrink:0;letter-spacing:0.03em;">' + initials + '</div>'
      + '<div style="flex:1;min-width:0;">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;">'
      + '<div>'
      + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;">' + c.name + '</div>'
      + typeBadge + '</div>'
      + '<div style="font-size:12px;color:var(--muted);margin-top:2px;">' + c.role + ' · ' + c.firm + '</div>'
      + '</div>'
      + '<div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">'
      + '<div style="font-size:10.5px;color:var(--muted);">Last contact: ' + (c.lastContacted||'—') + '</div>'
      + '<button class="btn sm" onclick="openContactModal(\'' + c.id + '\')">Edit</button>'
      + '</div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin-bottom:10px;">'
      + (c.email ? '<div><div class="f-label" style="margin-bottom:2px;">Email</div><div style="font-size:11.5px;color:var(--text-2);">' + c.email + '</div></div>' : '')
      + (c.phone ? '<div><div class="f-label" style="margin-bottom:2px;">Phone</div><div style="font-size:11.5px;color:var(--text-2);">' + c.phone + '</div></div>' : '')
      + '<div><div class="f-label" style="margin-bottom:2px;">Relationship Owner</div><div style="font-size:11.5px;color:var(--text-2);">' + (c.owner||'—') + '</div></div>'
      + '</div>'
      + (c.notes ? '<div style="background:var(--cream);border-radius:5px;padding:8px 12px;font-size:11.5px;color:var(--text-2);line-height:1.5;margin-bottom:8px;"><span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Notes · </span>' + c.notes + '</div>' : '')
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">'
      + (linkedDeals ? '<div class="tag-row">' + linkedDeals + '</div>' : '')
      + '<div class="tag-row">' + tagBadges + '</div>'
      + '</div>'
      + '</div></div>';
  }).join('');

  return kpis + toolbar + cards;
}

function openContactModal(id) {
  var c = id ? CONTACTS.find(function(x){return x.id===id;}) : null;
  var isNew = !c;
  var typeOpts = Object.entries(CONTACT_TYPE_LABELS).map(function(e) {
    return '<option value="' + e[0] + '"' + (c && c.type===e[0] ? ' selected' : '') + '>' + e[1] + '</option>';
  }).join('');
  var dealOpts = DEALS.map(function(d) {
    var sel = c && c.dealIds && c.dealIds.includes(d.id) ? ' selected' : '';
    return '<option value="' + d.id + '"' + sel + '>' + d.company + ' — ' + d.dealType + '</option>';
  }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="ct-name" value="' + escHtml(c?c.name:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Firm / Organisation</label><input class="form-input" id="ct-firm" value="' + escHtml(c?c.firm:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Role / Title</label><input class="form-input" id="ct-role" value="' + escHtml(c?c.role:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Contact Type</label><select class="form-select" id="ct-type">' + typeOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Email</label><input class="form-input" id="ct-email" type="email" value="' + escHtml(c?c.email:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="ct-phone" value="' + escHtml(c?c.phone:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Relationship Owner</label><input class="form-input" id="ct-owner" value="' + escHtml(c?c.owner:'') + '" placeholder="e.g. J. Harrington" /></div>'
    + '<div class="form-group"><label class="form-label">Last Contacted</label><input class="form-input" id="ct-lastContacted" type="date" value="' + (c?c.lastContacted:'') + '" /></div>'
    + '<div class="form-group full"><label class="form-label">Notes</label><textarea class="form-textarea" id="ct-notes">' + escHtml(c?c.notes:'') + '</textarea></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Linked Deals</div>'
    + '<div class="form-group full"><select class="form-select" id="ct-dealIds" multiple style="min-height:90px;">' + dealOpts + '</select><div style="font-size:10.5px;color:var(--muted);margin-top:4px;">Hold Ctrl / Cmd to select multiple deals</div></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Tags</div>'
    + '<div class="form-group full">' + listEditorHTML('ct-tags', c?c.tags:[], 'e.g. Key Relationship') + '</div>'
    + '</div>';

  var footer = '<div>' + (!isNew ? '<button class="btn danger" onclick="deleteContact(\'' + c.id + '\')">Delete</button>' : '') + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveContact(\'' + (c?c.id:'') + '\')">Save Contact</button>'
    + '</div>';

  openModal(isNew ? 'New Contact' : 'Edit — ' + c.name, body, footer);
}

function saveContact(id) {
  var sel = document.getElementById('ct-dealIds');
  var dealIds = sel ? Array.from(sel.selectedOptions).map(function(o){return o.value;}) : [];
  var record = {
    id: id || genId(),
    name: mval('ct-name'), firm: mval('ct-firm'), role: mval('ct-role'),
    type: mval('ct-type'), email: mval('ct-email'), phone: mval('ct-phone'),
    owner: mval('ct-owner'), lastContacted: mval('ct-lastContacted'),
    notes: mval('ct-notes'), dealIds: dealIds,
    tags: collectList('ct-tags'),
  };
  if (!record.name) { alert('Name is required.'); return; }
  if (id) { CONTACTS = CONTACTS.map(function(c){return c.id===id?record:c;}); }
  else { CONTACTS.push(record); }
  saveState(); closeModal(); renderView();
}

function deleteContact(id) {
  if (!confirm('Delete this contact? This cannot be undone.')) return;
  CONTACTS = CONTACTS.filter(function(c){return c.id!==id;});
  saveState(); closeModal(); renderView();
}

