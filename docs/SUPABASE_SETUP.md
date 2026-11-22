# Ledger, Videos & Press: setup and test guide

Three live features run on Supabase:

- **Distribution Ledger.** Admin entries drive every public counter.
- **YouTube Video Gallery.**
- **Press Releases.**

All three are managed at **`/admin`**. The admin area is not linked from the site and is never indexed.

---

## 1. Create / prepare the Supabase project

The project already exists: `https://hnuddarqfcpueuakctql.supabase.co`.

1. Open **Supabase → SQL Editor → New query**.
2. Paste the whole of [`supabase/schema.sql`](../supabase/schema.sql) and click **Run**. It creates:
   - the tables, indexes, RLS policies and `get_impact_stats()`
   - the Realtime publication
   - the public `media` storage bucket and its policies
   - the three core food pathways

   If you previously ran an older version of this schema with nine programs,
   running the updated file again updates the three core categories and archives
   the legacy categories. Existing ledger entries are preserved.

   The file is safe to run again; ledger records are preserved, the three core
   categories are kept in sync with the current site, and the optional ledger
   photo column is added to existing projects.
3. **Authentication → Sign In / Providers → Email.** Make sure email is enabled, then **turn OFF "Allow new users to sign up"**. Only you need an account.

## 2. Create the admin user

Supabase Auth logs in with an **email address**, not a username.

1. **Authentication → Users → Add user → Create new user.** Enter your email and a **strong** password, and tick **Auto Confirm User**.
2. In the SQL Editor, run this with your email:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.org'
   on conflict do nothing;
   ```

Only users in `public.admins` can write. Even a valid login without that row is read-only.

## 3. Environment variables

| Variable | Value | Where |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hnuddarqfcpueuakctql.supabase.co` | `.env.local` + Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the **publishable** key (`sb_publishable_…`) | `.env.local` + Vercel |
| `NEXT_PUBLIC_SITE_URL` | `https://www.ltsfoundation.in` | Vercel (already used) |

- `.env.local` already exists locally and is git-ignored. `.env.example` documents the names.
- The publishable key is meant to be public. RLS protects the data.
- **Never** put the `service_role` key or the JWT secret in this repo or in any `NEXT_PUBLIC_` variable. The app never needs them.

**Vercel:** Project → Settings → Environment Variables. Add the two Supabase variables for **Production, Preview and Development**, then **Deployments → ⋯ → Redeploy**. The variables are baked in at build time, so a redeploy is required.

## 4. How it works (short)

- **Counters are computed in Postgres** (`get_impact_stats()`):
  - kits = sum of entries whose program counts as *kits*
  - foods = sum of entries whose program counts as *meals*
  - days = today (IST) minus the start date. The start date is the override from Admin → Dashboard, or else the earliest entry.
- **SEO.** This is a Next.js server-rendered site, not a client-only SPA. Every page's HTML already contains its `<title>`, description, canonical, hreflang, Open Graph, Twitter tags and JSON-LD, so Google, WhatsApp and Facebook read them with no prerender or crawler middleware.
- **Freshness.** Pages are static and cached at the edge. Every admin save calls `/api/revalidate`, which checks your login and admin row, so the next visitor gets fresh HTML immediately. There is also a 5-minute safety refresh.
- **Live numbers.** On the home stats bar and `/ledger`, a Supabase Realtime subscription refetches the counters the moment an entry is saved, with no reload.
- **Images.** Press and ledger photos are resized in the browser:
  - main image: 1600px WebP
  - social card: 1200×630 JPEG
  - card thumbnail: 800px

  Ledger entries store the public thumbnail URL in `ledger_entries.photo_url`.
  The existing public `media` bucket allows visitors to view photos and limits
  uploads to admins; no additional bucket policy is required.

  All uploads go through `uploadImage()` in [`src/lib/storage.ts`](../src/lib/storage.ts). To move to Cloudflare R2, change only that function.

## 5. Test checklist

### Ledger + counters

- [ ] Open `/en` in one window and `/admin/ledger` in another (or on your phone).
- [ ] Add 3 entries:
  - 50 · *Monthly Grocery Kits* · Kasaragod
  - 120 · *Daily Food* · Cherkala
  - 30 · *Smile and Care* · Kanhangad
- [ ] With "Save & add another", place and program stay filled and the cursor jumps back to Quantity.
- [ ] Without reloading `/en`: **Kits given +50**, **Foods distributed +120**, Smile and Care changes neither. "Updated just now" shows. Days since started = today minus the earliest date.
- [ ] Open `/ml/ledger`: the numbers use Malayalam digits (൧൨൦). Entries appear grouped by month, with program chips and the monthly bar chart.
- [ ] Filter by program, place and month; "Load more" appears after 30 entries.
- [ ] Edit an entry: the counter changes. Delete one and confirm: the counter drops. Press **Undo**: it comes back.
- [ ] Admin → Dashboard: change a program's "Counts as" and the totals recalculate. Set a start date and the days count changes.

### Video gallery

- [ ] In `/admin/gallery`, paste 5 links, one per line, mixing formats: `watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, and a `watch?v=…&list=…` playlist item. Add one duplicate and one junk line.
- [ ] Check the preview: 5 marked "Ready" with thumbnails and auto-fetched titles, the duplicate flagged, the junk line flagged.
- [ ] Save, then on `/en/gallery`:
  - the video count shows
  - grid is 3 / 2 / 1 columns (desktop / tablet / phone)
  - the network tab shows **no YouTube iframe** until you click play
  - two videos can play at once
- [ ] Toggle Featured, and it appears in the large top row. Reorder (arrows, or drag on desktop) and the order matches. Unpublish and it disappears from the site.
- [ ] The home page shows the 3 latest videos.

### Press release + SEO

- [ ] In `/admin/press/new`, paste a title and body. Check:
  - the slug fills in automatically, with "✓ Available"
  - the Preview tab renders paragraphs, headings and links
  - the Google preview shows
- [ ] Add a photo and alt text, then **Publish**.
- [ ] `/en/press` lists the card. `/en/press/<slug>` shows the dateline, photo, body, share buttons and "More press releases".
- [ ] View the page source: `<title>`, `meta description`, `canonical`, `og:image` (1200×630), `og:type=article`, `article:published_time`, and `application/ld+json` with `NewsArticle`.
- [ ] Paste the URL into **https://search.google.com/test/rich-results**. Expect *Article* and *Breadcrumb*, valid.
- [ ] Paste the URL into **https://developers.facebook.com/tools/debug/**. Click "Scrape again", and the image and title appear. WhatsApp uses the same tags: send the link to yourself. WhatsApp caches previews, so test a brand-new URL.
- [ ] `/sitemap.xml` lists the release. `/robots.txt` has the `Sitemap:` line.

### General

- [ ] At 360px (phone), all admin buttons are easy to tap and there is no sideways scrolling.
- [ ] The keyboard alone works: Tab through the forms, Esc closes dialogs, focus stays inside open dialogs.
- [ ] `/admin` while logged out redirects to `/admin/login`. Log out works.
