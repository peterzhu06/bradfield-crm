// ============================================================
// PIPELINE CHARTS — registry + customisable "Charts" tab
// ------------------------------------------------------------
// Every chart is described once in PIPELINE_CHART_REGISTRY and can
// be drawn in any container. The Charts tab lets users pick which
// charts to show, their style (bar / horizontal bar / donut) and
// order; the layout is stored in the shared settings (PIPELINE_CHARTS).
// ============================================================

var STAGE_WEIGHTS = { origination: 0.2, mandate: 0.5, live: 0.8, paused: 0.1 };
var PC_STAGE_ORDER  = ['origination', 'mandate', 'live', 'paused'];
var PC_STAGE_LABELS = { origination:'Origination', mandate:'Mandate', live:'Execution', paused:'Paused' };
var PC_STAGE_COLORS = { origination:'#78716c', mandate:'#c8570a', live:'#44403c', paused:'#c4b5a5' };
var PC_RAG_COLORS   = { green:'#3a6b4a', amber:'#b08a1e', red:'#8b3a3a' };
var PC_PALETTE      = ['#1a1a1a','#b9975b','#818cf8','#22c55e','#f97316','#38bdf8','#e879f9','#94a3b8'];

function pcActiveDeals() { return DEALS.filter(function(d){ return PC_STAGE_ORDER.includes(d.stage); }); }
function pcMoney(v) { return 'A$' + (Math.round(v * 10) / 10) + 'm'; }
function pcQuarter(dateStr) {
  if (!dateStr) return null;
  var d = new Date(dateStr); if (isNaN(d)) return null;
  return 'Q' + (Math.floor(d.getMonth() / 3) + 1) + ' ' + d.getFullYear();
}

// ── Registry ─────────────────────────────────────────────────
// kinds: which visual styles the chart supports; the first is the default.
// build(): returns { labels, datasets:[{label,data,colors}], stacked, unit }
var PIPELINE_CHART_REGISTRY = {
  stageValue: {
    title: 'Value by Stage', sub: 'A$m — active deals', kinds: ['hbar','bar','doughnut'], unit: 'money',
    build: function() {
      return { labels: PC_STAGE_ORDER.map(function(k){ return PC_STAGE_LABELS[k]; }),
        datasets: [{ data: PC_STAGE_ORDER.map(function(k){ return DEALS.filter(function(d){ return d.stage===k; }).reduce(function(s,d){ return s+d.sizeMn; },0); }),
                     colors: PC_STAGE_ORDER.map(function(k){ return PC_STAGE_COLORS[k]; }) }] };
    }
  },
  dealType: {
    title: 'Value by Deal Type', sub: 'A$m — active pipeline', kinds: ['hbar','bar','doughnut'], unit: 'money',
    build: function() {
      var m = {}; pcActiveDeals().forEach(function(d){ m[d.dealType] = (m[d.dealType]||0) + d.sizeMn; });
      var labels = Object.keys(m).sort(function(a,b){ return m[b]-m[a]; });
      return { labels: labels, datasets: [{ data: labels.map(function(l){ return m[l]; }), colors: labels.map(function(_,i){ return PC_PALETTE[i % PC_PALETTE.length]; }) }] };
    }
  },
  ownerStage: {
    title: 'Value by Owner & Stage', sub: 'A$m per stage per owner', kinds: ['table'],
    renderHTML: function() { return pcOwnerStageTable(); }
  },
  sector: {
    title: 'Deals by Sector', sub: 'Count — active pipeline', kinds: ['doughnut','hbar','bar'], unit: 'count',
    build: function() {
      var m = {}; pcActiveDeals().forEach(function(d){ m[d.sector] = (m[d.sector]||0) + 1; });
      var labels = Object.keys(m);
      return { labels: labels, datasets: [{ data: labels.map(function(l){ return m[l]; }), colors: labels.map(function(_,i){ return PC_PALETTE[i % PC_PALETTE.length]; }) }] };
    }
  },
  // ── New charts ───────────────────────────────────────────
  ageing: {
    title: 'Pipeline Ageing', sub: 'Days in current stage — coloured by status', kinds: ['hbar','bar'], unit: 'days',
    build: function() {
      var rows = pcActiveDeals().map(function(d){ var info = dealAgeInfo(d); return { name: d.company, days: info ? info.days : 0, rag: d.statusKey || 'green' }; })
        .filter(function(r){ return r.days > 0; }).sort(function(a,b){ return b.days - a.days; }).slice(0, 12);
      return { labels: rows.map(function(r){ return r.name; }),
        datasets: [{ data: rows.map(function(r){ return r.days; }), colors: rows.map(function(r){ return PC_RAG_COLORS[r.rag] || '#888'; }) }] };
    }
  },
  closesByQuarter: {
    title: 'Expected Closes by Quarter', sub: 'A$m by target close date, stacked by stage', kinds: ['bar','hbar'], unit: 'money', stacked: true,
    build: function() {
      var deals = pcActiveDeals();
      var qs = {}; deals.forEach(function(d){ var q = pcQuarter(d.closeDate) || 'Unscheduled'; qs[q] = true; });
      var labels = Object.keys(qs).filter(function(q){ return q !== 'Unscheduled'; }).sort(function(a,b){
        var pa = a.split(' '), pb = b.split(' '); return (pa[1]-pb[1]) || (pa[0] > pb[0] ? 1 : -1); });
      if (qs['Unscheduled']) labels.push('Unscheduled');
      return { labels: labels, datasets: PC_STAGE_ORDER.map(function(stage){
        return { label: PC_STAGE_LABELS[stage], colors: PC_STAGE_COLORS[stage],
          data: labels.map(function(q){ return deals.filter(function(d){ return d.stage===stage && (pcQuarter(d.closeDate)||'Unscheduled')===q; }).reduce(function(s,d){ return s+d.sizeMn; },0); }) };
      }) };
    }
  },
  healthByStage: {
    title: 'Deal Health by Stage', sub: 'Count of deals by status — green / amber / red', kinds: ['bar','hbar'], unit: 'count', stacked: true,
    build: function() {
      var deals = pcActiveDeals();
      return { labels: PC_STAGE_ORDER.map(function(k){ return PC_STAGE_LABELS[k]; }),
        datasets: ['green','amber','red'].map(function(rag){
          return { label: { green:'On track', amber:'Watch', red:'At risk' }[rag], colors: PC_RAG_COLORS[rag],
            data: PC_STAGE_ORDER.map(function(stage){ return deals.filter(function(d){ return d.stage===stage && (d.statusKey||'green')===rag; }).length; }) };
        }) };
    }
  },
  weightedByOwner: {
    title: 'Weighted vs Gross Pipeline', sub: 'A$m by owner — probability-weighted by stage (20/50/80/10%)', kinds: ['bar','hbar'], unit: 'money',
    build: function() {
      var deals = pcActiveDeals();
      var owners = Array.from(new Set(deals.map(function(d){ return d.owner; }))).sort();
      return { labels: owners, datasets: [
        { label: 'Gross', colors: '#d6d3cd', data: owners.map(function(o){ return deals.filter(function(d){ return d.owner===o; }).reduce(function(s,d){ return s+d.sizeMn; },0); }) },
        { label: 'Weighted', colors: '#b9975b', data: owners.map(function(o){ return deals.filter(function(d){ return d.owner===o; }).reduce(function(s,d){ return s + d.sizeMn * (STAGE_WEIGHTS[d.stage]||0); },0); }) },
      ] };
    }
  },
};

var PC_KIND_LABELS = { bar:'Bar', hbar:'Horizontal', doughnut:'Donut', table:'Table' };

// ── Drawing ──────────────────────────────────────────────────
function pcFormat(unit, v) {
  if (unit === 'money') return pcMoney(v);
  if (unit === 'days')  return v + ' day' + (v===1?'':'s');
  return v + (unit === 'count' ? ' deal' + (v===1?'':'s') : '');
}

function drawPipelineChart(id, kind, canvasId) {
  var spec = PIPELINE_CHART_REGISTRY[id]; if (!spec || !spec.build) return;
  var c = document.getElementById(canvasId); if (!c) return;
  var existing = window.Chart.getChart(c); if (existing) existing.destroy();
  var data = spec.build();
  var unit = spec.unit, tickCol = '#999', gridCol = 'rgba(0,0,0,0.04)';
  var multi = data.datasets.length > 1;
  var fmtTick = function(v){ return unit === 'money' ? 'A$' + v + 'm' : v; };

  if (kind === 'doughnut') {
    var ds = data.datasets[0];
    new window.Chart(c, { type: 'doughnut',
      data: { labels: data.labels, datasets: [{ data: ds.data, backgroundColor: ds.colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '58%',
        plugins: { legend: { position: 'right', labels: { font: { size: 9 }, color: '#555', boxWidth: 8, padding: 5 } },
                   tooltip: { callbacks: { label: function(ctx){ return ' ' + pcFormat(unit, ctx.raw); } } } } } });
    return;
  }
  var horizontal = kind === 'hbar';
  var valueAxis = { grid: { color: gridCol }, ticks: { color: tickCol, font: { size: 9 }, callback: fmtTick, precision: 0 }, beginAtZero: true, stacked: !!spec.stacked };
  var catAxis   = { grid: { display: false }, ticks: { color: '#555', font: { size: 9 } }, stacked: !!spec.stacked };
  new window.Chart(c, { type: 'bar',
    data: { labels: data.labels, datasets: data.datasets.map(function(ds){ return { label: ds.label, data: ds.data, backgroundColor: ds.colors, borderRadius: 3, borderSkipped: false }; }) },
    options: { indexAxis: horizontal ? 'y' : 'x', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: multi, position: 'top', labels: { font: { size: 9 }, color: '#555', boxWidth: 8, padding: 8 } },
                 tooltip: { callbacks: { label: function(ctx){ return ' ' + (ctx.dataset.label ? ctx.dataset.label + ': ' : '') + pcFormat(unit, ctx.raw); } } } },
      scales: horizontal ? { x: valueAxis, y: catAxis } : { x: catAxis, y: valueAxis } } });
}

function pcOwnerStageTable() {
  var activeDeals = pcActiveDeals();
  var owners = Array.from(new Set(activeDeals.map(function(d){ return d.owner; }))).sort();
  var stageColMap = { origination:'#94a3b8', mandate:'#c9a84c', live:'#22c55e', paused:'#b0b0b0' };
  var colW = 'width:' + Math.floor(80 / Math.max(owners.length, 1)) + '%;';
  var t = '<table style="width:100%;border-collapse:collapse;font-size:10.5px;"><thead><tr>'
    + '<th style="text-align:left;padding:4px 6px;border-bottom:2px solid var(--border);width:20%;"></th>'
    + owners.map(function(o){ return '<th style="text-align:right;padding:4px 6px;color:#000;font-weight:600;font-size:10px;border-bottom:2px solid var(--border);' + colW + '">' + escHtml(o.split(' ').pop()) + '</th>'; }).join('')
    + '</tr></thead><tbody>';
  PC_STAGE_ORDER.forEach(function(stage) {
    t += '<tr style="border-bottom:1px solid var(--cream-d);"><td style="padding:5px 6px;color:var(--text-2);"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:' + stageColMap[stage] + ';margin-right:4px;vertical-align:middle;"></span>' + PC_STAGE_LABELS[stage] + '</td>';
    owners.forEach(function(o) {
      var val = activeDeals.filter(function(d){ return d.owner===o && d.stage===stage; }).reduce(function(s,d){ return s+d.sizeMn; }, 0);
      t += '<td style="padding:5px 6px;text-align:right;color:' + (val>0?'#000':'var(--muted)') + ';font-weight:' + (val>0?'500':'400') + ';">' + (val>0?'A$'+val+'m':'—') + '</td>';
    });
    t += '</tr>';
  });
  t += '<tr style="border-top:2px solid var(--border);"><td style="padding:5px 6px;color:#000;font-weight:600;font-size:10px;">Total</td>'
    + owners.map(function(o){ var tot = activeDeals.filter(function(d){ return d.owner===o; }).reduce(function(s,d){ return s+d.sizeMn; },0); return '<td style="padding:5px 6px;text-align:right;color:#000;font-weight:700;">' + (tot>0?'A$'+tot+'m':'—') + '</td>'; }).join('')
    + '</tr></tbody></table>';
  if (!owners.length) t = '<div style="font-size:11px;color:var(--muted);text-align:center;padding:24px 0;">No active deals</div>';
  return t;
}

// ── Board strip (the 4 tiles above the kanban) ───────────────
var PIPELINE_BOARD_STRIP = [
  { id:'stageValue', kind:'hbar' }, { id:'dealType', kind:'hbar' }, { id:'ownerStage', kind:'table' }, { id:'sector', kind:'doughnut' },
];

function pcCardHTML(item, idx, opts) {
  var spec = PIPELINE_CHART_REGISTRY[item.id]; if (!spec) return '';
  var h = opts.height || 130, editable = !!opts.editable;
  var kindBtns = '';
  if (editable && spec.kinds.length > 1) {
    kindBtns = '<div class="view-toggle" style="transform:scale(0.85);transform-origin:right center;">'
      + spec.kinds.map(function(k){ return '<button class="vt-btn ' + (k===item.kind?'active':'') + '" onclick="setPipelineChartKind(' + idx + ',\'' + k + '\')">' + PC_KIND_LABELS[k] + '</button>'; }).join('')
      + '</div>';
  }
  var controls = editable
    ? '<div style="display:flex;align-items:center;gap:4px;">' + kindBtns
      + '<button class="btn sm" title="Move left" onclick="movePipelineChart(' + idx + ',-1)" ' + (idx===0?'disabled':'') + '>◀</button>'
      + '<button class="btn sm" title="Move right" onclick="movePipelineChart(' + idx + ',1)" ' + (idx===opts.total-1?'disabled':'') + '>▶</button>'
      + '<button class="btn sm" title="Remove" onclick="removePipelineChart(' + idx + ')">✕</button>'
      + '</div>'
    : '';
  var body = spec.renderHTML
    ? '<div style="overflow:auto;">' + spec.renderHTML() + '</div>'
    : '<div style="position:relative;height:' + h + 'px;"><canvas id="' + opts.prefix + item.id + '"></canvas></div>';
  return '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:16px 18px;">'
    + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:12px;">'
    + '<div><div style="font-family:\'Spectral\',serif;font-size:13px;color:#000;margin-bottom:2px;">' + spec.title + '</div>'
    + '<div style="font-size:10px;color:var(--muted);">' + spec.sub + '</div></div>' + controls + '</div>'
    + body + '</div>';
}

function pcDrawAll(items, prefix) {
  loadChartJs().then(function() {
    items.forEach(function(it){ if (PIPELINE_CHART_REGISTRY[it.id] && PIPELINE_CHART_REGISTRY[it.id].build) drawPipelineChart(it.id, it.kind, prefix + it.id); });
  });
}

// ── Charts tab ───────────────────────────────────────────────
function pcConfig() {
  if (!Array.isArray(PIPELINE_CHARTS)) PIPELINE_CHARTS = [];
  PIPELINE_CHARTS = PIPELINE_CHARTS.filter(function(it){ return it && PIPELINE_CHART_REGISTRY[it.id]; })
    .map(function(it){ var spec = PIPELINE_CHART_REGISTRY[it.id]; return { id: it.id, kind: spec.kinds.includes(it.kind) ? it.kind : spec.kinds[0] }; });
  return PIPELINE_CHARTS;
}

function renderPipelineCharts() {
  var items = pcConfig();
  var used = items.map(function(i){ return i.id; });
  var available = Object.keys(PIPELINE_CHART_REGISTRY).filter(function(id){ return !used.includes(id); });
  var cols = state.pipelineChartCols || 2;

  var toolbar = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;">'
    + '<select onchange="if(this.value){addPipelineChart(this.value);}" style="font-size:12px;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--white);">'
    + '<option value="">+ Add chart…</option>'
    + available.map(function(id){ return '<option value="' + id + '">' + PIPELINE_CHART_REGISTRY[id].title + '</option>'; }).join('')
    + (available.length ? '' : '<option disabled>All charts added</option>')
    + '</select>'
    + '<div class="view-toggle"><button class="vt-btn ' + (cols===2?'active':'') + '" onclick="state.pipelineChartCols=2;renderView()">2 columns</button><button class="vt-btn ' + (cols===3?'active':'') + '" onclick="state.pipelineChartCols=3;renderView()">3 columns</button></div>'
    + '<div class="toolbar-spacer"></div>'
    + '<span style="font-size:11px;color:var(--muted);">' + items.length + ' of ' + Object.keys(PIPELINE_CHART_REGISTRY).length + ' charts · layout is shared with the team</span>'
    + '<button class="btn sm" onclick="resetPipelineCharts()">Reset to default</button>'
    + '</div>';

  var grid = items.length
    ? '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:14px;">'
      + items.map(function(it, i){ return pcCardHTML(it, i, { prefix: 'pc-', height: cols===3 ? 200 : 240, editable: true, total: items.length }); }).join('')
      + '</div>'
    : '<div style="background:var(--white);border:1px dashed var(--border);border-radius:8px;padding:40px;text-align:center;color:var(--muted);font-size:12.5px;">No charts selected — use “Add chart” above.</div>';

  setTimeout(function(){ pcDrawAll(items, 'pc-'); }, 60);
  return toolbar + grid;
}

function savePipelineCharts() { saveState(); renderView(); }
function addPipelineChart(id) {
  var spec = PIPELINE_CHART_REGISTRY[id]; if (!spec) return;
  pcConfig().push({ id: id, kind: spec.kinds[0] }); savePipelineCharts();
}
function removePipelineChart(idx) { pcConfig().splice(idx, 1); savePipelineCharts(); }
function movePipelineChart(idx, dir) {
  var arr = pcConfig(), j = idx + dir; if (j < 0 || j >= arr.length) return;
  var t = arr[idx]; arr[idx] = arr[j]; arr[j] = t; savePipelineCharts();
}
function setPipelineChartKind(idx, kind) { var arr = pcConfig(); if (arr[idx]) { arr[idx].kind = kind; savePipelineCharts(); } }
function resetPipelineCharts() {
  PIPELINE_CHARTS = deepClone(DEFAULT_PIPELINE_CHARTS); savePipelineCharts();
}
