# Hunger Free Kasaragod

Website for **Hunger Free Kasaragod**, the food-relief initiative of Live to Smile Foundation (LTS Foundation), Kasaragod, Kerala. Bilingual (English and Malayalam), mobile-first, static-first.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000 (content-gap notes visible)
npm run check      # typecheck + lint + production build
npm run build && npm start
```

Requires Node 20+.

## Where things live

| Path | What |
|---|---|
| `content/site.config.ts` | **Every number, ID, contact, price and feature flag.** Start here. |
| `content/programs.ts` | The 9 programs (EN + ML) |
| `content/faqs.ts` | FAQ questions and answers |
| `content/collections.ts` | Ledger, gallery, stories, documents, "Our Story" chapters |
| `content/messages/{en,ml}.json` | All UI strings |
| `src/sections/` | Home page sections (S1–S18 in the spec) |
| `src/components/` | UI, layout, motion, media, SEO components |
| `src/lib/seo.ts`, `src/lib/schema.ts` | Metadata, hreflang and JSON-LD |
| `CONTENT_GAPS.md` | What's still needed from the foundation |
| `DECISIONS.md` | Why things are built the way they are |
| `docs/OWNER_GUIDE.md` | How to update the site |

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (default `https://www.ltsfoundation.in`) |
| `NEXT_PUBLIC_SHOW_CONTENT_GAPS` | `true` to show content-gap notes in a production build |

## Status

- **Phase 1 (Foundation)**: done
- **Phase 2 (Home)**: done (all sections; data-dependent sections stay hidden until real content arrives)
- Programs index and 9 program pages: done (copy needs expanding)
- Phases 3–6: other routes are noindex stubs for now
