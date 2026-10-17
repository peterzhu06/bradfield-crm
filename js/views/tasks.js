// ============================================================
// TASKS — RENDER & CRUD
// ============================================================
function renderTasks() {
  var today = new Date().toISOString().slice(0,10);
  var f = TASKS.slice();
  if (state.taskSearch)         { var q=state.taskSearch.toLowerCase(); f=f.filter(function(t){ return t.title.toLowerCase().includes(q) || (t.notes||'').toLowerCase().includes(q) || t.owner.toLowerCase().includes(q); }); }
  if (state.taskStatusFilter)   { f=f.filter(function(t){ return t.status===state.taskStatusFilter; }); }
  if (state.taskPriorityFilter) { f=f.filter(function(t){ return t.priority===state.taskPriorityFilter; }); }
  if (state.taskOwnerFilter)    { f=f.filter(function(t){ return t.owner===state.taskOwnerFilter; }); }

  var open    = TASKS.filter(function(t){ return t.status==='open'; }).length;
  var review  = TASKS.filter(function(t){ return t.status==='review'; }).length;
  var overdue = TASKS.filter(function(t){ return t.status==='open' && t.dueDate && t.dueDate < today; }).length;
  var doneAll = TASKS.filter(function(t){ return t.status==='done'; }).length;
  var highOpen= TASKS.filter(function(t){ return t.status==='open' && t.priority==='High'; }).length;

  var owners = Array.from(new Set(TASKS.map(function(t){ return t.owner; }).filter(Boolean))).sort();
  var ownerOpts = owners.map(function(o){ return '<option value="' + escHtml(o) + '"'+ (state.taskOwnerFilter===o?' selected':'') + '>' + escHtml(o) + '</option>'; }).join('');

  var kpis = '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Open Tasks</div><div class="s-value">' + open + '</div><div class="s-sub">Across all deals</div></div>'
    + '<div class="stat-card"><div class="s-label">Awaiting Review</div><div class="s-value" style="color:' + (review>0?'var(--amber)':'#000') + '">' + review + '</div><div class="s-sub">Pending senior sign-off</div></div>'
    + '<div class="stat-card"><div class="s-label">Overdue</div><div class="s-value" style="color:' + (overdue>0?'var(--red)':'#000') + '">' + overdue + '</div><div class="s-sub">Past due date</div></div>'
    + '<div class="stat-card"><div class="s-label">Completed</div><div class="s-value">' + doneAll + '</div><div class="s-sub">Closed out</div></div>'
    + '</div>';

  var toolbar = '<div class="toolbar" style="margin-bottom:16px;">'
    + '<input type="text" placeholder="Search tasks..." value="' + escHtml(state.taskSearch) + '" oninput="state.taskSearch=this.value;renderView()" />'
    + '<select onchange="state.taskStatusFilter=this.value;renderView()"><option value="">All statuses</option><option value="open"' + (state.taskStatusFilter==='open'?' selected':'') + '>Open</option><option value="review"' + (state.taskStatusFilter==='review'?' selected':'') + '>Awaiting Review</option><option value="done"' + (state.taskStatusFilter==='done'?' selected':'') + '>Done</option></select>'
    + '<select onchange="state.taskPriorityFilter=this.value;renderView()"><option value="">All priorities</option><option value="High"' + (state.taskPriorityFilter==='High'?' selected':'') + '>High</option><option value="Medium"' + (state.taskPriorityFilter==='Medium'?' selected':'') + '>Medium</option><option value="Low"' + (state.taskPriorityFilter==='Low'?' selected':'') + '>Low</option></select>'
    + '<select onchange="state.taskOwnerFilter=this.value;renderView()"><option value="">All owners</option>' + ownerOpts + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">' + f.length + ' task' + (f.length!==1?'s':'') + '</div>'
    + '<div class="view-toggle">'
    + '<button class="vt-btn ' + (state.taskViewMode==='list'?'active':'') + '" onclick="state.taskViewMode=\'list\';renderView()">List</button>'
    + '<button class="vt-btn ' + (state.taskViewMode==='byPerson'?'active':'') + '" onclick="state.taskViewMode=\'byPerson\';renderView()">By Person</button>'
    + '</div>'
    + '<button class="btn primary" onclick="openTaskModal()">+ New Task</button>'
    + '<button class="btn" onclick="openTasksSnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  function taskCard(t) {
    var linkedDeal = t.dealId ? DEALS.find(function(d){ return d.id===t.dealId; }) : null;
    var isOverdue  = t.status==='open' && t.dueDate && t.dueDate < today;
    var pb  = TASK_PRIORITY_BADGE[t.priority] || 'stone';
    var done     = t.status === 'done';
    var inReview = t.status === 'review';
    var checkBtn = '<button onclick="toggleTaskDone(\'' + t.id + '\')" style="margin-top:2px;width:18px;height:18px;border-radius:4px;border:2px solid ' + (done?'#3a6b4a':inReview?'#8b7a2a':'var(--border)') + ';background:' + (done?'#3a6b4a':inReview?'#fffbeb':'var(--white)') + ';flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.13s;" title="' + (done?'Mark open':'Mark done') + '">' + (done ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>' : '') + (inReview ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8b7a2a" stroke-width="3"><circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' : '') + '</button>';
    var reviewBtn = (t.status === 'open') ? '<button onclick="toggleTaskReview(\'' + t.id + '\')" class="btn sm" style="font-size:10px;padding:3px 8px;background:var(--cream);color:#8b7a2a;border:1px solid #d4b98a;">Review →</button>' : (inReview ? '<button onclick="toggleTaskReview(\'' + t.id + '\')" class="btn sm" style="font-size:10px;padding:3px 8px;background:#fffbeb;color:#8b7a2a;border:1px solid #d4b98a;">← Return</button>' : '');
    return '<div class="card" style="padding:14px 18px;margin-bottom:10px;display:flex;align-items:flex-start;gap:14px;' + (done?'opacity:0.55;':inReview?'border-left:3px solid #c9a84c;':'') + '">' + checkBtn
      + '<div style="flex:1;min-width:0;"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;"><div style="flex:1;">'
      + '<div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:3px;"><span class="badge ' + pb + '">' + t.priority + '</span>' + (inReview ? '<span class="badge amber" style="font-size:9px;">Awaiting Review</span>' : '') + (linkedDeal ? '<span class="badge navy" style="font-size:9px;cursor:pointer;" onclick="navigate(\'pipeline\')">' + linkedDeal.company + '</span>' : '') + '</div>'
      + '<div style="font-size:13px;font-weight:500;color:#000;' + (done?'text-decoration:line-through;':'')+'">' + escHtml(t.title) + '</div>'
      + (t.notes ? '<div style="font-size:11.5px;color:var(--text-2);margin-top:3px;">' + escHtml(t.notes) + '</div>' : '')
      + '</div><div style="flex-shrink:0;text-align:right;"><div style="font-size:11px;color:' + (isOverdue?'var(--red)':'var(--muted)') + ';margin-bottom:4px;">' + (isOverdue?'⚠ ':'') + (t.dueDate||'No date') + '</div><div style="font-size:10.5px;color:var(--muted);">' + (t.owner||'—') + '</div></div></div></div>'
      + '<div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end;">' + reviewBtn + '<button class="btn sm" onclick="openTaskModal(\'' + t.id + '\')">Edit</button></div></div>';
  }

  if (state.taskViewMode === 'byPerson') {
    var personMap = {};
    f.forEach(function(t) {
      var names = (t.owner || 'Unassigned').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
      if (!names.length) names = ['Unassigned'];
      names.forEach(function(name) {
        if (!personMap[name]) personMap[name] = [];
        personMap[name].push(t);
      });
    });
    var people = Object.keys(personMap).sort(function(a,b) {
      var oa = personMap[a].filter(function(t){ return t.status==='open'; }).length;
      var ob = personMap[b].filter(function(t){ return t.status==='open'; }).length;
      return ob - oa || a.localeCompare(b);
    });

    var html = kpis + toolbar;
    if (!people.length) return html + '<div class="empty-state">No tasks match your filters.</div>';

    html += people.map(function(person) {
      var tasks = personMap[person].slice().sort(function(a,b) {
        var sa = a.status==='done' ? 2 : a.status==='review' ? 1 : 0;
        var sb = b.status==='done' ? 2 : b.status==='review' ? 1 : 0;
        if (sa !== sb) return sa - sb;
        var po = (TASK_PRIORITY_ORDER[a.priority]||9)-(TASK_PRIORITY_ORDER[b.priority]||9);
        return po !== 0 ? po : (a.dueDate||'').localeCompare(b.dueDate||'');
      });
      var openCount    = tasks.filter(function(t){ return t.status==='open'; }).length;
      var overdueCount = tasks.filter(function(t){ return t.status==='open' && t.dueDate && t.dueDate < today; }).length;
      return '<div style="margin-bottom:26px;">'
        + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);">'
        + '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;">' + escHtml(person) + '</div>'
        + '<span class="section-count" style="margin-left:0;">' + tasks.length + ' task' + (tasks.length!==1?'s':'') + '</span>'
        + (openCount    ? '<span style="font-size:11px;color:var(--muted);">' + openCount + ' open</span>' : '')
        + (overdueCount ? '<span style="font-size:11px;color:var(--red);">⚠ ' + overdueCount + ' overdue</span>' : '')
        + '</div>'
        + tasks.map(taskCard).join('')
        + '</div>';
    }).join('');
    return html;
  }

  var openTasks   = f.filter(function(t){ return t.status==='open'; }).sort(function(a,b){ var po=(TASK_PRIORITY_ORDER[a.priority]||9)-(TASK_PRIORITY_ORDER[b.priority]||9); return po!==0?po:(a.dueDate||'').localeCompare(b.dueDate||''); })
  var reviewTasks = f.filter(function(t){ return t.status==='review'; }).sort(function(a,b){ var po=(TASK_PRIORITY_ORDER[a.priority]||9)-(TASK_PRIORITY_ORDER[b.priority]||9); return po!==0?po:(a.dueDate||'').localeCompare(b.dueDate||''); })
  var doneTasks   = f.filter(function(t){ return t.status==='done'; });

  var html = kpis + toolbar;
  if (!openTasks.length && !reviewTasks.length && !doneTasks.length) return html + '<div class="empty-state">No tasks match your filters.</div>';

  if (openTasks.length)   html += '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);">Open Tasks <span style="font-size:12px;color:var(--muted);font-family:inherit;">(' + openTasks.length + ')</span></div>' + openTasks.map(taskCard).join('');
  if (reviewTasks.length) html += '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#8b7a2a;margin:24px 0 12px;padding-bottom:8px;border-bottom:2px solid #c9a84c;">Tasks Awaiting Review <span style="font-size:12px;color:var(--muted);font-family:inherit;">(' + reviewTasks.length + ')</span></div>' + reviewTasks.map(taskCard).join('');
  if (doneTasks.length)   html += '<div style="font-family:\'Spectral\',serif;font-size:15px;color:var(--muted);margin:24px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--border);">Completed <span style="font-size:12px;color:var(--muted);font-family:inherit;">(' + doneTasks.length + ')</span></div>' + doneTasks.map(taskCard).join('');
  return html;
}

function toggleTaskDone(id) {
  TASKS = TASKS.map(function(t) {
    if (t.id !== id) return t;
    return Object.assign({}, t, { status: t.status==='done' ? 'open' : 'done' });
  });
  saveState(); renderView();
}

function toggleTaskReview(id) {
  TASKS = TASKS.map(function(t) {
    if (t.id !== id) return t;
    return Object.assign({}, t, { status: t.status==='review' ? 'open' : 'review' });
  });
  saveState(); renderView();
}

var taskModalReturnTo = null;

function openTaskModal(id, opts) {
  opts = opts || {};
  taskModalReturnTo = opts.returnToDealId || null;
  var t = id ? TASKS.find(function(x){ return x.id===id; }) : null;
  var isNew = !t;
  var selectedDealId = t ? t.dealId : (opts.presetDealId || '');
  var dealOpts = '<option value="">— Not linked to a deal —</option>' + DEALS.map(function(d){
    return '<option value="' + d.id + '"' + (selectedDealId===d.id?' selected':'') + '>' + d.company + ' — ' + d.dealType + '</option>';
  }).join('');
  var body = '<div class="form-grid">'
    + '<div class="form-group full"><label class="form-label">Task Title</label><input class="form-input" id="tk-title" value="' + escHtml(t?t.title:'') + '" placeholder="e.g. Send updated IM to lender" /></div>'
    + '<div class="form-group"><label class="form-label">Owner</label><input class="form-input" id="tk-owner" value="' + escHtml(t?t.owner:'') + '" placeholder="e.g. J. Harrington" /></div>'
    + '<div class="form-group"><label class="form-label">Due Date</label><input class="form-input" id="tk-dueDate" type="date" value="' + (t?t.dueDate:'') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="tk-priority">'
    + '<option value="High"' + (t&&t.priority==='High'?' selected':'') + '>High</option>'
    + '<option value="Medium"' + (t&&t.priority==='Medium'?' selected':'') + '>Medium</option>'
    + '<option value="Low"' + (t&&t.priority==='Low'?' selected':'') + '>Low</option>'
    + '</select></div>'
    + '<div class="form-group"><label class="form-label">Status</label><select class="form-select" id="tk-status">'
    + '<option value="open"' + (t&&t.status==='open'?' selected':'') + '>Open</option>'
    + '<option value="review"' + (t&&t.status==='review'?' selected':'') + '>Awaiting Review</option>'
    + '<option value="done"' + (t&&t.status==='done'?' selected':'') + '>Done</option>'
    + '</select></div>'
    + '<div class="form-group"><label class="form-label">Linked Deal</label><select class="form-select" id="tk-dealId">' + dealOpts + '</select></div>'
    + '<div class="form-group full"><label class="form-label">Notes</label><textarea class="form-textarea" id="tk-notes">' + escHtml(t?t.notes:'') + '</textarea></div>'
    + '</div>';
  var footer = '<div>' + (!isNew ? '<button class="btn danger" onclick="deleteTask(\'' + t.id + '\')">Delete</button>' : '') + '</div>'
    + '<div style="display:flex;gap:8px;"><button class="btn" onclick="cancelTaskModal()">Cancel</button><button class="btn primary" onclick="saveTask(\'' + (t?t.id:'') + '\')">Save Task</button></div>';
  openModal(isNew ? 'New Task' : 'Edit Task', body, footer);
}

function cancelTaskModal() {
  var returnTo = taskModalReturnTo;
  taskModalReturnTo = null;
  if (returnTo) { openDealModal(returnTo); }
  else { closeModal(); }
}

function afterTaskMutation() {
  var returnTo = taskModalReturnTo;
  taskModalReturnTo = null;
  saveState(); renderView();
  if (returnTo) { openDealModal(returnTo); }
  else { closeModal(); }
}

function saveTask(id) {
  var record = {
    id: id || genId(),
    title: mval('tk-title'), owner: mval('tk-owner'), dueDate: mval('tk-dueDate'),
    priority: mval('tk-priority'), status: mval('tk-status'),
    dealId: mval('tk-dealId'), notes: mval('tk-notes'),
  };
  if (!record.title) { alert('Task title is required.'); return; }
  if (id) { TASKS = TASKS.map(function(t){ return t.id===id?record:t; }); }
  else { TASKS.push(record); }
  afterTaskMutation();
}

function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  TASKS = TASKS.filter(function(t){ return t.id!==id; });
  afterTaskMutation();
}

