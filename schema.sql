-- Hitting 2.0 app: standalone database. Nothing here is shared with Makos HQ.

create table if not exists public.clients (
  id text primary key,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Who can sign in: one row per (email, client). The coach has role 'coach' and no client.
create table if not exists public.access (
  email text not null,
  client_id text references public.clients(id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'coach')),
  added_at timestamptz not null default now(),
  unique (email, client_id)
);
create index if not exists access_email_idx on public.access (lower(email));

create table if not exists public.plans (
  client_id text primary key references public.clients(id) on delete cascade,
  focus text[] not null default '{}',
  note text,
  updated_at timestamptz not null default now()
);

-- Session reports AND video submissions (a row with video_path is a video).
create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  client_id text not null references public.clients(id) on delete cascade,
  client_name text,
  focus text[] default '{}',
  result text check (result in ('nailed', 'getting', 'struggled')),
  mastered boolean default false,
  benchmarks jsonb,
  series text,
  hit int,
  total int,
  note text,
  video_path text,
  coach_note text,
  coach_audio_path text,
  coach_audio_type text,
  coach_reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists feedback_client_idx on public.feedback (client_id, created_at desc);

create or replace function public.my_email() returns text
  language sql stable as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) $$;
create or replace function public.is_coach() returns boolean
  language sql stable security definer set search_path = public as
  $$ select exists (select 1 from public.access where lower(email) = public.my_email() and role = 'coach') $$;
create or replace function public.is_member() returns boolean
  language sql stable security definer set search_path = public as
  $$ select exists (select 1 from public.access where lower(email) = public.my_email()) $$;
create or replace function public.my_client_ids() returns setof text
  language sql stable security definer set search_path = public as
  $$ select client_id from public.access where lower(email) = public.my_email() and client_id is not null $$;
create or replace function public.email_allowed(check_email text) returns boolean
  language sql stable security definer set search_path = public as
  $$ select exists (select 1 from public.access where lower(email) = lower(trim(check_email))) $$;
grant execute on function public.email_allowed(text) to anon, authenticated;

alter table public.clients enable row level security;
alter table public.access enable row level security;
alter table public.plans enable row level security;
alter table public.feedback enable row level security;

create policy "read own clients" on public.clients for select to authenticated using (public.is_coach() or id in (select public.my_client_ids()));
create policy "coach manages clients" on public.clients for all to authenticated using (public.is_coach()) with check (public.is_coach());

create policy "read own access" on public.access for select to authenticated using (public.is_coach() or lower(email) = public.my_email());
create policy "coach manages access" on public.access for all to authenticated using (public.is_coach()) with check (public.is_coach());

create policy "read own plan" on public.plans for select to authenticated using (public.is_coach() or client_id in (select public.my_client_ids()));
create policy "coach manages plans" on public.plans for all to authenticated using (public.is_coach()) with check (public.is_coach());

create policy "read own feedback" on public.feedback for select to authenticated using (public.is_coach() or client_id in (select public.my_client_ids()));
create policy "add own feedback" on public.feedback for insert to authenticated with check (public.is_coach() or client_id in (select public.my_client_ids()));
create policy "note own feedback" on public.feedback for update to authenticated using (public.is_coach() or client_id in (select public.my_client_ids())) with check (public.is_coach() or client_id in (select public.my_client_ids()));
create policy "coach deletes feedback" on public.feedback for delete to authenticated using (public.is_coach());

grant select, insert, update, delete on public.clients, public.access, public.plans, public.feedback to authenticated;
grant usage on sequence public.feedback_id_seq to authenticated;
revoke all on public.clients, public.access, public.plans, public.feedback from anon;

-- Private video bucket, 50 MB per file. Path: <client_id>/<file>
insert into storage.buckets (id, name, public, file_size_limit)
values ('videos', 'videos', false, 52428800)
on conflict (id) do update set public = false, file_size_limit = 52428800;

create policy "videos read" on storage.objects for select to authenticated
  using (bucket_id = 'videos' and (public.is_coach() or (storage.foldername(name))[1] in (select public.my_client_ids())));
create policy "videos upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'videos' and (public.is_coach() or (storage.foldername(name))[1] in (select public.my_client_ids())));
create policy "videos delete" on storage.objects for delete to authenticated
  using (bucket_id = 'videos' and public.is_coach());

-- Live updates for the coach screen
alter publication supabase_realtime add table public.feedback, public.plans;

-- The coach
insert into public.access (email, client_id, role) values ('hitting2.0bball@gmail.com', null, 'coach'), ('devanahart@icloud.com', null, 'coach')
on conflict do nothing;
