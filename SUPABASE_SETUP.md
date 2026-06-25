# MOOSING × Supabase — setup

The app now persists everything to your Supabase project instead of in-memory
mock data. Catalog, orders, settings, and **images/logo** all live in Supabase.

- Project URL: `https://rawxzuztrqmkadagwkdv.supabase.co`
- Schema/SQL: [`supabase/schema.sql`](supabase/schema.sql)

## 1. Run the SQL (one time)

1. Open **Supabase Dashboard ▸ SQL Editor ▸ New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Click **Run**.

This creates the 8 tables, all performance indexes, the `media` and `logos`
storage buckets, the RLS policies, and seeds the same demo data the app shipped
with. It is **idempotent** — safe to run again.

## 2. Environment variables

Already created for you in [`.env.local`](.env.local):

```
VITE_SUPABASE_URL=https://rawxzuztrqmkadagwkdv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJ…
```

Vite only reads env vars at startup — **restart `npm run dev`** if it was running.

## 3. Run

```bash
npm install      # @supabase/supabase-js is already in package.json
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Admin access: create an account on the login page (saved to Supabase Auth), or
use the **Demo** button for instant access without an account.

## Admin authentication (Supabase Auth)

The **Create account** button on the login page now calls `supabase.auth.signUp`
→ the user is stored in Supabase's **`auth.users`** table. **Login** calls
`supabase.auth.signInWithPassword` against it, and the session persists across
reloads.

> **Enable instant login:** by default Supabase requires e-mail confirmation, so
> a new account can't sign in until the user clicks the confirmation link. To let
> people log in immediately after creating an account, go to **Dashboard ▸
> Authentication ▸ Sign In / Providers ▸ Email** and turn **"Confirm email" OFF**.
> (If you leave it ON, the app shows a "check your e-mail" message instead.)

The old demo credentials (`admin@moosing.dz`) only work via the **Demo** button now
— to log in with them by password, create that account once with **Create account**.

## How it works

| Concern | Implementation |
|---|---|
| Auth | [`src/lib/supabase.ts`](src/lib/supabase.ts) + `StoreContext` — Supabase Auth (`signUp`/`signInWithPassword`), session tracked via `onAuthStateChange` |
| Reads | [`src/lib/api.ts`](src/lib/api.ts) `fetchAll()` — a single batched `Promise.all` load on startup |
| Writes | `StoreContext` updates the UI **optimistically**, then writes through to Supabase in the background |
| Images | `ImageInput` uploads to a bucket and stores the returned **public CDN URL** in the row |
| Buckets | `media` (program/promotion images) and `logos` (showroom logo) — both public |

## Why it's fast

- **Indexes** on every filter/sort/search path (B-tree FKs & dates, a *partial*
  index on active promotions, and **pg_trgm GIN** for instant text search).
- **One** batched network request hydrates the whole app; the UI then filters
  client-side with zero further round-trips.
- **Optimistic updates** — the UI never waits on the network for a mutation.
- Images are served from Supabase's CDN with a 1-year cache header.
- `@supabase/supabase-js` is code-split into its own cached chunk.

## ⚠️ Security note (important)

Admin login now uses **Supabase Auth**, but the RLS write policies still allow
`anon` (so the optimistic, anon-key writes keep working), and **anyone can sign
up**. So having an account doesn't yet grant *special* power beyond what the anon
key already allows — it's authentication, not authorization.

To make it real admin-only authorization:

1. Restrict who can sign up (e.g. disable open sign-ups in **Dashboard ▸
   Authentication**, or invite the admin manually), **and**
2. Tighten the `*_write` policies from `to anon` to `to authenticated` (optionally
   gated on an allow-listed e-mail / a custom `role` claim). A ready-to-use
   HARDENING block is at the bottom of [`supabase/schema.sql`](supabase/schema.sql).

Keep the public `*_read` and order-`insert` policies open so the storefront keeps
working for visitors.
