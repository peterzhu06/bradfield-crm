// ============================================================
// PIPELINE — with CRUD
// ============================================================
function renderPipeline() {
  // ── Business toggle ──────────────────────────────────────────
  var isSF = state.pipelineBusiness !== 'broking';
  var toggle = '<div style="display:flex;align-items:center;gap:0;background:var(--cream-d);border-radius:8px;padding:3px;margin-bottom:20px;width:fit-content;">'
    + '<button onclick="state.pipelineBusiness=\'sf\';state.pipelineTab=\'board\';state.pipelineStageFilter=\'\';renderView()" style="padding:7px 20px;border-radius:6px;border:none;cursor:pointer;font-size:12.5px;font-weight:500;transition:all 0.15s;background:' + (isSF?'var(--white)':'transparent') + ';color:' + (isSF?'#000':'var(--muted)') + ';box-shadow:' + (isSF?'0 1px 4px rgba(0,0,0,0.10)':'none') + ';">Structured Finance</button>'
    + '<button onclick="state.pipelineBusiness=\'broking\';state.pipelineTab=\'board\';state.pipelineStageFilter=\'\';renderView()" style="padding:7px 20px;border-radius:6px;border:none;cursor:pointer;font-size:12.5px;font-weight:500;transition:all 0.15s;background:' + (!isSF?'var(--white)':'transparent') + ';color:' + (!isSF?'#000':'var(--muted)') + ';box-shadow:' + (!isSF?'0 1px 4px rgba(0,0,0,0.10)':'none') + ';">Broking</button>'
    + '</div>';

  return toggle + (isSF ? renderSFPipeline() : renderBrokingPipeline());
}

function renderSFPipeline() {
  let f = DEALS;
  if (state.pipelineSearch) { const q=state.pipelineSearch.toLowerCase(); f=f.filter(d=>d.company.toLowerCase().includes(q)||d.dealType.toLowerCase().includes(q)||d.sector.toLowerCase().includes(q)||d.owner.toLowerCase().includes(q)); }
  if (state.pipelineStageFilter) f=f.filter(d=>d.stage===state.pipelineStageFilter);
  const liveDeals=DEALS.filter(d=>['origination','mandate','live','paused'].includes(d.stage));
  const pv=liveDeals.reduce((s,d)=>s+d.sizeMn,0);
  return `
  <div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">
    <div class="stat-card"><div class="s-label">Live Deals</div><div class="s-value">${liveDeals.length}</div><div class="s-sub">Active pipeline</div></div>
    <div class="stat-card"><div class="s-label">Total Pipeline</div><div class="s-value">A$${pv}m</div><div class="s-sub">Live deal value</div></div>
    <div class="stat-card"><div class="s-label">In Execution</div><div class="s-value">${DEALS.filter(d=>d.stage==='live').length}</div><div class="s-sub">Live / execution stage</div></div>
  </div>
  <div class="toolbar">
    <input type="text" placeholder="Search deals…" value="${state.pipelineSearch}" oninput="state.pipelineSearch=this.value;renderView()" />
    <select onchange="state.pipelineStageFilter=this.value;renderView()">
      <option value="">All stages</option>
      ${Object.entries(STAGE_CONFIG).map(([k,v])=>`<option value="${k}" ${state.pipelineStageFilter===k?'selected':''}>${v.label}</option>`).join('')}
    </select>
    <div class="toolbar-spacer"></div>
    <div class="view-toggle">
      <button class="vt-btn ${state.pipelineTab==='board'||!state.pipelineTab?'active':''}" onclick="state.pipelineTab='board';state.pipelineViewMode='kanban';renderView()">Board</button>
      <button class="vt-btn ${state.pipelineTab==='table'?'active':''}" onclick="state.pipelineTab='table';state.pipelineViewMode='table';renderView()">Table</button>
      <button class="vt-btn ${state.pipelineTab==='timeline'?'active':''}" onclick="state.pipelineTab='timeline';renderView()">Timeline</button>
    </div>
    <button class="btn primary" onclick="openDealModal()">+ New Deal</button>
    <button class="btn" onclick="openSnapshotCustomizer()" style="font-size:11.5px;">📋 Weekly Snapshot</button>
  </div>
  ${state.pipelineTab==='timeline' ? renderDealTimeline(f) : state.pipelineTab==='table' ? renderPipelineTable(f) : renderKanban(f)}`;
}

// ============================================================
// BROKING PIPELINE
// ============================================================
function renderBrokingPipeline() {
  var f = BROKING_DEALS.slice();
  if (state.brokingSearch) { var q=state.brokingSearch.toLowerCase(); f=f.filter(function(d){ return d.company.toLowerCase().includes(q)||d.loanType.toLowerCase().includes(q)||d.sector.toLowerCase().includes(q)||(d.owner||'').toLowerCase().includes(q); }); }
  if (state.brokingStageFilter) f=f.filter(function(d){ return d.stage===state.brokingStageFilter; });

  var total    = BROKING_DEALS.length;
  var settled  = BROKING_DEALS.filter(function(d){ return d.stage==='settled'; }).length;
  var approved = BROKING_DEALS.filter(function(d){ return d.stage==='approved'; }).length;
  var pv       = BROKING_DEALS.filter(function(d){ return d.stage!=='settled'; }).reduce(function(s,d){ return s+d.sizeMn; }, 0).toFixed(2);

  var stageOpts = Object.entries(BROKING_STAGE_CONFIG).map(function(e){
    return '<option value="'+e[0]+'"'+(state.brokingStageFilter===e[0]?' selected':'')+'>'+e[1].label+'</option>';
  }).join('');

  var html = '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Total Deals</div><div class="s-value">'+total+'</div><div class="s-sub">In pipeline</div></div>'
    + '<div class="stat-card"><div class="s-label">Pipeline Value</div><div class="s-value">A$'+pv+'m</div><div class="s-sub">Active (excl. settled)</div></div>'
    + '<div class="stat-card"><div class="s-label">Approved</div><div class="s-value">'+approved+'</div><div class="s-sub">Ready to settle</div></div>'
    + '<div class="stat-card"><div class="s-label">Settled</div><div class="s-value">'+settled+'</div><div class="s-sub">Completed this pipeline</div></div>'
    + '</div>';

  html += '<div class="toolbar" style="margin-bottom:16px;">'
    + '<input type="text" placeholder="Search broking deals…" value="'+escHtml(state.brokingSearch)+'" oninput="state.brokingSearch=this.value;renderView()" />'
    + '<select onchange="state.brokingStageFilter=this.value;renderView()"><option value="">All stages</option>'+stageOpts+'</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">'+f.length+' deal'+(f.length!==1?'s':'')+'</div>'
    + '<button class="btn primary" onclick="openBrokingDealModal()">+ New Broking Deal</button>'
    + '</div>';

  // Kanban board
  html += '<div class="kanban-wrap"><div class="kanban-board">';
  Object.entries(BROKING_STAGE_CONFIG).forEach(function(entry) {
    var key = entry[0], sc = entry[1];
    var sd  = f.filter(function(d){ return d.stage===key; });
    html += '<div class="kanban-col">';
    html += '<div class="kanban-col-header" style="border-bottom-color:'+sc.color+'">'
      + '<div class="kanban-stage-dot" style="background:'+sc.color+'"></div>'
      + '<div class="kanban-col-label">'+sc.label+'</div>'
      + '<div class="kanban-col-count">'+sd.length+'</div>'
      + '</div>';
    sd.forEach(function(d) {
      var age = dealAgeInfo(d);
      var dotColor = DEAL_STATUS_COLORS[d.statusKey] || '#888';
      var bTasks = TASKS.filter(function(t){ return t.dealId === d.id && t.status !== 'done'; });
      var bTaskFooter = bTasks.length
        ? bTasks.slice(0,2).map(function(t){ return '<div style="display:flex;align-items:flex-start;gap:4px;"><span style="width:4px;height:4px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:4px;"></span><span>'+t.title+'</span></div>'; }).join('')
        : '';
      html += '<div class="kanban-card" onclick="openBrokingDealModal(\''+d.id+'\')">';
      html += '<div class="kc-body">';
      html += '<div class="kc-header"><div class="kc-name">'+d.company+'</div><div class="kc-badge">'+sc.label+'</div></div>';
      html += '<div class="kc-type">'+d.loanType+' · '+d.sector+'</div>';
      html += '<div class="kc-value">'+d.size+'</div>';
      html += '<div class="kc-meta">'+d.owner+'</div>';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">';
      html += '<div>'+dealAgeBadge(d)+'</div>';
      html += '<div style="width:7px;height:7px;border-radius:50%;background:'+dotColor+';"></div>';
      html += '</div></div>';
      html += '<div class="kc-next"><span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Status · </span>'+d.nextStep+'</div>';
      if (bTaskFooter) html += '<div style="padding:7px 13px;background:var(--cream-d);border-top:1px solid var(--border);font-size:10.5px;color:var(--text-2);line-height:1.5;"><span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;display:block;margin-bottom:4px;">Tasks</span>'+bTaskFooter+'</div>';
      html += '</div>';
    });
    if (sd.length===0) html += '<div style="font-size:11px;color:var(--muted);text-align:center;padding:20px 0;">—</div>';
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

function openBrokingDealModal(id) {
  var d = id ? BROKING_DEALS.find(function(x){ return x.id===id; }) : null;
  var isNew = !d;
  var stageOpts = Object.entries(BROKING_STAGE_CONFIG).map(function(e){
    return '<option value="'+e[0]+'"'+(d&&d.stage===e[0]?' selected':'')+'>'+e[1].label+'</option>';
  }).join('');
  var sectorOpts = ['Residential','Commercial Property','Business','Asset Finance','SMSF','Personal Finance','Other'].map(function(s){
    return '<option value="'+s+'"'+(d&&d.sector===s?' selected':'')+'>'+s+'</option>';
  }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Client / Borrower</label><input class="form-input" id="bk-company" value="'+escHtml(d?d.company:'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Loan Type</label><input class="form-input" id="bk-loanType" value="'+escHtml(d?d.loanType:'')+'" placeholder="e.g. Residential Mortgage" /></div>'
    + '<div class="form-group"><label class="form-label">Sector</label><select class="form-select" id="bk-sector">'+sectorOpts+'</select></div>'
    + '<div class="form-group"><label class="form-label">Loan Size</label><input class="form-input" id="bk-size" value="'+escHtml(d?d.size:'')+'" placeholder="e.g. A$750k" /></div>'
    + '<div class="form-group"><label class="form-label">Size (A$m — numeric)</label><input class="form-input" id="bk-sizeMn" type="number" step="0.01" value="'+(d?d.sizeMn:'')+'" placeholder="0.75" /></div>'
    + '<div class="form-group"><label class="form-label">Stage</label><select class="form-select" id="bk-stage">'+stageOpts+'</select></div>'
    + '<div class="form-group"><label class="form-label">Owner</label><input class="form-input" id="bk-owner" value="'+escHtml(d?d.owner:'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Date Introduced</label><input class="form-input" id="bk-introDate" type="date" value="'+(d?d.introDate||'':'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Target Settlement</label><input class="form-input" id="bk-closeDate" type="date" value="'+(d?d.closeDate||'':'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Status</label><select class="form-select" id="bk-statusKey"><option value="green"'+(d&&d.statusKey==='green'?' selected':'')+'>On track</option><option value="amber"'+(d&&d.statusKey==='amber'?' selected':'')+'>Watch</option><option value="red"'+(d&&d.statusKey==='red'?' selected':'')+'>At risk</option></select></div>'
    + '<div class="form-group full"><label class="form-label">Next Step</label><textarea class="form-textarea" id="bk-nextStep">'+escHtml(d?d.nextStep:'')+' </textarea></div>'
    + '<div class="form-group full"><label class="form-label">Notes</label><textarea class="form-textarea" id="bk-notes">'+escHtml(d?d.notes:'')+' </textarea></div>'
    + '</div>';

  var deleteBtn = !isNew ? '<button class="btn danger" onclick="deleteBrokingDeal(\''+d.id+'\')">Delete</button>' : '';
  var footer = '<div>'+deleteBtn+'</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveBrokingDeal(\''+(d?d.id:'')+'\')">Save Deal</button>'
    + '</div>';
  openModal(isNew?'New Broking Deal':'Edit — '+(d?d.company:''), body, footer);
}

function saveBrokingDeal(id) {
  var existing = id ? BROKING_DEALS.find(function(d){ return d.id===id; }) : null;
  var newStage = mval('bk-stage');
  var stageEnteredDate = (existing && existing.stage===newStage && existing.stageEnteredDate)
    ? existing.stageEnteredDate : new Date().toISOString().slice(0,10);
  var statusLabels = { green:'On track', amber:'Watch', red:'At risk' };
  var sk = mval('bk-statusKey');
  var record = {
    id: id || genId(),
    company: mval('bk-company'), loanType: mval('bk-loanType'),
    sector: mval('bk-sector'), size: mval('bk-size'),
    sizeMn: parseFloat(document.getElementById('bk-sizeMn').value)||0,
    stage: newStage, stageEnteredDate,
    introDate: mval('bk-introDate'), closeDate: mval('bk-closeDate'),
    owner: mval('bk-owner'), statusKey: sk, status: statusLabels[sk]||'On track',
    nextStep: mval('bk-nextStep').trim(), notes: mval('bk-notes').trim(),
  };
  if (!record.company) { alert('Client name is required.'); return; }
  if (id) { BROKING_DEALS = BROKING_DEALS.map(function(d){ return d.id===id?record:d; }); }
  else { BROKING_DEALS.push(record); }
  saveState(); closeModal(); renderView();
}

function deleteBrokingDeal(id) {
  if (!confirm('Delete this broking deal?')) return;
  BROKING_DEALS = BROKING_DEALS.filter(function(d){ return d.id!==id; });
  saveState(); closeModal(); renderView();
}

function renderKanban(f) {
  // ── Chart strip ──────────────────────────────────────────────
  var chartStrip = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:18px;">'

    // 1. Pipeline value by stage
    + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:16px 18px;">'
    + '<div style="font-family:\'Spectral\',serif;font-size:13px;color:#000;margin-bottom:2px;">Value by Stage</div>'
    + '<div style="font-size:10px;color:var(--muted);margin-bottom:12px;">A$m — active deals</div>'
    + '<div style="position:relative;height:130px;"><canvas id="kb-stageBar"></canvas></div>'
    + '</div>'

    // 2. Deal value by owner
    + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:16px 18px;">'
    + '<div style="font-family:\'Spectral\',serif;font-size:13px;color:#000;margin-bottom:2px;">Value by Deal Type</div>'
    + '<div style="font-size:10px;color:var(--muted);margin-bottom:12px;">A$m — active pipeline</div>'
    + '<div style="position:relative;height:130px;"><canvas id="kb-dealTypeBar"></canvas></div>'
    + '</div>'

    // 3. Value by owner by stage (table)
    + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:16px 18px;">'
    + '<div style="font-family:\'Spectral\',serif;font-size:13px;color:#000;margin-bottom:2px;">Value by Owner & Stage</div>'
    + '<div style="font-size:10px;color:var(--muted);margin-bottom:12px;">A$m per stage per owner</div>'
    + '<div id="kb-ownerStageTable" style="overflow:auto;"></div>'
    + '</div>'

    // 4. Deal count by sector
    + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:16px 18px;">'
    + '<div style="font-family:\'Spectral\',serif;font-size:13px;color:#000;margin-bottom:2px;">Deals by Sector</div>'
    + '<div style="font-size:10px;color:var(--muted);margin-bottom:12px;">Count — active pipeline</div>'
    + '<div style="position:relative;height:130px;"><canvas id="kb-sectorDonut"></canvas></div>'
    + '</div>'

    + '</div>';

  // ── Kanban board ─────────────────────────────────────────────
  var board = '<div class="kanban-wrap"><div class="kanban-board">'
    + Object.entries(STAGE_CONFIG).map(function(entry) {
        var key = entry[0], sc = entry[1];
        var sd = f.filter(function(d){ return d.stage === key; });
        return '<div class="kanban-col">'
          + '<div class="kanban-col-header" style="border-bottom-color:' + sc.color + '">'
          + '<div class="kanban-stage-dot" style="background:' + sc.color + '"></div>'
          + '<div class="kanban-col-label">' + sc.label + '</div>'
          + '<div class="kanban-col-count">' + sd.length + '</div>'
          + '</div>'
          + sd.map(function(d) {
              var cardTasks = TASKS.filter(function(t){ return t.dealId === d.id && t.status !== 'done'; });
              var taskFooter = cardTasks.length
                ? cardTasks.slice(0,2).map(function(t){ return '<div style="display:flex;align-items:flex-start;gap:4px;"><span style="width:4px;height:4px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:4px;"></span><span>' + t.title + '</span></div>'; }).join('')
                : '';
              return '<div class="kanban-card" onclick="openDealModal(\'' + d.id + '\')">'
                + '<div class="kc-body">'
                + '<div class="kc-header"><div class="kc-name">' + d.company + '</div><div class="kc-badge">' + sc.label + '</div></div>'
                + '<div class="kc-type">' + d.sector + ' · ' + d.owner + '</div>'
                + '<div class="kc-value">' + d.size + '</div>'
                + '<div class="kc-meta">' + d.dealType + '</div>'
                + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">'
                + '<div style="font-size:10px;color:var(--muted);">' + (d.closeDate ? 'Close: ' + d.closeDate : '') + '</div>'
                + '<div style="display:flex;align-items:center;gap:5px;">' + dealAgeBadge(d)
                + '<div style="width:7px;height:7px;border-radius:50%;background:' + (DEAL_STATUS_COLORS[d.statusKey]||'#888') + ';"></div>'
                + '</div></div></div>'
                + '<div class="kc-next"><span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Status · </span>' + (d.nextStep||'—') + '</div>'
                + (taskFooter ? '<div style="padding:7px 13px;background:var(--cream-d);border-top:1px solid var(--border);font-size:10.5px;color:var(--text-2);line-height:1.5;"><span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;display:block;margin-bottom:4px;">Tasks</span>' + taskFooter + '</div>' : '')
                + '</div>';
            }).join('')
          + (sd.length===0 ? '<div style="font-size:11px;color:var(--muted);text-align:center;padding:20px 0;">—</div>' : '')
          + '</div>';
      }).join('')
    + '</div></div>';

  setTimeout(drawPipelineCharts, 60);
  return chartStrip + board;
}

function drawPipelineCharts() {
  loadChartJs().then(function() {
    freeCanvases(['kb-stageBar','kb-dealTypeBar','kb-sectorDonut']);
    var liveStages = ['origination','mandate','live','paused'];
    var activeDeals = DEALS.filter(function(d){ return liveStages.includes(d.stage); });

    var tickCol  = '#999';
    var gridCol  = 'rgba(0,0,0,0.04)';
    var palette  = ['#1a1a1a','#b9975b','#818cf8','#22c55e','#f97316','#38bdf8','#e879f9','#94a3b8'];
    var stageColors = { origination:'#78716c', mandate:'#c8570a', live:'#44403c', paused:'#c4b5a5' };

    // ── 1. Pipeline value by stage (horizontal bar) ──────────────
    var c1 = document.getElementById('kb-stageBar');
    if (c1) {
      var stageOrder  = ['origination','mandate','live','paused'];
      var stageLabels = ['Origination','Mandate','Live','Paused'];
      var stageVals   = stageOrder.map(function(k){ return DEALS.filter(function(d){ return d.stage===k; }).reduce(function(s,d){ return s+d.sizeMn; },0); });
      new window.Chart(c1, {
        type: 'bar',
        data: { labels: stageLabels, datasets: [{ data: stageVals, backgroundColor: Object.values(stageColors), borderRadius: 3, borderSkipped: false }] },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx){ return ' A$' + ctx.raw + 'm'; } } } },
          scales: {
            x: { grid: { color: gridCol }, ticks: { color: tickCol, font: { size: 9 }, callback: function(v){ return 'A$' + v + 'm'; } }, beginAtZero: true },
            y: { grid: { display: false }, ticks: { color: '#555', font: { size: 9 } } }
          }
        }
      });
    }

    // ── 2. Deal value by type (bar) ─────────────────────────────
    var c2 = document.getElementById('kb-dealTypeBar');
    if (c2) {
      var dealTypeMap = {};
      activeDeals.forEach(function(d){ dealTypeMap[d.dealType] = (dealTypeMap[d.dealType]||0) + d.sizeMn; });
      var dtLabels = Object.keys(dealTypeMap).sort(function(a,b){ return dealTypeMap[b]-dealTypeMap[a]; });
      var dtVals   = dtLabels.map(function(t){ return dealTypeMap[t]; });
      var dtColors = dtLabels.map(function(_,i){ return palette[i % palette.length]; });
      new window.Chart(c2, {
        type: 'bar',
        data: { labels: dtLabels, datasets: [{ data: dtVals, backgroundColor: dtColors, borderRadius: 3, borderSkipped: false }] },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx){ return ' A$' + ctx.raw + 'm'; } } } },
          scales: {
            x: { grid: { color: gridCol }, ticks: { color: tickCol, font: { size: 9 }, callback: function(v){ return 'A$' + v + 'm'; } }, beginAtZero: true },
            y: { grid: { display: false }, ticks: { color: '#555', font: { size: 9 } } }
          }
        }
      });
    }

    // ── 3. Value by owner by stage (table) ──────────────────────
    var t3 = document.getElementById('kb-ownerStageTable');
    if (t3) {
      var owners3     = Array.from(new Set(activeDeals.map(function(d){ return d.owner; }))).sort();
      var stageOrder3 = ['origination','mandate','live','paused'];
      var stageNames3 = { origination:'Origination', mandate:'Mandate', live:'Execution', paused:'Paused' };
      var stageColMap = { origination:'#94a3b8', mandate:'#c9a84c', live:'#22c55e', paused:'#b0b0b0' };

      var colW = 'width:' + Math.floor(80 / Math.max(owners3.length, 1)) + '%;';

      var tHTML = '<table style="width:100%;border-collapse:collapse;font-size:10.5px;">';
      // Header row: blank + owner names
      tHTML += '<thead><tr>';
      tHTML += '<th style="text-align:left;padding:4px 6px;color:var(--muted);font-weight:600;font-size:9.5px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid var(--border);width:20%;"></th>';
      owners3.forEach(function(o) {
        tHTML += '<th style="text-align:right;padding:4px 6px;color:#000;font-weight:600;font-size:10px;border-bottom:2px solid var(--border);' + colW + '">' + o.split(' ').pop() + '</th>';
      });
      tHTML += '</tr></thead><tbody>';

      // One row per stage
      stageOrder3.forEach(function(stage) {
        var dot = '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:' + stageColMap[stage] + ';margin-right:4px;vertical-align:middle;"></span>';
        tHTML += '<tr style="border-bottom:1px solid var(--cream-d);">';
        tHTML += '<td style="padding:5px 6px;color:var(--text-2);">' + dot + stageNames3[stage] + '</td>';
        owners3.forEach(function(o) {
          var val = activeDeals.filter(function(d){ return d.owner===o && d.stage===stage; }).reduce(function(s,d){ return s+d.sizeMn; }, 0);
          tHTML += '<td style="padding:5px 6px;text-align:right;color:' + (val>0?'#000':'var(--muted)') + ';font-weight:' + (val>0?'500':'400') + ';">' + (val>0?'A$'+val+'m':'—') + '</td>';
        });
        tHTML += '</tr>';
      });

      // Total row
      tHTML += '<tr style="border-top:2px solid var(--border);">';
      tHTML += '<td style="padding:5px 6px;color:#000;font-weight:600;font-size:10px;">Total</td>';
      owners3.forEach(function(o) {
        var total = activeDeals.filter(function(d){ return d.owner===o; }).reduce(function(s,d){ return s+d.sizeMn; }, 0);
        tHTML += '<td style="padding:5px 6px;text-align:right;color:#000;font-weight:700;">' + (total>0?'A$'+total+'m':'—') + '</td>';
      });
      tHTML += '</tr>';

      tHTML += '</tbody></table>';
      t3.innerHTML = tHTML;
    }

    // ── 4. Deal count by sector (donut) ─────────────────────────
    var c4 = document.getElementById('kb-sectorDonut');
    if (c4) {
      var sectorMap = {};
      activeDeals.forEach(function(d){ sectorMap[d.sector] = (sectorMap[d.sector]||0) + 1; });
      var sLabels = Object.keys(sectorMap);
      var sVals   = Object.values(sectorMap);
      new window.Chart(c4, {
        type: 'doughnut',
        data: { labels: sLabels, datasets: [{ data: sVals, backgroundColor: palette.slice(0, sLabels.length), borderWidth: 2, borderColor: '#fff', hoverOffset: 4 }] },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '58%',
          plugins: {
            legend: { position: 'right', labels: { font: { size: 9 }, color: '#555', boxWidth: 8, padding: 5 } },
            tooltip: { callbacks: { label: function(ctx){ return ' ' + ctx.raw + ' deal' + (ctx.raw!==1?'s':''); } } }
          }
        }
      });
    }
  });
}

function renderPipelineTable(f) {
  return `<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;">
  <table class="data-table"><thead><tr><th>Company</th><th>Deal Type</th><th>Sector</th><th>Size</th><th>Stage</th><th>Owner</th><th>Next Step</th><th>Close Date</th><th>Status</th><th></th></tr></thead><tbody>
  ${f.map(d=>{const sc=stageConf(d.stage);return`<tr>
    <td class="strong" style="white-space:nowrap;vertical-align:top;">${firmLogo(d.company,18)} ${d.company}</td><td style="vertical-align:top;">${d.dealType}</td><td style="vertical-align:top;">${d.sector}</td>
    <td class="mono" style="vertical-align:top;">${d.size}</td>
    <td style="vertical-align:top;"><span class="badge ${sc.badgeClass}">${sc.label}</span></td>
    <td style="vertical-align:top;">${d.owner}</td>
    <td style="max-width:180px;font-size:11.5px;color:var(--text-2);vertical-align:top;">${d.nextStep}</td>
    <td style="color:var(--muted);white-space:nowrap;vertical-align:top;">${d.closeDate}</td>
    <td style="vertical-align:top;"><span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:${DEAL_STATUS_COLORS[d.statusKey]||'#888'};"><span style="width:6px;height:6px;border-radius:50%;background:${DEAL_STATUS_COLORS[d.statusKey]||'#888'};flex-shrink:0;"></span>${d.status}</span></td>
    <td style="vertical-align:top;"><button class="btn sm" onclick="openDealModal('${d.id}')">Edit</button></td>
  </tr>`;}).join('')}
  ${f.length===0?`<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--muted);">No deals match your filters.</td></tr>`:''}
  </tbody></table></div>`;
}


function openDealModal(id) {
  var d = id ? DEALS.find(function(x) { return x.id === id; }) : null;
  var isNew = !d;
  var title = isNew ? 'New Deal' : 'Edit — ' + (d ? d.company : '');

  var stageOpts = Object.entries(STAGE_CONFIG).map(function(entry) {
    var k = entry[0], v = entry[1];
    return '<option value="' + k + '"' + (d && d.stage === k ? ' selected' : '') + '>' + v.label + '</option>';
  }).join('');

  var statusGreen = d && d.statusKey === 'green' ? ' selected' : '';
  var statusAmber = d && d.statusKey === 'amber' ? ' selected' : '';
  var statusRed   = d && d.statusKey === 'red'   ? ' selected' : '';

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Company / Borrower</label><input class="form-input" id="f-company" value="' + escHtml(d ? d.company : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Deal Type</label><input class="form-input" id="f-dealType" value="' + escHtml(d ? d.dealType : '') + '" placeholder="e.g. Wholesale Facility" /></div>'
    + '<div class="form-group"><label class="form-label">Sector</label><input class="form-input" id="f-sector" value="' + escHtml(d ? d.sector : '') + '" placeholder="e.g. Agriculture" /></div>'
    + '<div class="form-group"><label class="form-label">Size (A$m — numeric)</label><input class="form-input" id="f-sizeMn" type="number" step="0.01" value="' + (d ? d.sizeMn : '') + '" placeholder="75" /></div>'
    + '<div class="form-group"><label class="form-label">Stage</label><select class="form-select" id="f-stage">' + stageOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Deal Lead / Owner</label><input class="form-input" id="f-owner" value="' + escHtml(d ? d.owner : '') + '" placeholder="e.g. J. Harrington" /></div>'
    + '<div class="form-group"><label class="form-label">Target Close Date</label><input class="form-input" id="f-closeDate" type="date" value="' + (d ? d.closeDate : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Date Introduced</label><input class="form-input" id="f-introDate" type="date" value="' + (d ? (d.introDate||'') : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Status</label>'
    + '<select class="form-select" id="f-statusKey">'
    + '<option value="green"' + statusGreen + '>On track</option>'
    + '<option value="amber"' + statusAmber + '>Watch</option>'
    + '<option value="red"'   + statusRed   + '>At risk / Closed lost</option>'
    + '</select></div>'
    + '<div class="form-group full"><label class="form-label">Status</label><textarea class="form-textarea" id="f-nextStep">' + escHtml(d ? d.nextStep : '') + '</textarea></div>'
    + '<div class="form-group full"><label class="form-label">Notes</label><textarea class="form-textarea" id="f-notes">' + escHtml(d ? d.notes : '') + '</textarea></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Current Status</div>'
    + '<div style="grid-column:1/-1;font-size:11px;color:var(--muted);margin-top:-6px;margin-bottom:2px;">Dot-point summary of where this deal is up to — displayed on the Overview page.</div>'
    + '<div class="form-group full">' + listEditorHTML('f-statusNotes', d ? (d.statusNotes || []) : [], 'e.g. Term sheet received from lender — under review') + '</div>'
    + '</div>';

  if (!isNew) {
    var dealTasks = TASKS.filter(function(t){ return t.dealId === d.id; }).sort(function(a,b){
      var sa = a.status==='done' ? 2 : a.status==='review' ? 1 : 0;
      var sb = b.status==='done' ? 2 : b.status==='review' ? 1 : 0;
      if (sa !== sb) return sa - sb;
      return (a.dueDate||'').localeCompare(b.dueDate||'');
    });
    var taskRowsHtml = dealTasks.length ? dealTasks.map(function(t){
      var prColor = t.priority==='High'?'#8b3a3a':t.priority==='Medium'?'#8b7a2a':'#3a6b4a';
      var statusLabel = t.status==='done' ? 'Done' : t.status==='review' ? 'In Review' : 'Open';
      var statusColor = t.status==='done' ? '#888' : t.status==='review' ? '#8b7a2a' : '#2a6b5a';
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);' + (t.status==='done'?'opacity:0.55;':'') + '">'
        + '<div style="min-width:0;">'
        + '<div style="font-size:12.5px;font-weight:500;color:#1a1a1a;' + (t.status==='done'?'text-decoration:line-through;':'') + '">' + escHtml(t.title) + '</div>'
        + '<div style="font-size:11px;color:var(--muted);margin-top:2px;">' + escHtml(t.owner||'Unassigned') + (t.dueDate ? ' · Due ' + t.dueDate : '') + '</div>'
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">'
        + '<span style="font-size:10.5px;font-weight:600;color:' + prColor + ';">' + t.priority + '</span>'
        + '<span style="font-size:10.5px;font-weight:600;color:' + statusColor + ';">' + statusLabel + '</span>'
        + '<button class="btn sm" onclick="openTaskModal(\'' + t.id + '\',{returnToDealId:\'' + d.id + '\'})">Edit</button>'
        + '</div>'
        + '</div>';
    }).join('') : '<div style="font-size:12px;color:var(--muted);padding:8px 0;">No tasks linked to this deal yet.</div>';

    body += '<hr class="form-divider" />'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">'
      + '<div class="form-section-label" style="margin-bottom:0;">Tasks</div>'
      + '<button class="btn sm primary" onclick="openTaskModal(null,{presetDealId:\'' + d.id + '\',returnToDealId:\'' + d.id + '\'})">+ Add Task</button>'
      + '</div>'
      + taskRowsHtml;
  }

  var archiveBtn = !isNew ? '<button class="btn danger" onclick="archiveDeal(\'' + d.id + '\')" style="margin-right:6px;">' + 'Archive Deal</button>' : '';
  var deleteBtn = !isNew ? '<button class="btn danger" onclick="deleteDeal(\'' + d.id + '\')">' + 'Delete Deal</button>' : '';
  var footer = '<div>' + archiveBtn + deleteBtn + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveDeal(\'' + (d ? d.id : '') + '\')">' + 'Save Deal</button>'
    + '</div>';

  openModal(title, body, footer);
}

function saveDeal(id) {
  const statusKey = mval('f-statusKey');
  const statusLabels = { green:'On track', amber:'Watch', red:'At risk' };
  const existing = id ? DEALS.find(function(d){ return d.id === id; }) : null;
  const newStage = mval('f-stage');
  const stageEnteredDate = (existing && existing.stage === newStage && existing.stageEnteredDate)
    ? existing.stageEnteredDate
    : new Date().toISOString().slice(0,10);

  const sizeMnVal = parseFloat(document.getElementById('f-sizeMn').value) || 0;
  const record = {
    id: id || genId(),
    company: mval('f-company'), dealType: mval('f-dealType'),
    sector: mval('f-sector'), size: formatDealSize(sizeMnVal),
    sizeMn: sizeMnVal,
    stage: newStage, stageEnteredDate, introDate: mval('f-introDate'),
    owner: mval('f-owner'),
    closeDate: mval('f-closeDate'), status: mval('f-status') || statusLabels[statusKey],
    statusKey, nextStep: mval('f-nextStep'), notes: mval('f-notes'),
    statusNotes: collectList('f-statusNotes'),
  };
  if (!record.company) { alert('Company name is required.'); return; }
  if (id) { DEALS = DEALS.map(d => d.id === id ? record : d); }
  else { DEALS.push(record); }
  saveState(); closeModal(); renderView();
}

function archiveDeal(id) {
  var d = DEALS.find(function(x){ return x.id === id; });
  if (!d) return;
  openArchiveReasonModal(d);
}

function deleteDeal(id) {
  var d = DEALS.find(function(x){ return x.id === id; });
  if (!d) return;
  if (!confirm('Permanently delete "' + d.company + '"? This cannot be undone — the deal will NOT be moved to Archive.')) return;
  DEALS = DEALS.filter(function(x){ return x.id !== id; });
  saveState(); closeModal(); renderView();
  showToast('Deal deleted: ' + d.company);
}

var DEAL_DEATH_REASONS = ['Lost to competitor', 'Client pulled out', 'Funding fell through', 'Pricing not competitive', 'Deal restructured / no longer required', 'Timing — revisit later', 'Other'];
var DEAL_WIN_REASONS   = ['Financial close / funded', 'Transaction completed successfully', 'Advisory mandate delivered', 'Refinanced as planned', 'Other'];

function openArchiveReasonModal(d) {
  var lostOpts = DEAL_DEATH_REASONS.map(function(r){ return '<option value="' + escHtml(r) + '">' + escHtml(r) + '</option>'; }).join('');
  var wonOpts  = DEAL_WIN_REASONS.map(function(r){ return '<option value="' + escHtml(r) + '">' + escHtml(r) + '</option>'; }).join('');
  var body = '<div class="form-grid">'
    + '<div class="form-group full"><div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px;">You\'re removing <strong>' + escHtml(d.company) + '</strong> (' + escHtml(d.size) + ') from the active pipeline. First, how did this deal end?</div></div>'
    + '<div class="form-group full" style="display:flex;gap:8px;">'
    + '<button type="button" id="arc-outcome-won-btn" class="btn" style="flex:1;" onclick="setArchiveOutcome(\'won\')">✅ Closed — Won / Completed</button>'
    + '<button type="button" id="arc-outcome-lost-btn" class="btn danger" style="flex:1;" onclick="setArchiveOutcome(\'lost\')">❌ Closed — Lost / Dead</button>'
    + '</div>'
    + '<input type="hidden" id="arc-outcome" value="lost" />'
    + '<div class="form-group full"><label class="form-label">Archive Date</label><input class="form-input" id="arc-date" type="date" value="' + new Date().toISOString().slice(0,10) + '" /></div>'
    + '<div class="form-group full" id="arc-reason-lost-wrap"><label class="form-label">Reason it did not proceed</label><select class="form-select" id="arc-reason-lost">' + lostOpts + '</select></div>'
    + '<div class="form-group full" id="arc-reason-won-wrap" style="display:none;"><label class="form-label">How it was completed</label><select class="form-select" id="arc-reason-won">' + wonOpts + '</select></div>'
    + '<div class="form-group full"><label class="form-label">Additional Notes (optional)</label><textarea class="form-textarea" id="arc-notes" placeholder="Any further context..."></textarea></div>'
    + '</div>';
  var footer = '<div></div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn danger" onclick="confirmArchiveDeal(\'' + d.id + '\')">Archive Deal</button>'
    + '</div>';
  openModal('Archive Deal — ' + d.company, body, footer);
}

function setArchiveOutcome(outcome) {
  var el = document.getElementById('arc-outcome');
  if (el) el.value = outcome;
  var lostWrap = document.getElementById('arc-reason-lost-wrap');
  var wonWrap  = document.getElementById('arc-reason-won-wrap');
  if (lostWrap) lostWrap.style.display = outcome === 'lost' ? '' : 'none';
  if (wonWrap)  wonWrap.style.display  = outcome === 'won'  ? '' : 'none';
  var wonBtn  = document.getElementById('arc-outcome-won-btn');
  var lostBtn = document.getElementById('arc-outcome-lost-btn');
  if (wonBtn)  wonBtn.className  = outcome === 'won'  ? 'btn primary' : 'btn';
  if (lostBtn) lostBtn.className = outcome === 'lost' ? 'btn danger'  : 'btn';
}

function confirmArchiveDeal(id) {
  var d = DEALS.find(function(x){ return x.id === id; });
  if (!d) { closeModal(); return; }
  var outcome = mval('arc-outcome') || 'lost';
  var reason  = outcome === 'won' ? (mval('arc-reason-won') || 'Other') : (mval('arc-reason-lost') || 'Other');
  var notes   = mval('arc-notes') || '';
  var archiveDate = mval('arc-date') || new Date().toISOString().slice(0,10);
  var archived = Object.assign({}, d, {
    archivedAt: archiveDate,
    archiveOutcome: outcome,
    deathReason: reason,
    deathNotes: notes
  });
  ARCHIVED_DEALS.push(archived);
  DEALS = DEALS.filter(function(x){ return x.id !== id; });
  saveState(); closeModal(); renderView();
  showToast((outcome === 'won' ? 'Deal archived as completed: ' : 'Deal archived: ') + d.company);
}

function restoreDeal(id) {
  var d = ARCHIVED_DEALS.find(function(x){ return x.id === id; });
  if (!d) return;
  if (!confirm('Restore "' + d.company + '" to the active pipeline?')) return;
  var restored = Object.assign({}, d);
  delete restored.archivedAt;
  delete restored.archiveOutcome;
  delete restored.deathReason;
  delete restored.deathNotes;
  DEALS.push(restored);
  ARCHIVED_DEALS = ARCHIVED_DEALS.filter(function(x){ return x.id !== id; });
  saveState(); renderView();
  showToast('Deal restored: ' + d.company);
}

function permanentlyDeleteArchivedDeal(id) {
  if (!confirm('Permanently delete this archived deal? This cannot be undone.')) return;
  ARCHIVED_DEALS = ARCHIVED_DEALS.filter(function(x){ return x.id !== id; });
  saveState(); renderView();
}


// ============================================================
// DEALS TAB — per-deal cards with intro date & aging
// ============================================================
// ============================================================
// DEAL TIMELINE
// ============================================================
function renderDealTimeline(f) {
  var activeDeals = f.filter(function(d) { return d.stage !== 'closed_lost' && d.stage !== 'closed_won'; });
  if (activeDeals.length === 0) return '<div class="empty-state">No deals match your filters.</div>';

  var html = '<div style="display:flex;flex-direction:column;gap:16px;">';
  activeDeals.forEach(function(deal) {
    var sc = stageConf(deal.stage);
    var milestoneData = DEAL_MILESTONES.find(function(m) { return m.dealId === deal.id; });
    var milestones = milestoneData ? milestoneData.milestones : [];
    var total = milestones.length;
    var done  = milestones.filter(function(m){ return m.done; }).length;
    var pct   = total > 0 ? Math.round(done / total * 100) : 0;

    html += '<div class="card" style="padding:20px 24px;">';
    html += '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">';
    html += '<div style="display:flex;align-items:center;gap:10px;">';
    html += '<div>' + (typeof firmLogo === 'function' ? firmLogo(deal.company, 20) : '') + '</div>';
    html += '<div>';
    html += '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;">' + deal.company + '</div>';
    html += '<div style="font-size:11px;color:var(--muted);margin-top:2px;">' + deal.dealType + ' · ' + deal.size + ' · ' + deal.owner + '</div>';
    html += '</div></div>';
    html += '<div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">';
    html += '<span class="badge ' + sc.badgeClass + '">' + sc.label + '</span>';
    html += '<span style="font-size:11px;color:var(--muted);">' + pct + '% complete</span>';
    html += '<button class="btn sm" onclick="openMilestoneModal(\'' + deal.id + '\')">Edit Milestones</button>';
    html += '</div></div>';

    // Progress bar
    html += '<div style="height:4px;background:var(--cream-d);border-radius:2px;margin-bottom:18px;overflow:hidden;">';
    html += '<div style="height:100%;width:' + pct + '%;background:' + sc.color + ';border-radius:2px;transition:width 0.4s;"></div>';
    html += '</div>';

    if (milestones.length === 0) {
      html += '<div style="font-size:12px;color:var(--muted);padding:10px 0;">No milestones yet — click Edit Milestones to add.</div>';
    } else {
      // Timeline track
      html += '<div style="position:relative;padding-left:24px;">';
      // Vertical line
      html += '<div style="position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--cream-d);"></div>';
      milestones.forEach(function(m, idx) {
        var today = new Date().toISOString().slice(0,10);
        var isOverdue = !m.done && m.date < today;
        var dotColor = m.done ? '#3a6b4a' : isOverdue ? '#8b3a3a' : sc.color;
        var dotBorder = m.done ? '#3a6b4a' : isOverdue ? '#8b3a3a' : 'var(--border)';
        var dotBg = m.done ? dotColor : 'var(--white)';
        var textColor = m.done ? 'var(--muted)' : isOverdue ? '#8b3a3a' : 'var(--text)';

        html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:' + (idx === milestones.length-1 ? '0' : '12px') + ';position:relative;">';
        html += '<div style="width:14px;height:14px;border-radius:50%;background:' + dotBg + ';border:2px solid ' + dotBorder + ';flex-shrink:0;z-index:1;display:flex;align-items:center;justify-content:center;">';
        if (m.done) html += '<svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>';
        html += '</div>';
        html += '<div style="flex:1;display:flex;align-items:center;justify-content:space-between;">';
        html += '<div style="font-size:12.5px;color:' + textColor + ';' + (m.done?'text-decoration:line-through;':'') + '">' + m.label + '</div>';
        html += '<div style="font-size:11px;color:' + (isOverdue?'#8b3a3a':'var(--muted)') + ';white-space:nowrap;margin-left:12px;">';
        html += (isOverdue ? '⚠ ' : '') + m.date;
        html += '</div></div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function openMilestoneModal(dealId) {
  var deal = DEALS.find(function(d){ return d.id === dealId; });
  if (!deal) return;
  var milestoneData = DEAL_MILESTONES.find(function(m){ return m.dealId === dealId; });
  var milestones = milestoneData ? milestoneData.milestones : [];

  var rows = milestones.map(function(m, i) {
    return '<div class="list-editor-item" style="gap:8px;margin-bottom:6px;" id="ml-row-' + i + '">'
      + '<input type="checkbox" ' + (m.done?'checked':'') + ' id="ml-done-' + i + '" style="width:16px;height:16px;flex-shrink:0;cursor:pointer;" />'
      + '<input class="form-input le-input" id="ml-label-' + i + '" value="' + escHtml(m.label) + '" placeholder="Milestone label" style="flex:1;" />'
      + '<input class="form-input" id="ml-date-' + i + '" type="date" value="' + m.date + '" style="width:140px;flex-shrink:0;" />'
      + '<button class="remove-btn" onclick="this.closest(\'.list-editor-item\').remove()">×</button>'
      + '</div>';
  }).join('');

  var body = '<div style="margin-bottom:12px;font-size:11.5px;color:var(--text-2);">Edit milestones for <strong>' + deal.company + '</strong>. Check the box to mark as complete.</div>'
    + '<div id="ml-rows">' + rows + '</div>'
    + '<button class="add-item-btn" style="margin-top:8px;" onclick="addMilestoneRow()">+ Add milestone</button>';

  var footer = '<div></div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveMilestones(\'' + dealId + '\')">Save Milestones</button>'
    + '</div>';

  openModal('Milestones — ' + deal.company, body, footer);
}

function addMilestoneRow() {
  var container = document.getElementById('ml-rows');
  var i = 'new' + Date.now();
  var div = document.createElement('div');
  div.className = 'list-editor-item';
  div.style.cssText = 'gap:8px;margin-bottom:6px;';
  div.innerHTML = '<input type="checkbox" id="ml-done-' + i + '" style="width:16px;height:16px;flex-shrink:0;cursor:pointer;" />'
    + '<input class="form-input le-input" id="ml-label-' + i + '" placeholder="Milestone label" style="flex:1;" />'
    + '<input class="form-input" id="ml-date-' + i + '" type="date" style="width:140px;flex-shrink:0;" />'
    + '<button class="remove-btn" onclick="this.closest(\'.list-editor-item\').remove()">×</button>';
  container.appendChild(div);
}

function saveMilestones(dealId) {
  var rows = document.querySelectorAll('#ml-rows .list-editor-item');
  var milestones = [];
  rows.forEach(function(row, i) {
    var label = row.querySelector('input[type="text"], input.le-input') ? row.querySelector('input.le-input').value.trim() : '';
    var dateEl = row.querySelectorAll('input')[2] || row.querySelectorAll('input')[1];
    var doneEl = row.querySelector('input[type="checkbox"]');
    if (label) {
      milestones.push({
        id: 'ml' + dealId + i,
        label: label,
        date: dateEl ? dateEl.value : '',
        done: doneEl ? doneEl.checked : false,
      });
    }
  });
  var idx = DEAL_MILESTONES.findIndex(function(m){ return m.dealId === dealId; });
  if (idx >= 0) { DEAL_MILESTONES[idx].milestones = milestones; }
  else { DEAL_MILESTONES.push({ dealId: dealId, milestones: milestones }); }
  saveState(); closeModal(); renderView();
}


// ============================================================
// DEAL AGE INFO + BADGE
// ============================================================
function dealAgeInfo(d) {
  if (!d.stageEnteredDate && !d.introDate) return { days: 0, label: '—', color: '#888', bg: '#f0ede6' };
  var dateStr = d.stageEnteredDate || d.introDate;
  var entered = new Date(dateStr);
  var today   = new Date();
  var days    = Math.floor((today - entered) / (1000 * 60 * 60 * 24));
  var label   = days < 7 ? days + 'd' : days < 30 ? Math.floor(days/7) + 'w' : Math.floor(days/30) + 'mo';
  var color   = days <= 30 ? '#3a6b4a' : days <= 60 ? '#8b7a2a' : '#8b3a3a';
  var bg      = days <= 30 ? '#e8f3eb' : days <= 60 ? '#f5f0e0' : '#f5e8e8';
  return { days, label, color, bg };
}

function dealAgeBadge(d) {
  if (!d.stageEnteredDate) return '';
  var entered = new Date(d.stageEnteredDate);
  var today   = new Date();
  var days    = Math.floor((today - entered) / (1000 * 60 * 60 * 24));
  var label   = days < 7 ? days + 'd' : days < 30 ? Math.floor(days/7) + 'w' : Math.floor(days/30) + 'mo';
  var color   = days <= 30 ? '#3a6b4a' : days <= 60 ? '#8b7a2a' : '#8b3a3a';
  var bg      = days <= 30 ? '#e8f3eb' : days <= 60 ? '#f5f0e0' : '#f5e8e8';
  return '<span style="font-size:9px;font-weight:500;color:' + color + ';background:' + bg + ';border-radius:3px;padding:1px 5px;letter-spacing:0.02em;" title="' + days + ' days in this stage">' + label + ' in stage</span>';
}

