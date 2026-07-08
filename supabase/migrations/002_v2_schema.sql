-- LawLingo v2 — "Teach → Test → Lock" Schema
-- Run in Supabase SQL Editor. Drops the old questions table and creates the new format.

-- New questions table with teaching blocks
drop table if exists public.question_pools cascade;

alter table public.questions rename to questions_old;

create table public.questions (
  id uuid default gen_random_uuid() primary key,
  lesson_id text not null,
  micro_skill text not null,
  block text not null check (block in ('A','B','C','consolidation')),
  phase text not null check (phase in ('teaching','consolidation')),
  teaching_summary text,
  type text not null check (type in ('teaching','fill_gap_statute','fill_gap_case','drag_elements','scenario_choice','spot_error','msq','clause_drafting','case_ratio_match')),
  question text,
  answer text,
  options jsonb default '[]',
  feedback text,
  oscoa_references text[] default '{}',
  difficulty text check (difficulty in ('easy','medium','hard')),
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Index lesson lookups
create index idx_questions_lesson on questions(lesson_id, block, phase);

-- RLS: Anyone can read
alter table public.questions enable row level security;
create policy "Anyone can read questions" on public.questions for select using (true);

-- Lesson progress tracking
create table if not exists public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id text not null,
  block text not null,
  completed boolean default false,
  mistakes jsonb default '[]',
  created_at timestamptz default now(),
  unique(user_id, lesson_id, block)
);

alter table public.lesson_progress enable row level security;
create policy "Users manage their lesson progress" on public.lesson_progress for all using (auth.uid() = user_id);

create index idx_lesson_progress_user on lesson_progress(user_id, lesson_id);

-- Insert the gold standard A1.1 data from the JSON file
-- (This is done via the seed script)
