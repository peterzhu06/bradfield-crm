// ============================================================
// ARCHIVE — Dead / removed deals
// ============================================================
function renderArchive() {
  var f = ARCHIVED_DEALS.slice();
  if (state.archiveSearch) {
    var q = state.archiveSearch.toLowerCase();
    f = f.filter(function(d){ return d.company.toLowerCase().includes(q) || (d.deathReason||'').toLowerCase().includes(q); });
  }
  if (state.archiveReasonFilter) f = f.filter(function(d){ return d.deathReason === state.archiveReasonFilter; });
  f.sort(function(a,b){ return (b.archivedAt||'').localeCompare(a.archivedAt||''); });

  var totalArchived = ARCHIVED_DEALS.length;
  var wonCount  = ARCHIVED_DEALS.filter(function(d){ return (d.archiveOutcome||'lost') === 'won'; }).length;
  var lostCount = ARCHIVED_DEALS.filter(function(d){ return (d.archiveOutcome||'lost') === 'lost'; }).length;
  var thisYear = new Date().getFullYear().toString();
  var archivedThisYear = ARCHIVED_DEALS.filter(function(d){ return (d.archivedAt||'').startsWith(thisYear); }).length;

  var kpis = '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Archived Deals</div><div class="s-value">' + totalArchived + '</div><div class="s-sub">All time</div></div>'
    + '<div class="stat-card"><div class="s-label">Closed Deals</div><div class="s-value" style="color:#2a6b4a;">' + wonCount + '</div><div class="s-sub">Completed successfully</div></div>'
    + '<div class="stat-card"><div class="s-label">Deals Lost</div><div class="s-value" style="color:#8b3a3a;">' + lostCount + '</div><div class="s-sub">Did not proceed</div></div>'
    + '<div class="stat-card"><div class="s-label">Archived This Year</div><div class="s-value">' + archivedThisYear + '</div><div class="s-sub">' + thisYear + '</div></div>'
    + '</div>';

  var reasonOpts = DEAL_DEATH_REASONS.concat(DEAL_WIN_REASONS).filter(function(r,i,arr){ return arr.indexOf(r)===i; })
    .map(function(r){ return '<option value="' + escHtml(r) + '"' + (state.archiveReasonFilter===r?' selected':'') + '>' + escHtml(r) + '</option>'; }).join('');

  var toolbar = '<div class="toolbar" style="margin-bottom:20px;">'
    + '<input type="text" placeholder="Search archived deals..." value="' + escHtml(state.archiveSearch||'') + '" oninput="state.archiveSearch=this.value;renderView()" />'
    + '<select onchange="state.archiveReasonFilter=this.value;renderView()"><option value="">All reasons</option>' + reasonOpts + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">' + f.length + ' deal' + (f.length!==1?'s':'') + '</div>'
    + '<button class="btn" onclick="openArchiveSnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  if (f.length === 0) return kpis + toolbar + '<div class="empty-state">No archived deals' + (ARCHIVED_DEALS.length?' match your filters':'') + '.</div>';

  function buildTable(rowsArr, isWon) {
    if (!rowsArr.length) {
      return '<div class="empty-state" style="padding:20px;">No ' + (isWon ? 'closed' : 'lost') + ' deals' + (ARCHIVED_DEALS.length ? ' match your filters' : '') + '.</div>';
    }
    var rows = rowsArr.map(function(d) {
      return '<tr style="border-bottom:1px solid var(--cream-d);">'
        + '<td style="padding:11px 14px;font-size:12.5px;font-weight:500;color:#000;">' + escHtml(d.company) + '</td>'
        + '<td style="padding:11px 14px;font-size:11.5px;color:var(--text-2);">' + escHtml(d.dealType||'—') + '</td>'
        + '<td style="padding:11px 14px;font-size:11.5px;color:var(--text-2);">' + escHtml(d.size||'—') + '</td>'
        + '<td style="padding:11px 14px;font-size:11.5px;color:var(--text-2);">' + escHtml(d.owner||'—') + '</td>'
        + '<td style="padding:11px 14px;"><span class="badge ' + (isWon?'green':'red') + '" style="font-size:10px;">' + escHtml(d.deathReason||'Other') + '</span></td>'
        + '<td style="padding:11px 14px;font-size:11.5px;color:var(--text-2);max-width:240px;">' + escHtml(d.deathNotes||'—') + '</td>'
        + '<td style="padding:11px 14px;font-size:11px;color:var(--muted);white-space:nowrap;">' + (d.archivedAt||'—') + '</td>'
        + '<td style="padding:11px 14px;white-space:nowrap;">'
        + '<button class="btn sm" onclick="restoreDeal(\'' + d.id + '\')" style="margin-right:6px;">Restore</button>'
        + '<button class="btn sm danger" onclick="permanentlyDeleteArchivedDeal(\'' + d.id + '\')">Delete</button>'
        + '</td>'
        + '</tr>';
    }).join('');

    var reasonHeader = isWon ? 'How Completed' : 'Reason';
    var colgroup = '<colgroup><col style="width:15%"><col style="width:12%"><col style="width:7%"><col style="width:12%"><col style="width:14%"><col style="width:15%"><col style="width:10%"><col style="width:15%"></colgroup>';
    return '<div style="background:var(--white);border:1px solid var(--border);border-radius:10px;overflow:hidden;">'
      + '<table style="width:100%;border-collapse:collapse;table-layout:fixed;">'
      + colgroup
      + '<thead><tr style="background:var(--cream);">'
      + '<th style="padding:10px 14px;text-align:left;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);">Deal</th>'
      + '<th style="padding:10px 14px;text-align:left;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);">Type</th>'
      + '<th style="padding:10px 14px;text-align:left;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);">Size</th>'
      + '<th style="padding:10px 14px;text-align:left;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);">Owner</th>'
      + '<th style="padding:10px 14px;text-align:left;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);">' + reasonHeader + '</th>'
      + '<th style="padding:10px 14px;text-align:left;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);">Notes</th>'
      + '<th style="padding:10px 14px;text-align:left;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);">Archived</th>'
      + '<th style="padding:10px 14px;"></th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  var wonDeals  = f.filter(function(d){ return (d.archiveOutcome||'lost') === 'won'; });
  var lostDeals = f.filter(function(d){ return (d.archiveOutcome||'lost') === 'lost'; });

  return kpis + toolbar
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">'
    + '<div class="section-title" style="margin-bottom:0;">✅ Closed Deals</div>'
    + '<span class="section-count">' + wonDeals.length + '</span>'
    + '</div>'
    + buildTable(wonDeals, true)
    + '<div style="display:flex;align-items:center;gap:10px;margin:26px 0 12px;">'
    + '<div class="section-title" style="margin-bottom:0;">❌ Deals Lost</div>'
    + '<span class="section-count">' + lostDeals.length + '</span>'
    + '</div>'
    + buildTable(lostDeals, false);
}

// ============================================================
// ARCHIVE SNAPSHOT
// ============================================================
function openArchiveSnapshot() {
  var today = new Date();
  var dateStr = today.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  var thisYear = today.getFullYear();
  var currentMonthIdx = today.getMonth();

  var ytd = ARCHIVED_DEALS.filter(function(d){ return (d.archivedAt||'').startsWith(thisYear.toString()); });
  var closedYTD = ytd.filter(function(d){ return (d.archiveOutcome||'lost') === 'won'; });
  var lostYTD   = ytd.filter(function(d){ return (d.archiveOutcome||'lost') === 'lost'; });
  var winRateYTD = (closedYTD.length + lostYTD.length) > 0 ? Math.round(closedYTD.length / (closedYTD.length + lostYTD.length) * 100) : 0;
  var valueClosedYTD = closedYTD.reduce(function(s,d){ return s + (d.sizeMn||0); }, 0);
  var valueLostYTD   = lostYTD.reduce(function(s,d){ return s + (d.sizeMn||0); }, 0);

  // Monthly outcomes this year
  var monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].slice(0, currentMonthIdx + 1);
  var monthlyWon  = monthLabels.map(function(_, i){
    return ARCHIVED_DEALS.filter(function(d){
      if (!d.archivedAt) return false;
      var dt = new Date(d.archivedAt);
      return dt.getFullYear() === thisYear && dt.getMonth() === i && (d.archiveOutcome||'lost') === 'won';
    }).length;
  });
  var monthlyLost = monthLabels.map(function(_, i){
    return ARCHIVED_DEALS.filter(function(d){
      if (!d.archivedAt) return false;
      var dt = new Date(d.archivedAt);
      return dt.getFullYear() === thisYear && dt.getMonth() === i && (d.archiveOutcome||'lost') === 'lost';
    }).length;
  });

  // Top lost reasons (all time)
  var lostAll = ARCHIVED_DEALS.filter(function(d){ return (d.archiveOutcome||'lost') === 'lost'; });
  var reasonCounts = {};
  lostAll.forEach(function(d){ var r = d.deathReason || 'Other'; reasonCounts[r] = (reasonCounts[r]||0) + 1; });
  var reasonEntries = Object.entries(reasonCounts).sort(function(a,b){ return b[1]-a[1]; }).slice(0, 6);
  var reasonLabels = reasonEntries.map(function(e){ return e[0].length > 22 ? e[0].slice(0,20)+'…' : e[0]; });
  var reasonVals   = reasonEntries.map(function(e){ return e[1]; });

  // Closed vs lost by owner (all time)
  var ownerMap = {};
  ARCHIVED_DEALS.forEach(function(d){
    var o = d.owner || 'Unassigned';
    if (!ownerMap[o]) ownerMap[o] = { won: 0, lost: 0 };
    if ((d.archiveOutcome||'lost') === 'won') ownerMap[o].won++; else ownerMap[o].lost++;
  });
  var owners = Object.keys(ownerMap).sort(function(a,b){ return (ownerMap[b].won+ownerMap[b].lost) - (ownerMap[a].won+ownerMap[a].lost); }).slice(0, 8);
  var ownerWonVals  = owners.map(function(o){ return ownerMap[o].won; });
  var ownerLostVals = owners.map(function(o){ return ownerMap[o].lost; });

  // Recent archive table (most recent 20)
  var recent = ARCHIVED_DEALS.slice().sort(function(a,b){ return (b.archivedAt||'').localeCompare(a.archivedAt||''); }).slice(0, 20);
  var recentRows = recent.length === 0 ? '<tr><td colspan="6" style="padding:16px;text-align:center;color:#888;">No archived deals</td></tr>' : recent.map(function(d) {
    var isWon = (d.archiveOutcome||'lost') === 'won';
    return '<tr style="border-bottom:1px solid #f0ede8;">'
      + '<td style="padding:9px 12px;font-size:12px;font-weight:500;color:#1a1a1a;">' + escHtml(d.company) + '</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">' + escHtml(d.size||'—') + '</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">' + escHtml(d.owner||'—') + '</td>'
      + '<td style="padding:9px 12px;font-size:11px;"><span style="color:' + (isWon?'#2a6b4a':'#8b3a3a') + ';font-weight:600;">' + (isWon?'Closed':'Lost') + '</span></td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#555;">' + escHtml(d.deathReason||'Other') + '</td>'
      + '<td style="padding:9px 12px;font-size:11px;color:#888;">' + (d.archivedAt||'—') + '</td>'
      + '</tr>';
  }).join('');

  var chartData = JSON.stringify({
    monthLabels: monthLabels, monthlyWon: monthlyWon, monthlyLost: monthlyLost,
    reasonLabels: reasonLabels, reasonVals: reasonVals,
    owners: owners, ownerWonVals: ownerWonVals, ownerLostVals: ownerLostVals
  });

  var kpiHtml = snapshotKpi('Closed Deals YTD', closedYTD.length, 'A$' + (Math.round(valueClosedYTD*100)/100) + 'm value')
    + snapshotKpi('Deals Lost YTD', lostYTD.length, 'A$' + (Math.round(valueLostYTD*100)/100) + 'm value')
    + snapshotKpi('Win Rate YTD', winRateYTD + '%', 'Closed ÷ (Closed + Lost)')
    + snapshotKpi('Net Value YTD', 'A$' + (Math.round((valueClosedYTD-valueLostYTD)*100)/100) + 'm', 'Closed value less lost value');

  var bodyHtml = ''
    + '<div class="charts-grid" style="grid-template-columns:1fr;border-bottom:1px solid #e8e4de;">'
    + '<div class="chart-cell" style="border-right:none;"><div class="chart-label">Monthly Outcomes — ' + thisYear + '</div><div class="chart-wrap" style="height:200px;"><canvas id="arc-sn-monthly"></canvas></div></div>'
    + '</div>'
    + '<div class="charts-grid" style="grid-template-columns:1fr 1fr;">'
    + '<div class="chart-cell"><div class="chart-label">Top Reasons — Lost Deals (all time)</div><div class="chart-wrap" style="height:190px;"><canvas id="arc-sn-reasons"></canvas></div></div>'
    + '<div class="chart-cell" style="border-right:none;"><div class="chart-label">Closed vs. Lost by Owner (all time)</div><div class="chart-wrap" style="height:190px;"><canvas id="arc-sn-owner"></canvas></div></div>'
    + '</div>'
    + '<div class="section-title">Recently Archived</div>'
    + '<table><thead><tr><th>Deal</th><th>Size</th><th>Owner</th><th>Outcome</th><th>Reason</th><th>Archived</th></tr></thead><tbody>' + recentRows + '</tbody></table>';

  var shellHtml = snapshotShell('Archive Snapshot', thisYear + ' Year to Date', dateStr, kpiHtml, bodyHtml);

  // Inject Chart.js CDN + inline chart script before </body>
  var chartScript = '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>'
    + '<scr'+'ipt>'
    + 'var D=' + chartData + ';'
    + 'var gOpts={responsive:true,maintainAspectRatio:false};'
    + 'new Chart(document.getElementById("arc-sn-monthly"),{type:"bar",data:{labels:D.monthLabels,datasets:[{label:"Closed",data:D.monthlyWon,backgroundColor:"#3a6b4a",borderRadius:3,borderSkipped:false},{label:"Lost",data:D.monthlyLost,backgroundColor:"#8b3a3a",borderRadius:3,borderSkipped:false}]},options:Object.assign({},gOpts,{plugins:{legend:{position:"top",labels:{font:{size:9},boxWidth:8}},tooltip:{callbacks:{label:function(c){return" "+c.dataset.label+": "+c.raw;}}}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:"#888"}},y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{stepSize:1,font:{size:9},color:"#888"},beginAtZero:true}}})});'
    + 'new Chart(document.getElementById("arc-sn-reasons"),{type:"bar",data:{labels:D.reasonLabels,datasets:[{data:D.reasonVals,backgroundColor:"#8b3a3a",borderRadius:3,borderSkipped:false}]},options:Object.assign({},gOpts,{indexAxis:"y",plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return" "+c.raw+" deal"+(c.raw!==1?"s":"");}}}},scales:{x:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{stepSize:1,font:{size:9},color:"#888"},beginAtZero:true},y:{grid:{display:false},ticks:{font:{size:9},color:"#555"}}}})});'
    + 'new Chart(document.getElementById("arc-sn-owner"),{type:"bar",data:{labels:D.owners,datasets:[{label:"Closed",data:D.ownerWonVals,backgroundColor:"#3a6b4a",borderRadius:3,borderSkipped:false},{label:"Lost",data:D.ownerLostVals,backgroundColor:"#8b3a3a",borderRadius:3,borderSkipped:false}]},options:Object.assign({},gOpts,{plugins:{legend:{position:"top",labels:{font:{size:9},boxWidth:8}},tooltip:{callbacks:{label:function(c){return" "+c.dataset.label+": "+c.raw;}}}},scales:{x:{grid:{display:false},ticks:{font:{size:8},color:"#888",maxRotation:20}},y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{stepSize:1,font:{size:9},color:"#888"},beginAtZero:true}}})});'
    + '<'+'/'+'script>';

  var html = shellHtml.replace('</body></html>', chartScript + '</body></html>');

  snapshotOpen(html, 'Bradfield-Archive-Snapshot.html');
}

