// ============================================================
// RENDER — CLIENT TARGETS (new page)
// ============================================================
const SECTOR_LABELS = { agri:'Agriculture', fig:'Financial Institutions', realestate:'Real Estate' };
const SECTOR_COLORS = { agri:'#3a6b4a', fig:'#1e4a6e', realestate:'#6b4a2a' };
const PRIORITY_BADGE = { High:'blue', Medium:'amber', Low:'stone' };
const STATUS_BADGE = { Engaged:'green', Target:'navy', Monitoring:'stone' };

function renderTargets() {
  var isSF = state.targetBusiness !== 'broking';
  var toggle = '<div style="display:flex;align-items:center;gap:0;background:var(--cream-d);border-radius:8px;padding:3px;margin-bottom:20px;width:fit-content;">'
    + '<button onclick="state.targetBusiness=\'sf\';state.targetSearch=\'\';state.targetPriority=\'\';state.targetStatus=\'\';destroyChart();renderView()" style="padding:7px 20px;border-radius:6px;border:none;cursor:pointer;font-size:12.5px;font-weight:500;transition:all 0.15s;background:' + (isSF?'var(--white)':'transparent') + ';color:' + (isSF?'#000':'var(--muted)') + ';box-shadow:' + (isSF?'0 1px 4px rgba(0,0,0,0.10)':'none') + ';">Structured Finance</button>'
    + '<button onclick="state.targetBusiness=\'broking\';state.targetSearch=\'\';state.targetPriority=\'\';state.targetStatus=\'\';destroyChart();renderView()" style="padding:7px 20px;border-radius:6px;border:none;cursor:pointer;font-size:12.5px;font-weight:500;transition:all 0.15s;background:' + (!isSF?'var(--white)':'transparent') + ';color:' + (!isSF?'#000':'var(--muted)') + ';box-shadow:' + (!isSF?'0 1px 4px rgba(0,0,0,0.10)':'none') + ';">Broking</button>'
    + '</div>';
  return toggle + (isSF ? renderSFTargets() : renderBrokingTargets());
}

function renderSFTargets() {
  var sector   = state.targetSector || 'agri';
  var subtypes = SF_SUBTYPES[sector] || [];
  var subType  = state.targetSubType || '';

  var f = CLIENT_TARGETS.filter(function(t){ return t.sector === sector; });
  if (subType && subType !== 'All Types') f = f.filter(function(t){ return t.subType === subType || t.type === subType; });
  if (state.targetSearch)   { var q=state.targetSearch.toLowerCase(); f=f.filter(function(t){ return t.name.toLowerCase().includes(q)||(t.type||'').toLowerCase().includes(q)||(t.description||'').toLowerCase().includes(q); }); }
  if (state.targetPriority) f=f.filter(function(t){ return t.priority===state.targetPriority; });
  if (state.targetStatus)   f=f.filter(function(t){ return t.status===state.targetStatus; });

  var allTargets  = CLIENT_TARGETS;
  var highCount   = allTargets.filter(function(t){ return t.priority==='High'; }).length;
  var engagedCount= allTargets.filter(function(t){ return t.status==='Engaged'; }).length;

  var html = '<div class="stat-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Total Targets</div><div class="s-value">'+allTargets.length+'</div><div class="s-sub">Across all sectors</div></div>'
    + '<div class="stat-card"><div class="s-label">High Priority</div><div class="s-value">'+highCount+'</div><div class="s-sub">Immediate focus</div></div>'
    + '<div class="stat-card"><div class="s-label">Engaged</div><div class="s-value">'+engagedCount+'</div><div class="s-sub">Active dialogue</div></div>'
    + '<div class="stat-card"><div class="s-label">Agri</div><div class="s-value">'+allTargets.filter(function(t){return t.sector==='agri';}).length+'</div><div class="s-sub">Agriculture targets</div></div>'
    + '<div class="stat-card"><div class="s-label">FIG</div><div class="s-value">'+allTargets.filter(function(t){return t.sector==='fig';}).length+'</div><div class="s-sub">Financial institutions</div></div>'
    + '</div>';

  // Sector tabs
  html += '<div style="display:flex;gap:0;border:1px solid var(--border);border-radius:6px;overflow:hidden;width:fit-content;margin-bottom:12px;">';
  Object.entries(SECTOR_LABELS).forEach(function(e) {
    var k=e[0],v=e[1];
    var active = sector===k;
    html += '<button onclick="state.targetSector=\''+k+'\';state.targetSubType=\'\';destroyChart();renderView()" style="padding:8px 18px;font-family:\'DM Sans\',sans-serif;font-size:12px;font-weight:'+(active?'600':'400')+';background:'+(active?SECTOR_COLORS[k]:'var(--white)')+';color:'+(active?'#fff':'var(--text-2)')+';border:none;border-right:1px solid var(--border);cursor:pointer;transition:all .12s;">'
      + v+' <span style="opacity:0.7;font-size:10px;">('+allTargets.filter(function(t){return t.sector===k;}).length+')</span></button>';
  });
  html += '</div>';

  // Sub-type pill strip
  html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;">';
  subtypes.forEach(function(st) {
    var active = (subType===st) || (st==='All Types' && !subType);
    html += '<button onclick="state.targetSubType=\''+(st==='All Types'?'':st)+'\';renderView()" style="padding:4px 12px;border-radius:20px;border:1px solid '+(active?SECTOR_COLORS[sector]:'var(--border)')+';background:'+(active?SECTOR_COLORS[sector]:'var(--white)')+';color:'+(active?'#fff':'var(--text-2)')+';font-size:11px;cursor:pointer;">'+st+'</button>';
  });
  html += '<button onclick="openEditTypesModal(\'' + sector + '\')" style="padding:4px 12px;border-radius:20px;border:1px solid var(--border);background:var(--white);color:var(--text-2);font-size:11px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit Types</button>';
  html += '</div>';

  // Toolbar
  html += '<div class="toolbar" style="margin-bottom:16px;">'
    + '<input type="text" placeholder="Search targets…" value="'+escHtml(state.targetSearch)+'" oninput="state.targetSearch=this.value;renderView()" />'
    + '<select onchange="state.targetPriority=this.value;renderView()"><option value="">All priorities</option><option value="High"'+(state.targetPriority==='High'?' selected':'')+'>High</option><option value="Medium"'+(state.targetPriority==='Medium'?' selected':'')+'>Medium</option><option value="Low"'+(state.targetPriority==='Low'?' selected':'')+'>Low</option></select>'
    + '<select onchange="state.targetStatus=this.value;renderView()"><option value="">All statuses</option><option value="Engaged"'+(state.targetStatus==='Engaged'?' selected':'')+'>Engaged</option><option value="Target"'+(state.targetStatus==='Target'?' selected':'')+'>Target</option><option value="Monitoring"'+(state.targetStatus==='Monitoring'?' selected':'')+'>Monitoring</option></select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">'+f.length+' target'+(f.length!==1?'s':'')+'</div>'
    + '<div class="view-toggle">'
    + '<button class="vt-btn '+(state.targetViewMode==='list'?'active':'')+'" onclick="state.targetViewMode=\'list\';destroyChart();renderView()">List</button>'
    + '<button class="vt-btn '+(state.targetViewMode==='chart'?'active':'')+'" onclick="state.targetViewMode=\'chart\';renderView()">Chart</button>'
    + '</div>'
    + '<button class="btn primary" onclick="openTargetModal()">+ Add Target</button>'
    + '<button class="btn" onclick="openTargetsSnapshot(state.targetSector||\'agri\')" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  html += state.targetViewMode === 'chart' ? renderTargetChart(f) : renderTargetList(f);

  if (state.targetViewMode === 'chart') setTimeout(function(){ drawTargetChart(f); }, 60);
  return html;
}

function renderBrokingTargets() {
  var f = BROKING_TARGETS.slice();
  if (state.targetSearch) { var q=state.targetSearch.toLowerCase(); f=f.filter(function(t){ return t.name.toLowerCase().includes(q)||(t.subType||'').toLowerCase().includes(q)||(t.notes||'').toLowerCase().includes(q); }); }
  if (state.targetPriority) f=f.filter(function(t){ return t.priority===state.targetPriority; });
  if (state.targetStatus)   f=f.filter(function(t){ return t.pitchStatus===state.targetStatus; });

  var total    = BROKING_TARGETS.length;
  var mandated = BROKING_TARGETS.filter(function(t){ return t.pitchStatus==='Mandated'; }).length;
  var pitching = BROKING_TARGETS.filter(function(t){ return t.pitchStatus==='Pitching'; }).length;
  var pv       = BROKING_TARGETS.reduce(function(s,t){ return s+t.estimatedDealSize; },0).toFixed(2);

  var html = '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">'
    + '<div class="stat-card"><div class="s-label">Total Targets</div><div class="s-value">'+total+'</div><div class="s-sub">In pipeline</div></div>'
    + '<div class="stat-card"><div class="s-label">Est. Loan Value</div><div class="s-value">A$'+pv+'m</div><div class="s-sub">Across all targets</div></div>'
    + '<div class="stat-card"><div class="s-label">Pitching</div><div class="s-value">'+pitching+'</div><div class="s-sub">Active proposals</div></div>'
    + '<div class="stat-card"><div class="s-label">Mandated</div><div class="s-value">'+mandated+'</div><div class="s-sub">Won — in progress</div></div>'
    + '</div>';

  html += '<div class="toolbar" style="margin-bottom:16px;">'
    + '<input type="text" placeholder="Search broking targets…" value="'+escHtml(state.targetSearch)+'" oninput="state.targetSearch=this.value;renderView()" />'
    + '<select onchange="state.targetPriority=this.value;renderView()"><option value="">All priorities</option><option value="High"'+(state.targetPriority==='High'?' selected':'')+'>High</option><option value="Medium"'+(state.targetPriority==='Medium'?' selected':'')+'>Medium</option><option value="Low"'+(state.targetPriority==='Low'?' selected':'')+'>Low</option></select>'
    + '<select onchange="state.targetStatus=this.value;renderView()"><option value="">All statuses</option>'
    + Object.keys(PITCH_STATUS_CONFIG).map(function(s){ return '<option value="'+s+'"'+(state.targetStatus===s?' selected':'')+'>'+s+'</option>'; }).join('')
    + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">'+f.length+' target'+(f.length!==1?'s':'')+'</div>'
    + '<button class="btn primary" onclick="openBrokingTargetModal()">+ Add Target</button>'
    + '<button class="btn" onclick="openBrokingTargetsSnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  if (f.length === 0) return html + '<div class="empty-state">No targets match your filters.</div>';

  html += '<div style="display:flex;flex-direction:column;gap:10px;">';
  f.forEach(function(t) {
    var ps   = PITCH_STATUS_CONFIG[t.pitchStatus] || PITCH_STATUS_CONFIG.Identified;
    var pb   = PRIORITY_BADGE[t.priority] || 'stone';
    var heat = ['','🌡','🌡🌡','🔥'][Math.min(t.heatScore||0,3)];
    var today= new Date().toISOString().slice(0,10);
    var daysSince = t.lastContacted ? Math.floor((new Date()-new Date(t.lastContacted))/86400000) : null;
    var contactColor = daysSince===null?'var(--muted)':daysSince<14?'#3a6b4a':daysSince<30?'#8b7a2a':'#8b3a3a';

    html += '<div class="card" style="overflow:hidden;padding:0;">';
    html += '<div style="padding:16px 20px;">';
    html += '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">';
    html += '<div style="display:flex;align-items:center;gap:10px;">';
    html += firmLogo(t.name, 22);
    html += '<div>';
    html += '<div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;">'+t.name+'</div>';
    html += '<div style="font-size:11px;color:var(--muted);margin-top:1px;">'+t.subType+' · '+t.owner+'</div>';
    html += '</div></div>';
    html += '<div style="display:flex;align-items:center;gap:7px;flex-shrink:0;">';
    html += heat ? '<span style="font-size:14px;" title="Relationship heat">'+heat+'</span>' : '';
    html += '<span class="badge '+pb+'">'+t.priority+'</span>';
    html += '<span class="badge '+(PITCH_STATUS_CONFIG[t.pitchStatus]?{Identified:'stone',Engaged:'blue',Pitching:'amber',Mandated:'teal'}[t.pitchStatus]:'stone')+'">'+t.pitchStatus+'</span>';
    html += '</div></div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">';
    html += '<div><div style="font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:2px;">Contact</div><div style="font-size:11.5px;color:var(--text-2);">'+t.contacts+'</div></div>';
    html += '<div><div style="font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:2px;">Last Contacted</div><div style="font-size:11.5px;color:'+contactColor+';">'+(t.lastContacted||'—')+(daysSince!==null?' ('+daysSince+'d ago)':'')+'</div></div>';
    html += '<div><div style="font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:2px;">Est. Loan Size</div><div style="font-family:\'Spectral\',serif;font-size:14px;color:#000;">A$'+t.estimatedDealSize+'m</div></div>';
    html += '</div>';
    html += '<div style="display:flex;justify-content:flex-end;"><button class="btn sm" onclick="openBrokingTargetModal(\''+t.id+'\')">Edit</button></div>';
    html += '</div>';
    var footerText = (t.nextStep ? '<span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Next Step · </span>'+escHtml(t.nextStep) : '')
      + (t.notes ? (t.nextStep ? '<span style="color:var(--muted);margin:0 6px;">·</span>' : '') + escHtml(t.notes) : '');
    if (footerText) html += '<div style="padding:9px 20px;background:var(--cream);border-top:1px solid var(--border);font-size:11.5px;color:var(--text-2);line-height:1.5;">'+footerText+'</div>';
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function openBrokingTargetModal(id) {
  var t = id ? BROKING_TARGETS.find(function(x){ return x.id===id; }) : null;
  var isNew = !t;
  var sectors = ['Residential','Commercial Property','Business','Asset Finance','SMSF','Personal Finance','Other'];
  var sectorOpts = sectors.map(function(s){ return '<option value="'+s+'"'+(t&&t.sector===s?' selected':'')+'>'+s+'</option>'; }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Client / Company</label><input class="form-input" id="bkt-name" value="'+escHtml(t?t.name:'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Sub Type</label><input class="form-input" id="bkt-subType" value="'+escHtml(t?t.subType:'')+'" placeholder="e.g. SMSF Loans" /></div>'
    + '<div class="form-group"><label class="form-label">Sector</label><select class="form-select" id="bkt-sector">'+sectorOpts+'</select></div>'
    + '<div class="form-group"><label class="form-label">Key Contact</label><input class="form-input" id="bkt-contacts" value="'+escHtml(t?t.contacts:'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Owner</label><input class="form-input" id="bkt-owner" value="'+escHtml(t?t.owner:'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Pitch Status</label><select class="form-select" id="bkt-pitchStatus">'
    + Object.keys(PITCH_STATUS_CONFIG).map(function(s){ return '<option value="'+s+'"'+(t&&t.pitchStatus===s?' selected':'')+'>'+s+'</option>'; }).join('')
    + '</select></div>'
    + '<div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="bkt-priority"><option value="High"'+(t&&t.priority==='High'?' selected':'')+'>High</option><option value="Medium"'+(t&&t.priority==='Medium'?' selected':'')+'>Medium</option><option value="Low"'+(t&&t.priority==='Low'?' selected':'')+'>Low</option></select></div>'
    + '<div class="form-group"><label class="form-label">Relationship Heat</label><select class="form-select" id="bkt-heatScore"><option value="0"'+(t&&t.heatScore===0?' selected':'')+'>Cold</option><option value="1"'+(t&&t.heatScore===1?' selected':'')+'>Warm 🌡</option><option value="2"'+(t&&t.heatScore===2?' selected':'')+'>Hot 🌡🌡</option><option value="3"'+(t&&t.heatScore===3?' selected':'')+'>Very Hot 🔥</option></select></div>'
    + '<div class="form-group"><label class="form-label">Last Contacted</label><input class="form-input" id="bkt-lastContacted" type="date" value="'+(t?t.lastContacted||'':'')+'" /></div>'
    + '<div class="form-group"><label class="form-label">Est. Loan Size (A$m)</label><input class="form-input" id="bkt-estimatedDealSize" type="number" step="0.01" value="'+(t?t.estimatedDealSize:'')+'" /></div>'
    + '<div class="form-group full"><label class="form-label">Next Step</label><textarea class="form-textarea" id="bkt-nextStep">'+escHtml(t?t.nextStep:'')+' </textarea></div>'
    + '<div class="form-group full"><label class="form-label">Notes</label><textarea class="form-textarea" id="bkt-notes">'+escHtml(t?t.notes:'')+' </textarea></div>'
    + '</div>';

  var deleteBtn = !isNew ? '<button class="btn danger" onclick="deleteBrokingTarget(\''+t.id+'\')">Delete</button>' : '';
  var footer = '<div>'+deleteBtn+'</div><div style="display:flex;gap:8px;"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveBrokingTarget(\''+(t?t.id:'')+'\')">Save</button></div>';
  openModal(isNew?'New Broking Target':'Edit — '+(t?t.name:''), body, footer);
}

function saveBrokingTarget(id) {
  var record = {
    id: id||genId(), name: mval('bkt-name'), subType: mval('bkt-subType'), sector: mval('bkt-sector'),
    contacts: mval('bkt-contacts'), owner: mval('bkt-owner'), pitchStatus: mval('bkt-pitchStatus'),
    priority: mval('bkt-priority'), heatScore: parseInt(document.getElementById('bkt-heatScore').value)||0,
    lastContacted: mval('bkt-lastContacted'),
    estimatedDealSize: parseFloat(document.getElementById('bkt-estimatedDealSize').value)||0,
    nextStep: mval('bkt-nextStep').trim(), notes: mval('bkt-notes').trim(),
    dealFrequency: 1,
  };
  if (!record.name) { alert('Client name is required.'); return; }
  if (id) { BROKING_TARGETS = BROKING_TARGETS.map(function(t){ return t.id===id?record:t; }); }
  else { BROKING_TARGETS.push(record); }
  saveState(); closeModal(); renderView();
}

function deleteBrokingTarget(id) {
  if (!confirm('Delete this target?')) return;
  BROKING_TARGETS = BROKING_TARGETS.filter(function(t){ return t.id!==id; });
  saveState(); closeModal(); renderView();
}

function renderTargetList(f) {
  if (f.length === 0) return `<div class="empty-state">No targets match your filters.</div>`;
  return f.map(t => {
    const sc = SECTOR_COLORS[t.sector];
    return `
    <div class="card" style="overflow:hidden;padding:0;margin-bottom:12px;">
      <div style="padding:18px 20px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              ${firmLogo(t.name, 26)}
              <div style="font-family:'Spectral',serif;font-size:15px;color:#000;">${t.name}</div>
              ${t.asx ? `<span class="badge stone" style="font-size:9px;">ASX: ${t.asx}</span>` : ''}
              <span class="badge ${PRIORITY_BADGE[t.priority]||'stone'}">${t.priority} Priority</span>
              <span class="badge ${STATUS_BADGE[t.status]||'stone'}">${t.status}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);margin-top:3px;">${t.type}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;margin-left:16px;">
            <div style="font-size:10px;color:var(--muted);">Est. mandate size</div>
            <div style="font-family:'Spectral',serif;font-size:16px;font-weight:300;color:#000;">A$${t.estimatedDealSize}m</div>
            <div style="font-size:10px;color:var(--muted);margin-top:2px;">Revenue: ${t.revenue}</div>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-2);line-height:1.55;margin-bottom:10px;">${t.description}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
          <div>
            <div class="f-label" style="margin-bottom:4px;">Mandate Types</div>
            <div class="tag-row">${t.mandateTypes.map(m=>`<span class="badge stone">${m}</span>`).join('')}</div>
          </div>
          <div>
            <div class="f-label" style="margin-bottom:4px;">Key Contacts</div>
            <div style="font-size:11.5px;color:var(--text-2);">${t.contacts}</div>
          </div>
          <div>
            <div class="f-label" style="margin-bottom:4px;">Est. Deal Frequency</div>
            <div style="font-size:11.5px;color:var(--text-2);">${t.dealFrequency}× per year</div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button class="btn sm" onclick="openTargetModal('${t.id}')">Edit</button>
        </div>
      </div>
      <div style="padding:10px 20px;background:var(--cream);border-top:1px solid var(--border);font-size:11.5px;color:var(--text-2);line-height:1.5;">
        <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Notes · </span>${t.notes}
      </div>
    </div>`;
  }).join('');
}

function renderTargetChart(f) {
  const sectorLabel = SECTOR_LABELS[state.targetSector];
  return `
  <div style="background:var(--white);border:1px solid var(--border);border-radius:10px;padding:24px 28px;">
    <div style="margin-bottom:6px;">
      <div style="font-family:'Spectral',serif;font-size:15px;color:#000;">${sectorLabel} — Target Opportunity Map</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px;">X axis: estimated deal size · Y axis: deal frequency per year · Bubble size = total annual mandate value · Colour = priority</div>
    </div>
    <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;"><span style="width:10px;height:10px;border-radius:50%;background:#1e4a6e;display:inline-block;"></span>High priority</span>
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;"><span style="width:10px;height:10px;border-radius:50%;background:#8b7a2a;display:inline-block;"></span>Medium priority</span>
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--muted);">● Filled = Engaged · ○ Ring = Target/Monitoring</span>
    </div>
    <div style="position:relative;height:380px;"><canvas id="targetChart" role="img" aria-label="Bubble chart showing client targets by deal size and frequency"></canvas></div>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:10px;">Target Summary</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
        ${f.map(t=>`
        <div style="background:var(--cream);border-radius:6px;padding:9px 12px;border-left:3px solid ${t.priority==='High'?SECTOR_COLORS[t.sector]:'var(--stone)'};">
          <div style="font-size:11px;font-weight:600;color:#000;margin-bottom:3px;">${t.name}</div>
          <div style="font-size:10px;color:var(--muted);">A$${t.estimatedDealSize}m · ${t.dealFrequency}×/yr</div>
          <div style="margin-top:4px;"><span class="badge ${STATUS_BADGE[t.status]||'stone'}" style="font-size:9px;">${t.status}</span></div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function drawTargetChart(f) {
  destroyChart();
  const canvas = document.getElementById('targetChart');
  if (!canvas || !f.length) return;
  const sc = SECTOR_COLORS[state.targetSector];
  loadChartJs().then(() => {
    const priorityColor = { High: sc + 'dd', Medium: '#8b7a2a' + 'bb', Low: '#888888bb' };
    const priorityBorder = { High: sc, Medium: '#8b7a2a', Low: '#888888' };
    _activeChart = new window.Chart(canvas, {
      type: 'bubble',
      data: {
        datasets: f.map(t => ({
          label: t.name,
          data: [{ x: t.estimatedDealSize, y: t.dealFrequency, r: Math.max(8, Math.sqrt(t.estimatedDealSize * t.dealFrequency) * 1.1) }],
          backgroundColor: t.status === 'Engaged' ? (priorityColor[t.priority]||'#888bb') : 'transparent',
          borderColor: priorityBorder[t.priority] || '#888',
          borderWidth: t.status === 'Engaged' ? 2 : 2.5,
          pointStyle: t.status === 'Engaged' ? 'circle' : 'circle',
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const t = f[ctx.datasetIndex];
                return [`${t.name}`, `Est. deal: A$${t.estimatedDealSize}m`, `Frequency: ${t.dealFrequency}×/yr`, `Status: ${t.status}`, `Priority: ${t.priority}`];
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Estimated Mandate Size (A$m)', font: { size: 11 }, color: '#888' },
            ticks: { color: '#888', font: { size: 10 }, callback: v => `A$${v}m` },
            grid: { color: 'rgba(0,0,0,0.05)' }, min: 0,
          },
          y: {
            title: { display: true, text: 'Estimated Deal Frequency (per year)', font: { size: 11 }, color: '#888' },
            ticks: { color: '#888', font: { size: 10 } },
            grid: { color: 'rgba(0,0,0,0.05)' }, min: 0,
          }
        }
      }
    });
  });
}

// ============================================================
// CLIENT TARGET CRUD
// ============================================================
function openTargetModal(id) {
  var t = id ? CLIENT_TARGETS.find(function(x) { return x.id === id; }) : null;
  var isNew = !t;

  var currentSector = t ? t.sector : state.targetSector;
  var currentSubType = t ? (t.subType || '') : '';

  var sectorOpts = Object.entries(SECTOR_LABELS).map(function(entry) {
    var k = entry[0], v = entry[1];
    var selected = currentSector === k ? ' selected' : '';
    return '<option value="' + k + '"' + selected + '>' + v + '</option>';
  }).join('');

  function buildSubTypeOpts(sector, selected) {
    var types = SF_SUBTYPES[sector] || [];
    return types.filter(function(s){ return s !== 'All Types'; }).map(function(s){
      return '<option value="' + s + '"' + (selected === s ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
  }

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Company Name</label><input class="form-input" id="tg-name" value="' + escHtml(t ? t.name : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Company Type</label><input class="form-input" id="tg-type" value="' + escHtml(t ? t.type : '') + '" placeholder="e.g. Non-Bank Lender" /></div>'
    + '<div class="form-group"><label class="form-label">Sector</label><select class="form-select" id="tg-sector" onchange="updateTargetSubTypes(this.value)">' + sectorOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Sub-Type</label><select class="form-select" id="tg-subType">' + buildSubTypeOpts(currentSector, currentSubType) + '</select></div>'
    + '<div class="form-group"><label class="form-label">ASX / Exchange Code</label><input class="form-input" id="tg-asx" value="' + escHtml(t ? t.asx : '') + '" placeholder="e.g. ELD, or Unlisted" /></div>'
    + '<div class="form-group"><label class="form-label">Revenue (est.)</label><input class="form-input" id="tg-revenue" value="' + escHtml(t ? t.revenue : '') + '" placeholder="e.g. A$500m" /></div>'
    + '<div class="form-group"><label class="form-label">Employees (est.)</label><input class="form-input" id="tg-employees" value="' + escHtml(t ? t.employees : '') + '" placeholder="e.g. ~500" /></div>'
    + '<div class="form-group"><label class="form-label">Est. Deal Size (A$m)</label><input class="form-input" id="tg-dealSize" type="number" value="' + (t ? t.estimatedDealSize : '') + '" placeholder="150" /></div>'
    + '<div class="form-group"><label class="form-label">Deal Frequency (per yr)</label><input class="form-input" id="tg-freq" type="number" step="0.5" value="' + (t ? t.dealFrequency : '') + '" placeholder="2" /></div>'
    + '<div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="tg-priority">'
    + '<option value="High"'   + (t && t.priority === 'High'   ? ' selected' : '') + '>High</option>'
    + '<option value="Medium"' + (t && t.priority === 'Medium' ? ' selected' : '') + '>Medium</option>'
    + '<option value="Low"'    + (t && t.priority === 'Low'    ? ' selected' : '') + '>Low</option>'
    + '</select></div>'
    + '<div class="form-group"><label class="form-label">Status</label><select class="form-select" id="tg-status">'
    + '<option value="Target"'    + (t && t.status === 'Target'     ? ' selected' : '') + '>Target</option>'
    + '<option value="Engaged"'   + (t && t.status === 'Engaged'    ? ' selected' : '') + '>Engaged</option>'
    + '<option value="Monitoring"'+ (t && t.status === 'Monitoring' ? ' selected' : '') + '>Monitoring</option>'
    + '</select></div>'
    + '<div class="form-group"><label class="form-label">Key Contacts</label><input class="form-input" id="tg-contacts" value="' + escHtml(t ? t.contacts : '') + '" placeholder="Name (Title)" /></div>'
    + '<div class="form-group"><label class="form-label">Last Updated</label><input class="form-input" id="tg-updated" type="date" value="' + (t ? t.lastUpdated : '') + '" /></div>'
    + '<div class="form-group full"><label class="form-label">Description</label><textarea class="form-textarea" id="tg-desc">' + escHtml(t ? t.description : '') + '</textarea></div>'
    + '<div class="form-group full"><label class="form-label">Notes</label><textarea class="form-textarea" id="tg-notes">' + escHtml(t ? t.notes : '') + '</textarea></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Mandate Types</div>'
    + '<div class="form-group full">' + listEditorHTML('tg-mandateTypes', t ? t.mandateTypes : [], 'e.g. ABS / Securitisation') + '</div>'
    + '</div>';

  var deleteBtn = !isNew ? '<button class="btn danger" onclick="deleteTarget(\'' + t.id + '\')">' + 'Delete</button>' : '';
  var footer = '<div>' + deleteBtn + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveTarget(\'' + (t ? t.id : '') + '\')">' + 'Save Target</button>'
    + '</div>';

  openModal(isNew ? 'New Client Target' : 'Edit — ' + (t ? t.name : ''), body, footer);
}

function updateTargetSubTypes(sector) {
  var sel = document.getElementById('tg-subType');
  if (!sel) return;
  var types = (SF_SUBTYPES[sector] || []).filter(function(s){ return s !== 'All Types'; });
  sel.innerHTML = types.map(function(s){ return '<option value="'+s+'">'+s+'</option>'; }).join('');
}

function saveTarget(id) {
  const record = {
    id: id || genId(),
    name: mval('tg-name'), type: mval('tg-type'),
    sector: mval('tg-sector'), subType: mval('tg-subType'),
    asx: mval('tg-asx'),
    revenue: mval('tg-revenue'), employees: mval('tg-employees'),
    estimatedDealSize: parseFloat(document.getElementById('tg-dealSize').value)||0,
    dealFrequency: parseFloat(document.getElementById('tg-freq').value)||1,
    priority: mval('tg-priority'), status: mval('tg-status'),
    contacts: mval('tg-contacts'), lastUpdated: mval('tg-updated'),
    description: mval('tg-desc'), notes: mval('tg-notes'),
    mandateTypes: collectList('tg-mandateTypes'),
  };
  if (!record.name) { alert('Company name is required.'); return; }
  if (id) { CLIENT_TARGETS = CLIENT_TARGETS.map(t => t.id===id ? record : t); }
  else { CLIENT_TARGETS.push(record); state.targetSector = record.sector; }
  saveState(); closeModal(); renderView();
}

function deleteTarget(id) {
  if (!confirm('Delete this target? This cannot be undone.')) return;
  CLIENT_TARGETS = CLIENT_TARGETS.filter(t => t.id !== id);
  saveState(); closeModal(); renderView();
}


