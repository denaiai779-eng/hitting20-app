#!/usr/bin/env python3
"""Builds the Hitting 2.0 app (index.html) from the Makos HQ engine.

Pulls the CSS and the cage-plan / video / review code out of the Makos app, rebrands it,
and swaps the hard-coded roster for a client list stored in this app's own database.
Run: python3 build.py   (re-run after editing this file; never hand-edit index.html)
"""
import re, os, json, time

SRC = os.path.expanduser('~/Claude/return-to-quality/index.html')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
SUPABASE_URL = 'https://buxdjqowkknqagojspqb.supabase.co'
ANON = open(os.path.join(os.path.dirname(OUT), '.anon_key')).read().strip()
VERSION = time.strftime('%Y%m%d%H%M%S')

src = open(SRC).read()
lines = src.split('\n')

def block(start_pat, end_pat):
    s = next(i for i, l in enumerate(lines) if start_pat in l)
    e = next(i for i in range(s + 1, len(lines)) if end_pat in lines[i])
    return '\n'.join(lines[s:e])

# ---------- CSS ----------
css = src[src.index('<style>') + 7: src.index('</style>')]
def rgba_swap(m):
    r, g, b, a = [x.strip() for x in m.group(1).split(',')]
    key = (r, g, b)
    to = {('0', '191', '255'): '26,169,214', ('0', '150', '255'): '26,169,214', ('0', '200', '255'): '26,169,214',
          ('13', '40', '71'): '21,25,30', ('10', '22', '40'): '11,13,16'}.get(key)
    return f'rgba({to},{a})' if to else m.group(0)
css = re.sub(r'rgba\(([^)]*)\)', rgba_swap, css)
for a, b in {'#0a1628': '#0b0d10', '#0d2847': '#171b20', '#102f54': '#222830', '#00bfff': '#1aa9d6',
             '#0077cc': '#0a7fa6', '#7ee0ff': '#7fd6f2', '#2a3759': '#2f3640', '#131c2e': '#12151a',
             '#7e92b3': '#8e98a3', '#e9eef7': '#e8ecef'}.items():
    css = re.sub(a, b, css, flags=re.I)
css = css.replace("'Bebas Neue'", "'Oswald'").replace('Bebas Neue', 'Oswald').replace("'Montserrat'", "'Inter'").replace('Montserrat', 'Inter')
css += """
  /* Hitting 2.0 */
  .h20-logo { width: 260px; max-width: 80%; height: auto; display: block; margin: 0 auto 2px; }
  .h20-sub { font-family: 'Oswald', Impact, sans-serif; letter-spacing: 3px; font-size: 15px; color: var(--cyan); margin-top: 6px; text-transform: uppercase; }
  header.app-header h1 { font-weight: 600; }
  .home-wrap { max-width: 600px; margin: 0 auto; padding: 4px 14px 20px; }
  .home-btn { display:block; width:100%; margin:12px 0 0; padding:16px 14px; border:1px solid rgba(26,169,214,.35); border-radius:12px;
    background: linear-gradient(160deg, rgba(23,27,32,.95), rgba(11,13,16,.95)); color: var(--white); text-align:left; cursor:pointer;
    font-family:'Oswald', Impact, sans-serif; font-size:21px; letter-spacing:1.5px; }
  .home-btn.primary { background: var(--cyan); color: #0b0d10; border-color: var(--cyan); }
  .home-btn small { display:block; font-family:'Inter', Arial, sans-serif; font-size:11px; letter-spacing:.6px; font-weight:600; opacity:.8; margin-top:3px; text-transform:none; }
  .home-note { margin-top:14px; padding:12px 14px; border-left:3px solid var(--cyan); background: rgba(26,169,214,.08); border-radius:0 8px 8px 0; font-size:13px; line-height:1.5; }
  .home-note b { display:block; font-family:'Oswald', Impact, sans-serif; letter-spacing:2px; color:var(--cyan); font-size:12px; margin-bottom:2px; }
  .fa-vid { margin-top:6px; font-size:12px; color:var(--muted); display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
  .fa-vid b { color:var(--white); }
  .fa-vid button { background:transparent; border:1px solid #2f3640; color:var(--cyan); border-radius:4px; padding:3px 8px; font-size:10px; letter-spacing:1px; cursor:pointer; font-family:'Oswald', Impact, sans-serif; }
  .cl-add { display:grid; grid-template-columns: 1fr; gap:8px; margin:8px 0 12px; }
  .cl-add input { width:100%; padding:11px 12px; border-radius:8px; border:1px solid #2f3640; background:#0b0d10; color:var(--white); font-size:15px; font-family:'Inter', Arial, sans-serif; }
  .cp-num.ini { font-family:'Oswald', Impact, sans-serif; background: rgba(26,169,214,.15); color: var(--cyan); border-radius: 50%; width: 34px; height: 34px; display:flex; align-items:center; justify-content:center; font-size:14px; }
  footer.h20-foot { text-align:center; color:var(--muted); font-size:10px; letter-spacing:2px; padding:22px 10px 6px; }
"""

# ---------- JS: lift the cage plan, video, review and sign-in code ----------
js = block('// ===== CAGE PLANS =====', '// === Boot ===')

R = [
    # tables, columns, storage
    ("'cage_plans'", "'plans'"), ("'cage_feedback'", "'feedback'"), ("'family_access'", "'access'"),
    ("const FB_BUCKET = 'cage-videos';", "const FB_BUCKET = 'videos';"),
    (".eq('team_id', TEAM_ID)", ""), ("team_id: TEAM_ID, ", ""), ("team_id: TEAM_ID,", ""),
    ("`${TEAM_ID}/${currentPlayerId}/", "`${currentPlayerId}/"), ("`${TEAM_ID}/${r.player_id}/", "`${r.client_id}/"),
    ("player_name", "client_name"), ("player_id", "client_id"),
    # roster -> clients
    ("ROSTER.find(", "CLIENTS.find("), ("ROSTER.filter(", "CLIENTS.filter("), ("ROSTER.map(", "CLIENTS.map("), ("ROSTER.length", "CLIENTS.length"),
    ("? ROSTER :", "? CLIENTS :"),
    ("`#${p.num} ${p.name}`", "p.name"), ("`#${p.num} ${cgEsc(p.name)}${divLogo(p)}`", "cgEsc(p.name)"),
    ("<div class=\"cp-num\">#${p.num}</div>", "<div class=\"cp-num ini\">${initials(p.name)}</div>"),
    ("${cgEsc(p.name)}${divLogo(p)}", "${cgEsc(p.name)}"),
    ("#${p.num} ${cgEsc(p.name)}", "${cgEsc(p.name)}"),
    # wording
    ("Ask Coach Devan or Coach Nick what to work on.", "Ask Coach Devan what to work on."),
    ("◂ BACK TO MAKO", "◂ BACK TO HOME"),
    ("Tap a player to set his focus areas", "Tap a client to set his plan"),
    ("SESSION COMPLETE · +3 PTS", "SESSION COMPLETE"),
    ("'✓ COMPLETE SESSION · +3 PTS'", "'✓ COMPLETE SESSION'"),
    ("<span style=\"color:var(--cyan)\">#ReturnToQuality</span>", "<span style=\"color:var(--cyan)\">HITTING 2.0</span>"),
    ("This app is for Midwest Makos families and coaches only. Enter the email you gave the team and we'll send you a sign-in code.",
     "This app is for Hitting 2.0 clients. Enter the email you gave Coach Devan and we'll send you a sign-in code."),
    ("That email is not on the Makos list. Ask Coach Devan to add it.", "That email is not on the Hitting 2.0 list. Ask Coach Devan to add it."),
    ("role === 'family'", "role === 'client'"), ("role: 'family'", "role: 'client'"),
    ("    if (repErr) console.warn('report', repErr);", "    if (repErr) throw repErr;"),
    ("if (!fbState.file) { st.classList.add('err'); st.textContent = 'Pick a video first.'; return; }",
     "if (!fbState.file) { st.classList.add('err'); st.textContent = 'Pick a video first.'; return; }\n  if (!isCoach) { const vs = await getVideoStatus(currentPlayerId); if (vs && vs.left <= 0) { st.classList.add('err'); st.textContent = LIMIT_MSG; return; } }"),
    ("st.textContent = e && e.message === 'shrink'", "st.textContent = e && /VIDEO_LIMIT/.test(e.message || '') ? LIMIT_MSG : e && e.message === 'shrink'"),
    ("onclick = () => renderVideoForm(targetEl, focus);", "onclick = () => guardVideoForm(targetEl, focus);"),
    ("renderVideoForm(document.getElementById('cgBody'), focus); window.scrollTo(0, 0);", "guardVideoForm(document.getElementById('cgBody'), focus); window.scrollTo(0, 0);"),
    ("document.getElementById('fbSkip').addEventListener('click', () => renderCageView());", "document.getElementById('fbSkip').addEventListener('click', () => { stopAllCgTimers(); renderHome(); showView('view-main'); });"),
]
for a, b in R:
    js = js.replace(a, b)

# session count now comes from session reports, not the points log
js = re.sub(r"async function fetchCageStats\(\) \{.*?\n\}\n", """async function fetchCageStats() {
  const { data, error } = await supabase.from('feedback').select('client_id, created_at').not('result', 'is', null).order('created_at', { ascending: false }).limit(2000);
  if (error) { console.warn('cage stats', error); return; }
  cageStats = {};
  for (const r of data || []) {
    const s = cageStats[r.client_id] || (cageStats[r.client_id] = { count: 0, last: r.created_at });
    s.count++;
  }
}
""", js, count=1, flags=re.S)

# completing a session: no points, no log table. Save the report only.
js = re.sub(r"  const pts = 3;\n  try \{\n.*?    const benched =", "  try {\n    const benched =", js, count=1, flags=re.S)
js = js.replace("    fetchPlayers();\n", "")

# family access UI -> client management (rewritten below)
js = js[:js.index('// --- Coach: manage who can sign in ---')]

# player-side home button
js = js.replace("""function updateCagePlanButton() {
  const sub = document.getElementById('cagePlanSub');""", """function updateCagePlanButton() {
  renderHomeNote();
  const sub = document.getElementById('cagePlanSub');""")
js = js.replace("document.getElementById('cagePlanBtn').addEventListener('click', openCageView);", "")

APP_JS = r"""
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = '__URL__';
const SUPABASE_KEY = '__KEY__';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Auto-update: phones cache this page, so check for a newer version on open and when the app comes back on screen.
const APP_VERSION = '__VERSION__';
async function checkForUpdate() {
  try {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return;
    const { v } = await r.json();
    if (v && v !== APP_VERSION && sessionStorage.getItem('h20_reloaded_for') !== v) {
      sessionStorage.setItem('h20_reloaded_for', v);
      location.replace(location.pathname + '?v=' + v);
    }
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkForUpdate(); });
checkForUpdate();

const LOCAL_KEY = 'h20_client_v1';
let currentPlayerId = localStorage.getItem(LOCAL_KEY) || null;   // the selected client
let CLIENTS = [];                                                  // [{ id, name, active }]
const initials = n => String(n || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const clientById = id => CLIENTS.find(c => c.id === id);

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.view === viewId.replace('view-', '')));
}

async function fetchClients() {
  const { data, error } = await supabase.from('clients').select('*').eq('active', true).order('name');
  if (error) { console.warn('clients', error); return; }
  CLIENTS = data || [];
}

// --- Client picker (parents with more than one kid, or the coach previewing) ---
function renderPlayerSelect() {
  const grid = document.getElementById('rosterGrid');
  const list = visibleRoster();
  grid.innerHTML = list.length ? list.map(p => `<div class="ps-card" data-id="${p.id}">
      <div class="ps-num">${initials(p.name)}</div>
      <div class="ps-name">${cgEsc(p.name)}</div>
      <div class="ps-pts">${(cagePlans[p.id]?.focus || []).length ? 'PLAN READY' : 'NO PLAN YET'}</div>
    </div>`).join('') : '<div class="cg-empty"><b>NO CLIENTS YET</b>Add one in the Coach tab.</div>';
}
function setPlayer(pid) {
  if (!visibleRoster().some(p => p.id === pid)) return;
  currentPlayerId = pid;
  localStorage.setItem(LOCAL_KEY, pid);
  renderHome();
  showView('view-main');
}
function renderHome() {
  const p = clientById(currentPlayerId);
  document.getElementById('playerName').textContent = p ? p.name : 'Pick a client';
  updateCagePlanButton();
  renderVideoCounter();
}
function renderHomeNote() {
  const el = document.getElementById('homeNote'); if (!el) return;
  const note = cagePlans[currentPlayerId]?.note;
  el.innerHTML = note ? `<div class="home-note"><b>FROM COACH DEVAN</b>${cgEsc(note)}</div>` : '';
}
document.getElementById('rosterGrid').addEventListener('click', e => { const c = e.target.closest('.ps-card'); if (c) setPlayer(c.dataset.id); });
document.getElementById('playerChip').addEventListener('click', () => { renderPlayerSelect(); showView('view-select'); });
document.getElementById('cagePlanBtn').addEventListener('click', openCageView);
const LIMIT_MSG = "You've used all your videos for this month. They reset on the 1st. Extra breakdowns are $25: text Coach Devan at 313-478-3086.";
async function getVideoStatus(cid) {
  const { data, error } = await supabase.rpc('video_status', { cid });
  if (error) { console.warn('video_status', error); return null; }
  return data;
}
async function guardVideoForm(targetEl, focus) {
  if (!isCoach) {
    const vs = await getVideoStatus(currentPlayerId);
    if (vs && vs.allowed <= 0) { targetEl.innerHTML = `<div class="cg-empty"><b>VIDEO BREAKDOWNS</b>Video breakdowns come with the Hitting 2.0 App add-on or the Remote membership. Ask Coach Devan to add it.<br><button class="cg-back" id="vgBack">◂ BACK</button></div>`; document.getElementById('vgBack').onclick = () => { renderHome(); showView('view-main'); }; return; }
    if (vs && vs.left <= 0) { targetEl.innerHTML = `<div class="cg-empty"><b>${vs.used} OF ${vs.allowed} USED</b>${LIMIT_MSG}<br><button class="cg-back" id="vgBack">◂ BACK</button></div>`; document.getElementById('vgBack').onclick = () => { renderHome(); showView('view-main'); }; return; }
  }
  renderVideoForm(targetEl, focus);
  if (!isCoach) {
    const vs = await getVideoStatus(currentPlayerId);
    const sub = targetEl.querySelector('.fb-sub');
    if (vs && sub) sub.innerHTML = `<b style="color:var(--cyan)">${vs.left} of ${vs.allowed} videos left this month.</b> Up to 2 minutes each. Coach talks over it.`;
  }
}
async function renderVideoCounter() {
  const el = document.getElementById('homeVideoSub'); if (!el || !currentPlayerId) return;
  if (isCoach) { el.textContent = 'Up to 2 minutes. Coach talks over it.'; return; }
  const vs = await getVideoStatus(currentPlayerId);
  if (!vs) return;
  el.textContent = vs.allowed <= 0 ? 'Comes with the App add-on or Remote membership'
    : vs.left <= 0 ? `All ${vs.allowed} used this month · resets on the 1st` : `${vs.left} of ${vs.allowed} left this month`;
}
document.getElementById('homeVideo').addEventListener('click', () => {
  if (!currentPlayerId) return;
  showView('view-cage'); window.scrollTo(0, 0);
  const p = clientById(currentPlayerId);
  document.getElementById('cgPlayer').textContent = p ? p.name : '';
  document.getElementById('cgChips').innerHTML = '';
  guardVideoForm(document.getElementById('cgBody'), cagePlans[currentPlayerId]?.focus || []);
});
document.getElementById('homeFeedback').addEventListener('click', () => { if (currentPlayerId) openMyFeedback(); });

async function openCoachView() {
  showView('view-coach'); window.scrollTo(0, 0);
  await Promise.all([fetchClients(), fetchCagePlans(), fetchCageStats(), refreshAccess(), refreshUsage()]);
  fbRows = await fetchFeedback();
  renderCoachCagePlans(); renderCoachFeedback(); renderAccess();
}
document.querySelectorAll('.bottom-nav button').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.view === 'coach') openCoachView();
  else if (!currentPlayerId) { renderPlayerSelect(); showView('view-select'); }
  else { renderHome(); showView('view-main'); }
}));
document.getElementById('lockCoach').addEventListener('click', () => signOut());

__LIFTED__

// --- Coach: clients + who can sign in ---
const monthKey = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Detroit' }).slice(0, 7);
let usageByClient = {};
async function refreshUsage() {
  const start = monthKey() + '-01T00:00:00-05:00';
  const { data, error } = await supabase.from('video_usage').select('client_id').gte('created_at', start).limit(5000);
  if (error) { console.warn('usage', error); return; }
  usageByClient = {};
  for (const r of data || []) usageByClient[r.client_id] = (usageByClient[r.client_id] || 0) + 1;
}
async function refreshAccess() {
  const { data, error } = await supabase.from('access').select('*').order('email');
  if (!error) faRows = data || [];
}
function slugify(name) {
  const base = name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'client';
  let id = base, n = 2;
  while (CLIENTS.some(c => c.id === id)) id = base + '-' + n++;
  return id;
}
function renderAccess() {
  const list = document.getElementById('faList'); if (!list) return;
  const sel = document.getElementById('faPlayer');
  sel.innerHTML = '<option value="">Add an email for…</option>' + CLIENTS.map(p => `<option value="${p.id}">${cgEsc(p.name)}</option>`).join('') + '<option value="__coach">Coach (sees everything)</option>';
  const fam = faRows.filter(r => r.role === 'client'), coaches = faRows.filter(r => r.role === 'coach');
  const missing = CLIENTS.filter(p => !fam.some(r => r.client_id === p.id)).length;
  document.getElementById('faSummary').textContent = `${CLIENTS.length} client${CLIENTS.length === 1 ? '' : 's'}${missing ? ' · ' + missing + ' with no email' : ''}`;
  const chip = r => `<span class="fa-email">${cgEsc(r.email)}<button data-del="${cgEsc(r.email)}|${r.client_id || ''}" title="Remove">×</button></span>`;
  list.innerHTML = CLIENTS.map(p => {
    const rows = fam.filter(r => r.client_id === p.id);
    const vAllowed = (p.video_limit || 0) + (p.bonus_month === monthKey() ? (p.bonus_videos || 0) : 0), vUsed = usageByClient[p.id] || 0;
    return `<div class="fa-player"><div class="fa-name">${cgEsc(p.name)} <button class="fa-arch" data-arch="${p.id}" style="float:right;background:none;border:0;color:var(--muted);font-size:11px;letter-spacing:1px;cursor:pointer">ARCHIVE</button><button data-delc="${p.id}" style="float:right;background:none;border:0;color:#ff6b78;font-size:11px;letter-spacing:1px;cursor:pointer;margin-left:10px">DELETE</button><button data-ren="${p.id}" style="float:right;background:none;border:0;color:var(--cyan);font-size:11px;letter-spacing:1px;cursor:pointer;margin-right:10px">RENAME</button></div>${rows.length ? rows.map(chip).join('') : '<div class="fa-none">NO EMAIL YET: this client cannot sign in</div>'}
      <div class="fa-vid">🎬 Videos this month: <b>${vUsed} of ${vAllowed}</b>
        <button data-vlim="${p.id}" data-to="${p.video_limit > 0 ? 0 : 2}">${p.video_limit > 0 ? 'TURN OFF' : 'TURN ON 2/MO'}</button>
        <button data-vbonus="${p.id}">+1 EXTRA</button></div></div>`;
  }).join('') + `<div class="fa-player"><div class="fa-name">Coach</div>${coaches.map(chip).join('')}</div>`;
  list.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
    const [email, pid] = b.dataset.del.split('|');
    if (email === authEmail && !pid) { document.getElementById('faStatus').textContent = 'You cannot remove your own coach access.'; return; }
    if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = '?'; b.style.background = 'var(--red)'; setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = '×'; b.style.background = ''; } }, 3000); return; }
    let q = supabase.from('access').delete().eq('email', email);
    q = pid ? q.eq('client_id', pid) : q.is('client_id', null);
    const { error } = await q;
    document.getElementById('faStatus').textContent = error ? 'Could not remove. Try again.' : `Removed ${email}.`;
    await refreshAccess(); renderAccess();
  }));
  list.querySelectorAll('[data-vlim]').forEach(b => b.addEventListener('click', async () => {
    const { error } = await supabase.from('clients').update({ video_limit: Number(b.dataset.to) }).eq('id', b.dataset.vlim);
    document.getElementById('faStatus').textContent = error ? 'Could not change videos. Try again.' : (Number(b.dataset.to) > 0 ? 'Videos turned on: 2 a month.' : 'Videos turned off.');
    await refreshUsage(); await fetchClients(); renderAccess();
  }));
  list.querySelectorAll('[data-vbonus]').forEach(b => b.addEventListener('click', async () => {
    const c = clientById(b.dataset.vbonus); if (!c) return;
    const bonus = (c.bonus_month === monthKey() ? (c.bonus_videos || 0) : 0) + 1;
    const { error } = await supabase.from('clients').update({ bonus_videos: bonus, bonus_month: monthKey() }).eq('id', c.id);
    document.getElementById('faStatus').textContent = error ? 'Could not add the extra video. Try again.' : `Added 1 extra video for ${c.name} this month.`;
    await fetchClients(); renderAccess();
  }));
  list.querySelectorAll('[data-delc]').forEach(b => b.addEventListener('click', async () => {
    const c = clientById(b.dataset.delc); if (!c) return;
    if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'TAP AGAIN: DELETE FOREVER'; b.style.fontWeight = '800'; setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = 'DELETE'; b.style.fontWeight = ''; } }, 4000); return; }
    b.disabled = true; b.textContent = 'DELETING…';
    const st = document.getElementById('faStatus');
    try {
      const { data: files } = await supabase.storage.from(FB_BUCKET).list(c.id, { limit: 1000 });
      const paths = (files || []).map(f => `${c.id}/${f.name}`);
      if (paths.length) { const { error: sErr } = await supabase.storage.from(FB_BUCKET).remove(paths); if (sErr) throw sErr; }
      const { error } = await supabase.from('clients').delete().eq('id', c.id);
      if (error) throw error;
      st.textContent = `Deleted ${c.name}: sign-in, plan, reports and videos removed.`;
    } catch (e) { console.warn(e); st.textContent = `Could not delete ${c.name}. Try again.`; }
    if (currentPlayerId === c.id) { currentPlayerId = null; localStorage.removeItem(LOCAL_KEY); }
    await Promise.all([fetchClients(), refreshAccess(), refreshUsage(), fetchCagePlans()]); renderAccess(); renderCoachCagePlans();
  }));
  list.querySelectorAll('[data-ren]').forEach(b => b.addEventListener('click', async () => {
    const c = clientById(b.dataset.ren); if (!c) return;
    const name = (window.prompt("Hitter's name", c.name) || '').trim().replace(/\s+/g, ' ');
    if (!name || name === c.name) return;
    const { error } = await supabase.from('clients').update({ name }).eq('id', c.id);
    document.getElementById('faStatus').textContent = error ? 'Could not rename. Try again.' : `Renamed to ${name}.`;
    await fetchClients(); renderAccess(); renderCoachCagePlans();
  }));
  list.querySelectorAll('[data-arch]').forEach(b => b.addEventListener('click', async () => {
    if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'TAP AGAIN TO ARCHIVE'; b.style.color = 'var(--red)'; setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = 'ARCHIVE'; b.style.color = ''; } }, 3000); return; }
    const id = b.dataset.arch;
    const { error } = await supabase.from('clients').update({ active: false }).eq('id', id);
    if (!error) await supabase.from('access').delete().eq('client_id', id);
    document.getElementById('faStatus').textContent = error ? 'Could not archive. Try again.' : 'Archived. Their sign-in is removed; their history is kept.';
    await Promise.all([fetchClients(), refreshAccess()]); renderAccess(); renderCoachCagePlans();
  }));
}
document.getElementById('clAdd').addEventListener('click', async () => {
  const name = document.getElementById('clName').value.trim().replace(/\s+/g, ' ');
  const email = document.getElementById('clEmail').value.trim().toLowerCase();
  const st = document.getElementById('clStatus');
  if (name.length < 2) { st.textContent = "Enter the client's name."; return; }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { st.textContent = 'That email does not look right.'; return; }
  const id = slugify(name);
  const { error } = await supabase.from('clients').insert({ id, name });
  if (error) { st.textContent = 'Could not add the client. Try again.'; console.warn(error); return; }
  if (email) {
    const { error: aErr } = await supabase.from('access').insert({ email, client_id: id, role: 'client' });
    if (aErr) st.textContent = `Added ${name}, but the email did not save. Add it below.`;
  }
  if (!st.textContent.startsWith('Added')) st.textContent = email ? `Added ${name}. ${email} can sign in now.` : `Added ${name}. Add a parent email below so they can sign in.`;
  document.getElementById('clName').value = ''; document.getElementById('clEmail').value = '';
  await Promise.all([fetchClients(), refreshAccess()]); renderAccess(); renderCoachCagePlans();
  setTimeout(() => { st.textContent = ''; }, 6000);
});
document.getElementById('faAdd').addEventListener('click', async () => {
  const email = document.getElementById('faEmail').value.trim().toLowerCase(), pid = document.getElementById('faPlayer').value, st = document.getElementById('faStatus');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { st.textContent = 'Enter a valid email.'; return; }
  if (!pid) { st.textContent = 'Pick the client (or Coach).'; return; }
  const row = pid === '__coach' ? { email, client_id: null, role: 'coach' } : { email, client_id: pid, role: 'client' };
  const { error } = await supabase.from('access').insert(row);
  st.textContent = error ? (error.code === '23505' ? 'That email already has access for this client.' : 'Could not add. Try again.') : `Added ${email}. They can sign in now.`;
  if (!error) document.getElementById('faEmail').value = '';
  await refreshAccess(); renderAccess();
});

// Live updates
function startRealtime() {
  supabase.channel('h20-feedback').on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => {
    if (document.getElementById('view-coach').classList.contains('active')) refreshCoachFeedback();
  }).subscribe();
  supabase.channel('h20-plans').on('postgres_changes', { event: '*', schema: 'public', table: 'plans' }, async () => {
    await fetchCagePlans(); updateCagePlanButton();
    if (document.getElementById('view-coach').classList.contains('active')) renderCoachCagePlans();
  }).subscribe();
}

// === Boot ===
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { showView('view-login'); renderLogin('email'); return; }
  authEmail = (session.user.email || '').toLowerCase();
  const allowed = await loadAccess();
  if (!allowed) { await supabase.auth.signOut(); showView('view-login'); renderLogin('email', authEmail, 'That email is not on the Hitting 2.0 list anymore. Ask Coach Devan.'); return; }
  document.body.classList.remove('locked');
  document.querySelector('.bottom-nav button[data-view="coach"]').style.display = isCoach ? '' : 'none';
  await Promise.all([fetchClients(), fetchCagePlans()]);
  if (!isCoach && myPlayerIds.length === 1) { currentPlayerId = myPlayerIds[0]; localStorage.setItem(LOCAL_KEY, currentPlayerId); }
  if (currentPlayerId && !visibleRoster().some(p => p.id === currentPlayerId)) { currentPlayerId = null; localStorage.removeItem(LOCAL_KEY); }
  document.getElementById('playerChip').style.display = visibleRoster().length > 1 ? '' : 'none';
  if (isCoach && !currentPlayerId) openCoachView();
  else if (currentPlayerId) { renderHome(); showView('view-main'); }
  else { renderPlayerSelect(); showView('view-select'); }
  startRealtime();
})();
"""
app_js = APP_JS.replace('__URL__', SUPABASE_URL).replace('__KEY__', ANON).replace('__VERSION__', VERSION).replace('__LIFTED__', js)

# Leftovers from the Makos engine that must not survive
for bad in ['TEAM_ID', 'ROSTER', 'divLogo', 'allPlayersData', 'getMonday', "'log'", 'Makos', 'MAKO', 'Nick', 'fetchPlayers']:
    assert bad not in app_js, f'leftover: {bad}'

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0b0d10">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Hitting 2.0">
<meta name="application-name" content="Hitting 2.0">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png?v=2">
<link rel="icon" href="icons/favicon.png?v=2">
<link rel="manifest" href="manifest.webmanifest">
<title>Hitting 2.0</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body class="locked">

<div class="view" id="view-login">
  <header class="app-header" style="border:0">
    <img class="h20-logo" src="icons/logo-header.png" alt="Hitting 2.0">
    <div class="h20-sub">Training App</div>
  </header>
  <div class="lg-card" id="lgCard"></div>
</div>

<div class="view" id="view-select">
  <header class="app-header">
    <img class="h20-logo" src="icons/logo-header.png" alt="Hitting 2.0">
    <div class="h20-sub">Pick a hitter</div>
  </header>
  <div class="ps-roster" id="rosterGrid"></div>
</div>

<div class="view" id="view-main">
  <header class="app-header">
    <img class="h20-logo" src="icons/logo-header.png" alt="Hitting 2.0">
    <div class="player-chip" id="playerChip"><span id="playerName">Pick a client</span><span style="opacity:.6;">⇄</span></div>
  </header>
  <div class="home-wrap">
    <button class="home-btn primary" id="cagePlanBtn">⚾ MY CAGE PLAN<small id="cagePlanSub">Your session from Coach Devan</small></button>
    <div id="homeNote"></div>
    <button class="home-btn" id="homeVideo">📹 SEND COACH A VIDEO<small id="homeVideoSub">Up to 2 minutes. Coach talks over it.</small></button>
    <button class="home-btn" id="homeFeedback">💬 COACH FEEDBACK<small>Voice-overs and notes on your videos</small></button>
    <footer class="h20-foot">HITTING 2.0 · COACH DEVAN AHART</footer>
  </div>
</div>

<div class="view" id="view-coach">
  <div class="lb-header"><h2>COACH</h2><div class="sub">Hitting 2.0</div></div>
  <div class="coach-section">
    <div class="coach-section-head"><h3>Clients &amp; Plans</h3><div class="cp-last" id="cpSummary"></div></div>
    <div class="cp-hint" style="text-align:left">Tap a client after a lesson to set what he works on this week</div>
    <button class="lib-btn" id="openLibrary" style="width:100%;margin:6px 0 10px">📚 DRILL LIBRARY</button>
    <div id="coachCagePlans"></div>
  </div>
  <div class="coach-section">
    <div class="coach-section-head"><h3>Videos to Review</h3><div class="cp-last" id="fbSummary"></div></div>
    <div class="cp-hint" style="text-align:left">Tap one to watch and record a voice-over</div>
    <div id="coachFeedback"></div>
  </div>
  <div class="coach-section">
    <div class="coach-section-head"><h3>Session Reports</h3><div class="cp-last" id="srSummary"></div></div>
    <div class="cp-hint" style="text-align:left">Benchmarks hit, mastered or struggled</div>
    <div id="coachReports"></div>
  </div>
  <div class="coach-section">
    <div class="coach-section-head"><h3>Add a Client</h3></div>
    <div class="cl-add">
      <input id="clName" placeholder="Hitter's name" autocomplete="off">
      <input id="clEmail" type="email" placeholder="Parent email (to sign in)" autocomplete="off">
      <button class="lib-btn" id="clAdd" style="margin:0;width:100%">+ ADD CLIENT</button>
      <div class="fb-status" id="clStatus"></div>
    </div>
  </div>
  <div class="coach-section">
    <div class="coach-section-head"><h3>Sign-In Access</h3><div class="cp-last" id="faSummary"></div></div>
    <div class="cp-hint" style="text-align:left">Only these emails can sign in. Archive keeps their history; Delete removes them for good.</div>
    <div class="fa-add">
      <input type="email" id="faEmail" placeholder="parent@email.com" autocomplete="off">
      <select id="faPlayer"></select>
      <button class="lib-btn" id="faAdd" style="margin:0;width:100%">+ ADD EMAIL</button>
      <div class="fb-status" id="faStatus"></div>
    </div>
    <div id="faList"></div>
  </div>
  <div style="text-align:center;padding:20px">
    <button id="lockCoach" style="background:transparent;color:var(--muted);border:1px solid #2f3640;padding:8px 16px;border-radius:4px;font-family:'Oswald',Impact,sans-serif;letter-spacing:2px;cursor:pointer;">SIGN OUT</button>
  </div>
</div>

<div class="view" id="view-cage">
  <div class="lb-header"><h2>MY CAGE PLAN</h2><div class="sub" id="cgPlayer">—</div><div class="cg-chips" id="cgChips"></div></div>
  <div class="cg-wrap" id="cgBody"></div>
</div>
<div class="view" id="view-library">
  <div class="lb-header"><h2>DRILL LIBRARY</h2><div class="sub">Every series and drill a client can be assigned</div></div>
  <div class="cg-wrap" id="libBody"></div>
</div>
<div class="view" id="view-review">
  <div class="lb-header"><h2>REVIEW</h2><div class="sub" id="rvPlayer">—</div></div>
  <div class="cg-wrap" id="rvBody"></div>
</div>
<div class="view" id="view-myfeedback">
  <div class="lb-header"><h2>COACH FEEDBACK</h2><div class="sub" id="mfPlayer">—</div></div>
  <div class="cg-wrap" id="mfBody"></div>
</div>

<div class="takeaway-sheet cp-sheet" id="cpSheet">
  <div class="sheet-backdrop" id="cpBackdrop"></div>
  <div class="sheet-content">
    <div class="sheet-handle"></div>
    <div class="sheet-title">CAGE PLAN</div>
    <div class="sheet-sub" id="cpSheetPlayer">—</div>
    <div class="cp-hint">Pick 1 to 3 focus areas</div>
    <div class="cp-opts" id="cpOpts"></div>
    <div class="cp-est" id="cpEst"></div>
    <textarea class="cp-note-in" id="cpNote" maxlength="240" placeholder="After-lesson note (optional): what we worked on, what to feel"></textarea>
    <div class="cp-sheet-actions">
      <button class="cp-cancel" id="cpCancel">CANCEL</button>
      <button class="cp-clear" id="cpClear">CLEAR</button>
      <button class="cp-save" id="cpSave">SAVE</button>
    </div>
  </div>
</div>

<nav class="bottom-nav">
  <div class="bottom-nav-inner">
    <button data-view="main" class="active">⚾ Home</button>
    <button data-view="coach">👔 Coach</button>
  </div>
</nav>

<script src="cage-library.js"></script>
<script type="module">{app_js}</script>
</body>
</html>
"""
open(OUT, 'w').write(HTML)
json.dump({'v': VERSION}, open(os.path.join(os.path.dirname(OUT), 'version.json'), 'w'))
print('built', OUT, len(HTML), 'bytes · version', VERSION)
