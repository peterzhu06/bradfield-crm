// ============================================================
// AUTH — Supabase email/password sign-in
// ------------------------------------------------------------
// Users are created by an admin in the Supabase dashboard
// (Authentication → Users → "Add user") or invited by email.
// Public sign-up should be disabled (see README).
// ============================================================

var auth = { client: null, user: null, ready: false };

function isSupabaseConfigured() {
  var c = window.BRADFIELD_CONFIG || {};
  return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY && window.supabase && window.supabase.createClient);
}

function currentUser() { return auth.user; }

function initAuth(handlers) {
  var c = window.BRADFIELD_CONFIG || {};
  if (!isSupabaseConfigured()) {
    var w = document.getElementById('login-config-warning');
    if (w && (c.SUPABASE_URL || c.SUPABASE_ANON_KEY)) w.style.display = 'block';
    return Promise.resolve(null);
  }
  auth.client = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  auth.client.auth.onAuthStateChange(function(event, session) {
    var user = session ? session.user : null;
    var wasUser = auth.user;
    auth.user = user;
    if (event === 'PASSWORD_RECOVERY') { setTimeout(openChangePasswordModal, 300); }
    if (event === 'SIGNED_IN' && user && (!wasUser || wasUser.id !== user.id)) handlers.onSignedIn(user);
    if (event === 'SIGNED_OUT') handlers.onSignedOut();
    if (event === 'INITIAL_SESSION') { if (user) handlers.onSignedIn(user); else handlers.onSignedOut(); }
  });
  return auth.client;
}

function handleLogin(ev) {
  if (ev) ev.preventDefault();
  if (!auth.client) { showLoginError('Supabase is not configured. Edit js/config.js.'); return false; }
  var email = document.getElementById('login-email').value.trim();
  var pw    = document.getElementById('login-password').value;
  var btn   = document.getElementById('login-btn');
  btn.disabled = true; btn.textContent = 'Signing in…'; showLoginError('');
  auth.client.auth.signInWithPassword({ email: email, password: pw }).then(function(res) {
    btn.disabled = false; btn.textContent = 'Sign in';
    if (res.error) showLoginError(res.error.message || 'Sign-in failed');
  });
  return false;
}

function handleForgotPassword() {
  if (!auth.client) return;
  var email = document.getElementById('login-email').value.trim();
  if (!email) { showLoginError('Enter your email above first, then click Forgot password.'); return; }
  auth.client.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + window.location.pathname }).then(function(res) {
    if (res.error) showLoginError(res.error.message);
    else showLoginError('If that address has an account, a reset link has been emailed.', true);
  });
}

function showLoginError(msg, ok) {
  var el = document.getElementById('login-error');
  if (!el) return;
  el.textContent = msg || '';
  el.style.color = ok ? 'var(--green)' : 'var(--red)';
}

function signOut() {
  if (!auth.client) return;
  auth.client.auth.signOut();
}

function openChangePasswordModal() {
  if (!auth.client) { showToast('Password changes are only available in shared (Supabase) mode.', true); return; }
  var body = '<div class="form-grid single">'
    + '<div class="form-group"><label class="form-label">New password</label><input class="form-input" id="pw-new" type="password" autocomplete="new-password" /></div>'
    + '<div class="form-group"><label class="form-label">Confirm new password</label><input class="form-input" id="pw-confirm" type="password" autocomplete="new-password" /></div>'
    + '<div style="font-size:11px;color:var(--muted);">Minimum 8 characters.</div>'
    + '</div>';
  var footer = '<div></div><div style="display:flex;gap:8px;"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="submitChangePassword()">Update password</button></div>';
  openModal('Change Password', body, footer);
}

function submitChangePassword() {
  var a = mval('pw-new'), b = mval('pw-confirm');
  if (a.length < 8) { alert('Password must be at least 8 characters.'); return; }
  if (a !== b) { alert('Passwords do not match.'); return; }
  auth.client.auth.updateUser({ password: a }).then(function(res) {
    if (res.error) { showToast(res.error.message, true); return; }
    closeModal(); showToast('Password updated.');
  });
}
