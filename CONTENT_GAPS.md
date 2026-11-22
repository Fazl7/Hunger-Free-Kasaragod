# Content gaps

Everything the site needs from Live to Smile Foundation before launch. **Nothing below has been invented.** Wherever one of these is missing, the site hides the related UI in production and shows a dashed orange "Content gap" note in development (`npm run dev`) so you can see exactly where it goes.

★ = launch-blocking

| # | Item | Where it goes | Status |
|---|---|---|---|
| ★1 | Donation amounts for **1 Day / 10 Days / 1 Month** (cut off in the brochure) | `content/site.config.ts → donation.tiers[].amountINR` | Missing. Only the "Any amount" card shows |
| ★2 | Cost per meal and per grocery kit (powers "this provides about N meals") | `donation.costPerMealINR`, `donation.costPerKitINR` | Missing |
| ★3 | **Verified** registration certificates: NITI Aayog `KL/2023/0346346`, 12A `AACTL2843C25KC01`, 80G `AACTL2843C25KC02`, CSR-1 `CSR00104723` | `content/site.config.ts → registrations.verifiedOn` | Owner confirmed the IDs for public display; visible on the site |
| ★4 | 80G receipt format approved by a CA, plus PAN collection rules | Phase 4 donate flow | Official digital receipts are stated; CA/PAN handling still needs review |
| ★5 | Opening hours | `org.openingHours` | Address, phone, WhatsApp and email supplied and displayed; hours still need confirmation |
| ★6 | Original high-res photos and videos **with consent forms**; a 6–10 s hero video loop | `content/collections.ts → gallery`, `site.config.heroMedia` | Missing. Hero uses an illustration; gallery hidden |
| ★7 | Cumulative impact totals with a counting method: meals served, households reached, kg rescued, plus an "updated on" date | `impact.*` / Distribution Ledger | Daily operating scale is supplied (50 breakfasts + 80 lunches, six days a week); cumulative totals still come from verified ledger entries |
| ★8 | Consented photos for the founding story and founder/team | `collections.ts → storyChapters` | Story chapters, founding year (2022), and founder/team details are supplied; photos still need consent |
| ★9 | Malayalam translations reviewed by a native speaker | `content/messages/ml.json`, `content/programs.ts`, `content/faqs.ts` (all marked `needsNativeReview`) | Drafts written, **not reviewed** |
| ★10 | Donation payment method/account details and approved payment instructions | Donate page | The form opens a WhatsApp draft with the donor's name and amount; it does not collect payment. Confirm payment instructions before adding online payment |
| ★11 | Distribution ledger entries (date, place, program, quantity, unit) | `collections.ts → ledger` | Missing. Ledger section hidden |
| 12 | FCRA registration number and any approved foreign-contribution payment route | `registrations.fcra`, donation flow | Active FCRA registration/approval confirmed; no registration number supplied and foreign contributions remain disabled in the site |
| 13 | Press releases (PDF), annual reports, brand kit, brochure PDF | `collections.ts → documents` | Missing |
| 14 | Award details: exact event name ("Accelerate Action"?) and date; award photo | `award.eventName`, `award.date` | Partly known (brochure) |
| 15 | Beneficiary and volunteer stories **with consent** | `collections.ts → stories` | Missing |
| 16 | Minimum quantity for surplus-food pickup and a specific response-time commitment | FAQ "accept", `foodRescue.responseTime` | Accepted foods and the two-to-three-hour preparation window are supplied; no minimum quantity or response-time promise was provided |
| 17 | Funds breakdown (how each rupee is used) | `fundsBreakdown` | Missing |
| 18 | Volunteer roles | FAQ "volunteer", Volunteer page | Owner supplied and confirmed |
| 19 | Domain: confirm ownership of `ltsfoundation.in`; decide whether `hungerfreekasaragod.in`/`.org` should also be bought and redirected | `NEXT_PUBLIC_SITE_URL` | To confirm |
| 20 | Official logo files (SVG/PNG) | `src/components/layout/Logo.tsx`, `src/app/icon.svg` | A placeholder bowl-and-smile mark is used |
| 21 | Google Business Profile access; social account access | Phase 5 | Missing |
| 22 | Lawyer review of privacy, terms, refund and consent policies | Phase 4–6 | Not started |
| 23 | Program pages need 400+ unique words each (EN + ML): history, numbers, photos, FAQs | `content/programs.ts → body` | Only 1 short paragraph each (brochure facts only) |

## Brochure typos to fix in print
"Accelarate" → "Accelerate"; "Oldage" → "Old Age"; cut-off text in the "Daily Food" and "Food On Call" paragraphs.
