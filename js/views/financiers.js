// ============================================================
// LENDERS
// ============================================================

function renderLenders() {
  var f = LENDERS;
  if (state.lenderSearch) {
    var q = state.lenderSearch.toLowerCase();
    f = f.filter(function(l) {
      return l.name.toLowerCase().includes(q) ||
             l.type.toLowerCase().includes(q) ||
             l.assetClasses.some(function(a) { return a.toLowerCase().includes(q); }) ||
             l.notes.toLowerCase().includes(q);
    });
  }
  if (state.lenderTypeFilter) f = f.filter(function(l) { return l.typeKey === state.lenderTypeFilter; });
  if (state.lenderAssetFilter) f = f.filter(function(l) {
    return l.assetClasses.some(function(a) { return a.toLowerCase().includes(state.lenderAssetFilter.toLowerCase()); });
  });

  var allAssets = Array.from(new Set(LENDERS.flatMap(function(l) { return l.assetClasses; }))).sort();
  var chartData = state.lenderTypeFilter
    ? FINANCIER_CHART_DATA.filter(function(d) { return d.typeKey === state.lenderTypeFilter; })
    : FINANCIER_CHART_DATA;

  // Build toolbar HTML
  var assetOptions = allAssets.map(function(a) {
    return '<option value="' + a + '"' + (state.lenderAssetFilter === a ? ' selected' : '') + '>' + a + '</option>';
  }).join('');

  var typeOptions = [
    ['', 'All financier types'],
    ['major_bank', 'Major Bank'],
    ['regional_bank', 'Regional Bank'],
    ['private_credit', 'Private Credit Fund'],
    ['super', 'Superannuation Fund'],
    ['insurance', 'Insurance / Life Company'],
    ['real_estate_credit', 'Real Estate Credit Manager'],
    ['infrastructure', 'Infrastructure Asset Manager'],
  ].map(function(pair) {
    return '<option value="' + pair[0] + '"' + (state.lenderTypeFilter === pair[0] ? ' selected' : '') + '>' + pair[1] + '</option>';
  }).join('');

  var toolbar = '<div class="toolbar">'
    + '<input type="text" placeholder="Search financiers, asset class, structure..." value="' + escHtml(state.lenderSearch) + '" oninput="state.lenderSearch=this.value;renderView()" />'
    + '<select onchange="state.lenderTypeFilter=this.value;renderView()">' + typeOptions + '</select>'
    + '<select onchange="state.lenderAssetFilter=this.value;renderView()">'
    + '<option value="">All asset classes</option>' + assetOptions + '</select>'
    + '<div class="toolbar-spacer"></div>'
    + '<div style="font-size:12px;color:var(--muted);">' + f.length + ' counterpart' + (f.length !== 1 ? 'ies' : 'y') + '</div>'
    + '<div class="view-toggle">'
    + '<button class="vt-btn ' + (state.lenderViewMode === 'list' ? 'active' : '') + '" onclick="state.lenderViewMode=\'list\';destroyChart();renderView()">List</button>'
    + '<button class="vt-btn ' + (state.lenderViewMode === 'chart' ? 'active' : '') + '" onclick="state.lenderViewMode=\'chart\';renderView()">Chart</button>'
    + '</div>'
    + '<button class="btn primary" onclick="openLenderModal()">+ Add Financier</button>'
    + '<button class="btn" onclick="openLendersSnapshot()" style="font-size:11.5px;">📋 Snapshot</button>'
    + '</div>';

  if (state.lenderViewMode === 'chart') {
    // Build type legend
    var typeColorMap = {major_bank:'Major Bank',regional_bank:'Regional Bank',private_credit:'Private Credit',super:'Superannuation',insurance:'Insurance',real_estate_credit:'RE Credit',infrastructure:'Infrastructure'};
    var legend = Object.entries(FINANCIER_TYPE_COLORS).map(function(entry) {
      var k = entry[0], col = entry[1];
      var label = typeColorMap[k] || k;
      return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--text-2);">'
        + '<span style="width:10px;height:10px;border-radius:50%;background:' + col + ';display:inline-block;flex-shrink:0;"></span>'
        + label + '</span>';
    }).join('');

    // Build summary table rows
    var maxFUM = Math.max.apply(null, FINANCIER_CHART_DATA.map(function(x) { return x.fum; }));
    var tableRows = chartData.map(function(d) {
      var typeLabel = typeColorMap[d.typeKey] || d.typeKey;
      var col = FINANCIER_TYPE_COLORS[d.typeKey] || '#888';
      var pct = Math.round(d.fum / maxFUM * 100);
      var fumStr = d.fum >= 1 ? d.fum.toFixed(0) : d.fum.toFixed(1);
      var maxStr = d.maxDeal >= 1000 ? 'A$' + (d.maxDeal/1000).toFixed(0) + 'bn+' : 'A$' + d.maxDeal + 'm';
      return '<tr style="border-bottom:0.5px solid var(--cream-d);">'
        + '<td style="padding:7px 10px;font-weight:500;color:#000;white-space:nowrap;">' + firmLogo(d.fullName,16) + ' ' + d.name + '</td>'
        + '<td style="padding:7px 10px;"><span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;">'
        + '<span style="width:7px;height:7px;border-radius:50%;background:' + col + ';flex-shrink:0;"></span>' + typeLabel + '</span></td>'
        + '<td style="padding:7px 10px;text-align:right;font-family:\'Spectral\',serif;font-size:13px;">' + fumStr + '</td>'
        + '<td style="padding:7px 10px;text-align:right;color:var(--muted);">A$' + d.minDeal + 'm</td>'
        + '<td style="padding:7px 10px;text-align:right;color:var(--muted);">' + maxStr + '</td>'
        + '<td style="padding:7px 10px;min-width:120px;"><div style="height:5px;background:var(--cream-d);border-radius:3px;overflow:hidden;">'
        + '<div style="height:100%;width:' + pct + '%;background:' + col + ';border-radius:3px;"></div></div></td>'
        + '</tr>';
    }).join('');

    var chartHTML = '<div style="background:var(--white);border:1px solid var(--border);border-radius:10px;padding:24px 28px;margin-bottom:16px;">'
      + '<div style="margin-bottom:6px;">'
      + '<div style="font-family:\'Spectral\',serif;font-size:15px;color:#000;">Financier Universe — FUM vs Mandate Size</div>'
      + '<div style="font-size:11px;color:var(--muted);margin-top:2px;">X axis: FUM (A$bn) · Y axis: max single mandate (A$m) · Bubble size = FUM scale · Colour = type</div>'
      + '</div>'
      + '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px;">' + legend + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">'
      + '<div><div style="font-size:11px;font-weight:500;color:var(--text-2);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.07em;">FUM vs Max Mandate</div>'
      + '<div style="position:relative;height:320px;"><canvas id="financierBubble" role="img"></canvas></div></div>'
      + '<div><div style="font-size:11px;font-weight:500;color:var(--text-2);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.07em;">FUM by Firm (A$bn)</div>'
      + '<div style="position:relative;height:320px;"><canvas id="financierBar" role="img"></canvas></div></div>'
      + '</div>'
      + '<div style="margin-top:22px;padding-top:18px;border-top:1px solid var(--border);">'
      + '<div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:12px;">Financier Summary</div>'
      + '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:11px;">'
      + '<thead><tr style="border-bottom:1px solid var(--border);">'
      + '<th style="text-align:left;padding:6px 10px;color:var(--muted);font-weight:500;text-transform:uppercase;font-size:9px;letter-spacing:0.08em;">Firm</th>'
      + '<th style="text-align:left;padding:6px 10px;color:var(--muted);font-weight:500;text-transform:uppercase;font-size:9px;">Type</th>'
      + '<th style="text-align:right;padding:6px 10px;color:var(--muted);font-weight:500;text-transform:uppercase;font-size:9px;">FUM (A$bn)</th>'
      + '<th style="text-align:right;padding:6px 10px;color:var(--muted);font-weight:500;text-transform:uppercase;font-size:9px;">Min</th>'
      + '<th style="text-align:right;padding:6px 10px;color:var(--muted);font-weight:500;text-transform:uppercase;font-size:9px;">Max</th>'
      + '<th style="text-align:left;padding:6px 10px;color:var(--muted);font-weight:500;text-transform:uppercase;font-size:9px;">Scale</th>'
      + '</tr></thead>'
      + '<tbody>' + tableRows + '</tbody>'
      + '</table></div></div></div>';

    setTimeout(function() { drawFinancierCharts(chartData); }, 60);
    return toolbar + chartHTML;
  }

  // List view
  if (f.length === 0) {
    return toolbar + '<div class="empty-state"><div class="es-icon">🔍</div>No financiers match your filters.</div>';
  }

  var cards = f.map(function(l) {
    var assetBadges = l.assetClasses.map(function(a) {
      return '<span class="badge stone">' + a + '</span>';
    }).join('');

    var txnBadges = l.transactionTypes.slice(0,2).map(function(t) {
      return '<span class="badge navy" style="font-size:9px;">' + t + '</span>';
    }).join('');
    if (l.transactionTypes.length > 2) {
      txnBadges += '<span class="badge stone" style="font-size:9px;">+' + (l.transactionTypes.length - 2) + '</span>';
    }

    var recentDealBadges = l.recentDeals.map(function(d) {
      return '<span class="badge gold">' + d + '</span>';
    }).join('');

    return '<div class="lender-card" onclick="toggleLenderExpand(\'' + l.id + '\',event)">'
      + '<div class="lc-inner">'
      + '<div class="lc-top">'
      + '<div>'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">' + firmLogo(l.name,22) + '<div class="lc-name" style="margin:0;">' + l.name + '</div><span class="badge stone" style="font-size:9px;">' + l.type + '</span></div>'
      + '<div class="tag-row" style="margin-top:7px;">' + assetBadges + '</div>'
      + '</div>'
      + '<div style="text-align:right;flex-shrink:0;margin-left:16px;">'
      + '<div class="lc-size-label">Deal range</div>'
      + '<div class="lc-size">' + l.sizeMin + ' \u2013 ' + l.sizeMax + '</div>'
      + '<div class="tag-row" style="justify-content:flex-end;margin-top:6px;">' + txnBadges + '</div>'
      + '<div class="last-updated" style="margin-top:8px;">Updated ' + l.lastUpdated + '</div>'
      + '</div>'
      + '</div>'
      + '<div id="lender-expand-' + l.id + '" style="display:none;margin-top:14px;">'
      + '<div class="field-grid">'
      + '<div class="field-item"><div class="f-label">Geography</div><div class="f-value">' + l.geographies.join(', ') + '</div></div>'
      + '<div class="field-item"><div class="f-label">Transaction Types</div><div class="f-value">' + l.transactionTypes.join(', ') + '</div></div>'
      + '<div class="field-item" style="grid-column:1/-1;"><div class="f-label">Preferred Structure</div><div class="f-value">' + l.preferredStructure + '</div></div>'
      + '<div class="field-item"><div class="f-label">Pricing / Returns</div><div class="f-value">' + l.pricing + '</div></div>'
      + '<div class="field-item"><div class="f-label">Key Contacts</div><div class="f-value">' + l.contacts + '</div></div>'
      + '</div>'
      + '<hr class="divider">'
      + '<div class="field-item" style="margin-bottom:10px;"><div class="f-label">Recent Transactions</div>'
      + '<div class="tag-row" style="margin-top:5px;">' + recentDealBadges + '</div></div>'
      + '<div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;">'
      + '<button onclick="event.stopPropagation();openLenderModal(\'' + l.id + '\')" class="btn sm">Edit Financier</button>'
      + '<button onclick="event.stopPropagation();navigateToDD(\'' + l.name + '\')" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#000;color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;font-family:DM Sans,sans-serif;cursor:pointer;letter-spacing:0.03em;">View DD Requirements &#x2192;</button>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div style="padding:9px 20px;background:var(--cream);border-top:1px solid var(--border);font-size:11px;color:var(--text-2);line-height:1.5;">'
      + '<span style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);font-weight:500;">Notes \u00b7 </span>' + l.notes
      + '</div>'
      + '</div>';
  }).join('');

  return toolbar + cards;
}

function drawFinancierCharts(data) {
  loadChartJs().then(function() {
    ['financierBubble','financierBar'].forEach(function(id) {
      var existing = window.Chart.getChart(id);
      if (existing) existing.destroy();
    });

    var gridCol = 'rgba(0,0,0,0.05)';
    var tickCol = '#999';

    var bubbleCanvas = document.getElementById('financierBubble');
    if (bubbleCanvas) {
      new window.Chart(bubbleCanvas, {
        type: 'bubble',
        data: {
          datasets: data.map(function(d) {
            return {
              label: d.name,
              data: [{ x: d.fum, y: d.maxDeal, r: Math.max(6, Math.min(32, Math.sqrt(d.fum) * 1.8)) }],
              backgroundColor: d.color + 'cc',
              borderColor: d.color,
              borderWidth: 1.5,
            };
          })
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var d = data[ctx.datasetIndex];
                  return [d.fullName, 'FUM: A$' + (d.fum >= 1 ? d.fum.toFixed(0) : d.fum.toFixed(1)) + 'bn', 'Max mandate: A$' + d.maxDeal + 'm', 'Min mandate: A$' + d.minDeal + 'm'];
                }
              }
            }
          },
          scales: {
            x: { title: { display: true, text: 'FUM (A$bn)', font: { size: 10 }, color: tickCol }, ticks: { color: tickCol, font: { size: 9 }, callback: function(v) { return 'A$' + v + 'bn'; } }, grid: { color: gridCol }, min: 0 },
            y: { title: { display: true, text: 'Max Mandate (A$m)', font: { size: 10 }, color: tickCol }, ticks: { color: tickCol, font: { size: 9 }, callback: function(v) { return v >= 1000 ? 'A$' + (v/1000).toFixed(0) + 'bn' : 'A$' + v + 'm'; } }, grid: { color: gridCol }, min: 0 }
          }
        }
      });
    }

    var barCanvas = document.getElementById('financierBar');
    if (barCanvas) {
      var sorted = data.slice().sort(function(a,b) { return b.fum - a.fum; });
      new window.Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: sorted.map(function(d) { return d.name; }),
          datasets: [{
            data: sorted.map(function(d) { return d.fum; }),
            backgroundColor: sorted.map(function(d) { return d.color + 'cc'; }),
            borderColor: sorted.map(function(d) { return d.color; }),
            borderWidth: 1.5,
            borderRadius: 3,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var d = sorted[ctx.dataIndex];
                  return ' A$' + (d.fum >= 1 ? d.fum.toFixed(0) : d.fum.toFixed(1)) + 'bn FUM';
                }
              }
            }
          },
          scales: {
            x: { ticks: { color: tickCol, font: { size: 9 }, callback: function(v) { return 'A$' + v + 'bn'; } }, grid: { color: gridCol } },
            y: { ticks: { color: tickCol, font: { size: 9 } }, grid: { display: false } }
          }
        }
      });
    }
  });
}


function toggleLenderExpand(id, event) {
  const el = document.getElementById(`lender-expand-${id}`);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}
function navigateToDD(lenderName) { state.librarySearch = lenderName; navigate('library'); }


// ============================================================
// FINANCIER CRUD
// ============================================================
function openLenderModal(id) {
  var l = id ? LENDERS.find(function(x){ return x.id === id; }) : null;
  var isNew = !l;

  var typeOpts = [
    ['major_bank','Major Bank'],
    ['regional_bank','Regional Bank'],
    ['private_credit','Private Credit Fund'],
    ['super','Superannuation Fund'],
    ['insurance','Insurance / Life Company'],
    ['real_estate_credit','Real Estate Credit Manager'],
    ['infrastructure','Infrastructure Asset Manager'],
    ['other','Other'],
  ].map(function(p){
    return '<option value="'+p[0]+'"'+(l&&l.typeKey===p[0]?' selected':'')+'>'+p[1]+'</option>';
  }).join('');

  var statusOpts = ['Active','Inactive','Monitoring'].map(function(s){
    return '<option value="'+s+'"'+(l&&l.status===s?' selected':'')+'>'+s+'</option>';
  }).join('');

  var body = '<div class="form-grid">'
    + '<div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="ln-name" value="'+escHtml(l?l.name:'')+'" placeholder="e.g. Commonwealth Bank of Australia" /></div>'
    + '<div class="form-group"><label class="form-label">Short Name</label><input class="form-input" id="ln-short" value="'+escHtml(l?l.shortName:'')+'" placeholder="e.g. CBA" /></div>'
    + '<div class="form-group"><label class="form-label">Type</label><select class="form-select" id="ln-typeKey">'+typeOpts+'</select></div>'
    + '<div class="form-group"><label class="form-label">Status</label><select class="form-select" id="ln-status">'+statusOpts+'</select></div>'
    + '<div class="form-group"><label class="form-label">Min Deal Size</label><input class="form-input" id="ln-sizeMin" value="'+escHtml(l?l.sizeMin:'')+'" placeholder="e.g. A$20m" /></div>'
    + '<div class="form-group"><label class="form-label">Max Deal Size</label><input class="form-input" id="ln-sizeMax" value="'+escHtml(l?l.sizeMax:'')+'" placeholder="e.g. A$500m" /></div>'
    + '<div class="form-group"><label class="form-label">Pricing / Returns</label><input class="form-input" id="ln-pricing" value="'+escHtml(l?l.pricing:'')+'" placeholder="e.g. BBSW + 200–350bps" /></div>'
    + '<div class="form-group"><label class="form-label">Key Contacts</label><input class="form-input" id="ln-contacts" value="'+escHtml(l?l.contacts:'')+'" placeholder="Name (Title)" /></div>'
    + '<div class="form-group"><label class="form-label">Last Updated</label><input class="form-input" id="ln-updated" type="date" value="'+(l?l.lastUpdated:new Date().toISOString().slice(0,10))+'" /></div>'
    + '<div class="form-group full"><label class="form-label">Preferred Structure / Notes</label><textarea class="form-textarea" id="ln-structure">'+escHtml(l?l.preferredStructure:'')+' </textarea></div>'
    + '<div class="form-group full"><label class="form-label">Relationship Notes</label><textarea class="form-textarea" id="ln-notes">'+escHtml(l?l.notes:'')+' </textarea></div>'
    + '<hr class="form-divider" />'
    + '<div class="form-section-label">Asset Classes</div>'
    + '<div class="form-group full">'+listEditorHTML('ln-assetClasses', l?l.assetClasses:[], 'e.g. Residential Mortgage')+'</div>'
    + '<div class="form-section-label">Transaction Types</div>'
    + '<div class="form-group full">'+listEditorHTML('ln-txnTypes', l?l.transactionTypes:[], 'e.g. Warehouse Facility')+'</div>'
    + '<div class="form-section-label">Geographies</div>'
    + '<div class="form-group full">'+listEditorHTML('ln-geos', l?l.geographies:[], 'e.g. Australia')+'</div>'
    + '<div class="form-section-label">Recent Deals</div>'
    + '<div class="form-group full">'+listEditorHTML('ln-recentDeals', l?l.recentDeals:[], 'e.g. A$200m RMBS (2025)')+'</div>'
    + '</div>';

  var deleteBtn = !isNew ? '<button class="btn danger" onclick="deleteLender(\''+l.id+'\')">Delete</button>' : '';
  var footer = '<div>'+deleteBtn+'</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="btn" onclick="closeModal()">Cancel</button>'
    + '<button class="btn primary" onclick="saveLender(\''+(l?l.id:'')+'\')">Save Financier</button>'
    + '</div>';

  openModal(isNew ? 'New Financier' : 'Edit — '+(l?l.name:''), body, footer);
}

function saveLender(id) {
  var typeKeyVal = mval('ln-typeKey');
  var typeLabels = {
    major_bank:'Major Bank', regional_bank:'Regional Bank', private_credit:'Private Credit Fund',
    super:'Superannuation Fund', insurance:'Insurance / Life Company',
    real_estate_credit:'Real Estate Credit Manager', infrastructure:'Infrastructure Asset Manager', other:'Other',
  };
  var record = {
    id: id || genId(),
    name: mval('ln-name'), shortName: mval('ln-short'),
    type: typeLabels[typeKeyVal] || mval('ln-typeKey'),
    typeKey: typeKeyVal,
    sizeMin: mval('ln-sizeMin'), sizeMax: mval('ln-sizeMax'),
    pricing: mval('ln-pricing'), contacts: mval('ln-contacts'),
    lastUpdated: mval('ln-updated'), status: mval('ln-status') || 'Active',
    preferredStructure: mval('ln-structure').trim(),
    notes: mval('ln-notes').trim(),
    assetClasses: collectList('ln-assetClasses'),
    transactionTypes: collectList('ln-txnTypes'),
    geographies: collectList('ln-geos'),
    recentDeals: collectList('ln-recentDeals'),
  };
  if (!record.name) { alert('Financier name is required.'); return; }
  if (id) { LENDERS = LENDERS.map(function(l){ return l.id===id ? record : l; }); }
  else { LENDERS.push(record); }
  saveState(); closeModal(); renderView();
}

function deleteLender(id) {
  if (!confirm('Delete this financier? This cannot be undone.')) return;
  LENDERS = LENDERS.filter(function(l){ return l.id !== id; });
  saveState(); closeModal(); renderView();
}

