// ============================================================
// OVERVIEW
// ============================================================
function renderOverview() {
  var liveDeals     = DEALS.filter(function(d){ return ['origination','mandate','live','paused'].includes(d.stage); });
  var watchDeals    = liveDeals.filter(function(d){ return d.statusKey === 'amber' || d.statusKey === 'red'; });
  var pipelineValue = liveDeals.reduce(function(s,d){ return s + d.sizeMn; }, 0);
  var today         = new Date();

  // Deals closing within 60 days
  var closingSoon = liveDeals.filter(function(d) {
    if (!d.closeDate) return false;
    var diff = (new Date(d.closeDate) - today) / (1000*60*60*24);
    return diff >= 0 && diff <= 60;
  }).sort(function(a,b){ return new Date(a.closeDate) - new Date(b.closeDate); });

  // Action items from activity log (most recent 6)
  var recentActions = [];
  ACTIVITY_LOG.slice().sort(function(a,b){ return b.date.localeCompare(a.date); }).forEach(function(a) {
    if (a.actionItems && a.actionItems.length) {
      a.actionItems.forEach(function(item) {
        if (recentActions.length < 6) recentActions.push({ item: item, deal: a.dealId ? DEALS.find(function(d){ return d.id===a.dealId; }) : null, date: a.date, owner: a.owner });
      });
    }
  });

  // Sector breakdown for donut
  var sectorMap = {};
  liveDeals.forEach(function(d){ sectorMap[d.sector] = (sectorMap[d.sector]||0) + d.sizeMn; });

  // Stage breakdown for bar
  var stageOrder  = ['origination','mandate','live','paused'];
  var stageCounts = stageOrder.map(function(k){ return DEALS.filter(function(d){ return d.stage===k; }).length; });
  var stageValues = stageOrder.map(function(k){ return DEALS.filter(function(d){ return d.stage===k; }).reduce(function(s,d){ return s+d.sizeMn; },0); });

  // Recent activity — pull from ACTIVITY_LOG if available, else ACTIVITY
  var recentActivity = ACTIVITY_LOG.slice().sort(function(a,b){ return b.date.localeCompare(a.date); }).slice(0,6);

  // Bundle data for widget renderer
  var data = { liveDeals: liveDeals, watchDeals: watchDeals, pipelineValue: pipelineValue, today: today,
               closingSoon: closingSoon, recentActions: recentActions, sectorMap: sectorMap,
               stageOrder: stageOrder, stageCounts: stageCounts, stageValues: stageValues,
               recentActivity: recentActivity };

  var html = '<div style="display:flex;justify-content:flex-end;margin-bottom:16px;">'
    + '<button class="btn" onclick="openDashboardCustomiser()" style="font-size:11.5px;">'
    + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:5px;vertical-align:middle;"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>'
    + 'Customise Dashboard</button></div>';

  DASHBOARD_CONFIG.forEach(function(w) {
    if (w.enabled) html += renderDashboardWidget(w.id, data);
  });

  return html;
}

function renderDashboardWidget(id, data) {
  var liveDeals     = data.liveDeals;
  var watchDeals    = data.watchDeals;
  var pipelineValue = data.pipelineValue;
  var today         = data.today;
  var closingSoon   = data.closingSoon;
  var recentActivity = data.recentActivity;

  var wrap = function(inner){ return '<div style="margin-bottom:20px;">' + inner + '</div>'; };

  if (id === 'kpis') {
    return wrap(
      '<div class="stat-grid" style="grid-template-columns:repeat(6,1fr);">'
      + '<div class="stat-card"><div class="s-label">Live Transactions</div><div class="s-value">'+liveDeals.length+'</div><div class="s-sub">Across active stages</div><span class="s-delta up">↑ 2 this quarter</span></div>'
      + '<div class="stat-card"><div class="s-label">Pipeline Value</div><div class="s-value" style="font-size:20px;">A$'+pipelineValue+'m</div><div class="s-sub">Total live deal value</div></div>'
      + '<div class="stat-card"><div class="s-label">Needs Attention</div><div class="s-value" style="color:'+(watchDeals.length>0?'var(--amber)':'var(--green)')+';">'+watchDeals.length+'</div><div class="s-sub">Watch / at-risk deals</div></div>'
      + '<div class="stat-card"><div class="s-label">Lender Relationships</div><div class="s-value">'+LENDERS.length+'</div><div class="s-sub">Active buy-side firms</div></div>'
      + '<div class="stat-card"><div class="s-label">Contacts</div><div class="s-value">'+CONTACTS.length+'</div><div class="s-sub">People directory</div></div>'
      + '</div>'
    );
  }

  if (id === 'attention') {
    var attnBody = '';
    if (watchDeals.length === 0) {
      attnBody = '<div style="padding:28px;text-align:center;color:var(--muted);font-size:12px;">✓ All deals on track</div>';
    } else {
      attnBody = watchDeals.map(function(d) {
        var sc = stageConf(d.stage);
        var dc = d.statusKey==='red'?'var(--red)':'var(--amber)';
        return '<div style="padding:11px 18px;border-bottom:1px solid var(--cream-d);display:flex;align-items:flex-start;gap:12px;">'
          + '<div style="width:3px;background:'+dc+';align-self:stretch;border-radius:2px;flex-shrink:0;"></div>'
          + '<div style="flex:1;min-width:0;">'
          + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">'
          + '<div style="font-size:12.5px;font-weight:500;color:#000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+d.company+'</div>'
          + '<span class="badge '+sc.badgeClass+'" style="flex-shrink:0;">'+sc.label+'</span>'
          + '</div>'
          + '<div style="font-size:11px;color:var(--muted);margin-top:2px;">'+d.dealType+' · '+d.size+' · '+d.owner+'</div>'
          + (d.statusNotes && d.statusNotes.length ? '<div style="font-size:11px;color:var(--text-2);margin-top:5px;line-height:1.5;border-left:2px solid '+dc+';padding-left:8px;">'+d.statusNotes[0]+'</div>' : '')
          + '</div></div>';
      }).join('');
    }
    var greenDeals = liveDeals.filter(function(d){ return d.statusKey==='green'; });
    var greenFooter = greenDeals.length > 0
      ? '<div style="padding:10px 18px;background:var(--cream);"><div style="font-size:10.5px;color:var(--muted);"><span style="color:var(--green);margin-right:4px;">●</span>'+greenDeals.length+' deal'+(greenDeals.length!==1?'s':'')+' on track — '+greenDeals.map(function(d){ return d.company; }).join(', ')+'</div></div>'
      : '';
    return wrap(
      '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;">'
      + '<div style="padding:14px 18px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;">Deals Needing Attention</div>'
      + '<button class="btn sm" onclick="navigate(\'pipeline\')">View all →</button>'
      + '</div>'
      + attnBody + greenFooter
      + '</div>'
    );
  }

  if (id === 'tasks') {
    var todayStr = new Date().toISOString().slice(0,10);
    var openTasks = (typeof TASKS !== 'undefined' ? TASKS : []).filter(function(t){ return t.status==='open'; })
      .sort(function(a,b){
        var po=(TASK_PRIORITY_ORDER[a.priority]||9)-(TASK_PRIORITY_ORDER[b.priority]||9);
        if(po!==0) return po;
        return (a.dueDate||'').localeCompare(b.dueDate||'');
      }).slice(0,6);
    var tasksBody = openTasks.length===0
      ? '<div style="padding:28px;text-align:center;color:var(--muted);font-size:12px;">✓ No open tasks</div>'
      : openTasks.map(function(t){
          var isOverdue = t.dueDate && t.dueDate < todayStr;
          var pb = {High:'#8b3a3a',Medium:'#8b6a2a',Low:'#888'}[t.priority]||'#888';
          var linkedDeal = t.dealId ? DEALS.find(function(d){ return d.id===t.dealId; }) : null;
          return '<div style="padding:9px 16px;border-bottom:1px solid var(--cream-d);display:flex;align-items:flex-start;gap:9px;">'
            + '<div style="width:5px;height:5px;border-radius:50%;background:'+pb+';flex-shrink:0;margin-top:5px;"></div>'
            + '<div style="flex:1;min-width:0;">'
            + '<div style="font-size:11.5px;color:var(--text-2);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+escHtml(t.title)+'</div>'
            + '<div style="font-size:10px;color:'+(isOverdue?'var(--red)':'var(--muted)')+';margin-top:1px;">'
            + (t.owner||'')+(t.dueDate?' · '+(isOverdue?'⚠ ':'')+t.dueDate:'')+(linkedDeal?' · '+linkedDeal.company:'')
            + '</div></div>'
            + '<button onclick="toggleTaskDone(\''+t.id+'\')" style="width:16px;height:16px;border-radius:3px;border:1.5px solid var(--border);background:var(--white);flex-shrink:0;cursor:pointer;margin-top:1px;" title="Mark done"></button>'
            + '</div>';
        }).join('');
    return wrap(
      '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;">'
      + '<div style="padding:14px 18px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;">Open Tasks</div>'
      + '<button class="btn sm" onclick="navigate(\'tasks\')">View all →</button>'
      + '</div>'
      + tasksBody
      + '</div>'
    );
  }

  if (id === 'upcoming') {
    var upcomingBody = closingSoon.length === 0
      ? '<div style="padding:28px;text-align:center;color:var(--muted);font-size:12px;">No closings in next 60 days</div>'
      : closingSoon.map(function(d) {
          var days = Math.round((new Date(d.closeDate) - today) / (1000*60*60*24));
          var urgency = days <= 14 ? 'var(--red)' : days <= 30 ? 'var(--amber)' : 'var(--green)';
          return '<div style="padding:10px 16px;border-bottom:1px solid var(--cream-d);display:flex;align-items:center;gap:12px;">'
            + '<div style="text-align:center;width:38px;flex-shrink:0;">'
            + '<div style="font-family:\'Spectral\',serif;font-size:18px;color:'+urgency+';line-height:1;">'+days+'</div>'
            + '<div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;">days</div>'
            + '</div>'
            + '<div style="flex:1;min-width:0;">'
            + '<div style="font-size:12px;font-weight:500;color:#000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+d.company+'</div>'
            + '<div style="font-size:10.5px;color:var(--muted);">'+d.size+' · '+d.closeDate+'</div>'
            + '</div></div>';
        }).join('');
    return wrap(
      '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;">'
      + '<div style="padding:14px 18px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;">Closing Soon</div>'
      + '<div style="font-size:10.5px;color:var(--muted);">Next 60 days</div>'
      + '</div>'
      + upcomingBody
      + '</div>'
    );
  }

  if (id === 'charts') {
    return wrap(
      '<div style="display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:16px;">'
      + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:18px 20px;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;margin-bottom:4px;">Pipeline by Stage</div>'
      + '<div style="font-size:10.5px;color:var(--muted);margin-bottom:14px;">Deal count across all stages</div>'
      + '<div style="position:relative;height:200px;"><canvas id="ov-stageBar"></canvas></div>'
      + '</div>'
      + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:18px 20px;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;margin-bottom:4px;">Pipeline by Sector</div>'
      + '<div style="font-size:10.5px;color:var(--muted);margin-bottom:14px;">A$m live deal value by sector</div>'
      + '<div style="position:relative;height:200px;"><canvas id="ov-sectorDonut"></canvas></div>'
      + '</div>'
      + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:18px 20px;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;margin-bottom:4px;">Deal Sizes</div>'
      + '<div style="font-size:10.5px;color:var(--muted);margin-bottom:14px;">Live pipeline — A$m by transaction</div>'
      + '<div style="position:relative;height:200px;"><canvas id="ov-dealBar"></canvas></div>'
      + '</div>'
      + '</div>'
    );
  }

  if (id === 'pipeline_table') {
    return wrap(
      '<div class="section-header"><div class="section-title">Active Deal Pipeline <span class="section-count">'+liveDeals.length+'</span></div><button class="btn sm" onclick="navigate(\'pipeline\')">Full pipeline →</button></div>'
      + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;">'
      + '<table class="data-table"><thead><tr><th>Transaction</th><th>Type</th><th>Size</th><th>Stage</th><th>Owner</th></tr></thead><tbody>'
      + liveDeals.map(function(d){ var sc=stageConf(d.stage); return '<tr><td class="strong" style="white-space:nowrap;">'+firmLogo(d.company,18)+' '+d.company+'</td><td>'+d.dealType+'</td><td class="mono">'+d.size+'</td><td><span class="badge '+sc.badgeClass+'">'+sc.label+'</span></td><td>'+d.owner+'</td></tr>'; }).join('')
      + '</tbody></table>'
      + '</div>'
    );
  }

  if (id === 'activity') {
    var actBody;
    if (recentActivity.length > 0) {
      actBody = recentActivity.map(function(a) {
        var icon = {'meeting':'🤝','call':'📞','email':'✉️','conference':'🏛️'}[a.type] || '📋';
        var linkedDeal = a.dealId ? DEALS.find(function(d){ return d.id===a.dealId; }) : null;
        return '<div style="padding:10px 0;border-bottom:1px solid var(--cream-d);">'
          + '<div style="display:flex;align-items:flex-start;gap:10px;">'
          + '<div style="font-size:14px;flex-shrink:0;margin-top:1px;">'+icon+'</div>'
          + '<div>'
          + '<div style="font-size:12px;font-weight:500;color:#000;line-height:1.4;">'+a.title+'</div>'
          + '<div style="font-size:11px;color:var(--muted);margin-top:2px;">'+a.date+(linkedDeal?' · '+linkedDeal.company:'')+'</div>'
          + '</div></div></div>';
      }).join('');
    } else {
      actBody = '<ul class="activity-list">'+(typeof ACTIVITY !== 'undefined' ? ACTIVITY.map(function(a){ return '<li class="activity-item"><div class="activity-dot '+a.type+'"></div><div class="activity-body"><div class="activity-text">'+a.text+'</div><div class="activity-time">'+a.time+'</div></div></li>'; }).join('') : '')+'</ul>';
    }
    return wrap(
      '<div class="section-header"><div class="section-title">Recent Activity</div><button class="btn sm" onclick="navigate(\'activity\')">View all →</button></div>'
      + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;padding:6px 18px;max-height:360px;overflow-y:auto;">'
      + actBody
      + '</div>'
    );
  }

  if (id === 'owner') {
    var ownerMap = {};
    DEALS.filter(function(d){ return ['origination','mandate','live','paused'].includes(d.stage); }).forEach(function(d) {
      if (!ownerMap[d.owner]) ownerMap[d.owner] = { count: 0, value: 0, stages: {} };
      ownerMap[d.owner].count++;
      ownerMap[d.owner].value += d.sizeMn;
      ownerMap[d.owner].stages[d.stage] = (ownerMap[d.owner].stages[d.stage]||0) + 1;
    });
    var ownerRows = Object.keys(ownerMap).sort().map(function(owner) {
      var o = ownerMap[owner];
      var stageStr = Object.keys(o.stages).map(function(s){ return s+' ('+o.stages[s]+')'; }).join(', ');
      return '<tr><td class="strong">'+escHtml(owner)+'</td><td class="mono" style="text-align:center;">'+o.count+'</td><td class="mono">A$'+o.value.toFixed(0)+'m</td><td style="font-size:11px;color:var(--muted);">'+escHtml(stageStr)+'</td></tr>';
    }).join('');
    return wrap(
      '<div class="section-header"><div class="section-title">Pipeline by Owner</div></div>'
      + '<div style="background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;">'
      + '<table class="data-table"><thead><tr><th>Owner</th><th style="text-align:center;">Deals</th><th>Total A$m</th><th>Stages</th></tr></thead><tbody>'
      + ownerRows
      + '</tbody></table>'
      + '</div>'
    );
  }

  return '';
}

function openDashboardCustomiser() {
  var body = '<div style="display:flex;flex-direction:column;gap:2px;" id="dash-cfg-list">';
  DASHBOARD_CONFIG.forEach(function(w, i) {
    body += '<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--white);border:1px solid var(--border);border-radius:6px;" data-id="'+w.id+'">'
      + '<input type="checkbox" id="dc-'+w.id+'" '+(w.enabled?'checked':'')+' style="width:14px;height:14px;accent-color:#000;cursor:pointer;">'
      + '<label for="dc-'+w.id+'" style="flex:1;font-size:13px;color:var(--text);cursor:pointer;">'+w.label+'</label>'
      + '<button onclick="moveDashboardWidget(\''+w.id+'\',-1)" class="btn sm" style="padding:3px 8px;" '+(i===0?'disabled':'')+'>▲</button>'
      + '<button onclick="moveDashboardWidget(\''+w.id+'\',1)" class="btn sm" style="padding:3px 8px;" '+(i===DASHBOARD_CONFIG.length-1?'disabled':'')+'>▼</button>'
      + '</div>';
  });
  body += '</div>';

  var footer = '<button class="btn" onclick="closeModal()" style="margin-right:8px;">Cancel</button>'
    + '<button class="btn primary" onclick="saveDashboardConfig()">Save</button>';

  openModal('Customise Dashboard', body, footer);
}

function moveDashboardWidget(id, dir) {
  var idx = DASHBOARD_CONFIG.findIndex(function(w){ return w.id===id; });
  var newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= DASHBOARD_CONFIG.length) return;
  var tmp = DASHBOARD_CONFIG[idx];
  DASHBOARD_CONFIG[idx] = DASHBOARD_CONFIG[newIdx];
  DASHBOARD_CONFIG[newIdx] = tmp;
  openDashboardCustomiser();
}

function saveDashboardConfig() {
  DASHBOARD_CONFIG.forEach(function(w) {
    var cb = document.getElementById('dc-'+w.id);
    if (cb) w.enabled = cb.checked;
  });
  saveState();
  closeModal();
  renderView();
}

function drawOverviewCharts() {
  loadChartJs().then(function() {
    if (!document.getElementById('ov-stageBar')) return;
    freeCanvases(['ov-stageBar','ov-sectorDonut','ov-dealBar']);
    const liveDeals = DEALS.filter(d => ['origination','mandate','live','paused'].includes(d.stage));

    // Colours
    const STAGE_COLORS_OV = {
      origination: '#78716c',
      mandate:     '#c8570a',
      live:        '#44403c',
      paused:      '#c4b5a5',
    };
    const stageOrder = ['origination','mandate','live','paused'];
    const stageLabels = ['Origination','Mandated','Execution','On Pause'];
    const stageCounts = stageOrder.map(k => DEALS.filter(d=>d.stage===k).length);
    const stageColors = stageOrder.map(k => STAGE_COLORS_OV[k]);

    // Chart 1 — Stage bar
    const ctx1 = document.getElementById('ov-stageBar');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'bar',
        data: { labels: stageLabels, datasets: [{ data: stageCounts, backgroundColor: stageColors, borderRadius: 4, borderSkipped: false }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.raw + ' deal' + (ctx.raw!==1?'s':'') } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#888', maxRotation: 25 } },
            y: { grid: { color: '#f0ece4' }, ticks: { stepSize: 1, font: { size: 10 }, color: '#888' }, beginAtZero: true }
          }
        }
      });
    }

    // Chart 2 — Sector donut
    const sectorMap = {};
    liveDeals.forEach(d => { sectorMap[d.sector] = (sectorMap[d.sector]||0) + d.sizeMn; });
    const sectorLabels = Object.keys(sectorMap);
    const sectorVals   = Object.values(sectorMap);
    const palette = ['#1a1a1a','#c9a84c','#818cf8','#22c55e','#f97316','#94a3b8','#e879f9','#38bdf8'];
    const ctx2 = document.getElementById('ov-sectorDonut');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'doughnut',
        data: { labels: sectorLabels, datasets: [{ data: sectorVals, backgroundColor: palette.slice(0, sectorLabels.length), borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }] },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '60%',
          plugins: { legend: { position: 'right', labels: { font: { size: 10 }, color: '#555', boxWidth: 10, padding: 8 } }, tooltip: { callbacks: { label: ctx => ' A$' + ctx.raw + 'm' } } }
        }
      });
    }

    // Chart 3 — Deal size horizontal bar
    const sorted = liveDeals.slice().sort((a,b) => b.sizeMn - a.sizeMn);
    const ctx3 = document.getElementById('ov-dealBar');
    if (ctx3) {
      new Chart(ctx3, {
        type: 'bar',
        data: {
          labels: sorted.map(d => d.company.length > 16 ? d.company.slice(0,14)+'…' : d.company),
          datasets: [{
            data: sorted.map(d => d.sizeMn),
            backgroundColor: sorted.map(d => d.statusKey==='red'?'rgba(239,68,68,0.7)':d.statusKey==='amber'?'rgba(201,168,76,0.7)':'rgba(34,197,94,0.7)'),
            borderRadius: 4, borderSkipped: false
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' A$' + ctx.raw + 'm' } } },
          scales: {
            x: { grid: { color: '#f0ece4' }, ticks: { font: { size: 10 }, color: '#888', callback: v => 'A$'+v+'m' } },
            y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#555' } }
          }
        }
      });
    }
  });
}

