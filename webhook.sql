-- Log of booking webhooks from hitting2-0.com (service role only; no app access)
create table if not exists public.webhook_log (
  id bigint generated always as identity primary key,
  body jsonb,
  result text,
  created_at timestamptz not null default now()
);
alter table public.webhook_log enable row level security;
revoke all on public.webhook_log from anon, authenticated;
select 'ok' as webhook_log;
