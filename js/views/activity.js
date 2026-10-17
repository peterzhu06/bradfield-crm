// ============================================================
// ACTIVITY LOG — RENDER & CRUD
// ============================================================
function renderActivity() {
  var f = ACTIVITY_LOG;
  if (state.activitySearch) {
    var q = state.activitySearch.toLowerCase();
    f = f.filter(function(a) {
      return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.attendees.toLowerCase().includes(q) || a.tags.some(function(t){return t.toLowerCase().includes(q);});
    });
  }
  if (state.activityTypeFilter) f = f.filter(function(a){return a.type===state.activityTypeFilter;});
  if (state.activityDealFilter) f = f.filter(function(a){return a.dealId===state.activityDealFilter;});

  f = f.slice().sort(function(a,b){return b.date.localeCompare(a.date);});

  var typeOpts = Object.entries(ACTIVITY_TYPE_LABELS).map(function(e){
    return '<option value="' + e[0] + '"' + (state.activityTypeFilter===e[0]?' selected':'') + '>' + e[1] + '</option>';
  }).join('');
  var dealOpts = DEALS.map(function(d){
    return '<option value="' + d.id + '"' + (state.activityDealFilter===d.id?' selected':'') + '>' + d.company + '</option>';
  }).join('');

  var kpis = '<div class="stat-grid" style="margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Total Interactions</div><div class="s-value">' + ACTIVITY_LOG.length + '</div></div>'
    + '<div class="stat-card"><div class="s-label">Meetings</div><div class="s-value">' + ACTIVITY_LOG.filter(function(a){return a.type==='meeting';}).length + '</div></div>'
    + '<div class="stat-card"><div class="s-label">Calls</div><div class="s-value">' + ACTIVITY_LOG.filter(function(a){return a.type==='call';}).length + '</div></div>'
    + '<div class="stat-card"><div class="s-label">This Month</div><div class="s-value">' + ACTIVITY_LOG.filter(function(a){return a.date&&a.date.startsWith(new Date().toISOString().slice(0,7));}).length + '</div></div>'
    + '</div>';

  var toolbar = '<div class="toolbar">'
    + '<input type="text" placeholder="Search meetings, notes, attendees..." value="' + escHtml(state.activitySearch) + '" oninput="state.activitySearch=this.value;renderView()" />'
    + '<select onchange="state.activityTypeFilter=this.value;renderView()"><option value="">All types</option>' + typeOpts + '</select>'
    + '<select onchange="state.activityDealFilter=this.value;renderView()"><option value="">All deals</option>' + dealOpts + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">' + f.length + ' entr' + (f.length!==1?'ies':'y') + '</div>'
    + '<button class="btn primary" onclick="openActivityModal()">+ Log Activity</button>'
    + '<button class="btn" onclick="openActivitySnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  if (f.length === 0) return kpis + toolbar + '<div class="empty-state">No activity entries match your filters.</div>';

  var entries = f.map(function(a) {
    var typeBadge = '<span class="badge ' + (ACTIVITY_TYPE_BADGE[a.type]||'stone') + '">' + (ACTIVITY_TYPE_ICON[a.type]||'') + ' ' + (ACTIVITY_TYPE_LABELS[a.type]||a.type) + '</span>';
    var tagBadges = a.tags.map(function(t){return '<span class="badge stone" style="font-size:9px;">' + t + '</span>';}).join('');
    var linkedDeal = a.dealId ? DEALS.find(function(d){return d.id===a.dealId;}) : null;
    var actionDots = a.actionItems && a.actionItems.length ? a.actionItems.map(function(item) {
      return '<div style="display:flex;align-items:flex-start;gap:7px;margin-bottom:4px;">'
        + '<div style="width:5px;height:5px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:5px;"></div>'
        + '<div style="font-size:11.5px;color:var(--text-2);line-height:1.5;">' + item + '</div></div>';
    }).join('') : '';

    return '<div class="card" style="margin-bottom:14px;">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">'
      + '<div style="flex:1;">'
      + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">'
      + typeBadge
      + (linkedDeal ? '<span class="badge navy" style="font-size:9px;cursor:pointer;" onclick="navigate(\'pipeline\')">' + linkedDeal.company + '</span>' : '')
      + '</div>'
      + '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;margin-bottom:3px;">' + a.title + '</div>'
      + '<div style="font-size:11px;color:var(--muted);">' + a.date + ' · ' + a.attendees + '</div>'
      + '</div>'
      + '<div style="display:flex;gap:6px;align-items:flex-start;flex-shrink:0;margin-left:16px;">'
      + '<div style="font-size:10.5px;color:var(--muted);padding-top:2px;">Owner: ' + (a.owner||'—') + '</div>'
      + '<button class="btn sm" onclick="openActivityModal(\'' + a.id + '\')">Edit</button>'
      + '</div></div>'
      + '<div style="font-size:12px;color:var(--text-2);line-height:1.6;margin-bottom:' + (actionDots?'12px':'8px') + ';">' + a.summary + '</div>'
      + (actionDots ? '<div style="background:var(--cream);border-radius:5px;padding:10px 12px;margin-bottom:8px;"><div style="font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);font-weight:500;margin-bottom:7px;">Action Items</div>' + actionDots + '</div>' : '')
      + '<div class="tag-row">' + tagBadges + '</div>'
      + '</div>';
  }).join('');

  return kpis + toolbar + entries;
}

function openActivityModal(id) {
  var a = id ? ACTIVITY_LOG.find(function(x){return x.id===id;}) : null;
  var isNew = !a;
  var typeOpts = Object.entries(ACTIVITY_TYPE_LABELS).map(function(e){
    return '<option value="' + e[0] + '"' + (a&&a.type===e[0]?' selected':'') + '>' + e[1] + '</option>';
  }).join('');
  var dealOpts = '<option value="">— Not linked to a deal —</option>' + DEALS.map(function(d){
    return '<option value="' + d.id + '"' + (a&&a.dealId===d.id?' selected':'') + '>' + d.company + ' — ' + d.dealType + '</option>';
  }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group full"><label class="form-label">Title / Subject</label><input class="form-input" id="ac-title" value="' + escHtml(a?a.title:'') + '" placeholder="e.g. Metrics Credit — deal update call" /></div>'
    + '<div class="form-group"><label class="form-label">Type</label><select class="form-select" id="ac-type">' + typeOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Date</label><input class="form-input" id="ac-date" type="date" value="' + (a?a.date:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Linked Deal</label><select class="form-select" id="ac-dealId">' + dealOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Owner</label><input class="form-input" id="ac-owner" value="' + escHtml(a?a.owner:'') + '" placeholder="e.g. J. Harrington" /></div>'
    + '<div class="form-group full"><label class="form-label">Attendees</label><input class="form-input" id="ac-attendees" value="' + escHtml(a?a.attendees:'') + '" placeholder="e.g. J. Harrington, P. Singh / Counterparty Name" /></div>'
    + '<div class="form-group full"><label class="form-label">Summary / Notes</label><textarea class="form-textarea" style="min-height:110px;" id="ac-summary">' + escHtml(a?a.summary:'') + '</textarea></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Action Items</div>'
    + '<div class="form-group full">' + listEditorHTML('ac-actionItems', a?a.actionItems:[], 'e.g. Send updated IM to lender by Friday') + '</div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Tags</div>'
    + '<div class="form-group full">' + listEditorHTML('ac-tags', a?a.tags:[], 'e.g. Credit Approval') + '</div>'
    + '</div>';

  var footer = '<div>' + (!isNew ? '<button class="btn danger" onclick="deleteActivity(\'' + a.id + '\')">Delete</button>' : '') + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveActivity(\'' + (a?a.id:'') + '\')">Save Entry</button>'
    + '</div>';

  openModal(isNew ? 'Log Activity' : 'Edit — ' + a.title, body, footer);
}

function saveActivity(id) {
  var record = {
    id: id || genId(),
    title: mval('ac-title'), type: mval('ac-type'), date: mval('ac-date'),
    dealId: mval('ac-dealId'), owner: mval('ac-owner'), attendees: mval('ac-attendees'),
    summary: mval('ac-summary'),
    actionItems: collectList('ac-actionItems'),
    contactIds: [],
    tags: collectList('ac-tags'),
  };
  if (!record.title) { alert('Title is required.'); return; }
  if (id) { ACTIVITY_LOG = ACTIVITY_LOG.map(function(a){return a.id===id?record:a;}); }
  else { ACTIVITY_LOG.push(record); }
  saveState(); closeModal(); renderView();
}

function deleteActivity(id) {
  if (!confirm('Delete this entry? This cannot be undone.')) return;
  ACTIVITY_LOG = ACTIVITY_LOG.filter(function(a){return a.id!==id;});
  saveState(); closeModal(); renderView();
}

