-- LawLingo Database Schema
-- Run this in the Supabase SQL Editor

-- User Profiles
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  xp integer default 0,
  gems integer default 500,
  streak integer default 0,
  last_active timestamptz,
  league text default 'bronze',
  hearts integer default 5,
  streak_freeze boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Questions
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  page text not null,
  section text,
  micro_skill text,
  crown_level integer check (crown_level between 1 and 5),
  type text check (type in ('mcq','msq','tf','scenario','drag_match','fill_blank','drafting')),
  loophole boolean default false,
  difficulty text check (difficulty in ('easy','medium','hard')),
  tags text[],
  question text not null,
  options jsonb not null,
  feedback text,
  oscoa_references text[],
  created_at timestamptz default now()
);

-- Question pool cache
create table if not exists public.question_pools (
  id uuid default gen_random_uuid() primary key,
  page text not null,
  crown_level integer not null,
  question_ids uuid[] not null,
  loophole_count integer default 0,
  total_count integer default 0,
  updated_at timestamptz default now(),
  unique(page, crown_level)
);

-- Lesson attempts
create table if not exists public.lesson_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id text not null,
  score float,
  mistakes jsonb default '{}',
  completed boolean default false,
  created_at timestamptz default now()
);

-- Gate attempts
create table if not exists public.gate_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  page text not null,
  crown_level integer not null,
  score float,
  passed boolean,
  created_at timestamptz default now()
);

-- Spaced repetition cards
create table if not exists public.review_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  micro_skill text not null,
  easiness float default 2.5,
  interval integer default 0,
  next_review timestamptz default now(),
  last_review timestamptz,
  unique(user_id, micro_skill)
);

-- Badges
create table if not exists public.badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  earned_at timestamptz default now(),
  unique(user_id, name)
);

-- League leaderboard (weekly)
create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  league text not null default 'bronze',
  weekly_xp integer default 0,
  week_start date not null,
  unique(user_id, week_start)
);

-- Crown progress
create table if not exists public.crown_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  page text not null,
  crown_level integer not null,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, page, crown_level)
);

-- Loopholes entrance test results
create table if not exists public.loopholes_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  passed boolean default false,
  pledged boolean default false,
  created_at timestamptz default now(),
  unique(user_id)
);

-- Heart refills tracking
create table if not exists public.heart_refills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  refilled_at timestamptz default now()
);

-- Indexes
create index if not exists idx_questions_page_level on questions(page, crown_level);
create index if not exists idx_questions_tags on questions using gin(tags);
create index if not exists idx_questions_loophole on questions(loophole);
create index if not exists idx_lesson_attempts_user on lesson_attempts(user_id);
create index if not exists idx_gate_attempts_user on gate_attempts(user_id);
create index if not exists idx_review_cards_user on review_cards(user_id, next_review);
create index if not exists idx_leaderboard_week on leaderboard(week_start, league);

-- RLS Policies
alter table public.user_profiles enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.gate_attempts enable row level security;
alter table public.review_cards enable row level security;
alter table public.badges enable row level security;
alter table public.crown_progress enable row level security;
alter table public.loopholes_access enable row level security;
alter table public.leaderboard enable row level security;
alter table public.heart_refills enable row level security;
alter table public.questions enable row level security;

-- Read policies
create policy "Users can read their own profile" on public.user_profiles for select using (auth.uid() = id);
create policy "Users can read their own lesson attempts" on public.lesson_attempts for select using (auth.uid() = user_id);
create policy "Users can read their own gate attempts" on public.gate_attempts for select using (auth.uid() = user_id);
create policy "Users can read their own review cards" on public.review_cards for select using (auth.uid() = user_id);
create policy "Users can read their own badges" on public.badges for select using (auth.uid() = user_id);
create policy "Users can read their own crown progress" on public.crown_progress for select using (auth.uid() = user_id);
create policy "Users can read their own loopholes access" on public.loopholes_access for select using (auth.uid() = user_id);
create policy "Users can read leaderboard" on public.leaderboard for select using (true);
create policy "Anyone can read questions" on public.questions for select using (true);

-- Write/update policies
create policy "Users can update their own profile" on public.user_profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.user_profiles for insert with check (auth.uid() = id);
create policy "Users can insert lesson attempts" on public.lesson_attempts for insert with check (auth.uid() = user_id);
create policy "Users can insert gate attempts" on public.gate_attempts for insert with check (auth.uid() = user_id);
create policy "Users can upsert review cards" on public.review_cards for insert with check (auth.uid() = user_id);
create policy "Users can update review cards" on public.review_cards for update using (auth.uid() = user_id);
create policy "Users can insert badges" on public.badges for insert with check (auth.uid() = user_id);
create policy "Users can upsert crown progress" on public.crown_progress for insert with check (auth.uid() = user_id);
create policy "Users can update crown progress" on public.crown_progress for update using (auth.uid() = user_id);
create policy "Users can upsert loopholes access" on public.loopholes_access for insert with check (auth.uid() = user_id);
create policy "Users can update loopholes access" on public.loopholes_access for update using (auth.uid() = user_id);
create policy "Users can upsert leaderboard" on public.leaderboard for insert with check (auth.uid() = user_id);
create policy "Users can update leaderboard" on public.leaderboard for update using (auth.uid() = user_id);
create policy "Users can insert heart refills" on public.heart_refills for insert with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, xp, gems, streak, league, hearts)
  values (new.id, 0, 500, 0, 'bronze', 5);

  insert into public.loopholes_access (user_id, passed, pledged)
  values (new.id, false, false);

  insert into public.leaderboard (user_id, league, weekly_xp, week_start)
  values (new.id, 'bronze', 0, date_trunc('week', now()));

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Heart regeneration function (1 heart per 4 hours, max 5)
create or replace function public.regenerate_hearts(p_user_id uuid)
returns void as $$
declare
  v_hearts integer;
  v_last_refill timestamptz;
begin
  select hearts into v_hearts from public.user_profiles where id = p_user_id;
  if v_hearts >= 5 then return; end if;

  select max(refilled_at) into v_last_refill from public.heart_refills where user_id = p_user_id;
  if v_last_refill is null then
    v_last_refill := now() - interval '4 hours';
  end if;

  while v_hearts < 5 and (now() - v_last_refill) > interval '4 hours' loop
    v_hearts := v_hearts + 1;
    v_last_refill := v_last_refill + interval '4 hours';
    insert into public.heart_refills (user_id) values (p_user_id);
  end loop;

  if v_hearts > 5 then v_hearts := 5; end if;

  update public.user_profiles set hearts = v_hearts, updated_at = now() where id = p_user_id;
end;
$$ language plpgsql security definer;
