// ============================================================
// UI HELPERS — toast, save indicator, modal, list editor, chart loader
// ============================================================
function showSavePulse() {
  var el = document.getElementById('save-indicator');
  if (!el) return;
  el.style.opacity = '1';
  el.textContent = 'Saved';
  clearTimeout(el._timer);
  el._timer = setTimeout(function() { el.style.opacity = '0'; }, 1800);
}

// ── TOAST NOTIFICATION ────────────────────────────────────────
function showToast(msg, isError) {
  var existing = document.getElementById('crm-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'crm-toast';
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed',
    'bottom:24px',
    'right:24px',
    'background:' + (isError ? '#8b3a3a' : '#000'),
    'color:#fff',
    'font-family:DM Sans,sans-serif',
    'font-size:12px',
    'font-weight:500',
    'padding:10px 18px',
    'border-radius:6px',
    'z-index:9999',
    'box-shadow:0 4px 16px rgba(0,0,0,0.25)',
    'transition:opacity 0.3s',
    'opacity:1',
  ].join(';');
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; }, 3000);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3400);
}


// ============================================================
// HELPER — Chart.js loader (loads once, resolves promise)
// ============================================================
let _chartJsReady = null;
function loadChartJs() {
  if (_chartJsReady) return _chartJsReady;
  _chartJsReady = new Promise(resolve => {
    if (window.Chart) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'js/vendor/chart.umd.js';
    s.onload = resolve;
    document.head.appendChild(s);
  });
  return _chartJsReady;
}

// Track active Chart.js instance to destroy before re-draw
let _activeChart = null;
// Destroy any Chart.js instance bound to these canvas ids so they can be redrawn
function freeCanvases(ids) {
  if (!window.Chart) return;
  ids.forEach(function(id) {
    var c = document.getElementById(id);
    var existing = c && window.Chart.getChart(c);
    if (existing) { try { existing.destroy(); } catch(e) {} }
  });
}
function destroyChart() {
  if (_activeChart) { try { _activeChart.destroy(); } catch(e){} _activeChart = null; }
}

// ============================================================
// MODAL SYSTEM
// ============================================================
function openModal(title, bodyHTML, footerHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-footer').innerHTML = footerHTML;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  if (typeof onModalClosed === 'function') onModalClosed();
}
function mval(id) { return document.getElementById(id)?.value?.trim() || ''; }
function formatDealSize(mn) {
  var n = parseFloat(mn) || 0;
  if (n >= 1000) return 'A$' + (Math.round((n/1000)*100)/100) + 'bn';
  return 'A$' + (Math.round(n*100)/100) + 'm';
}

// Collect list-editor items
function collectList(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} .le-input`))
    .map(i => i.value.trim()).filter(Boolean);
}

// Render a list editor (inline add/remove rows)
function listEditorHTML(containerId, items = [], placeholder = 'Add item…') {
  const rows = items.map((item, i) => `
    <div class="list-editor-item">
      <input class="form-input le-input" value="${escHtml(item)}" placeholder="${placeholder}" />
      <button class="remove-btn" onclick="removeListItem(this)">×</button>
    </div>`).join('');
  return `<div class="list-editor" id="${containerId}">
    ${rows}
    <button class="add-item-btn" onclick="addListItem('${containerId}','${placeholder}')">+ Add item</button>
  </div>`;
}

function addListItem(containerId, placeholder) {
  const container = document.getElementById(containerId);
  const btn = container.querySelector('.add-item-btn');
  const div = document.createElement('div');
  div.className = 'list-editor-item';
  div.innerHTML = `<input class="form-input le-input" placeholder="${placeholder}" /><button class="remove-btn" onclick="removeListItem(this)">×</button>`;
  container.insertBefore(div, btn);
  div.querySelector('input').focus();
}

function removeListItem(btn) {
  btn.parentElement.remove();
}

function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
