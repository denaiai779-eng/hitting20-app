-- Video allowance per hitter, counted per calendar month (Detroit time). Coach is never limited.
alter table public.clients add column if not exists video_limit int not null default 0;   -- set to 2 by App Add-On / Remote purchase
alter table public.clients add column if not exists bonus_videos int not null default 0;  -- extra breakdowns granted by coach
alter table public.clients add column if not exists bonus_month text;                     -- 'YYYY-MM' the bonus applies to

-- Permanent usage log: one row per video ever sent. Deleting a video does NOT give the slot back.
create table if not exists public.video_usage (
  id bigint generated always as identity primary key,
  client_id text not null references public.clients(id) on delete cascade,
  feedback_id bigint,
  created_at timestamptz not null default now()
);
alter table public.video_usage enable row level security;
create policy "read own usage" on public.video_usage for select to authenticated using (public.is_coach() or client_id in (select public.my_client_ids()));
grant select on public.video_usage to authenticated;

create or replace function public.month_key() returns text language sql stable as
  $$ select to_char(now() at time zone 'America/Detroit', 'YYYY-MM') $$;

create or replace function public.videos_allowed(cid text) returns int language sql stable security definer set search_path = public as
  $$ select coalesce(video_limit, 0) + case when bonus_month = public.month_key() then coalesce(bonus_videos, 0) else 0 end from public.clients where id = cid $$;

create or replace function public.videos_used(cid text) returns int language sql stable security definer set search_path = public as
  $$ select count(*)::int from public.video_usage where client_id = cid
       and to_char(created_at at time zone 'America/Detroit', 'YYYY-MM') = public.month_key() $$;

-- What the app shows: { allowed, used, left }
create or replace function public.video_status(cid text) returns json language sql stable security definer set search_path = public as
  $$ select json_build_object('allowed', public.videos_allowed(cid), 'used', public.videos_used(cid),
       'left', greatest(public.videos_allowed(cid) - public.videos_used(cid), 0))
     where public.is_coach() or cid in (select public.my_client_ids()) $$;
grant execute on function public.video_status(text) to authenticated;

-- Hard stop: a family can't add a video past their allowance, even outside the app.
create or replace function public.enforce_video_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.video_path is null or public.is_coach() then return new; end if;
  if public.videos_used(new.client_id) >= public.videos_allowed(new.client_id) then
    raise exception 'VIDEO_LIMIT_REACHED' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists feedback_video_limit on public.feedback;
create trigger feedback_video_limit before insert on public.feedback for each row execute function public.enforce_video_limit();

create or replace function public.log_video_usage() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.video_path is not null then insert into public.video_usage (client_id, feedback_id) values (new.client_id, new.id); end if;
  return new;
end $$;
drop trigger if exists feedback_video_usage on public.feedback;
create trigger feedback_video_usage after insert on public.feedback for each row execute function public.log_video_usage();

-- Families can't change a row into a video later to dodge the count.
create or replace function public.block_video_path_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_coach() and new.video_path is distinct from old.video_path then
    raise exception 'VIDEO_PATH_LOCKED' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists feedback_video_lock on public.feedback;
create trigger feedback_video_lock before update on public.feedback for each row execute function public.block_video_path_change();

select 'video limits ready' as status;
