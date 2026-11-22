# How to update the site

You only ever edit files in the `content/` folder. After saving, the developer (or the hosting platform) rebuilds the site.

> **Tip:** run `npm run dev` and open http://localhost:3000. Anything still missing shows up as a dashed orange **"Content gap"** box exactly where it will appear. Those boxes never appear on the live site.

## Change a number (meals served, households reached…)
Open `content/site.config.ts` → `impact`. Replace `null` with the number, and set `updatedOn` to today's date (`"2026-12-01"`). The counter appears on the home page automatically.

## Set donation amounts
`content/site.config.ts` → `donation.tiers` → set `amountINR` for each tier (for example `amountINR: 500`). Set `costPerMealINR` to show "Provides about N meals".

## Show the registration numbers (80G, 12A…)
1. Check every ID in `registrations` against the **original certificate**.
2. Set `verifiedOn: "YYYY-MM-DD"`.
The IDs then appear in the trust section, footer, top bar and search-engine data.

## Add a distribution to the ledger
`content/collections.ts` → `ledger`, add:
```ts
{ id: "2026-12-01-kasaragod", date: "2026-12-01", place: "kasaragod", program: "daily-food",
  quantity: 120, unit: "meals", verified: true },
```
`place` is typically `kasaragod`, `cherkala`, `kanhangad`, or `interiors`. `program` is a program slug.

## Add photos or videos
Put files in `public/images/` (`.webp`/`.avif`, descriptive names like `breakfast-distribution-kasaragod.webp`), then add to `gallery` in `content/collections.ts`. **Set `consent: true` only when you have written consent from everyone identifiable.** Items without consent are never shown.

## Add a press release or certificate
Put the PDF in `public/docs/` and add an entry to `documents` with `verified: true`.

## Edit text
- Buttons, headings, labels: `content/messages/en.json` and `content/messages/ml.json` (keep the keys, change the text).
- Program descriptions: `content/programs.ts`.
- FAQs: `content/faqs.ts`. Remove `needsConfirmation: true` once the answer is accurate.

## Switch features on/off
`content/site.config.ts` → `features`.
