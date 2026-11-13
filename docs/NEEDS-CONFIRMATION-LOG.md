# Nik's Remodeling — Needs Confirmation Log

Last updated: 2026-11-13. Owner review queue for **missing or unverified price inputs first**, plus separate release tests.

## What belongs in this log (owner clarification)

**Primary purpose: missing or unverified NUMBERS**, not generic UI labels. For every item, record an actual cost or best available provisional estimate whenever reasonably possible, how it was calculated, and source/verification still needed. Use approved labor rates, supplier/material costs, 35% material markup and 7% package discount consistently. Do not write “Needs confirmation” in place of a calculable number.

Shipping: estimate by ZIP and item weights/combined supplier quotes where supported. Tax: calculate a clearly labeled ZIP-based estimate from the known taxable materials and supplies; final address-based tax may differ. Do not state shipping/tax are included in a package unless its price calculation really contains those costs. If a number cannot be responsibly calculated, clearly explain what input is missing and keep checkout blocked.

### Missing or unverified amounts to cost out first
| Price input | Estimate required | Current verification gap |
| --- | --- | --- |
| Garage Standard $1,920 | **Reconciled:** $388.37 materials + $19.58 supplies = $407.95 base deposit; $1,325.25 discounted labor + $186.80 fees = $1,920 total | Only actual tax, package delivery and final scope remain open |
| Bathroom package fixtures | Vanity faucet, vanity light, mirror, towel bar, paper holder, other fixture allowances | Current purchase costs and 35% markup |
| Kitchen packages | Standard light fixture and Kitchen Deluxe cabinets, countertops, installation labor, supplies | Supplier costs and quantities |
| Remaining packages | All priced scope components and starting prices for each package | Item-level labor/material/supplies audit |
| CJ supplier goods | Positive U.S. stock, item landed cost, combined ZIP shipping | Live fulfillment quote |
| Tax | ZIP preview rate and taxable material/supply base | Full-address verification before payment |

## Rules
- Keep online purchases paused until shipping, destination tax, payment flow, supplier fulfillment and end-to-end verification are complete.
- Never treat an estimated or missing price, shipping charge, tax rate, or material allowance as confirmed or collectible.
- Log each uncertainty here with the affected page/flow, what evidence is needed, and its status. Mark confirmed only after evidence and a corresponding test.
- Do not publish private tax credentials, supplier keys, customer addresses, or personal information here.

## Open items

| ID | Area | Needs confirmation / acceptance test | Status |
| --- | --- | --- | --- |
| NC-001 | Cloudflare deployment | Source version of updated cart was deployed and release manifest verified; future changes still require deployment checks. This does not prove D1 schema works. | Source deploy verified |
| NC-002 | D1 database | Confirm BUSINESS_DB binding points to `niks-business`; apply/verify required database migrations and test owner catalog queries. Configuration is committed; tables were not yet verified. | Pending |
| NC-003 | Garage Standard | $1,920 verified: $407.95 materials/supplies deposit basis + $1,325.25 discounted labor + $186.80 fees; desktop/tablet/phone cart tests passed. Shipping and tax remain NC-006/NC-008. | Arithmetic and display verified |
| NC-004 | All packages | Verify per-package starting prices, depositEstimate, laborEstimate, fees, measurement adjustments and the 7% discount reconcile across project cards, measurements, and cart without double counting. | Pending |
| NC-005 | Materials and supplies | Verify current costs/markups (35% target), correct units/quantities, supplies inclusion, package allowances and in-stock U.S. CJ inventory; do not substitute missing amounts. | Pending |
| NC-006 | Package delivery | Verify whether the materials/supplies portion of each package includes delivery; show an actual verified amount or “needs confirmation” instead of implying free shipping. ZIP-based quotes currently apply to separately priced supplier products. | Pending |
| NC-007 | Shipping estimates | Verify combined-CJ shipping to ZIP, multi-item carts, failures, refresh/requote after ZIP change, and final full-address reconciliation. | Pending |
| NC-008 | Sales tax | Verify taxable merchandise vs non-taxable installation labor by destination, ZIP preliminary estimate vs exact-address tax, shipping tax treatment, and that package materials are included once in taxable basis. | Pending |
| NC-009 | Cart display | Verify one clear ZIP input, legible due-at-approval estimate, labor/pay-later and full-project estimate, on phone and desktop, including mixed retail + packages, custom quotes and pending amounts. | Pending |
| NC-010 | Payment flow | Confirm “materials due now + labor weekly draws” and optional full-project payment after approval. Square/tax/shipping totals and server payment lock require end-to-end testing before any customer payment is enabled. | Pending |
| NC-011 | Product substitutions | Verify package-specific item allowances include tax/shipping, selected products fit their allowances, and expensive/unavailable items cannot bypass controls. | Pending |
| NC-012 | Package fixture costs | Confirm bathroom faucet, vanity light, mirror, accessories; kitchen standard light fixture; and Kitchen Deluxe cabinets, countertop, materials and labor. | Pending |
| NC-013 | Cart revisions | Run automated tests and verify live deploy of the 2026-11-13 ZIP-first and deposit-display update. No test or live acceptance pass has yet been recorded for that change. | Pending |

## Completed or checked (not launch approval)
- GitHub `wrangler.jsonc` config committed with D1 name, ID and `BUSINESS_DB` binding; actual deployment/binding remains NC-001/NC-002.
- Cart change committed to `app.js` to show package deposit and ZIP-first summary; still requires tests and review, NC-013.
- Customer online payments remain disabled in cart code pending full verification.

## Audit findings — package baseline coverage (2026-11-13)

Verified against `data/package-bundle-baselines.json`: only the following tiers currently have itemized reference baseline entries for the listed projects. Other displayed project tiers may use a different calculation path, but their itemized price basis has **not** been verified in this check. **Do not assume they are wrong or zero cost**; reconcile the actual project-card and cart math before approving.

- Garage: Basic and Standard have baseline entries; Deluxe and Custom need a separate reviewed price basis (Custom may remain quote-only).
- Basement, Laundry & Utility, Home Office, Kids' Room, Entry/Mudroom, Wallpaper, Patios/Concrete, Adult Room, Arches, Murals, Pet Room, Games & Hobbies, Mechanic Shop, and Music/Creative Studio: only Basic is present in this baseline file.
- Closets & Storage: Basic and Standard present; higher tiers, if sold, need independent review.
- Attic: only Standard present in this baseline file.
- Bedroom, Dining Room, and Living/Family Room: Basic, Standard and Deluxe present.

**Calculation risk found:** `app.js` package price/deposit and ZIP tax display still need a regression test for a **mixed cart with a package and retail merchandise**. The ZIP-based tax basis includes the package material estimate once; the deposited amount is displayed separately. This is not an end-to-end proof that all package supplies, delivery and fees are correctly allocated. Keep payment locked.

## Sign-off
A row is not finished until the result is verified and the resolution/date is recorded. Do not enable live checkout based solely on a successful source commit.

## Additional completed work (2026-11-13)
- The latest code-test/build workflow and full GitHub calculator/browser suite both passed on commit `3499ae8e` (run `43469780762`).
- Mixed package+retail carts now flag package freight separately from CJ freight. A verified CJ retail freight amount must not imply package lumber/paint delivery is paid.
- Package-only carts no longer show the confusing zero-dollar “Other priced items” summary line.
- New automated tests verify Garage Standard breakdown, all payment buttons disabled, package-only ZIP tax preview at a 7% mocked rate (material taxable basis $407.95 → illustrative tax $28.56), and desktop/tablet/phone presentation. The 7% example is a TEST rate, NOT a claim of the customer's real tax rate.
- Remaining *owner-facing* questions should be limited to truly needed product/scope and payment-policy approvals; current supplier/account validations remain engineering checks where access permits.

## Square integration diagnosis — November 13 follow-up
- Live `/api/integration-status` showed Square credentials **present**, but `locationPresent:false`. Live `/api/checkout-readiness?zip=30117` showed Square not ready, ZipTax ready, CJ configured, and checkout paused. This is evidence of a missing *production runtime location setting*, **not** evidence the user must recreate a Square account or API token.
- Updated the read-only checkout diagnostic to report distinct safe states: **credentials missing**, **location ID missing**, **location not verified**, or **ready**, without leaking any secret, token, merchant/location identifier, or raw error.
- Added tests for all four scenarios and for retaining `checkoutPaused:true` even if Square reports a valid card-processing location.
- **Later account check (only if still necessary):** review the EXISTING production Cloudflare Pages environment setting and Square merchant location, do not set up a new Square application. No payment may be enabled automatically.
