// Supabase Edge Function: wix-remove-customer
// Pinged by the database whenever the coach deletes a client in the app. Takes no input:
// it works through public.removed_customers (status 'pending') and, for each email, finds the
// Wix contact on hitting2-0.com, adds the label "Removed – Hitting 2.0", and unsubscribes them
// from email marketing. Payment and booking history stay in Wix.
// Needs the secret WIX_API_KEY (a Wix API key with Contacts + Email Subscriptions permissions).
import { createClient } from 'npm:@supabase/supabase-js@2';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const WIX_KEY = Deno.env.get('WIX_API_KEY') || '';
const SITE_ID = '6477ae75-52b8-4880-87f1-351d77657550'; // hitting2-0.com
const LABEL_NAME = 'Removed – Hitting 2.0';

const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });

async function wix(path: string, body: unknown) {
  const r = await fetch(`https://www.wixapis.com${path}`, {
    method: 'POST',
    headers: { 'Authorization': WIX_KEY, 'wix-site-id': SITE_ID, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${path} ${r.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : {};
}

Deno.serve(async () => {
  if (!WIX_KEY) return json({ result: 'waiting: WIX_API_KEY secret not set yet' });
  const { data: pending } = await sb.from('removed_customers').select('*').eq('status', 'pending').order('id').limit(50);
  if (!pending?.length) return json({ result: 'nothing pending' });

  const { label } = await wix('/contacts/v4/labels', { displayName: LABEL_NAME });
  const out: string[] = [];
  for (const row of pending) {
    let status = 'done', result = '';
    try {
      const { contacts } = await wix('/contacts/v4/contacts/query', { query: { filter: { 'info.emails.email': row.email }, paging: { limit: 20 } } });
      for (const c of contacts || []) await wix(`/contacts/v4/contacts/${c.id}/labels`, { labelKeys: [label.key] });
      await wix('/email-marketing/v1/email-subscriptions', { subscription: { email: row.email, subscriptionStatus: 'UNSUBSCRIBED' } });
      if (!contacts?.length) { status = 'not_found'; result = 'no Wix contact with this email; unsubscribed anyway'; }
      else result = `labeled ${contacts.length} contact(s) and unsubscribed`;
    } catch (e) {
      status = 'error'; result = (e as Error).message;
    }
    await sb.from('removed_customers').update({ status, result, processed_at: new Date().toISOString() }).eq('id', row.id);
    out.push(`${row.email}: ${status}`);
  }
  return json({ result: out });
});
