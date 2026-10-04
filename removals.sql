-- When the coach DELETES a client in the app, queue their email so their Wix contact gets
-- labeled "Removed – Hitting 2.0" and unsubscribed from email marketing. Archive does NOT do this.
create extension if not exists pg_net;

create table if not exists public.removed_customers (
  id bigint generated always as identity primary key,
  email text not null,
  client_name text,
  status text not null default 'pending',   -- pending | done | not_found | error
  result text,
  removed_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table public.removed_customers enable row level security;
create policy "coach reads removals" on public.removed_customers for select to authenticated using (public.is_coach());
grant select on public.removed_customers to authenticated;

create or replace function public.queue_customer_removal() returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- only emails that won't be used by another hitter (siblings share a parent email)
  insert into public.removed_customers (email, client_name)
  select a.email, old.name from public.access a
  where a.client_id = old.id and a.role = 'client'
    and not exists (select 1 from public.access b where lower(b.email) = lower(a.email) and b.client_id <> old.id);
  return old;
end $$;
drop trigger if exists clients_queue_removal on public.clients;
create trigger clients_queue_removal before delete on public.clients for each row execute function public.queue_customer_removal();

-- After the delete finishes, ping the Wix sync function (it reads the pending list; the request carries no data).
create or replace function public.ping_wix_removal() returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(url := 'https://buxdjqowkknqagojspqb.supabase.co/functions/v1/wix-remove-customer',
                        body := '{}'::jsonb, headers := '{"Content-Type":"application/json"}'::jsonb);
  return null;
end $$;
drop trigger if exists clients_ping_removal on public.clients;
create trigger clients_ping_removal after delete on public.clients for each statement execute function public.ping_wix_removal();

select 'removals ready' as status;
