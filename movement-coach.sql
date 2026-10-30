-- Movement Coach (physical therapist) review side.
-- Adds a 'pt' sign-in role, tags each video for the hitting coach or the movement coach,
-- and gives movement checks their own monthly allowance (separate from swing breakdowns).
-- Run once in the Supabase SQL editor (project buxdjqowkknqagojspqb), after video-limits.sql.

-- 1. Role
alter table public.access drop constraint if exists access_role_check;
alter table public.access add constraint access_role_check check (role in ('client', 'coach', 'pt'));

create or replace function public.is_pt() returns boolean
  language sql stable security definer set search_path = public as
  $$ select exists (select 1 from public.access where lower(email) = public.my_email() and role = 'pt') $$;

-- 2. Who each video is for
alter table public.feedback add column if not exists reviewer text not null default 'coach';
alter table public.feedback drop constraint if exists feedback_reviewer_check;
alter table public.feedback add constraint feedback_reviewer_check check (reviewer in ('coach', 'pt'));

-- The movement coach sees and answers only movement videos; she can't delete anything.
drop policy if exists "pt reads movement feedback" on public.feedback;
create policy "pt reads movement feedback" on public.feedback for select to authenticated using (public.is_pt() and reviewer = 'pt');
drop policy if exists "pt replies movement feedback" on public.feedback;
create policy "pt replies movement feedback" on public.feedback for update to authenticated
  using (public.is_pt() and reviewer = 'pt') with check (public.is_pt() and reviewer = 'pt');

-- Videos: she can watch movement videos and upload her voice-overs (<client_id>/review-...)
drop policy if exists "pt videos read" on storage.objects;
create policy "pt videos read" on storage.objects for select to authenticated
  using (bucket_id = 'videos' and public.is_pt() and exists (
    select 1 from public.feedback f where f.reviewer = 'pt' and (f.video_path = name or f.coach_audio_path = name)));
drop policy if exists "pt voiceover upload" on storage.objects;
create policy "pt voiceover upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'videos' and public.is_pt() and (storage.foldername(name))[1] in (
    select client_id from public.feedback where reviewer = 'pt'));

-- 3. Separate monthly allowance for movement checks
alter table public.clients add column if not exists movement_limit int not null default 0;  -- 1 for App + Coaching
alter table public.video_usage add column if not exists reviewer text not null default 'coach';

create or replace function public.videos_used(cid text) returns int language sql stable security definer set search_path = public as
  $$ select count(*)::int from public.video_usage where client_id = cid and reviewer = 'coach'
       and to_char(created_at at time zone 'America/Detroit', 'YYYY-MM') = public.month_key() $$;
create or replace function public.movement_used(cid text) returns int language sql stable security definer set search_path = public as
  $$ select count(*)::int from public.video_usage where client_id = cid and reviewer = 'pt'
       and to_char(created_at at time zone 'America/Detroit', 'YYYY-MM') = public.month_key() $$;
create or replace function public.movement_allowed(cid text) returns int language sql stable security definer set search_path = public as
  $$ select coalesce(movement_limit, 0) from public.clients where id = cid $$;

create or replace function public.video_status(cid text) returns json language sql stable security definer set search_path = public as
  $$ select json_build_object('allowed', public.videos_allowed(cid), 'used', public.videos_used(cid),
       'left', greatest(public.videos_allowed(cid) - public.videos_used(cid), 0),
       'm_allowed', public.movement_allowed(cid), 'm_used', public.movement_used(cid),
       'm_left', greatest(public.movement_allowed(cid) - public.movement_used(cid), 0))
     where public.is_coach() or cid in (select public.my_client_ids()) $$;

create or replace function public.enforce_video_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.video_path is null or public.is_coach() then return new; end if;
  if new.reviewer = 'pt' then
    if public.movement_used(new.client_id) >= public.movement_allowed(new.client_id) then
      raise exception 'VIDEO_LIMIT_REACHED' using errcode = 'P0001';
    end if;
  elsif public.videos_used(new.client_id) >= public.videos_allowed(new.client_id) then
    raise exception 'VIDEO_LIMIT_REACHED' using errcode = 'P0001';
  end if;
  return new;
end $$;

create or replace function public.log_video_usage() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.video_path is not null then
    insert into public.video_usage (client_id, feedback_id, reviewer) values (new.client_id, new.id, new.reviewer);
  end if;
  return new;
end $$;

-- Families can't move a video between coaches (or turn a row into a video) after sending it.
create or replace function public.block_video_path_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_coach() and (new.video_path is distinct from old.video_path or new.reviewer is distinct from old.reviewer) then
    raise exception 'VIDEO_PATH_LOCKED' using errcode = 'P0001';
  end if;
  return new;
end $$;

grant execute on function public.is_pt(), public.movement_used(text), public.movement_allowed(text) to authenticated;
select 'movement coach ready' as status;
