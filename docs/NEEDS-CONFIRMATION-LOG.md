# Nik's Remodeling — Needs Confirmation Log

Last updated: 2026-11-13. Owner review queue for **missing or unverified price inputs first**, plus separate release tests.

## What belongs in this log (owner clarification)

**Primary purpose: missing or unverified NUMBERS**, not generic UI labels. For every item, record an actual cost or best available provisional estimate whenever reasonably possible, how it was calculated, and source/verification still needed. Use approved labor rates, supplier/material costs, 35% material markup and 7% package discount consistently. Do not write “Needs confirmation” in place of a calculable number.

Shipping: estimate by ZIP and item weights/combined supplier quotes where supported. Tax: calculate a clearly labeled ZIP-based estimate from the known taxable materials and supplies; final address-based tax may differ. Do not state shipping/tax are included in a package unless its price calculation really contains those costs. If a number cannot be responsibly calculated, clearly explain what input is missing and keep checkout blocked.

### Missing or unverified amounts to cost out first
| Price input | Estimate required | Current verification gap |
| --- | --- | --- |
| Garage Standard $1,920 | Materials and supplies subtotal; labor after discount; fees; materials deposit; estimated tax and delivery | Confirm actual itemized basis and price shown in cart |
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
| NC-001 | Cloudflare deployment | Confirm the latest GitHub commits, including D1 binding and cart ZIP/deposit changes, deploy successfully; Cloudflare dashboard returned an unknown error during review. | Pending |
| NC-002 | D1 database | Confirm BUSINESS_DB binding points to `niks-business`; apply/verify required database migrations and test owner catalog queries. Configuration is committed; tables were not yet verified. | Pending |
| NC-003 | Garage Standard | Reproduce the $1,920 package quote, verify itemized materials, supplies, discounted labor and fees add up; verify displayed materials deposit and total. | Pending |
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

## Sign-off
A row is not finished until the result is verified and the resolution/date is recorded. Do not enable live checkout based solely on a successful source commit.
