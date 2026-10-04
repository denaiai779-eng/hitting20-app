// Supabase Edge Function: wix-new-client
// Wix Automation "Someone books a session" -> Send HTTP request (all automation data) -> here.
// Adds the booking's customer as a Hitting 2.0 client (plus sign-in access) unless their email is already known.
import { createClient } from 'npm:@supabase/supabase-js@2';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const OWNER_EMAILS = ['hitting2.0bball@gmail.com', 'devanahart@icloud.com'];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });

// Flattens the payload into "path.to.key" -> string value, so field names Wix uses don't matter much.
function flatten(o: unknown, path = '', out: Record<string, string> = {}) {
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) flatten(v, path ? `${path}.${k}` : k, out);
  } else if (typeof o === 'string' && o.trim()) out[path.toLowerCase()] = o.trim();
  return out;
}

function findEmail(flat: Record<string, string>) {
  const entries = Object.entries(flat).filter(([k, v]) => /email/.test(k) && EMAIL_RE.test(v) && !OWNER_EMAILS.includes(v.toLowerCase()));
  const preferred = entries.find(([k]) => /contact|customer|participant|booker/.test(k)) || entries.find(([k]) => !/staff|resource|owner|business/.test(k));
  return (preferred?.[1] || '').toLowerCase();
}

function findName(flat: Record<string, string>) {
  const pick = (re: RegExp) => {
    const hits = Object.entries(flat).filter(([k]) => re.test(k) && !/staff|resource|owner|business|service|location/.test(k));
    return (hits.find(([k]) => /contact|customer|participant/.test(k)) || hits[0])?.[1] || '';
  };
  const first = pick(/first_?name$|firstname$|name\.first$/);
  const last = pick(/last_?name$|lastname$|name\.last$/);
  return `${first} ${last}`.replace(/\s+/g, ' ').trim() || pick(/(^|\.)(full_?name|contact_?name|name)$/);
}

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'client';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ ok: true });
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  const flat = flatten(body);
  let result = '';
  try {
    if (!Object.keys(flat).some(k => /booking|session|slot|service/.test(k))) { result = 'skipped: not a booking payload'; return json({ result }); }
    const email = findEmail(flat);
    if (!email) { result = 'skipped: no customer email'; return json({ result }); }
    const { data: known } = await sb.from('access').select('client_id').eq('email', email).limit(1);
    if (known && known.length) { result = `exists: ${email}`; return json({ result }); }
    const name = findName(flat) || email.split('@')[0];
    let id = slugify(name), n = 2;
    while ((await sb.from('clients').select('id').eq('id', id).limit(1)).data?.length) id = `${slugify(name)}-${n++}`;
    const { error: cErr } = await sb.from('clients').insert({ id, name });
    if (cErr) throw cErr;
    const { error: aErr } = await sb.from('access').insert({ email, client_id: id, role: 'client' });
    if (aErr) throw aErr;
    result = `added: ${name} <${email}> as ${id}`;
    return json({ result });
  } catch (e) {
    result = `error: ${(e as Error).message || e}`;
    return json({ result }, 500);
  } finally {
    await sb.from('webhook_log').insert({ body, result });
  }
});
