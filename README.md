# LawLingo — Gamified Law Revision Platform

A Duolingo-style interactive platform for mastering English and Welsh law, covering the SQE syllabus and self-represented litigant skills.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your Supabase credentials
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `NEXTAUTH_URL` | `http://localhost:3000` (local) or production URL |
| `NEXTAUTH_SECRET` | Random secret for NextAuth.js |
| `GOOGLE_CLIENT_ID` | (Optional) Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | (Optional) Google OAuth secret |

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration SQL in `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor
3. Seed sample questions: `npx tsx scripts/seed.ts`

## Seeding Content

The complete legal curriculum is in `../pages/` (relative to the app directory). To seed:

```bash
# Parse markdown files and insert questions
node scripts/parse-content.js
```

Or manually seed with the reference modules:

```bash
npx tsx scripts/seed.ts
```

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel project settings
4. Deploy

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **State:** Zustand, React Query
- **Spaced Repetition:** SM-2 algorithm
- **Auth:** NextAuth.js + Supabase adapter

## Features

- 10-page comprehensive legal curriculum
- Interactive lesson player (MCQ, MSQ, T/F, scenario, drag-match, fill-blank)
- 5 Crown Levels per page (Bronze → Diamond)
- Mastery Gates with 80% pass threshold and 24-hour cooldown
- Spaced repetition with SM-2 algorithm
- Gamification: XP, gems, hearts, streaks, leagues, badges
- Duolingo-style interactive legal stories
- Loopholes Guard with ethics pledge
- Mobile-responsive design
- Skill tree with progressive unlocks
- Weekly league leaderboards

## Pages

| Page | Subject | Sections |
|------|---------|----------|
| A | Contract Law | 28 |
| B | Tort & Civil Wrongs | 22 |
| C | Criminal Law – Homicide | 7 |
| D | Criminal Law – Financial Crime | 12 |
| E | Civil-Criminal Overlap | 3 |
| F | Tax & Offshore Structures | 14 |
| G | Money Laundering & POCA | 11 |
| H | Loopholes & Defensive Lawyering | 15 |
| I | Civil Procedure | 18 |
| J | Criminal Procedure | 14 |

## License

Proprietary. All rights reserved.
