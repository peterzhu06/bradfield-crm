// ============================================================
// DOCUMENT LIBRARY — RENDER & CRUD
// ============================================================
function renderLibrary() {
  var f = DOC_LIBRARY;
  if (state.librarySearch) {
    var q = state.librarySearch.toLowerCase();
    f = f.filter(function(d) {
      return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.tags.some(function(t){return t.toLowerCase().includes(q);}) || d.author.toLowerCase().includes(q);
    });
  }
  if (state.libraryTypeFilter) f = f.filter(function(d){return d.type===state.libraryTypeFilter;});
  if (state.libraryDealFilter) f = f.filter(function(d){return d.dealId===state.libraryDealFilter;});

  var typeOpts = Object.entries(DOC_TYPE_LABELS).map(function(e){
    return '<option value="' + e[0] + '"' + (state.libraryTypeFilter===e[0]?' selected':'') + '>' + e[1] + '</option>';
  }).join('');
  var dealOpts = DEALS.map(function(d){
    return '<option value="' + d.id + '"' + (state.libraryDealFilter===d.id?' selected':'') + '>' + d.company + '</option>';
  }).join('');

  var kpis = '<div class="stat-grid" style="margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Total Documents</div><div class="s-value">' + DOC_LIBRARY.length + '</div></div>'
    + '<div class="stat-card"><div class="s-label">Templates</div><div class="s-value">' + DOC_LIBRARY.filter(function(d){return d.type==='template';}).length + '</div><div class="s-sub">Ready to use</div></div>'
    + '<div class="stat-card"><div class="s-label">Precedents</div><div class="s-value">' + DOC_LIBRARY.filter(function(d){return d.type==='precedent';}).length + '</div><div class="s-sub">Legal & structural</div></div>'
    + '<div class="stat-card"><div class="s-label">Research</div><div class="s-value">' + DOC_LIBRARY.filter(function(d){return d.type==='research';}).length + '</div><div class="s-sub">Market & sector analysis</div></div>'
    + '</div>';

  var toolbar = '<div class="toolbar">'
    + '<input type="text" placeholder="Search documents, tags, descriptions..." value="' + escHtml(state.librarySearch) + '" oninput="state.librarySearch=this.value;renderView()" />'
    + '<select onchange="state.libraryTypeFilter=this.value;renderView()"><option value="">All types</option>' + typeOpts + '</select>'
    + '<select onchange="state.libraryDealFilter=this.value;renderView()"><option value="">All deals</option>' + dealOpts + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">' + f.length + ' document' + (f.length!==1?'s':'') + '</div>'
    + '<button class="btn primary" onclick="openLibraryModal()">+ Add Document</button>'
    + '<button class="btn" onclick="openLibrarySnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  if (f.length === 0) return kpis + toolbar + '<div class="empty-state">No documents match your filters.</div>';

  var grouped = {};
  f.forEach(function(d) {
    var cat = d.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(d);
  });

  var html = kpis + toolbar;
  Object.entries(grouped).forEach(function(entry) {
    var cat = entry[0], docs = entry[1];
    var catLabel = DOC_CAT_LABELS[cat] || cat;
    html += '<div style="margin-bottom:6px;padding:10px 0 6px;">'
      + '<div style="display:flex;align-items:center;gap:8px;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:13px;font-weight:400;color:#000;">' + catLabel + '</div>'
      + '<span style="font-size:10px;color:var(--muted);background:var(--cream-d);padding:1px 7px;border-radius:8px;">' + docs.length + '</span>'
      + '</div></div>';

    docs.forEach(function(d) {
      var typeBadge = '<span class="badge ' + (DOC_TYPE_BADGE[d.type]||'stone') + '">' + (DOC_TYPE_LABELS[d.type]||d.type) + '</span>';
      var tagBadges = d.tags.map(function(t){return '<span class="badge stone" style="font-size:9px;">' + t + '</span>';}).join('');
      var linkedDeal = d.dealId ? DEALS.find(function(x){return x.id===d.dealId;}) : null;
      var fileIcon = DOC_FILETYPE_ICON[d.fileType] || DOC_FILETYPE_ICON.other;

      html += '<div class="card" style="margin-bottom:10px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;">'
        + '<div style="display:flex;gap:14px;flex:1;min-width:0;">'
        + '<div style="font-size:24px;flex-shrink:0;margin-top:2px;">' + fileIcon + '</div>'
        + '<div style="flex:1;">'
        + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">'
        + typeBadge
        + (linkedDeal ? '<span class="badge navy" style="font-size:9px;cursor:pointer;" onclick="navigate(\'pipeline\')">' + linkedDeal.company + '</span>' : '')
        + '</div>'
        + '<div style="font-family:\'Spectral\',serif;font-size:14.5px;color:#000;margin-bottom:4px;">' + d.title + '</div>'
        + '<div style="font-size:11.5px;color:var(--text-2);line-height:1.55;margin-bottom:8px;">' + d.description + '</div>'
        + '<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:8px;">'
        + '<div style="font-size:10.5px;color:var(--muted);">Author: <span style="color:var(--text-2);">' + (d.author||'—') + '</span></div>'
        + '<div style="font-size:10.5px;color:var(--muted);">Version: <span style="color:var(--text-2);">' + (d.version||'—') + '</span></div>'
        + '<div style="font-size:10.5px;color:var(--muted);">Date: <span style="color:var(--text-2);">' + (d.date||'—') + '</span></div>'
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
        + (d.location ? '<div style="font-size:10.5px;background:var(--cream-d);padding:3px 9px;border-radius:4px;color:var(--text-2);">📂 ' + d.location + '</div>' : '')
        + '</div>'
        + '<div class="tag-row" style="margin-top:8px;">' + tagBadges + '</div>'
        + '</div></div>'
        + '<button class="btn sm" style="flex-shrink:0;margin-left:12px;" onclick="openLibraryModal(\'' + d.id + '\')">Edit</button>'
        + '</div></div>';
    });
  });

  return html;
}

function openLibraryModal(id) {
  var d = id ? DOC_LIBRARY.find(function(x){return x.id===id;}) : null;
  var isNew = !d;
  var typeOpts = Object.entries(DOC_TYPE_LABELS).map(function(e){
    return '<option value="' + e[0] + '"' + (d&&d.type===e[0]?' selected':'') + '>' + e[1] + '</option>';
  }).join('');
  var catOpts = Object.entries(DOC_CAT_LABELS).map(function(e){
    return '<option value="' + e[0] + '"' + (d&&d.category===e[0]?' selected':'') + '>' + e[1] + '</option>';
  }).join('');
  var dealOpts = '<option value="">— Not linked to a deal —</option>' + DEALS.map(function(x){
    return '<option value="' + x.id + '"' + (d&&d.dealId===x.id?' selected':'') + '>' + x.company + ' — ' + x.dealType + '</option>';
  }).join('');
  var ftOpts = ['docx','pptx','pdf','xlsx','other'].map(function(ft){
    return '<option value="' + ft + '"' + (d&&d.fileType===ft?' selected':'') + '>' + ft.toUpperCase() + '</option>';
  }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group full"><label class="form-label">Document Title</label><input class="form-input" id="lib-title" value="' + escHtml(d?d.title:'') + '" placeholder="e.g. Warehouse Facility Term Sheet Template" /></div>'
    + '<div class="form-group"><label class="form-label">Document Type</label><select class="form-select" id="lib-type">' + typeOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Category</label><select class="form-select" id="lib-category">' + catOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">File Type</label><select class="form-select" id="lib-fileType">' + ftOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Version</label><input class="form-input" id="lib-version" value="' + escHtml(d?d.version:'') + '" placeholder="e.g. v1.0 or Final" /></div>'
    + '<div class="form-group"><label class="form-label">Author</label><input class="form-input" id="lib-author" value="' + escHtml(d?d.author:'') + '" placeholder="e.g. J. Harrington" /></div>'
    + '<div class="form-group"><label class="form-label">Date</label><input class="form-input" id="lib-date" type="date" value="' + (d?d.date:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Linked Deal</label><select class="form-select" id="lib-dealId">' + dealOpts + '</select></div>'
    + '<div class="form-group full"><label class="form-label">Description</label><textarea class="form-textarea" style="min-height:90px;" id="lib-description">' + escHtml(d?d.description:'') + '</textarea></div>'
    + '<div class="form-group full"><label class="form-label">Location (SharePoint / Drive path)</label><input class="form-input" id="lib-location" value="' + escHtml(d?d.location:'') + '" placeholder="e.g. SharePoint · Deal Templates · Warehouse" /></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Tags</div>'
    + '<div class="form-group full">' + listEditorHTML('lib-tags', d?d.tags:[], 'e.g. Term Sheet') + '</div>'
    + '</div>';

  var footer = '<div>' + (!isNew ? '<button class="btn danger" onclick="deleteLibraryDoc(\'' + d.id + '\')">Delete</button>' : '') + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveLibraryDoc(\'' + (d?d.id:'') + '\')">Save Document</button>'
    + '</div>';

  openModal(isNew ? 'Add Document' : 'Edit — ' + d.title, body, footer);
}

function saveLibraryDoc(id) {
  var record = {
    id: id || genId(),
    title: mval('lib-title'), type: mval('lib-type'), category: mval('lib-category'),
    fileType: mval('lib-fileType'), version: mval('lib-version'), author: mval('lib-author'),
    date: mval('lib-date'), dealId: mval('lib-dealId'), description: mval('lib-description'),
    location: mval('lib-location'), tags: collectList('lib-tags'),
  };
  if (!record.title) { alert('Title is required.'); return; }
  if (id) { DOC_LIBRARY = DOC_LIBRARY.map(function(d){return d.id===id?record:d;}); }
  else { DOC_LIBRARY.push(record); }
  saveState(); closeModal(); renderView();
}

function deleteLibraryDoc(id) {
  if (!confirm('Delete this document entry? This cannot be undone.')) return;
  DOC_LIBRARY = DOC_LIBRARY.filter(function(d){return d.id!==id;});
  saveState(); closeModal(); renderView();
}

