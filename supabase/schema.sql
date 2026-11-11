-- M1-COMMAND // Mike 1ne Audio Hub — schema + seed
-- Single shared workspace (no auth): the anon key may read/write these tables.
-- Tables are prefixed m1_ to avoid collisions in a shared Supabase project.

create table if not exists public.m1_routine_tasks (
  id text primary key,
  title text not null,
  duration text not null default '15 MINS',
  tool text not null default '',
  description text not null default '',
  completed boolean not null default false,
  position integer not null default 0
);

create table if not exists public.m1_qc_items (
  id text primary key,
  title text not null,
  detail text not null default '',
  category text not null default '',
  done boolean not null default false,
  position integer not null default 0
);

create table if not exists public.m1_projects (
  id text primary key,
  title text not null,
  client text not null default '',
  type text not null default '',
  revisions text not null default '',
  status text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.m1_roadmap_items (
  id text primary key,
  org text not null check (org in ('7H', 'EST')),
  title text not null,
  description text not null default '',
  status text not null default 'Pending' check (status in ('Pending', 'In Progress', 'Done')),
  position integer not null default 0
);

-- Row Level Security: shared hub, intentionally open to the anon role.
alter table public.m1_routine_tasks enable row level security;
alter table public.m1_qc_items enable row level security;
alter table public.m1_projects enable row level security;
alter table public.m1_roadmap_items enable row level security;

drop policy if exists "m1 hub select" on public.m1_routine_tasks;
drop policy if exists "m1 hub insert" on public.m1_routine_tasks;
drop policy if exists "m1 hub update" on public.m1_routine_tasks;
drop policy if exists "m1 hub delete" on public.m1_routine_tasks;
create policy "m1 hub select" on public.m1_routine_tasks for select to anon, authenticated using (true);
create policy "m1 hub insert" on public.m1_routine_tasks for insert to anon, authenticated with check (true);
create policy "m1 hub update" on public.m1_routine_tasks for update to anon, authenticated using (true) with check (true);
create policy "m1 hub delete" on public.m1_routine_tasks for delete to anon, authenticated using (true);

drop policy if exists "m1 hub select" on public.m1_qc_items;
drop policy if exists "m1 hub insert" on public.m1_qc_items;
drop policy if exists "m1 hub update" on public.m1_qc_items;
drop policy if exists "m1 hub delete" on public.m1_qc_items;
create policy "m1 hub select" on public.m1_qc_items for select to anon, authenticated using (true);
create policy "m1 hub insert" on public.m1_qc_items for insert to anon, authenticated with check (true);
create policy "m1 hub update" on public.m1_qc_items for update to anon, authenticated using (true) with check (true);
create policy "m1 hub delete" on public.m1_qc_items for delete to anon, authenticated using (true);

drop policy if exists "m1 hub select" on public.m1_projects;
drop policy if exists "m1 hub insert" on public.m1_projects;
drop policy if exists "m1 hub update" on public.m1_projects;
drop policy if exists "m1 hub delete" on public.m1_projects;
create policy "m1 hub select" on public.m1_projects for select to anon, authenticated using (true);
create policy "m1 hub insert" on public.m1_projects for insert to anon, authenticated with check (true);
create policy "m1 hub update" on public.m1_projects for update to anon, authenticated using (true) with check (true);
create policy "m1 hub delete" on public.m1_projects for delete to anon, authenticated using (true);

drop policy if exists "m1 hub select" on public.m1_roadmap_items;
drop policy if exists "m1 hub insert" on public.m1_roadmap_items;
drop policy if exists "m1 hub update" on public.m1_roadmap_items;
drop policy if exists "m1 hub delete" on public.m1_roadmap_items;
create policy "m1 hub select" on public.m1_roadmap_items for select to anon, authenticated using (true);
create policy "m1 hub insert" on public.m1_roadmap_items for insert to anon, authenticated with check (true);
create policy "m1 hub update" on public.m1_roadmap_items for update to anon, authenticated using (true) with check (true);
create policy "m1 hub delete" on public.m1_roadmap_items for delete to anon, authenticated using (true);

-- Seed defaults (idempotent — never overwrites user state)
insert into public.m1_routine_tasks (id, title, duration, tool, description, completed, position) values
  ('task-1', 'Frequency Identification Drills', '15 MINS', 'Logic Pro / Ear Trainer', 'Locate muddy 300Hz low-mids, harsh 3kHz resonances, and airy 10kHz boosts before adjusting EQ.', false, 0),
  ('task-2', 'Logic Pro Timed Fader Balance Drill', '15 MINS', 'Logic Pro', 'Build a static fader mix from a raw multitrack session using zero plugins. Focus purely on volume and panning.', false, 1),
  ('task-3', 'Reaper Sound Design Asset Generation', '15 MINS', 'Reaper', 'Process a single raw audio recording using Reaper item take FX and routing matrix to design a futuristic UI sound.', false, 2),
  ('task-4', 'Real-World System Translation Check', '15 MINS', 'Earbuds / Car Stereo', 'Export a short mix snippet and cross-check low-end clarity and vocal placement across consumer playback systems.', false, 3)
on conflict (id) do nothing;

insert into public.m1_qc_items (id, title, detail, category, done, position) values
  ('qc-1', 'Gain Staging Verified', 'Tracks peaking around -18 to -12 dBFS pre-fader.', 'PREP', false, 0),
  ('qc-2', 'Pitch & Timing Clean-up', 'Flex Pitch tails and transient alignment checked for artifacts.', 'PREP', false, 1),
  ('qc-3', 'Static Balance & Panning', 'Primary volume relationship solid with main vocals and kick centered.', 'BALANCE', false, 2),
  ('qc-4', 'Low-End Phase Alignment', 'Sub bass, kick drum, and DI bass correlation locked in mono.', 'PHASE', false, 3),
  ('qc-5', 'Dynamic Resonance Tamed', 'Dynamic EQ applied to treat harsh 3kHz vocal peaks.', 'DYNAMICS', false, 4),
  ('qc-6', 'Bus Compression & Saturation', 'Submix glued with gentle 1-2dB compression and subtle tape harmonics.', 'TONE', false, 5),
  ('qc-7', 'Mono Compatibility Sum Test', 'Mix checked in mono to ensure key instruments don''t cancel out.', 'TECHNICAL', false, 6),
  ('qc-8', 'True Peak Ceiling Set', 'Output limiter set to -1.0 dBFS maximum ceiling.', 'MASTERING', false, 7)
on conflict (id) do nothing;

insert into public.m1_projects (id, title, client, type, revisions, status) values
  ('proj-1', 'Acoustic Soul Session', '7H Music Group', 'Mixing (Logic Pro)', '2 Rounds Included', 'In Mix (Logic Pro)'),
  ('proj-2', 'Cyberpunk Sound Effects Kit', 'East Sound Technologies', 'Sound Design (Reaper)', 'Internal R&D Asset', 'Reaper SD Processing')
on conflict (id) do nothing;

insert into public.m1_roadmap_items (id, org, title, description, status, position) values
  ('r7h-1', '7H', 'Standardize Client Terms & Revision Limits', 'Cap revisions to 2 rounds per mix to protect studio engineering hours.', 'Done', 0),
  ('r7h-2', '7H', 'Create Logic Pro Mix & Master Template Suite', 'Pre-routed summing stacks and aux returns saved to template directory.', 'In Progress', 1),
  ('r7h-3', '7H', 'Launch 7H Engineering Service Portal', 'Dedicated client intake for commercial mixing, mastering, and stem delivery.', 'Pending', 2),
  ('est-1', 'EST', 'Reaper Custom Action Scripting Setup', 'Build modular hotkey workflows for fast sound design asset exports.', 'Done', 0),
  ('est-2', 'EST', 'DSP & Audio Plugin Architecture R&D', 'Explore JUCE and HISE audio plugin frameworks for custom VST development.', 'In Progress', 1),
  ('est-3', 'EST', 'Proprietary Sample & Preset Sound Bank', 'Create original sci-fi & hybrid instrument sound libraries engineered in Reaper.', 'Pending', 2)
on conflict (id) do nothing;

-- Realtime: broadcast hub changes to every connected client (live shared hub)
do $$
declare
  t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['m1_routine_tasks', 'm1_qc_items', 'm1_projects', 'm1_roadmap_items'] loop
      if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
      ) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    end loop;
  end if;
end $$;
