# Wiring SIGNAL to Supabase

The frontend (`lib/db.js`) already talks to Supabase — the switch is two env vars:

```bash
cp .env.example .env.local
# fill in:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Steps

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → run `supabase/schema.sql` (creates all PRD §6 tables, pgvector + PostGIS extensions, RLS policies, RPC functions, and the curated opportunity seed).
3. Copy the project URL + anon key into `.env.local`.
4. `npm run dev` — every `lib/db.js` call now hits the Supabase REST API (`/rest/v1/<table>`), and `rpc('local_density_count')` hits the PostGIS function.

## What switches

| Concern | Demo (no env) | Supabase |
|---|---|---|
| Tables | localStorage (`signal_db_*`) | Postgres REST |
| Auth | demo password (`signal-admin`) | swap `lib/auth.js` for `@supabase/ssr` (`signInWithPassword` + `auth.getUser()` for RLS-aware sessions) |
| Geo density | synthetic demo value | real `ST_DWithin` RPC |
| Uploads | simulated worker | `uploads` rows + object storage (Supabase Storage, presigned PUT) |
| Analytics | UTM in localStorage | `utm_events` table |

## Production notes

- Enable **RLS** (already in schema) and route auth through Supabase Auth so `auth.uid()` policies apply.
- Queue workers (BullMQ) run server-side with the **service_role** key — never expose it to the browser.
- The `messages` table is insert-only for anonymous visitors; read via admin (service role).
- HNSW index builds on large tables should run in a maintenance window.
