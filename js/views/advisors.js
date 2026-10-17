// ============================================================
// DD LIBRARY — with CRUD
// ============================================================
// ============================================================
// ADVISORY LANDSCAPE — with CRUD
// ============================================================
const ADVISOR_TYPE_LABELS = {
  independent: 'Independent Advisory',
  boutique: 'Boutique / Specialist',
  big4: 'Big Four Advisory',
  bank: 'Investment Bank',
  other: 'Other',
};
const TIER_BADGE = { 'Tier 1':'blue', 'Tier 2':'stone', 'Tier 3':'stone' };

function openAdvisorModal(id) {
  var a = id ? ADVISORS.find(function(x) { return x.id === id; }) : null;
  var isNew = !a;

  var typeOpts = Object.entries(ADVISOR_TYPE_LABELS).map(function(entry) {
    return '<option value="' + entry[0] + '"' + (a && a.typeKey === entry[0] ? ' selected' : '') + '>' + entry[1] + '</option>';
  }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Firm Name</label><input class="form-input" id="adv-name" value="' + escHtml(a ? a.name : '') + '" /></div>'
    + '<div class="form-group"><label class="form-label">Firm Type</label><select class="form-select" id="adv-typeKey">' + typeOpts + '</select></div>'
    + '<div class="form-group"><label class="form-label">Tier</label><select class="form-select" id="adv-tier">'
    + '<option value="Tier 1"' + (a && a.tier === 'Tier 1' ? ' selected' : '') + '>Tier 1 — Primary competitor</option>'
    + '<option value="Tier 2"' + (a && a.tier === 'Tier 2' ? ' selected' : '') + '>Tier 2 — Mid-tier / boutique</option>'
    + '<option value="Tier 3"' + (a && a.tier === 'Tier 3' ? ' selected' : '') + '>Tier 3 — Peripheral</option>'
    + '</select></div>'
    + '<div class="form-group"><label class="form-label">Deal Size Min</label><input class="form-input" id="adv-dealSizeMin" value="' + escHtml(a ? a.dealSizeMin : '') + '" placeholder="e.g. A$50m" /></div>'
    + '<div class="form-group"><label class="form-label">Deal Size Max</label><input class="form-input" id="adv-dealSizeMax" value="' + escHtml(a ? a.dealSizeMax : '') + '" placeholder="e.g. A$2,000m" /></div>'
    + '<div class="form-group"><label class="form-label">Key People</label><input class="form-input" id="adv-keyPeople" value="' + escHtml(a ? a.keyPeople : '') + '" placeholder="Name (Title)" /></div>'
    + '<div class="form-group"><label class="form-label">Last Updated</label><input class="form-input" id="adv-lastUpdated" type="date" value="' + (a ? a.lastUpdated : '') + '" /></div>'
    + '<div class="form-group full"><label class="form-label">Competitive Position</label><textarea class="form-textarea" id="adv-competitive">' + escHtml(a ? a.competitive : '') + '</textarea></div>'
    + '<div class="form-group full"><label class="form-label">Our Relationship</label><textarea class="form-textarea" id="adv-relationship">' + escHtml(a ? a.relationship : '') + '</textarea></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Advisory Focus Areas</div>'
    + '<div class="form-group full">' + listEditorHTML('adv-focus', a ? a.focus : [], 'e.g. M&A Advisory') + '</div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Sectors</div>'
    + '<div class="form-group full">' + listEditorHTML('adv-sectors', a ? a.sectors : [], 'e.g. Financial Services') + '</div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Geographies</div>'
    + '<div class="form-group full">' + listEditorHTML('adv-geography', a ? a.geography : [], 'e.g. UK, Europe') + '</div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Recent Mandates</div>'
    + '<div class="form-group full">' + listEditorHTML('adv-recentMandates', a ? a.recentMandates : [], 'e.g. Deal name (year)') + '</div>'
    + '</div>';

  var deleteBtn = !isNew ? '<button class="btn danger" onclick="deleteAdvisor(\'' + a.id + '\')">' + 'Delete</button>' : '';
  var footer = '<div>' + deleteBtn + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveAdvisor(\'' + (a ? a.id : '') + '\')">' + 'Save Advisor</button>'
    + '</div>';

  openModal(isNew ? 'New Advisor' : 'Edit Advisor', body, footer);
}

function saveAdvisor(id) {
  const typeKey = mval('adv-typeKey');
  const record = {
    id: id || genId(),
    name: mval('adv-name'),
    type: ADVISOR_TYPE_LABELS[typeKey] || typeKey,
    typeKey,
    tier: mval('adv-tier'),
    dealSizeMin: mval('adv-dealSizeMin'),
    dealSizeMax: mval('adv-dealSizeMax'),
    keyPeople: mval('adv-keyPeople'),
    competitive: mval('adv-competitive'),
    relationship: mval('adv-relationship'),
    lastUpdated: mval('adv-lastUpdated'),
    focus: collectList('adv-focus'),
    sectors: collectList('adv-sectors'),
    geography: collectList('adv-geography'),
    recentMandates: collectList('adv-recentMandates'),
  };
  if (!record.name) { alert('Firm name is required.'); return; }
  if (id) { ADVISORS = ADVISORS.map(a => a.id === id ? record : a); }
  else { ADVISORS.push(record); }
  saveState(); closeModal(); renderView();
}

function deleteAdvisor(id) {
  if (!confirm('Delete this advisor? This cannot be undone.')) return;
  ADVISORS = ADVISORS.filter(a => a.id !== id);
  saveState(); closeModal(); renderView();
}


// ============================================================
// RENDER — ADVISORY LANDSCAPE (patched with chart toggle)
// ============================================================
function renderAdvisors() {
  let f = ADVISORS;
  if (state.advisorSearch)     { const q=state.advisorSearch.toLowerCase();     f=f.filter(a=>a.name.toLowerCase().includes(q)||a.focus.some(x=>x.toLowerCase().includes(q))||a.sectors.some(s=>s.toLowerCase().includes(q))||a.competitive.toLowerCase().includes(q)||a.relationship.toLowerCase().includes(q)); }
  if (state.advisorTypeFilter) f=f.filter(a=>a.typeKey===state.advisorTypeFilter);
  if (state.advisorTierFilter) f=f.filter(a=>a.tier===state.advisorTierFilter);

  const t1=ADVISORS.filter(a=>a.tier==='Tier 1').length;
  const t2=ADVISORS.filter(a=>a.tier==='Tier 2').length;

  const html = `
  <div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">
    <div class="stat-card"><div class="s-label">Firms Tracked</div><div class="s-value">${ADVISORS.length}</div><div class="s-sub">All advisory firms</div></div>
    <div class="stat-card"><div class="s-label">Tier 1 Firms</div><div class="s-value">${t1}</div><div class="s-sub">Primary competitors</div></div>
    <div class="stat-card"><div class="s-label">Tier 2 Firms</div><div class="s-value">${t2}</div><div class="s-sub">Mid-tier / boutique</div></div>
    <div class="stat-card"><div class="s-label">Referral Partners</div><div class="s-value">${ADVISORS.filter(a=>a.relationship.toLowerCase().includes('referral')).length}</div><div class="s-sub">Active referral relationships</div></div>
  </div>

  <div class="toolbar">
    <input type="text" placeholder="Search advisors…" value="${state.advisorSearch}" oninput="state.advisorSearch=this.value;renderView()" />
    <select onchange="state.advisorTypeFilter=this.value;renderView()">
      <option value="">All types</option>
      ${Object.entries(ADVISOR_TYPE_LABELS).map(([k,v])=>`<option value="${k}" ${state.advisorTypeFilter===k?'selected':''}>${v}</option>`).join('')}
    </select>
    <select onchange="state.advisorTierFilter=this.value;renderView()">
      <option value="">All tiers</option>
      <option value="Tier 1" ${state.advisorTierFilter==='Tier 1'?'selected':''}>Tier 1</option>
      <option value="Tier 2" ${state.advisorTierFilter==='Tier 2'?'selected':''}>Tier 2</option>
    </select>
    <div class="toolbar-spacer"></div>
    <div style="font-size:12px;color:var(--muted);">${f.length} firm${f.length!==1?'s':''}</div>
    <div class="view-toggle">
      <button class="vt-btn ${state.advisorViewMode==='list'?'active':''}"  onclick="state.advisorViewMode='list';destroyChart();renderView()">List</button>
      <button class="vt-btn ${state.advisorViewMode==='chart'?'active':''}" onclick="state.advisorViewMode='chart';renderView()">Chart</button>
    </div>
    <button class="btn primary" onclick="openAdvisorModal()">+ Add Advisor</button>
    <button class="btn" onclick="openAdvisorsSnapshot()" style="font-size:11.5px;">📋 Snapshot</button>
  </div>

  ${state.advisorViewMode === 'chart' ? `
  <div style="background:var(--white);border:1px solid var(--border);border-radius:10px;padding:24px 28px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
      <div>
        <div style="font-family:'Spectral',serif;font-size:15px;color:#000;">Advisory Firm Comparison</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Avg deal size vs. deals per year · last 2 financial years · bubble size = relative deal volume</div>
      </div>
    </div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px;">
      ${ADVISOR_CHART_DATA.map(d=>`<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--text-2);"><span style="width:10px;height:10px;border-radius:50%;background:${d.color};display:inline-block;"></span>${d.name}</span>`).join('')}
    </div>
    <div style="position:relative;height:380px;"><canvas id="advisorChart" role="img" aria-label="Bubble chart comparing advisory firms by deal size and number of deals"></canvas></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
      ${ADVISOR_CHART_DATA.map(d=>`
      <div style="background:var(--cream);border-radius:6px;padding:10px 12px;border-left:3px solid ${d.color};">
        <div style="font-size:11px;font-weight:600;color:#000;margin-bottom:4px;">${d.name}</div>
        <div style="display:flex;gap:16px;">
          <div><div style="font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);">Avg Deal</div><div style="font-size:13px;font-family:'Spectral',serif;">A$${d.avgDealSizeMn}m</div></div>
          <div><div style="font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);">Deals/Yr</div><div style="font-size:13px;font-family:'Spectral',serif;">${d.dealsPerYear}</div></div>
          <div><div style="font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);">Tier</div><div><span class="badge ${TIER_BADGE[d.tier]||'stone'}">${d.tier}</span></div></div>
        </div>
      </div>`).join('')}
    </div>
  </div>` : `
  ${f.length===0?`<div class="empty-state">No advisors match your filters.</div>`:''}
  ${f.map(a=>`
  <div class="advisor-card">
    <div class="ac-inner">
      <div class="ac-top">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
            ${firmLogo(a.name,22)}<div class="ac-name" style="margin:0;">${a.name}</div>
            <span class="badge ${TIER_BADGE[a.tier]||'stone'}">${a.tier}</span>
          </div>
          <div class="ac-type">${ADVISOR_TYPE_LABELS[a.typeKey]||a.type}</div>
          <div class="tag-row" style="margin-top:7px;">${a.focus.map(f2=>`<span class="badge navy" style="font-size:9px;">${f2}</span>`).join('')}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:16px;">
          <div style="font-size:10px;color:var(--muted);margin-bottom:3px;">Deal range</div>
          <div style="font-family:'Spectral',serif;font-size:13px;font-weight:300;">${a.dealSizeMin} – ${a.dealSizeMax}</div>
          <div style="font-size:10.5px;color:var(--muted);margin-top:4px;">${a.geography.join(', ')}</div>
          <div class="last-updated" style="margin-top:6px;">Updated ${a.lastUpdated}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        <div><div class="f-label" style="margin-bottom:4px;">Sectors</div><div class="tag-row">${a.sectors.map(s=>`<span class="badge stone">${s}</span>`).join('')}</div></div>
        <div><div class="f-label" style="margin-bottom:4px;">Recent Mandates</div><div style="font-size:11.5px;color:var(--text-2);line-height:1.5;">${a.recentMandates.slice(0,2).join(' · ')}</div></div>
      </div>
      <hr class="divider" style="margin:12px 0;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div><div class="f-label" style="margin-bottom:4px;">Competitive Position</div><div style="font-size:11.5px;color:var(--text-2);line-height:1.5;">${a.competitive}</div></div>
        <div><div class="f-label" style="margin-bottom:4px;">Our Relationship</div><div style="font-size:11.5px;color:var(--text-2);line-height:1.5;">${a.relationship}</div></div>
      </div>
      <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;color:var(--muted);">Key people: ${a.keyPeople}</div>
        <button class="btn sm" onclick="openAdvisorModal('${a.id}')">Edit</button>
      </div>
    </div>
    <div class="ac-footer"><span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Notes · </span>${a.notes||''}</div>
  </div>`).join('')}`}`;

  // Draw chart after DOM settles
  if (state.advisorViewMode === 'chart') {
    setTimeout(() => drawAdvisorChart(), 60);
  }
  return html;
}

function drawAdvisorChart() {
  destroyChart();
  const canvas = document.getElementById('advisorChart');
  if (!canvas) return;
  loadChartJs().then(() => {
    const data = ADVISOR_CHART_DATA;
    _activeChart = new window.Chart(canvas, {
      type: 'bubble',
      data: {
        datasets: data.map(d => ({
          label: d.name,
          data: [{ x: d.avgDealSizeMn, y: d.dealsPerYear, r: Math.max(8, Math.sqrt(d.avgDealSizeMn * d.dealsPerYear) * 0.9) }],
          backgroundColor: d.color + 'cc',
          borderColor: d.color,
          borderWidth: 2,
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const d = data[ctx.datasetIndex];
                return [`${d.name}`, `Avg deal: A$${d.avgDealSizeMn}m`, `Deals/yr: ${d.dealsPerYear}`, `Tier: ${d.tier}`];
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Average Deal Size (A$m)', font: { size: 11 }, color: '#888' },
            ticks: { color: '#888', font: { size: 10 }, callback: v => `A$${v}m` },
            grid: { color: 'rgba(0,0,0,0.05)' },
            min: 0,
          },
          y: {
            title: { display: true, text: 'Deals Closed Per Year (avg last 2 FY)', font: { size: 11 }, color: '#888' },
            ticks: { color: '#888', font: { size: 10 } },
            grid: { color: 'rgba(0,0,0,0.05)' },
            min: 0,
          }
        }
      }
    });
  });
}

