# Nik's Remodeling — Sitewide Uniformity & Readiness Audit
**Audit date:** November 17, 2026  
**Baseline:** `main` at `7ac2fb6f`; review branch `audit/sitewide-material-entrypoint-units-20261117`  
**Purpose:** One consistent customer and owner flow across Projects, Shopping, Materials, Supplies, Installation & Labor, and Review Cart. No false readiness or misleading material quantities.

## Verified as working in the audited build
- Both GitHub Actions workflows passed on main at `7ac2fb6f`: site build and desktop/tablet/phone browser suite, including Firefox. Browser suites use mocked APIs; success **does not verify real payment, external inventory or email delivery**.
- Live `/release.json` reported commit `7ac2fb6f3b3ec225533522f255251b73172988f0`.
- Live navigation pages for Drywall, Lumber, Supplies, Contact, Cart and Installation served.
- Shopping → Materials → Drywall → Calculate Materials uses the common `/calculators.html` with preselected item and two steps, Measurements → Estimate; no duplicate location/work selection.
- Material reference catalog contains 70 priced references, marked up **once**; supplies reference contains 51 entries. These are reference allowances, **not** a complete supplier-backed local building-products marketplace.
- The 4×8, 1/2-inch standard drywall reference price is $21.94 per sheet (materials markup already embedded). Nonstandard sizes/specifications require a separate verified reference.

## High-priority findings
1. **Incorrect calculator units from some material tiles** — Material category selection was previously treated as permission to run that category's dimensional formula for every material type. Example: Drywall → Joint Compound and Tape & Corner Bead could calculate "drywall sheets" instead of pails/rolls. Similarly, some lumber items could be reported as studs. Fix in PR #31: route dimensional board products to the correct existing calculator, other stock items to the same engine's simple quantity/unit input; add checks for all 11 materials categories. Verify no misleading default pricing for specialty items.
2. **Installation defaults conflict with owner's current direction** — Live Installation page says "Other listed rates are labor only unless noted" and many service rows say "Labor only"; owner asked Nik's supplied materials to be default, with customer-supplied materials as an explicit opt-out. The change is NOT fully live; draft PR #23 exists and requires cross-cart/material-cost review. Do not assert installation pricing includes materials until it actually does.
3. **Checkout not fully launched** — Read-only `/api/checkout-readiness?zip=30117` returned `checkoutReadyForVerification:false`, `configurationReadyForTesting:false`. Payment processor/records reported ready; Square webhook notification setup and owner access are not ready, and real payment receipt/sandbox acceptance are not confirmed. Single-verified-retail-item paths may be special-cased but this is not blanket online checkout readiness; maintain hard block for unverified transactions.
4. **Retail materials catalog is incomplete** — At inspection the actual Drywall and Lumber product lists had no approved retailer SKU inventory; the 70-item material reference guide is separate. User-requested Home Depot/Lowe's-like lengths, thicknesses, ground-contact grades and local retailer stock/price research are not complete. Do not present CJ items or fallback prices as actual Lowe's/Home Depot stock.
5. **Project price coverage is incomplete** — Snapshot `docs/package-audit-2026-11-13.json` listed 43 categories/172 tier options, 37 starting prices and 135 quote-only; historical baseline, not proof counts remain unchanged. Project pricing audit PR #22 is still draft. 35% markup only covers materials; measured direct labor cost, job expenses, delivery, waste, overhead and true contribution need verification. Avoid double 7% package discounts.
6. **Contact and estimate sending are limited** — Browser-friendly Contact page is live with copyable email and webmail links. Actual email delivery was not independently verified. Printable local planning list/cart estimate exists; automatic branded estimate delivery or Square native estimate creation is not yet verified.

## Test and release rules
- Node unit/site tests and calculator audit must pass on the release branch.
- Browser suites must pass Firefox, desktop Chromium, tablet and phone. APIs in these tests are mocked: treat payment, CJ stock, destination tax and shipping as separate real-world acceptance.
- Material-category regression test must check all 11 material menus point to `calculators.html?mode=materials`, and known stock items never produce sheet/stud counts erroneously. Never silently substitute standard drywall board pricing for moisture/fire-rated or 4×12 board.
- The site must keep `payment` disabled for unverified tax, stock, delivery and processor status. No real customer charge as a test of the audit.
- Confirm live `/release.json` equals merged main SHA, not merely a green PR workflow.
- Retest an owner-quality walkthrough: project package → measurements → cart → print estimate, Shopping → Materials (drywall/lumber/compound/trim) → material takeoff → cart, Installation → labor/material choices → cart, and public Contact links.

## Immediate follow-ups not covered by PR #31
- Resolve Installation & Labor supplied-material-default draft PRs (#20 and #23) without overcharging supplies or duplicating cart items.
- Audit every package against current vendor material bill and covered maximum square footage, including the owner's 15% takeoff default where appropriate, with cost margin/fee floors and labor time.
- Expand and maintain retailer-verified local catalog variants, with one SKU/treatment/size/coverage and stock source per choice.
- Verify Square webhook and owner access setup; run strictly controlled payment tests before permitting widespread purchases.
- Confirm email receive/delivery, complete customer-estimate sending flow, and public owner-approved marketing readiness.

**Release assessment:** Current front-end navigation/build is serviceable, but full commercial launch, margin protection and integrated catalog/checkout are **not yet verified**. This audit is an issue inventory and CI-gated improvement, not a claim of complete end-to-end test coverage.
