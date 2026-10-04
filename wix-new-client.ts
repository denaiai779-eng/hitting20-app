// Supabase Edge Function: wix-new-client
// Called by Wix Automations on hitting2-0.com:
//   (no ?event)          "Someone books a session"  -> add the customer as a client (+ sign-in) if new
//   ?event=plan_purchased "Plan ordered"             -> App Add-On / Remote: turn videos on (2 a month)
//   ?event=plan_canceled  "Plan canceled"            -> App Add-On / Remote: turn videos off
// Every call is logged to webhook_log.
import { createClient } from 'npm:@supabase/supabase-js@2';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const OWNER_EMAILS = ['hitting2.0bball@gmail.com', 'devanahart@icloud.com'];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Wix plan IDs that include video breakdowns, and how many per month
const VIDEO_PLANS: Record<string, number> = {
  '8a192d59-00bc-42db-bfd7-5f5ae46005d3': 2, // Hitting 2.0 App Add-On
  'a5486482-5d50-4b8a-b25f-c5dbd3aef18d': 2, // Remote Membership
};

const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });

function flatten(o: unknown, path = '', out: Record<string, string> = {}) {
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) flatten(v, path ? `${path}.${k}` : k, out);
  } else if ((typeof o === 'string' || typeof o === 'number') && String(o).trim()) out[path.toLowerCase()] = String(o).trim();
  return out;
}

function findEmail(flat: Record<string, string>) {
  const entries = Object.entries(flat).filter(([k, v]) => /email/.test(k) && EMAIL_RE.test(v) && !OWNER_EMAILS.includes(v.toLowerCase()) && !/site_email|business/.test(k));
  const preferred = entries.find(([k]) => /contact|customer|participant|booker|buyer/.test(k)) || entries.find(([k]) => !/staff|resource|owner/.test(k));
  return (preferred?.[1] || '').toLowerCase();
}

function findContactId(flat: Record<string, string>) {
  const hit = Object.entries(flat).find(([k, v]) => /(^|\.|_)contact_?id$/.test(k) && UUID_RE.test(v));
  return hit?.[1] || '';
}

function findName(flat: Record<string, string>) {
  const pick = (re: RegExp) => {
    const hits = Object.entries(flat).filter(([k]) => re.test(k) && !/staff|resource|owner|business|service|location|site|plan/.test(k));
    return (hits.find(([k]) => /contact|customer|participant|buyer/.test(k)) || hits[0])?.[1] || '';
  };
  const first = pick(/first_?name$|firstname$|name\.first$/);
  const last = pick(/last_?name$|lastname$|name\.last$/);
  return `${first} ${last}`.replace(/\s+/g, ' ').trim() || pick(/(^|\.)(full_?name|contact_?name|name)$/);
}

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'client';

async function rememberContact(contactId: string, email: string) {
  if (contactId && email) await sb.from('contact_map').upsert({ contact_id: contactId, email, updated_at: new Date().toISOString() });
}

async function addClient(email: string, name: string) {
  let id = slugify(name), n = 2;
  while ((await sb.from('clients').select('id').eq('id', id).limit(1)).data?.length) id = `${slugify(name)}-${n++}`;
  const { error: cErr } = await sb.from('clients').insert({ id, name });
  if (cErr) throw cErr;
  const { error: aErr } = await sb.from('access').insert({ email, client_id: id, role: 'client' });
  if (aErr) throw aErr;
  return id;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ ok: true });
  const event = new URL(req.url).searchParams.get('event') || 'booking';
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  const flat = flatten(body);
  let result = '';
  try {
    const contactId = findContactId(flat);
    let email = findEmail(flat);
    if (!email && contactId) {
      const { data } = await sb.from('contact_map').select('email').eq('contact_id', contactId).limit(1);
      email = data?.[0]?.email || '';
    }
    await rememberContact(contactId, email);

    if (event === 'plan_purchased' || event === 'plan_canceled') {
      const planId = Object.entries(flat).find(([k, v]) => /(^|\.)plan_id$/.test(k) && UUID_RE.test(v))?.[1] || '';
      const perMonth = VIDEO_PLANS[planId];
      if (!perMonth) { result = `skipped: plan ${planId || '?'} has no videos`; return json({ result }); }
      if (!email) { result = `needs coach: ${event} for contact ${contactId || '?'} but no email found. Turn videos on/off in the Coach tab.`; return json({ result }); }
      let { data: rows } = await sb.from('access').select('client_id').eq('email', email).not('client_id', 'is', null);
      let ids = (rows || []).map(r => r.client_id as string);
      if (!ids.length && event === 'plan_purchased') ids = [await addClient(email, findName(flat) || email.split('@')[0])];
      if (!ids.length) { result = `skipped: no client for ${email}`; return json({ result }); }
      const limit = event === 'plan_purchased' ? perMonth : 0;
      const { error } = await sb.from('clients').update({ video_limit: limit, active: true }).in('id', ids);
      if (error) throw error;
      result = `${event}: videos ${limit ? 'ON (' + limit + '/mo)' : 'OFF'} for ${ids.join(', ')} <${email}>`;
      return json({ result });
    }

    // Booking: add new customers as clients
    if (!Object.keys(flat).some(k => /booking|session|slot|service/.test(k))) { result = 'skipped: not a booking payload'; return json({ result }); }
    if (!email) { result = 'skipped: no customer email'; return json({ result }); }
    const { data: known } = await sb.from('access').select('client_id').eq('email', email).limit(1);
    if (known && known.length) { result = `exists: ${email}`; return json({ result }); }
    const name = findName(flat) || email.split('@')[0];
    const id = await addClient(email, name);
    result = `added: ${name} <${email}> as ${id}`;
    return json({ result });
  } catch (e) {
    result = `error: ${(e as Error).message || e}`;
    return json({ result }, 500);
  } finally {
    await sb.from('webhook_log').insert({ body: { event, payload: body }, result });
  }
});
