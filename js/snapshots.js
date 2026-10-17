// ============================================================
// WEEKLY SNAPSHOT
// ============================================================
function getSnapshotSections() {
  if (!state.snapshotSections) {
    state.snapshotSections = {
      kpis: true,
      chartStage: true,
      chartDealType: true,
      chartOwnerStage: true,
      chartSector: true,
      pipelineValueOverTime: true,
      forecastCloseValue: true,
      pipelineTable: true
    };
  }
  return state.snapshotSections;
}

function openSnapshotCustomizer() {
  var sec = getSnapshotSections();
  var items = [
    { key:'kpis',                  label:'Summary KPIs',            sub:'Active Deals, Total Pipeline, Execution, On Pause' },
    { key:'chartStage',            label:'Value by Stage',          sub:'Chart' },
    { key:'chartDealType',         label:'Value by Deal Type',      sub:'Chart' },
    { key:'chartOwnerStage',       label:'Value by Owner & Stage',  sub:'Table' },
    { key:'chartSector',           label:'Deals by Sector',         sub:'Chart' },
    { key:'pipelineValueOverTime', label:'Pipeline Value Over Time',sub:'New — cumulative chart based on each deal\'s Date Introduced and, if archived, its archive date' },
    { key:'forecastCloseValue',    label:'Forecast Close Value — Rest of Year', sub:'New — based on each deal\'s Target Close Date' },
    { key:'pipelineTable',         label:'Active Pipeline Table',   sub:'Full deal list with linked tasks' }
  ];
  var body = '<div style="font-size:12.5px;color:var(--text-2);margin-bottom:12px;">Choose what to include in this snapshot.</div>'
    + '<div style="display:flex;flex-direction:column;gap:6px;">'
    + items.map(function(it){
        return '<div style="display:flex;align-items:flex-start;gap:10px;padding:9px 12px;background:var(--white);border:1px solid var(--border);border-radius:6px;">'
          + '<input type="checkbox" id="snap-'+it.key+'" '+(sec[it.key]?'checked':'')+' style="width:14px;height:14px;margin-top:2px;accent-color:#000;cursor:pointer;">'
          + '<label for="snap-'+it.key+'" style="flex:1;cursor:pointer;"><div style="font-size:13px;color:var(--text);">'+it.label+'</div><div style="font-size:11px;color:var(--muted);margin-top:1px;">'+it.sub+'</div></label>'
          + '</div>';
      }).join('')
    + '</div>';
  var footer = '<button class="btn" onclick="closeModal()" style="margin-right:8px;">Cancel</button>'
    + '<button class="btn primary" onclick="confirmGenerateSnapshot()">Generate Snapshot</button>';
  openModal('Customise Weekly Snapshot', body, footer);
}

function confirmGenerateSnapshot() {
  var sec = getSnapshotSections();
  var keys = ['kpis','chartStage','chartDealType','chartOwnerStage','chartSector','pipelineValueOverTime','forecastCloseValue','pipelineTable'];
  var anyChecked = false;
  keys.forEach(function(key){
    var el = document.getElementById('snap-'+key);
    if (el) { sec[key] = el.checked; if (el.checked) anyChecked = true; }
  });
  if (!anyChecked) { alert('Please select at least one section to include.'); return; }
  saveState();
  closeModal();
  generateWeeklySnapshot();
}

function generateWeeklySnapshot() {
  var sec = getSnapshotSections();
  var today    = new Date();
  var todayISO = today.toISOString().slice(0,10);
  var dateStr  = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  var activeDeals = DEALS.filter(function(d){ return d.stage !== 'closed_won' && d.stage !== 'closed_lost'; });
  var totalPipeline = activeDeals.reduce(function(s,d){ return s + d.sizeMn; }, 0);

  var stageOrder  = ['live','mandate','origination','paused'];
  var stageNames  = { live:'Execution', mandate:'Mandated', origination:'Origination', paused:'On Pause' };
  var stageColors = { live:'#2a6b5a', mandate:'#8b7a2a', origination:'#3a6b8b', paused:'#888' };
  var stageColorsChart = { origination:'#78716c', mandate:'#c8570a', live:'#44403c', paused:'#c4b5a5' };

  var dealRows = '';
  if (sec.pipelineTable) {
    dealRows = stageOrder.map(function(stage) {
      var deals = activeDeals.filter(function(d){ return d.stage === stage; });
      if (!deals.length) return '';
      var rows = deals.map(function(d) {
        var days = d.stageEnteredDate ? Math.floor((today - new Date(d.stageEnteredDate)) / 86400000) : null;
        var ageStr = days !== null ? (days < 7 ? days+'d' : days < 30 ? Math.floor(days/7)+'w' : Math.floor(days/30)+'mo') : '—';
        var dealTasks = TASKS.filter(function(t){ return t.dealId === d.id && t.status !== 'done'; });
        var tasksHtml = dealTasks.length
          ? dealTasks.map(function(t){
              var pri = t.priority==='High' ? '#c8570a' : t.priority==='Medium' ? '#78716c' : '#aaa';
              return '<div style="display:flex;align-items:flex-start;gap:4px;margin-bottom:3px;"><span style="width:5px;height:5px;border-radius:50%;background:'+pri+';flex-shrink:0;margin-top:4px;"></span><span>'+t.title+(t.dueDate?' <span style="color:#aaa;">· '+t.dueDate+'</span>':'')+'</span></div>';
            }).join('')
          : '<span style="color:#bbb;">—</span>';
        return '<tr style="border-bottom:1px solid #f0ede8;">'
          + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">' + d.company + '</td>'
          + '<td style="padding:9px 12px;font-size:11px;color:#555;">' + d.size + '</td>'
          + '<td style="padding:9px 12px;font-size:11px;color:#555;">' + d.dealType + '</td>'
          + '<td style="padding:9px 12px;font-size:11px;color:#555;">' + d.owner + '</td>'
          + '<td style="padding:9px 12px;font-size:11px;color:#777;">' + ageStr + '</td>'
          + '<td style="padding:9px 12px;vertical-align:top;font-size:10.5px;color:#444;line-height:1.5;">'+(d.nextStep||'—')+'</td>'
          + '<td style="padding:9px 12px;font-size:10.5px;color:#444;max-width:240px;line-height:1.5;">' + tasksHtml + '</td>'
          + '</tr>';
      }).join('');
      return '<tr><td colspan="7" style="padding:14px 12px 6px;background:#faf8f4;"><span style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:' + stageColors[stage] + ';">' + stageNames[stage] + '</span></td></tr>' + rows;
    }).join('');
  }

  // ── Chart data ───────────────────────────────────────────────
  var stageChartOrder = ['origination','mandate','live','paused'];
  var stageChartLabels = ['Origination','Mandate','Execution','Paused'];
  var stageChartVals   = stageChartOrder.map(function(k){ return activeDeals.filter(function(d){ return d.stage===k; }).reduce(function(s,d){ return s+d.sizeMn; },0); });
  var stageChartColors = stageChartOrder.map(function(k){ return stageColorsChart[k]; });

  var dealTypeMap = {};
  activeDeals.forEach(function(d){ dealTypeMap[d.dealType] = (dealTypeMap[d.dealType]||0) + d.sizeMn; });
  var dealTypeLabels = Object.keys(dealTypeMap).sort(function(a,b){ return dealTypeMap[b]-dealTypeMap[a]; });
  var dealTypeVals   = dealTypeLabels.map(function(t){ return dealTypeMap[t]; });
  var dealTypePalette = ['#1c1c1a','#c8570a','#78716c','#92400e','#44403c','#d6bfad','#7c2d12','#a8a29e'];
  var dealTypeColors  = dealTypeLabels.map(function(_,i){ return dealTypePalette[i % dealTypePalette.length]; });

  var ownerMap = {};
  activeDeals.forEach(function(d){ ownerMap[d.owner] = (ownerMap[d.owner]||0) + d.sizeMn; });
  var ownerLabels = Object.keys(ownerMap).sort();

  var ownerStageTableHtml = '';
  if (sec.chartOwnerStage) {
    var ownerStageOrder  = ['origination','mandate','live','paused'];
    var ownerStageNames  = { origination:'Origination', mandate:'Mandate', live:'Execution', paused:'Paused' };
    var ownerStageDots   = { origination:'#78716c', mandate:'#c8570a', live:'#44403c', paused:'#c4b5a5' };
    (function() {
      var colW = Math.floor(78 / Math.max(ownerLabels.length, 1));
      var tbl = '<table style="width:100%;border-collapse:collapse;font-size:10.5px;">';
      tbl += '<thead><tr><th style="text-align:left;padding:4px 5px;color:#aaa;font-size:9px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e8e4de;width:22%;"></th>';
      ownerLabels.forEach(function(o) {
        tbl += '<th style="text-align:right;padding:4px 5px;color:#1a1a1a;font-weight:600;font-size:10px;border-bottom:2px solid #e8e4de;width:' + colW + '%;">' + o.split(' ').pop() + '</th>';
      });
      tbl += '</tr></thead><tbody>';
      ownerStageOrder.forEach(function(stage) {
        var dot = '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:' + ownerStageDots[stage] + ';margin-right:4px;vertical-align:middle;"></span>';
        tbl += '<tr style="border-bottom:1px solid #f0ede8;"><td style="padding:5px 5px;color:#555;">' + dot + ownerStageNames[stage] + '</td>';
        ownerLabels.forEach(function(o) {
          var val = activeDeals.filter(function(d){ return d.owner===o && d.stage===stage; }).reduce(function(s,d){ return s+d.sizeMn; },0);
          tbl += '<td style="padding:5px 5px;text-align:right;color:' + (val>0?'#1a1a1a':'#bbb') + ';font-weight:' + (val>0?'500':'400') + ';">' + (val>0?'A$'+val+'m':'—') + '</td>';
        });
        tbl += '</tr>';
      });
      tbl += '<tr style="border-top:2px solid #e8e4de;"><td style="padding:5px 5px;color:#1a1a1a;font-weight:700;font-size:10px;">Total</td>';
      ownerLabels.forEach(function(o) {
        var total = activeDeals.filter(function(d){ return d.owner===o; }).reduce(function(s,d){ return s+d.sizeMn; },0);
        tbl += '<td style="padding:5px 5px;text-align:right;color:#1a1a1a;font-weight:700;">' + (total>0?'A$'+total+'m':'—') + '</td>';
      });
      tbl += '</tr></tbody></table>';
      ownerStageTableHtml = tbl;
    })();
  }

  var sectorMap = {};
  activeDeals.forEach(function(d){ sectorMap[d.sector] = (sectorMap[d.sector]||0)+1; });
  var sectorLabels = Object.keys(sectorMap).sort();
  var sectorVals   = sectorLabels.map(function(s){ return sectorMap[s]; });
  var sectorPalette = ['#c8570a','#1c1c1a','#78716c','#92400e','#44403c','#7c2d12','#d6bfad','#a8a29e'];

  // ── Pipeline Value Over Time (cumulative, based on Date Introduced / Archive Date) ──
  var pvLabels = [], pvVals = [];
  if (sec.pipelineValueOverTime) {
    var events = [];
    DEALS.forEach(function(d){ if (d.introDate) events.push({ date: d.introDate, delta: (d.sizeMn||0) }); });
    ARCHIVED_DEALS.forEach(function(d){
      if (d.introDate)  events.push({ date: d.introDate,  delta: (d.sizeMn||0) });
      if (d.archivedAt) events.push({ date: d.archivedAt, delta: -(d.sizeMn||0) });
    });
    var byDate = {};
    events.forEach(function(e){ if (!e.date) return; byDate[e.date] = (byDate[e.date]||0) + e.delta; });
    var evDates = Object.keys(byDate).sort();
    var cum = 0;
    evDates.forEach(function(dt){ cum += byDate[dt]; pvLabels.push(dt); pvVals.push(Math.round(cum*100)/100); });
  }

  // ── Forecast Close Value — Rest of Year (based on Target Close Date) ──
  var forecastMonthLabels = [], forecastMonthVals = [], forecastTotal = 0, forecastCount = 0;
  if (sec.forecastCloseValue) {
    var thisYearNum  = today.getFullYear();
    var monthNames   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var startMonth   = today.getMonth();
    for (var m = startMonth; m <= 11; m++) {
      var monthDeals = activeDeals.filter(function(d){
        if (!d.closeDate || d.closeDate < todayISO) return false;
        var cd = new Date(d.closeDate);
        return cd.getFullYear() === thisYearNum && cd.getMonth() === m;
      });
      forecastMonthLabels.push(monthNames[m] + ' ' + thisYearNum);
      forecastMonthVals.push(Math.round(monthDeals.reduce(function(s,d){ return s + (d.sizeMn||0); }, 0)*100)/100);
    }
    var forecastDeals = activeDeals.filter(function(d){
      if (!d.closeDate || d.closeDate < todayISO) return false;
      return new Date(d.closeDate).getFullYear() === thisYearNum;
    });
    forecastTotal = forecastDeals.reduce(function(s,d){ return s + (d.sizeMn||0); }, 0);
    forecastCount = forecastDeals.length;
  }

  var chartData = JSON.stringify({
    stageLabels: stageChartLabels, stageVals: stageChartVals, stageColors: stageChartColors,
    dealTypeLabels: dealTypeLabels, dealTypeVals: dealTypeVals, dealTypeColors: dealTypeColors,
    sectorLabels: sectorLabels, sectorVals: sectorVals, sectorPalette: sectorPalette,
    pvLabels: pvLabels, pvVals: pvVals,
    forecastMonthLabels: forecastMonthLabels, forecastMonthVals: forecastMonthVals
  });

  // ── Assemble optional HTML blocks ───────────────────────────
  var kpiHtml = '';
  if (sec.kpis) {
    kpiHtml = '<div class="kpi-row">'
      + '<div class="kpi"><div class="kpi-label">Active Deals</div><div class="kpi-value">' + activeDeals.length + '</div><div class="kpi-sub">In pipeline</div></div>'
      + '<div class="kpi"><div class="kpi-label">Total Pipeline</div><div class="kpi-value">A$' + totalPipeline + 'm</div><div class="kpi-sub">Gross deal value</div></div>'
      + '<div class="kpi"><div class="kpi-label">Execution</div><div class="kpi-value">' + activeDeals.filter(function(d){return d.stage==='live';}).length + '</div><div class="kpi-sub">Active mandates</div></div>'
      + '<div class="kpi"><div class="kpi-label">On Pause</div><div class="kpi-value">' + activeDeals.filter(function(d){return d.stage==='paused';}).length + '</div><div class="kpi-sub">Paused transactions</div></div>'
      + '</div>';
  }

  var smallCells = [];
  if (sec.chartStage)      smallCells.push('<div class="chart-cell"><div class="chart-label">Value by Stage</div><div class="chart-wrap"><canvas id="sn-stage"></canvas></div></div>');
  if (sec.chartDealType)   smallCells.push('<div class="chart-cell"><div class="chart-label">Value by Deal Type</div><div class="chart-wrap"><canvas id="sn-dealType"></canvas></div></div>');
  if (sec.chartOwnerStage) smallCells.push('<div class="chart-cell"><div class="chart-label">Value by Owner &amp; Stage</div>' + ownerStageTableHtml + '</div>');
  if (sec.chartSector)     smallCells.push('<div class="chart-cell"><div class="chart-label">Deals by Sector</div><div class="chart-wrap"><canvas id="sn-sector"></canvas></div></div>');
  var chartsGridHtml = smallCells.length ? ('<div class="charts-grid" style="grid-template-columns:repeat(' + smallCells.length + ',1fr);">' + smallCells.join('') + '</div>') : '';

  var pvSectionHtml = '';
  if (sec.pipelineValueOverTime) {
    pvSectionHtml = '<div class="section-title">Pipeline Value Over Time</div>'
      + '<div style="padding:16px 24px;border-bottom:1px solid #e8e4de;"><div class="chart-wrap" style="height:220px;"><canvas id="sn-pipelineValue"></canvas></div>'
      + '<div style="font-size:10px;color:#aaa;margin-top:8px;">Cumulative gross pipeline value — rises when a deal is introduced (Date Introduced), falls when a deal is archived (closed or lost).</div></div>';
  }

  var forecastSectionHtml = '';
  if (sec.forecastCloseValue) {
    forecastSectionHtml = '<div class="section-title">Forecast Close Value — Rest of ' + today.getFullYear() + '</div>'
      + '<div class="kpi-row" style="border-bottom:1px solid #e8e4de;">'
      + '<div class="kpi"><div class="kpi-label">Forecast Value</div><div class="kpi-value">A$' + (Math.round(forecastTotal*100)/100) + 'm</div><div class="kpi-sub">Based on target close dates</div></div>'
      + '<div class="kpi"><div class="kpi-label">Deals Forecast</div><div class="kpi-value">' + forecastCount + '</div><div class="kpi-sub">Scheduled to close by year end</div></div>'
      + '</div>'
      + '<div style="padding:16px 24px;border-bottom:1px solid #e8e4de;"><div class="chart-wrap" style="height:200px;"><canvas id="sn-forecast"></canvas></div></div>';
  }

  var pipelineTableHtml = '';
  if (sec.pipelineTable) {
    pipelineTableHtml = '<div class="section-title">Active Pipeline</div>'
      + '<table style="table-layout:fixed;width:100%;"><colgroup><col style="width:13%"><col style="width:7%"><col style="width:10%"><col style="width:9%"><col style="width:6%"><col style="width:28%"><col style="width:27%"></colgroup><thead><tr><th>Deal</th><th>Size</th><th>Type</th><th>Owner</th><th>Stage</th><th>Status</th><th>Tasks</th></tr></thead><tbody>' + dealRows + '</tbody></table>';
  }

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
    + '<title>Bradfield Advisors — Weekly Pipeline Snapshot</title>'
    + '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#faf8f4;color:#1a1a1a;padding:32px;}@media print{body{padding:16px;background:#fff;}}.page{max-width:980px;margin:0 auto;background:#fff;border:1px solid #e8e4de;border-radius:8px;overflow:hidden;}.header{background:#1a1a1a;color:#fff;padding:24px 32px;display:flex;justify-content:space-between;align-items:flex-end;}.header h1{font-family:Georgia,serif;font-size:20px;font-weight:400;letter-spacing:0.02em;}.header .meta{font-size:11px;color:#aaa;text-align:right;line-height:1.6;}table{width:100%;border-collapse:collapse;}th{padding:8px 12px;text-align:left;font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#888;border-bottom:2px solid #e8e4de;background:#faf8f4;}.section-title{font-family:Georgia,serif;font-size:14px;color:#1a1a1a;padding:20px 24px 12px;border-bottom:1px solid #e8e4de;}.kpi-row{display:flex;gap:0;border-bottom:1px solid #e8e4de;}.kpi{flex:1;padding:16px 24px;border-right:1px solid #e8e4de;}.kpi:last-child{border-right:none;}.kpi-label{font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:4px;}.kpi-value{font-family:Georgia,serif;font-size:22px;color:#1a1a1a;}.kpi-sub{font-size:10px;color:#aaa;margin-top:2px;}.charts-grid{display:grid;gap:0;border-bottom:1px solid #e8e4de;}.chart-cell{padding:16px 16px 12px;border-right:1px solid #e8e4de;overflow:hidden;}.chart-cell:last-child{border-right:none;}.chart-label{font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#888;margin-bottom:10px;}.chart-wrap{position:relative;height:160px;width:100%;}.footer{padding:14px 24px;background:#faf8f4;border-top:1px solid #e8e4de;font-size:10px;color:#aaa;display:flex;justify-content:space-between;}.print-btn{position:fixed;bottom:24px;right:24px;background:#1a1a1a;color:#fff;border:none;padding:10px 20px;border-radius:6px;font-size:13px;cursor:pointer;}@media print{.print-btn{display:none;}}</style>'
    + '</head><body>'
    + '<div class="page">'
    + '<div class="header"><div><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;margin-bottom:6px;">Bradfield Advisors</div><h1>Weekly Pipeline Snapshot</h1></div><div class="meta"><div>' + dateStr + '</div><div style="margin-top:2px;">Confidential — Internal Use Only</div></div></div>'
    + kpiHtml
    + chartsGridHtml
    + pvSectionHtml
    + forecastSectionHtml
    + pipelineTableHtml
    + '<div class="footer"><div>Bradfield Advisors — Confidential</div><div>Generated ' + dateStr + '</div></div>'
    + '</div>'
    + '<button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>'
    + '<scr'+'ipt>'
    + 'var D=' + chartData + ';'
    + 'var gOpts={responsive:true,maintainAspectRatio:false};'
    + (sec.chartStage ? 'if(document.getElementById("sn-stage")){new Chart(document.getElementById("sn-stage"),{type:"bar",data:{labels:D.stageLabels,datasets:[{data:D.stageVals,backgroundColor:D.stageColors,borderRadius:3,borderSkipped:false}]},options:Object.assign({},gOpts,{indexAxis:"y",plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return" A$"+c.raw+"m";}}}},scales:{x:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{color:"#999",font:{size:9},callback:function(v){return"A$"+v+"m";}},beginAtZero:true},y:{grid:{display:false},ticks:{color:"#555",font:{size:9}}}}})});}' : '')
    + (sec.chartDealType ? 'if(document.getElementById("sn-dealType")){new Chart(document.getElementById("sn-dealType"),{type:"bar",data:{labels:D.dealTypeLabels,datasets:[{data:D.dealTypeVals,backgroundColor:D.dealTypeColors,borderRadius:3,borderSkipped:false}]},options:Object.assign({},gOpts,{indexAxis:"y",plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return" A$"+c.raw+"m";}}}},scales:{x:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{color:"#999",font:{size:9},callback:function(v){return"A$"+v+"m";}},beginAtZero:true},y:{grid:{display:false},ticks:{color:"#555",font:{size:8}}}}})});}' : '')
    + (sec.chartSector ? 'if(document.getElementById("sn-sector")){new Chart(document.getElementById("sn-sector"),{type:"doughnut",data:{labels:D.sectorLabels,datasets:[{data:D.sectorVals,backgroundColor:D.sectorPalette.slice(0,D.sectorLabels.length),borderWidth:2,borderColor:"#fff"}]},options:Object.assign({},gOpts,{cutout:"55%",plugins:{legend:{position:"bottom",labels:{font:{size:8},boxWidth:8,padding:3}},tooltip:{callbacks:{label:function(c){return" "+c.raw+" deal"+(c.raw!==1?"s":"");}}}}})});}' : '')
    + (sec.pipelineValueOverTime ? 'if(document.getElementById("sn-pipelineValue")){new Chart(document.getElementById("sn-pipelineValue"),{type:"line",data:{labels:D.pvLabels,datasets:[{data:D.pvVals,borderColor:"#1a1a1a",backgroundColor:"rgba(201,168,76,0.18)",borderWidth:2,fill:true,stepped:true,pointRadius:2,pointBackgroundColor:"#c9a84c"}]},options:Object.assign({},gOpts,{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return" A$"+c.raw+"m";}}}},scales:{x:{grid:{display:false},ticks:{color:"#999",font:{size:9},maxRotation:45,autoSkip:true,maxTicksLimit:10}},y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{color:"#999",font:{size:9},callback:function(v){return"A$"+v+"m";}}}}})});}' : '')
    + (sec.forecastCloseValue ? 'if(document.getElementById("sn-forecast")){new Chart(document.getElementById("sn-forecast"),{type:"bar",data:{labels:D.forecastMonthLabels,datasets:[{data:D.forecastMonthVals,backgroundColor:"#c8570a",borderRadius:3,borderSkipped:false}]},options:Object.assign({},gOpts,{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return" A$"+c.raw+"m";}}}},scales:{x:{grid:{display:false},ticks:{color:"#999",font:{size:9}}},y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{color:"#999",font:{size:9},callback:function(v){return"A$"+v+"m";}},beginAtZero:true}}})});}' : '')
    + '<'+'/'+'script>'
    + '</body></html>';

  var blob = new Blob([html], { type: 'text/html' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'Bradfield-Weekly-Snapshot.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
}

// ============================================================
// SHARED SNAPSHOT HELPERS
// ============================================================
function snapshotShell(title, subtitle, dateStr, kpiHtml, bodyHtml) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bradfield Advisors — ' + title + '</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#faf8f4;color:#1a1a1a;padding:32px;}@media print{body{padding:16px;background:#fff;}}.page{max-width:1020px;margin:0 auto;background:#fff;border:1px solid #e8e4de;border-radius:8px;overflow:hidden;}.header{background:#1a1a1a;color:#fff;padding:24px 32px;display:flex;justify-content:space-between;align-items:flex-end;}.header h1{font-family:Georgia,serif;font-size:20px;font-weight:400;letter-spacing:0.02em;}.header .meta{font-size:11px;color:#aaa;text-align:right;line-height:1.6;}.kpi-row{display:flex;gap:0;border-bottom:1px solid #e8e4de;}.kpi{flex:1;padding:16px 24px;border-right:1px solid #e8e4de;}.kpi:last-child{border-right:none;}.kpi-label{font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:4px;}.kpi-value{font-family:Georgia,serif;font-size:22px;color:#1a1a1a;}.kpi-sub{font-size:10px;color:#aaa;margin-top:2px;}.section-title{font-family:Georgia,serif;font-size:14px;color:#1a1a1a;padding:20px 24px 12px;border-bottom:1px solid #e8e4de;}table{width:100%;border-collapse:collapse;}th{padding:8px 12px;text-align:left;font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#888;border-bottom:2px solid #e8e4de;background:#faf8f4;}td{vertical-align:top;}.footer{padding:14px 24px;background:#faf8f4;border-top:1px solid #e8e4de;font-size:10px;color:#aaa;display:flex;justify-content:space-between;}.print-btn{position:fixed;bottom:24px;right:24px;background:#1a1a1a;color:#fff;border:none;padding:10px 20px;border-radius:6px;font-size:13px;cursor:pointer;}@media print{.print-btn{display:none;}}</style>'
    + '</head><body>'
    + '<div class="page">'
    + '<div class="header"><div><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#888;margin-bottom:6px;">Bradfield Advisors</div><h1>' + title + '</h1>' + (subtitle ? '<div style="font-size:11px;color:#888;margin-top:4px;">' + subtitle + '</div>' : '') + '</div><div class="meta"><div>' + dateStr + '</div><div style="margin-top:2px;">Confidential — Internal Use Only</div></div></div>'
    + (kpiHtml ? '<div class="kpi-row">' + kpiHtml + '</div>' : '')
    + bodyHtml
    + '<div class="footer"><div>Bradfield Advisors — Confidential</div><div>Generated ' + dateStr + '</div></div>'
    + '</div>'
    + '<button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>'
    + '</body></html>';
}

function snapshotKpi(label, value, sub) {
  return '<div class="kpi"><div class="kpi-label">' + label + '</div><div class="kpi-value">' + value + '</div><div class="kpi-sub">' + sub + '</div></div>';
}

function snapshotOpen(html, filename) {
  var blob = new Blob([html], { type: 'text/html' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
}

// ============================================================
// TASKS SNAPSHOT
// ============================================================
function openTasksSnapshot() {
  if (state.taskViewMode === 'byPerson') { openTasksSnapshotByPerson(); return; }

  var today    = new Date();
  var todayISO = today.toISOString().slice(0,10);
  var dateStr  = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var open   = TASKS.filter(function(t){ return t.status==='open'; });
  var review = TASKS.filter(function(t){ return t.status==='review'; });
  var done   = TASKS.filter(function(t){ return t.status==='done'; });
  var overdue= open.filter(function(t){ return t.dueDate && t.dueDate < todayISO; });
  var high   = open.filter(function(t){ return t.priority==='High'; });

  var ownerMap = {};
  open.forEach(function(t){ var o = t.owner||'Unassigned'; ownerMap[o] = (ownerMap[o]||0)+1; });

  function sortTasks(arr) {
    return arr.slice().sort(function(a,b){
      var po = ({'High':0,'Medium':1,'Low':2}[a.priority]||3) - ({'High':0,'Medium':1,'Low':2}[b.priority]||3);
      if (po!==0) return po;
      return (a.dueDate||"").localeCompare(b.dueDate||"");
    });
  }

  function taskRow(t, checkOD) {
    var linked  = t.dealId ? DEALS.find(function(d){ return d.id===t.dealId; }) : null;
    var od = checkOD && t.dueDate && t.dueDate < todayISO;
    var prColor = t.priority==='High'?'#8b3a3a':t.priority==='Medium'?'#8b7a2a':'#3a6b4a';
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;font-weight:500;">' + (linked?linked.company:'—') + '</td>'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">' + (t.title||"") + '</td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+prColor+';font-weight:600;">'+t.priority+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;color:' + (od?'#8b3a3a':'#555') + ';">' + (od?'⚠ ':'') + (t.dueDate||'—') + '</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">' + (t.owner||'—') + '</td>'
      + '</tr>';
  }

  var taskRows   = open.length   === 0 ? '<tr><td colspan="5" style="padding:16px;text-align:center;color:#888;">No open tasks</td></tr>'   : sortTasks(open).map(function(t){ return taskRow(t,true); }).join('');
  var reviewRows = review.length === 0 ? '<tr><td colspan="5" style="padding:16px;text-align:center;color:#888;">No tasks awaiting review</td></tr>' : sortTasks(review).map(function(t){ return taskRow(t,false); }).join('');
  var doneRows   = done.length   === 0 ? '<tr><td colspan="3" style="padding:16px;text-align:center;color:#888;">No completed tasks</td></tr>'   : done.slice(0,15).map(function(t){ var dl=t.dealId?DEALS.find(function(d){return d.id===t.dealId;}):null; return '<tr style="border-bottom:1px solid #f0ede8;"><td style="padding:8px 12px;font-size:11px;color:#555;">' + (dl?dl.company:'—') + '</td><td style="padding:8px 12px;font-size:11px;color:#555;text-decoration:line-through;">'+t.title+'</td><td style="padding:8px 12px;font-size:11px;color:#888;">'+t.owner+'</td><td style="padding:8px 12px;font-size:11px;color:#888;">'+( t.dueDate||'—')+'</td></tr>'; }).join('');

  var kpiHtml = snapshotKpi('Open Tasks', open.length, high.length + ' high priority')
    + snapshotKpi('Awaiting Review', review.length, 'Pending senior sign-off')
    + snapshotKpi('Overdue', overdue.length, 'Require immediate action')
    + snapshotKpi('Completed', done.length, 'Total closed');

  var thead5 = '<thead><tr><th>Deal</th><th>Task</th><th>Priority</th><th>Due</th><th>Owner</th></tr></thead>';
  var bodyHtml = ''
    + '<div class="section-title">Open Tasks</div>'
    + '<table>' + thead5 + '<tbody>' + taskRows + '</tbody></table>'
    + '<div class="section-title">Tasks Awaiting Review</div>'
    + '<table>' + thead5 + '<tbody>' + reviewRows + '</tbody></table>'
    + '<div class="section-title">Recently Completed</div>'
    + '<table><thead><tr><th>Deal</th><th>Task</th><th>Owner</th><th>Due Date</th></tr></thead><tbody>' + doneRows + '</tbody></table>';

  snapshotOpen(snapshotShell('Tasks Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Tasks-Snapshot.html');
}

// ============================================================
// TASKS SNAPSHOT — BY PERSON
// ============================================================
function openTasksSnapshotByPerson() {
  var today    = new Date();
  var todayISO = today.toISOString().slice(0,10);
  var dateStr  = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var open    = TASKS.filter(function(t){ return t.status==='open'; });
  var review  = TASKS.filter(function(t){ return t.status==='review'; });
  var done    = TASKS.filter(function(t){ return t.status==='done'; });
  var overdue = open.filter(function(t){ return t.dueDate && t.dueDate < todayISO; });
  var high    = open.filter(function(t){ return t.priority==='High'; });

  var personMap = {};
  TASKS.forEach(function(t) {
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

  function taskRow(t) {
    var linked  = t.dealId ? DEALS.find(function(d){ return d.id===t.dealId; }) : null;
    var od = t.status==='open' && t.dueDate && t.dueDate < todayISO;
    var prColor = t.priority==='High'?'#8b3a3a':t.priority==='Medium'?'#8b7a2a':'#3a6b4a';
    var statusLabel = t.status==='done' ? 'Done' : t.status==='review' ? 'In Review' : 'Open';
    var statusColor = t.status==='done' ? '#888' : t.status==='review' ? '#8b7a2a' : '#2a6b5a';
    return '<tr style="border-bottom:1px solid #f0ede8;' + (t.status==='done'?'opacity:0.6;':'') + '">'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;font-weight:500;">' + (linked?linked.company:'—') + '</td>'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;' + (t.status==='done'?'text-decoration:line-through;':'') + '">' + (t.title||"") + '</td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+prColor+';font-weight:600;">'+t.priority+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+statusColor+';font-weight:600;">'+statusLabel+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;color:' + (od?'#8b3a3a':'#555') + ';">' + (od?'⚠ ':'') + (t.dueDate||'—') + '</td>'
      + '</tr>';
  }

  var thead = '<thead><tr><th>Deal</th><th>Task</th><th>Priority</th><th>Status</th><th>Due</th></tr></thead>';

  var bodyHtml = people.map(function(person) {
    var tasks = personMap[person].slice().sort(function(a,b) {
      var sa = a.status==='done' ? 2 : a.status==='review' ? 1 : 0;
      var sb = b.status==='done' ? 2 : b.status==='review' ? 1 : 0;
      if (sa !== sb) return sa - sb;
      var po = ({'High':0,'Medium':1,'Low':2}[a.priority]||3) - ({'High':0,'Medium':1,'Low':2}[b.priority]||3);
      return po !== 0 ? po : (a.dueDate||'').localeCompare(b.dueDate||'');
    });
    var openCount    = tasks.filter(function(t){ return t.status==='open'; }).length;
    var overdueCount = tasks.filter(function(t){ return t.status==='open' && t.dueDate && t.dueDate < todayISO; }).length;
    var rows = tasks.map(taskRow).join('');
    return '<div class="section-title">' + person + ' <span style="font-weight:400;color:#888;font-size:11px;">(' + openCount + ' open' + (overdueCount ? ', ' + overdueCount + ' overdue' : '') + ')</span></div>'
      + '<table>' + thead + '<tbody>' + rows + '</tbody></table>';
  }).join('');

  if (!people.length) bodyHtml = '<div style="padding:16px;text-align:center;color:#888;">No tasks match your filters.</div>';

  var kpiHtml = snapshotKpi('Open Tasks', open.length, high.length + ' high priority')
    + snapshotKpi('Awaiting Review', review.length, 'Pending senior sign-off')
    + snapshotKpi('Overdue', overdue.length, 'Require immediate action')
    + snapshotKpi('People', people.length, 'With assigned tasks');

  snapshotOpen(snapshotShell('Tasks Snapshot — By Person', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Tasks-Snapshot-ByPerson.html');
}

// ============================================================
// CLIENT TARGETS SNAPSHOT
// ============================================================
function openTargetsSnapshot(sector) {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  var sectorLabel = { agri:'Agriculture', fig:'Financial Institutions', realestate:'Real Estate' }[sector] || sector;

  var all = CLIENT_TARGETS.filter(function(t){ return t.sector === sector; });
  var byStatus  = {};
  var byPriority = { High:0, Medium:0, Low:0 };
  var bySubType  = {};
  all.forEach(function(t){
    byStatus[t.status]   = (byStatus[t.status]||0)+1;
    if (byPriority[t.priority]!==undefined) byPriority[t.priority]++;
    bySubType[t.subType] = (bySubType[t.subType]||0)+1;
  });

  var totalVal = all.reduce(function(s,t){ return s+(t.estimatedDealSize||0); },0).toFixed(0);
  var engaged  = all.filter(function(t){ return t.status==='Engaged'; }).length;
  var high     = all.filter(function(t){ return t.priority==='High'; }).length;

  var statLabels = Object.keys(byStatus);
  var statColors = { Engaged:'#2a6b5a', Target:'#3a6b8b', Monitoring:'#888' };

  var subLabels  = Object.keys(bySubType).sort();

  var rows = all.sort(function(a,b){
    var ps = {'Engaged':0,'Target':1,'Monitoring':2};
    return (ps[a.status]||3)-(ps[b.status]||3);
  }).map(function(t){
    var stColor = statColors[t.status]||'#888';
    var prColor = t.priority==='High'?'#8b3a3a':t.priority==='Medium'?'#8b7a2a':'#888';
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(t.name||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(t.subType||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+stColor+';font-weight:600;">'+(t.status||'—')+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+prColor+';font-weight:600;">'+(t.priority||'—')+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">A$'+(t.estimatedDealSize||0)+'m</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(t.contacts||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:240px;">'+(t.notes||'—')+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Total Targets', all.length, sectorLabel)
    + snapshotKpi('Engaged', engaged, 'Active relationships')
    + snapshotKpi('High Priority', high, 'Requiring focus')
    + snapshotKpi('Est. Deal Value', 'A$'+totalVal+'m', 'Pipeline potential');

  var bodyHtml = ''
    + '<div class="section-title">' + sectorLabel + ' — All Targets</div>'
    + '<table><thead><tr><th>Name</th><th>Sub-Type</th><th>Status</th><th>Priority</th><th>Est. Value</th><th>Contact</th><th>Notes</th></tr></thead><tbody>' + rows + '</tbody></table>';
  snapshotOpen(snapshotShell('Client Targets Snapshot', sectorLabel, dateStr, kpiHtml, bodyHtml), 'Bradfield-Targets-' + sector + '-Snapshot.html');
}

// ============================================================
// SERVICE PROVIDERS SNAPSHOT
// ============================================================
function openProvidersSnapshot() {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var byType  = {};
  var byTier  = { 'Tier 1':0, 'Tier 2':0 };
  SERVICE_PROVIDERS.forEach(function(p){
    byType[p.type] = (byType[p.type]||0)+1;
    if (byTier[p.tier]!==undefined) byTier[p.tier]++;
  });
  var typeLabels = Object.keys(byType).sort();

  var rows = SERVICE_PROVIDERS.slice().sort(function(a,b){
    return (a.type+a.tier+a.name).localeCompare(b.type+b.tier+b.name);
  }).map(function(p){
    var tierColor = p.tier==='Tier 1'?'#3a6b8b':'#888';
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(p.name||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(p.type||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+tierColor+';font-weight:600;">'+(p.tier||'—')+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(p.specialisation||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(p.contacts||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:220px;">'+(p.notes||'—')+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Total Providers', SERVICE_PROVIDERS.length, 'Across all categories')
    + snapshotKpi('Tier 1', byTier['Tier 1'], 'Primary relationships')
    + snapshotKpi('Tier 2', byTier['Tier 2'], 'Secondary / specialist')
    + snapshotKpi('Categories', typeLabels.length, 'Provider types');

  var bodyHtml = ''
    + '<div class="section-title">All Service Providers</div>'
    + '<table><thead><tr><th>Name</th><th>Type</th><th>Tier</th><th>Specialisation</th><th>Key Contacts</th><th>Notes</th></tr></thead><tbody>' + rows + '</tbody></table>';


  snapshotOpen(snapshotShell('Service Providers Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Providers-Snapshot.html');
}

// ============================================================
// CONTACTS SNAPSHOT
// ============================================================
function openContactsSnapshot() {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var byType = {};
  var byFirm = {};
  CONTACTS.forEach(function(c){
    byType[c.type||'Other'] = (byType[c.type||'Other']||0)+1;
    byFirm[c.firm||'Unknown'] = (byFirm[c.firm||'Unknown']||0)+1;
  });
  var typeLabels = Object.keys(byType).sort();
  var firmLabels = Object.keys(byFirm).sort(function(a,b){ return byFirm[b]-byFirm[a]; }).slice(0,8);

  var rows = CONTACTS.slice().sort(function(a,b){ return (a.firm+a.name).localeCompare(b.firm+b.name); }).map(function(c){
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(c.name||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(c.role||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(c.firm||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(c.type||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(c.email||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:200px;">'+(c.notes||'—')+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Total Contacts', CONTACTS.length, 'In network')
    + snapshotKpi('Firms', Object.keys(byFirm).length, 'Represented')
    + snapshotKpi('Categories', typeLabels.length, 'Contact types')
    + snapshotKpi('', '', '');

  var bodyHtml = ''
    + '<div class="section-title">All Contacts</div>'
    + '<table><thead><tr><th>Name</th><th>Role</th><th>Firm</th><th>Type</th><th>Email</th><th>Notes</th></tr></thead><tbody>' + rows + '</tbody></table>';


  snapshotOpen(snapshotShell('Contacts Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Contacts-Snapshot.html');
}

// ============================================================
// ACTIVITY LOG SNAPSHOT
// ============================================================
function openActivitySnapshot() {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var sorted  = ACTIVITY_LOG.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
  var byType  = {};
  var byMonth = {};
  sorted.forEach(function(a){
    byType[a.type||'Other'] = (byType[a.type||'Other']||0)+1;
    var mo = (a.date||'').slice(0,7);
    if (mo) byMonth[mo] = (byMonth[mo]||0)+1;
  });
  var typeLabels  = Object.keys(byType).sort();
  var monthLabels = Object.keys(byMonth).sort().slice(-6);

  var rows = sorted.slice(0,40).map(function(a){
    var linked = a.dealId ? DEALS.find(function(d){ return d.id===a.dealId; }) : null;
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;white-space:nowrap;">'+(a.date||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(a.title||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(a.type||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(linked?linked.company:'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(a.attendees||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:240px;">'+(a.summary||'—')+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Total Entries', ACTIVITY_LOG.length, 'All activity logged')
    + snapshotKpi('Activity Types', typeLabels.length, 'Categories')
    + snapshotKpi('This Month', (byMonth[today.toISOString().slice(0,7)]||0), 'Entries in ' + today.toLocaleDateString('en-AU',{month:'long'}))
    + snapshotKpi('Most Recent', sorted.length ? sorted[0].date : '—', (sorted.length ? sorted[0].title : '').slice(0,30));

  var bodyHtml = ''
    + '<div class="section-title">Recent Activity Log (last 40 entries)</div>'
    + '<table><thead><tr><th>Date</th><th>Title</th><th>Type</th><th>Deal</th><th>Attendees</th><th>Summary</th></tr></thead><tbody>' + rows + '</tbody></table>';


  snapshotOpen(snapshotShell('Activity Log Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Activity-Snapshot.html');
}

// ============================================================
// DOCUMENT LIBRARY SNAPSHOT
// ============================================================
function openLibrarySnapshot() {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var byType = {};
  var byDeal = {};
  DOC_LIBRARY.forEach(function(d){
    byType[d.type||'Other'] = (byType[d.type||'Other']||0)+1;
    var linked = d.dealId ? DEALS.find(function(x){ return x.id===d.dealId; }) : null;
    var key = linked ? linked.company : 'General';
    byDeal[key] = (byDeal[key]||0)+1;
  });
  var typeLabels = Object.keys(byType).sort();
  var dealLabels = Object.keys(byDeal).sort(function(a,b){ return byDeal[b]-byDeal[a]; }).slice(0,8);

  var rows = DOC_LIBRARY.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); }).map(function(d){
    var linked = d.dealId ? DEALS.find(function(x){ return x.id===d.dealId; }) : null;
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(d.title||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(d.type||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(linked?linked.company:'General')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(d.date||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(d.author||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:240px;">'+(d.description||'—')+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Total Documents', DOC_LIBRARY.length, 'In library')
    + snapshotKpi('Document Types', typeLabels.length, 'Categories')
    + snapshotKpi('Deal-Linked', DOC_LIBRARY.filter(function(d){ return !!d.dealId; }).length, 'Attached to deals')
    + snapshotKpi('General', DOC_LIBRARY.filter(function(d){ return !d.dealId; }).length, 'Unlinked documents');

  var bodyHtml = ''
    + '<div class="section-title">All Documents</div>'
    + '<table><thead><tr><th>Title</th><th>Type</th><th>Deal</th><th>Date</th><th>Author</th><th>Description</th></tr></thead><tbody>' + rows + '</tbody></table>';


  snapshotOpen(snapshotShell('Document Library Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Library-Snapshot.html');
}

// ============================================================
// FINANCIERS SNAPSHOT
// ============================================================
function openLendersSnapshot() {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var byType   = {};
  var allAssets = {};
  LENDERS.forEach(function(l){
    byType[l.type||'Other'] = (byType[l.type||'Other']||0)+1;
    (l.assetClasses||[]).forEach(function(a){ allAssets[a] = (allAssets[a]||0)+1; });
  });
  var typeLabels  = Object.keys(byType).sort();
  var assetLabels = Object.keys(allAssets).sort(function(a,b){ return allAssets[b]-allAssets[a]; }).slice(0,10);

  var rows = LENDERS.slice().sort(function(a,b){ return (a.type+a.name).localeCompare(b.type+b.name); }).map(function(l){
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(l.name||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(l.type||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(l.geography||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(l.ticketSizeMin||'—')+' – '+(l.ticketSizeMax||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(l.assetClasses||[]).slice(0,3).join(', ')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:200px;">'+(l.notes||'—').slice(0,120)+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Total Financiers', LENDERS.length, 'In panel')
    + snapshotKpi('Lender Types', typeLabels.length, 'Categories')
    + snapshotKpi('Asset Classes', Object.keys(allAssets).length, 'Covered')
    + snapshotKpi('Active Deals', DEALS.filter(function(d){ return d.stage==='live'; }).length, 'In execution');

  var bodyHtml = ''
    + '<div class="section-title">Financier Panel</div>'
    + '<table><thead><tr><th>Name</th><th>Type</th><th>Geography</th><th>Ticket Size</th><th>Asset Classes</th><th>Notes</th></tr></thead><tbody>' + rows + '</tbody></table>';


  snapshotOpen(snapshotShell('Financiers Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Financiers-Snapshot.html');
}

// ============================================================
// ADVISORY LANDSCAPE SNAPSHOT
// ============================================================
function openAdvisorsSnapshot() {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var byType  = {};
  var byTier  = {};
  var bySector = {};
  ADVISORS.forEach(function(a){
    byType[a.typeKey||'Other'] = (byType[a.typeKey||'Other']||0)+1;
    byTier[a.tier||'Other']   = (byTier[a.tier||'Other']||0)+1;
    (a.sectors||[]).forEach(function(s){ bySector[s] = (bySector[s]||0)+1; });
  });
  var typeLabels   = Object.keys(byType).sort();
  var tierLabels   = Object.keys(byTier).sort();
  var sectorLabels = Object.keys(bySector).sort(function(a,b){ return bySector[b]-bySector[a]; }).slice(0,8);

  var ADVISOR_TYPE_LABELS_LOCAL = { independent:'Independent', boutique:'Boutique', big4:'Big 4', bank:'Bank', other:'Other' };

  var rows = ADVISORS.slice().sort(function(a,b){ return (a.tier+a.name).localeCompare(b.tier+b.name); }).map(function(a){
    var tierColor = a.tier==='Tier 1'?'#3a6b8b':a.tier==='Tier 2'?'#8b7a2a':'#888';
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(a.name||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+tierColor+';font-weight:600;">'+(a.tier||'—')+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(ADVISOR_TYPE_LABELS_LOCAL[a.typeKey]||a.typeKey||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(a.sectors||[]).join(', ')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(a.relationship||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:220px;">'+(a.competitive||'—').slice(0,120)+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Firms Tracked', ADVISORS.length, 'Advisory landscape')
    + snapshotKpi('Tier 1', byTier['Tier 1']||0, 'Primary competitors')
    + snapshotKpi('Tier 2', byTier['Tier 2']||0, 'Boutique / specialist')
    + snapshotKpi('Referral Partners', ADVISORS.filter(function(a){ return (a.relationship||'').toLowerCase().includes('referral'); }).length, 'Active referral relationships');

  var bodyHtml = ''
    + '<div class="section-title">Advisory Landscape</div>'
    + '<table><thead><tr><th>Firm</th><th>Tier</th><th>Type</th><th>Sectors</th><th>Relationship</th><th>Competitive Notes</th></tr></thead><tbody>' + rows + '</tbody></table>';


  snapshotOpen(snapshotShell('Advisory Landscape Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Advisors-Snapshot.html');
}

// ============================================================
// BROKING TARGETS SNAPSHOT
// ============================================================
function openBrokingTargetsSnapshot() {
  var today   = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  var byStatus = {};
  var bySector = {};
  var byPitch  = {};
  BROKING_TARGETS.forEach(function(t){
    byStatus[t.pitchStatus||'Other'] = (byStatus[t.pitchStatus||'Other']||0)+1;
    bySector[t.sector||'Other']      = (bySector[t.sector||'Other']||0)+1;
    byPitch[t.priority||'Other']     = (byPitch[t.priority||'Other']||0)+1;
  });
  var statusLabels = Object.keys(byStatus).sort();
  var sectorLabels = Object.keys(bySector).sort();
  var totalVal = BROKING_TARGETS.reduce(function(s,t){ return s+(t.estimatedDealSize||0); },0).toFixed(2);

  var rows = BROKING_TARGETS.slice().map(function(t){
    var prColor = t.priority==='High'?'#8b3a3a':t.priority==='Medium'?'#8b7a2a':'#888';
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">'+(t.name||'')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(t.sector||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(t.pitchStatus||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:'+prColor+';font-weight:600;">'+(t.priority||'—')+'</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">A$'+(t.estimatedDealSize||0)+'m</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">'+(t.contacts||'—')+'</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#444;max-width:220px;">'+(t.nextStep||'—')+'</td>'
      + '</tr>';
  }).join('');

  var kpiHtml = snapshotKpi('Total Targets', BROKING_TARGETS.length, 'Broking pipeline')
    + snapshotKpi('Mandated', byStatus['Mandated']||0, 'Active mandates')
    + snapshotKpi('Pitching', byStatus['Pitching']||0, 'In pitch stage')
    + snapshotKpi('Est. Value', 'A$'+totalVal+'m', 'Potential deal flow');

  var bodyHtml = ''
    + '<div class="section-title">All Broking Targets</div>'
    + '<table><thead><tr><th>Name</th><th>Sector</th><th>Status</th><th>Priority</th><th>Est. Value</th><th>Contact</th><th>Next Step</th></tr></thead><tbody>' + rows + '</tbody></table>';


  snapshotOpen(snapshotShell('Broking Targets Snapshot', null, dateStr, kpiHtml, bodyHtml), 'Bradfield-Broking-Targets-Snapshot.html');
}

