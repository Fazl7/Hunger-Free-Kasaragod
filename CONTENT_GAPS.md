# Content gaps

Everything the site needs from Live to Smile Foundation before launch. **Nothing below has been invented.** Wherever one of these is missing, the site hides the related UI in production and shows a dashed orange "Content gap" note in development (`npm run dev`) so you can see exactly where it goes.

★ = launch-blocking

| # | Item | Where it goes | Status |
|---|---|---|---|
| ★1 | Donation amounts for **1 Day / 10 Days / 1 Month** (cut off in the brochure) | `content/site.config.ts → donation.tiers[].amountINR` | Missing. Only the "Any amount" card shows |
| ★2 | Cost per meal and per grocery kit (powers "this provides about N meals") | `donation.costPerMealINR`, `donation.costPerKitINR` | Missing |
| ★3 | **Verified** registration certificates: NITI Aayog `KL/2023/0346346`, 12A `AACTL2843C25KC01`, 80G `AACTL2843C25KC02`, CSR-1 `CSR00104723` | Check against originals, then set `registrations.verifiedOn` | IDs transcribed from a *photo of the brochure*. Hidden in production until verified |
| ★4 | 80G receipt format approved by a CA, plus PAN collection rules | Phase 4 donate flow | Missing |
| ★5 | Address, phone, WhatsApp, email, opening hours | `org.address`, `org.phone`, `org.whatsapp`, `org.email`, `org.openingHours` | Missing. Footer and contact schema are empty |
| ★6 | Original high-res photos and videos **with consent forms**; a 6–10 s hero video loop | `content/collections.ts → gallery`, `site.config.heroMedia` | Missing. Hero uses an illustration; gallery hidden |
| ★7 | Real impact numbers with a counting method: meals served, households reached, kg rescued, years active, plus an "updated on" date | `impact.*` | Missing. Only "100 kits / month" (brochure) is shown, plus "9 programs" and "3 towns" (counted from brochure) |
| ★8 | Founding story (why we started → first distribution → growth → today), founding year, founder/team details and photos | `collections.ts → storyChapters`, `org.foundingYear` | Missing. "Our Story" section hidden |
| ★9 | Malayalam translations reviewed by a native speaker | `content/messages/ml.json`, `content/programs.ts`, `content/faqs.ts` (all marked `needsNativeReview`) | Drafts written, **not reviewed** |
| ★10 | Razorpay account (KYC complete) and payment details | Phase 4 | Missing |
| ★11 | Distribution ledger entries (date, place, program, quantity, unit) | `collections.ts → ledger` | Missing. Ledger section hidden |
| 12 | FCRA status (affects foreign donations) | `registrations.fcra`, FAQ "foreign" | Unknown |
| 13 | Press releases (PDF), annual reports, brand kit, brochure PDF | `collections.ts → documents` | Missing |
| 14 | Award details: exact event name ("Accelerate Action"?) and date; award photo | `award.eventName`, `award.date` | Partly known (brochure) |
| 15 | Beneficiary and volunteer stories **with consent** | `collections.ts → stories` | Missing |
| 16 | What surplus food can be accepted (cooked/packed, timing, minimum quantity) and pickup response time | FAQ "accept", `foodRescue.responseTime` | Missing. FAQ hidden |
| 17 | Funds breakdown (how each rupee is used) | `fundsBreakdown` | Missing |
| 18 | Volunteer roles: confirm the list (packing, distribution, driving, photography, translation, tech) | FAQ "volunteer", Make an Impact card | Taken from the build spec; **please confirm** |
| 19 | Domain: confirm ownership of `ltsfoundation.in`; decide whether `hungerfreekasaragod.in`/`.org` should also be bought and redirected | `NEXT_PUBLIC_SITE_URL` | To confirm |
| 20 | Official logo files (SVG/PNG) | `src/components/layout/Logo.tsx`, `src/app/icon.svg` | A placeholder bowl-and-smile mark is used |
| 21 | Google Business Profile access; social account access | Phase 5 | Missing |
| 22 | Lawyer review of privacy, terms, refund and consent policies | Phase 4–6 | Not started |
| 23 | Program pages need 400+ unique words each (EN + ML): history, numbers, photos, FAQs | `content/programs.ts → body` | Only 1 short paragraph each (brochure facts only) |

## Brochure typos to fix in print
"Accelarate" → "Accelerate"; "Oldage" → "Old Age"; cut-off text in the "Daily Food" and "Food On Call" paragraphs.
