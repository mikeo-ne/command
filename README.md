# M1-COMMAND // Mike 1ne Audio Hub

A studio operations dashboard for Mike 1ne's audio engineering ecosystem — daily practice
drills, the studio session pipeline, a pre-flight QC audit for Logic Pro mixes/masters, and
the 7H Music Group / East Sound Technologies R&D roadmap.

Rebuilt from the original single-file prototype (`m1_command_audio_hub.html`) as a modern
Vite + React + TypeScript + Tailwind app with a shared Supabase workspace and live sync.

## Modules

1. **Daily Practice** — four 15-minute drills with completion tracking
2. **Studio Pipeline** — client sessions (add / delete), discipline metrics
3. **Pre-Flight QC Audit** — 8-point Logic Pro mix/master checklist with session reset
4. **Label & Tech R&D** — roadmap columns for 7H Music Group and East Sound Technologies
   (click a card to cycle Pending → In Progress → Done)

## Stack

- **Vite + React 18 + TypeScript + Tailwind CSS 3**
- **Supabase** (shared workspace, no login) — tables `m1_routine_tasks`, `m1_qc_items`,
  `m1_projects`, `m1_roadmap_items` in the `1NE` project, schema in
  [`supabase/schema.sql`](supabase/schema.sql)
- **Supabase Realtime** — every connected client live-updates when any row changes
- **localStorage fallback** — the app runs fully offline when Supabase env vars are absent

## Development

```sh
npm install
cp .env.example .env   # fill in Supabase URL + anon key (optional)
npm run dev            # http://localhost:5173
```

## Build & Deploy

```sh
npm run build          # type-check + production build into dist/
```

Deployed on Vercel as project `m1-command`. Environment variables (build-time):

| Variable                  | Value                                    |
| ------------------------- | ---------------------------------------- |
| `VITE_SUPABASE_URL`       | `https://vewkhidaajdrfkedeavs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY`  | Supabase anon/publishable key            |

## Security note

The hub is intentionally a **single shared workspace without authentication**: the anon key
may read and write the four `m1_*` tables (RLS policies are open for `anon`). Anyone with
the URL can edit hub state. Add Supabase Auth if this ever needs to be private.

## Database

`supabase/schema.sql` is the full schema + seed (idempotent). The migration
`m1_command_audio_hub_schema` is recorded in the Supabase project's migration history.
Tables live in the shared `1NE` Supabase project with an `m1_` prefix to avoid collisions.
