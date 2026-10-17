// ============================================================
// QUICK ADD
// ============================================================
function openQuickAdd() {
  var body = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">'
    + makeQACard('✅', 'New Task', 'Log an action item or next step', 'gold', "closeModal();openTaskModal()")
    + makeQACard('🤝', 'Log Activity', 'Record a meeting, call or email', 'blue', "closeModal();navigate('activity');setTimeout(openActivityModal,80)")
    + makeQACard('📁', 'New Deal', 'Add a mandate to the pipeline', 'green', "closeModal();navigate('pipeline');setTimeout(openDealModal,80)")
    + makeQACard('👤', 'New Contact', 'Add a person to your network', 'purple', "closeModal();navigate('contacts');setTimeout(openContactModal,80)")
    + '</div>';

  openModal('Quick Add', body, '<div></div><div><button class="btn" onclick="closeModal()">Cancel</button></div>');
}

function makeQACard(icon, label, sub, color, action) {
  var colors = { gold:'#b9975b', blue:'#1e4a6e', green:'#3a6b4a', purple:'#4a2a6e' };
  var bgs    = { gold:'#faf5eb', blue:'#e8f0f8', green:'#e8f3eb', purple:'#f0eaf8' };
  var col = colors[color] || '#333';
  var bg  = bgs[color]  || '#f5f5f5';
  return '<div onclick="' + action + '" style="background:' + bg + ';border:1px solid ' + col + '22;border-radius:10px;padding:20px 18px;cursor:pointer;transition:box-shadow 0.13s;text-align:left;" onmouseover="this.style.boxShadow=\'0 4px 16px rgba(0,0,0,0.10)\'" onmouseout="this.style.boxShadow=\'none\'">'
    + '<div style="font-size:26px;margin-bottom:8px;">' + icon + '</div>'
    + '<div style="font-family:\'Spectral\',serif;font-size:14px;color:' + col + ';margin-bottom:3px;">' + label + '</div>'
    + '<div style="font-size:11px;color:var(--muted);">' + sub + '</div>'
    + '</div>';
}

