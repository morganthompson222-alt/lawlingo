-- LawLingo v2.1 — Lesson Save States for Mid-Lesson Resume & Progress Tracking
-- Run: npx supabase db push (if linked) or paste into Supabase SQL Editor

-- Store mid-lesson state so users can resume after closing the tab
create table if not exists public.lesson_save_states (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id text not null,
  micro_skill text not null default '',
  state jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.lesson_save_states enable row level security;
create policy "Users manage their own save states"
  on public.lesson_save_states for all
  using (auth.uid() = user_id);

create index idx_lesson_save_states_user on lesson_save_states(user_id, lesson_id);

-- Track completed lessons for crown unlocking
create table if not exists public.lesson_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id text not null,
  micro_skill text not null default '',
  page text not null default '',
  crown_level int not null default 0,
  score numeric(5,2) not null default 0,
  correct int not null default 0,
  total int not null default 0,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.lesson_completions enable row level security;
create policy "Users manage their own lesson completions"
  on public.lesson_completions for all
  using (auth.uid() = user_id);

create index idx_lesson_completions_user on lesson_completions(user_id, page, crown_level);

-- Add consolidation_completed to lesson_progress
alter table public.lesson_progress add column if not exists consolidation_completed boolean default false;
