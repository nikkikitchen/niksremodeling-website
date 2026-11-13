# November 13, 2026 engineering and launch review

This review supersedes older launch checkpoint amounts where they disagree with the current itemized code. Online purchases remain disabled. This is an incomplete commercial/photo review, not approval to promote fixed-price projects.

## Fixed

- Reproduced five regression failures from main and confirmed the same failures in GitHub Actions job 131897970095. The static build itself succeeded. Updated obsolete expectations for removed invoice/deposit buttons and newly itemized provisional prices; retained cost breakdown, cart credit and payment lock assertions.
- Fixed repeated navigation initialization (multiple click listeners), removed Shopping/Installation hover activation including nested categories, retained click/keyboard operation and viewport positioning.
- Normalized visible package tiers without breaking legacy deep-link IDs.
- Moved the Pay-button update function into global scope so the Terms checkbox does not throw. Pay remains disabled regardless of agreement, credentials or browser state. Legacy Square controls cannot initialize.
- Removed the cart's hardcoded 8% tax fallback. Unknown tax remains unverified; totals explicitly exclude it and say tax pending. Provider ZIP previews remain estimates, never authorization to pay. A read-only live test returned a provider ZIP upper estimate of 7% for 30117; it does not establish destination/address tax treatment for remodeling services.
- Restored retail-cart address fields independently of disabled checkout controls. One order summary retains Terms and disabled Pay.
- Clean the build directory to prevent stale files surviving a release; version every local HTML JavaScript/CSS reference with the commit; verify actual output hashes, references and module paths.
- Added pinned Cloudflare Functions and Playwright tooling, Node 22 selection, Pages output configuration, and CI artifact/browser checks.

## Tested

- Static build and artifact verification: 56 published file hashes; 270 local HTML asset/link references; all published JavaScript syntax. Build integrity also checks 581 photo references and 240 source links.
- Full unit/integration suite: 183 passing, zero failures. Focused package/navigation/checkout-hold tests: 18 passing; final Accent price/scope check: 3 passing.
- Calculator audit: 113 work/material paths with zero failures; 33 HTML pages and cart/minimum-visit/carry-through checks.
- Nine real Chromium tests pass across 1440px desktop, 768px tablet and 390px phone. Test the exact built files: click/switch/outside/Escape/hover behavior, all 16 main categories, nested hubs, package labels, mobile details, measurement entry, additions site-review route, cart address, Terms lock, unknown tax, overflow and browser errors. External images and supplier APIs are mocked/blocked in these offline behavior tests.
- All 28 remote package-photo URLs returned image content in a separate HTTP audit using an identified audit User-Agent. This proves reachability from this environment at that time, not availability on every customer network.
- Real payments and supplier orders were never attempted.

## Pricing

Existing rules remain $75/hour where hourly labor applies, $150 minimum visit, already marked-up reference materials/supplies, 7% labor discount and 10% package fee with upward $5 rounding. No business policy was changed. Accent Deluxe’s historical $1,495 advertisement was withdrawn because no complete component baseline supports its premium-finish scope; supplier finish/setting materials, preparation/removal and task labor must be costed before restoring a numeric start.

Current provisional starts:

| Category | Basic | Standard | Deluxe/Premium |
| --- | ---: | ---: | ---: |
| Accent Walls | $585 | $835 | Component quote required |
| Bathroom | $875 | $1,325 | $1,990 |
| Kitchen | $1,285 | $3,880 | Site/product quote required |
| Accessibility Updates | $460 | $855 | Site/structural quote required |

Accent Standard's $835 includes $550 gross labor, $176.08 marked-up material allowances, $66.31 consumables, $38.50 labor discount and $79.24 minimum fees, rounded upward. This is the small 12-by-8-foot wall with 12 feet of chair rail and simple sponge-painted faux stone below, paint above. Detailed faux finishes and larger scopes require an adjusted quote. Provisional caulk/applicator allowances still need purchase confirmation.

See `package-audit-2026-11-13.json` for all 43 rendered category inventories, prices and included work. Provisional does not mean supplier-verified or approved final contract pricing. Unknown/structural packages remain quote required; no structural prices were invented.

## Photos

- Replaced Bedroom Basic because its different filename displayed the same photograph as Standard. The replacement is a distinct licensed residential bedroom photo.
- Replaced Accessibility Standard's ramp image with lever hardware matching its safety/hardware scope. Premium retains the straight-ramp image; Custom retains the accessible bathroom.
- Added source/creator/license records and visible credits for both local replacements and ten resolved remote Commons sources.
- Attic and Basement groups each have distinct relevant images; the existing approved images were preserved.
- NOT COMPLETE: 31 nested package groups repeat their category cover for Basic/Standard/Deluxe; the Garage Standard/Custom images also show the same scene. Generic Custom images, remaining source licenses, and image-to-scope progression need further visual curation. A filename-only uniqueness check cannot establish photo uniqueness or relevance. Metadata lookup was rate-limited after ten remote credits; existing credit links were preserved.

## Navigation

The 16 main project categories match the homepage and both menus. Browser tests cover all top-level destinations and nested hub link shapes. Existing integration tests cover all 40 additional package categories and measured/cart paths. This is not a claim that every nested link was manually clicked on every device.

## Deployment

Required repository build: `npm ci`, `npm run build`; Pages static output: `dist`. The committed `wrangler.jsonc` specifies that output and the existing `niksremodeling-website` project name. Pages also compiles the repository's `functions/` directory; `npm run build:functions` checks that separately. `npm run verify:dist` checks the transformed production files.

The original GitHub Cloudflare check confirms a failed deployment for b983700. The production release manifest initially reported e58b50cdde571f8cad3f69abcda965754a3fcc63. No Cloudflare account credentials or connector were available: dashboard build command, account environment bindings, complete Cloudflare build logs and any manual dashboard overrides cannot be independently inspected. GitHub Actions logs are available and show static build success followed by the five regression failures. Do not assume those logs establish the exact Cloudflare failure cause. Check the final handoff for the post-push live result.

## Missing inputs and remaining implementation

Owner inputs genuinely needed: approved fixture/material SKU purchase costs for provisional allowances; exact structural/site scope and compliant design for ramps/additions; confirmed tax treatment by transaction and jurisdiction; verification of destination tax and supplier freight configuration in the actual Pages project. Enter credentials only in Cloudflare secrets, never chat or source.

Engineering work still needed: remaining package component reconciliation (especially Accent Deluxe and uncosted tiers), photo curation and licensing, supplier-cost reservation/order records, delivered-cost allowance reconciliation with verified tax/freight, complete live stock/address verification, sandbox payment/fulfillment acceptance, and live deployment confirmation. Package allowance browsing still uses a disclosed 8% planning reserve; this is not a verified tax amount or proof that an item fits its delivered allowance. The cart keeps delivery/tax pending and purchases locked.

## Launch readiness

Not ready for unrestricted promotion as a fully priced remodeling store. Quote planning works on tested paths; estimates are provisional and require human scope/cost review. Automated firm quoting is not commercially verified. Checkout remains hard-locked on the server and disabled in the customer interface; enabling it requires separate owner authorization after the outstanding work and sandbox acceptance.

Implementation commit: `16780702be0ca5796ccb4b15c724d8e3a1f24590`. Production readiness endpoint reports purchases paused; processor ready and tax/supplier configured. Its configuration flags do not establish complete shipping/address/tax/fulfillment readiness.

## Deployment verification after the repair

Cloudflare’s GitHub check reported successful deployment of `fb0beb4b1792092ab0eca91e42d1f49afb9cfeed`. A fresh request to `https://niksremodeling.com/release.json` identified that exact commit; the served versioned app.js matched its manifest SHA-256. The final follow-up stacks long cart totals to avoid crowding on phones, visibly styles disabled Pay, spaces footer assurance labels, and aligns the Node engine declaration with jsdom’s actual supported versions. All nine browser tests pass with the added total-label geometry assertion. The final handoff identifies the latest verified deployed commit.
