# Nik's Remodeling — Whole-site quote/cart audit and consolidated fix list
**Audit date:** 2026-11-13  
**Status:** Source-level inventory and CI investigation completed; live/Cloudflare deployment, fresh automated green suite and end-to-end payment/shipping validation remain open. **Not a release sign-off.**

## Owner requirements
1. Simple, short and consistent customer path: project → measurement/work selections → quote/cart → one ZIP field → readable amount breakdown.
2. Packages include labor, materials, ordinary job-specific consumables and fees. Prices must be grounded in item quantities and approved labor, with **7% labor-only package discount**, approved **35% already-included material/supply markup**, and no double count.
3. Explicit **estimated materials deposit due at approval**; include applicable estimated tax and shipping whenever calculable, mark provisional if necessary; show project total and deferred balance.
4. **No fixed weekly draw amounts**. Subsequent labor payments depend on completion/approved performance milestones.
5. Allow full-project prepayment as an option **only after secure checkout is approved**. Never enable customer payment during this audit.
6. Keep a log of genuine missing or uncertain numeric inputs and owner decisions, not a list of UI labels.

## Audit sources and checks
- Reviewed GitHub `main` repository file tree: **355 files**, including the site, 43-category package inventory, project/cost calculators, material references, 51 approved supply price entries, cart, tax/shipping/payment API functions, and tests.
- Cross-checked `docs/package-audit-2026-11-13.json`: **43 categories, 172 tier cards, 37 priced and 135 currently quote-based**. This does **not** mean 135 must have fixed prices: 43 Custom entries and structural/scope-unknown jobs may properly remain quote-only; audit the others individually.
- Cross-checked `data/package-bundle-baselines.json`: **28 itemized research-provisional baseline tiers**; material and supply item references resolve. Prices are not evidence of live supplier pricing.
- Investigated latest GitHub Action `43457287591`, job `131994648709`: install, static build, published asset integrity and Cloudflare Functions compilation passed; unit-test step failed with **six tests**, so calculator/browser steps were **skipped**. Earlier, separate 2026-11-13 review reported 183 passing tests, 113 calculator paths and nine browser cases on older source, which is **not** proof for current changes.
- Inspected `app.js` cart summary and ZIP tax/shipping events, `room-projects.js` baseline/deposit/measurement logic, `functions/api/cart-tax.js`, `functions/api/cart-shipping.js`, and `functions/api/checkout-readiness.js`.
- No real Square payment, CJ supplier order, full-address jurisdiction tax, live inventory checkout, or Cloudflare current-release acceptance was attempted.

## Verified arithmetic example — Garage Standard
Baseline: `data/package-bundle-baselines.json`, Garage → Standard.
| Component | Amount |
| --- | ---: |
| Gross labor, before package discount | $1,425.00 |
| Labor discount (7% × $1,425) | −$99.75 |
| **Net labor** | **$1,325.25** |
| Marked-up materials (already marked up; do not add 35% again) | $388.37 |
| Job-specific material consumables | $19.58 |
| **Materials + supplies deposit basis (before taxes/freight)** | **$407.95** |
| Fees including upward $5 round-off | $186.80 |
| **Package starting total** | **$1,920.00** |

Checks: $1,325.25 + $407.95 + $186.80 = $1,920.00. Materials and labor are not to be charged again. Additional products, changed measurements, freight, tax and other approved changes may alter the final quote. The **$407.95 is not a tax-inclusive or delivery-inclusive collectible charge** without a verified destination/order basis. Subsequent draws are performance-based, not a predetermined weekly installment.

## Consolidated findings and fix queue (do not make piecemeal fixes until reviewed)
| Priority | ID | Area | Finding / required fix | Numeric/owner verification |
| --- | --- | --- | --- | --- |
| BLOCKER | A01 | CI/deployment | Latest GitHub build has six failing tests. Fix underlying UI/behavior where needed, update obsolete assertions only after confirming intended policy, then require all tests/browser checks green; verify actual deployed release. | Six failures: package labels, cart summary labels, two upfront-materials test cases, Accent Basic cart due-now and mixed package+retail total |
| BLOCKER | A02 | Package deposit | Cart now shows package materials deposit but can show dollar amounts without verified shipping/tax. For every quote, explicitly separate estimate vs payable charge; never silently treat unknown amounts as $0 or “included.” | Garage Standard base deposit $407.95; full amount depends on tax/delivery |
| BLOCKER | A03 | ZIP tax and shipping | ZIP is enough for preview, not guaranteed exact amount. Retail combined CJ freight is quoted per line; package baseline materials are **not** automatically linked to CJ freight or an itemized shipping estimate. Calculate defensible amounts where data permits; otherwise identify missing shipment and confirm before invoice/payment. | Verify freight included-in-package policy; shipping fee markup; destination taxable base |
| BLOCKER | A04 | Tax allocation | `app.js` tax preview uses `payableSubtotal + packageDepositEstimates` as taxable goods and adds an estimated shipping amount. Confirm each materials/consumable taxable category and shipping taxability by destination; ensure no labor taxed unless applicable. | Provider ZIP rate is provisional; exact address needed at invoice |
| BLOCKER | A05 | Total arithmetic | Audit package-only, retail-only, labor-only, old legacy carts, multiple quantity and mixed package + retail carts. Tests currently fail; current top-line “other priced items” and package total can be misleading. Verify initial/rendered totals and ZIP-change/requote events, fractions/rounding, credits and failed calls. | Regression tests with expected cents for each scenario |
| BLOCKER | A06 | Payment lock | Keep front-end Pay disabled and server hard-locked until shipping/tax/processor/full-cart fulfillment tests and owner approval. | `checkout-readiness.js`: checkoutPaused true, checkoutReadyForVerification false |
| HIGH | A07 | Draw wording | Remove any implication of fixed weekly amounts or automatic weekly schedule; label labor balance “pay later, according to approved work completed” and allow owner to set draws tied to milestones. | Owner-approved deposit/work schedule wording |
| HIGH | A08 | Package coverage | 43 categories/172 tiles but only 37 priced tiers. Classify 135 quote-based tiers by whether genuinely custom/structural or a repeatable bounded scope that can be costed. Avoid arbitrary numbers; publish estimates after itemization. | Quantity/labor/material basis for each bounded tier |
| HIGH | A09 | Reference cost coverage | 28 provisional itemized baselines have valid IDs but they are not a universal coverage of all 172 tiers; verify current quote logic for every priced card, and source quality for fixture allowances. | Fixture/cabinet/countertop/lighting/trim and disposal cost gaps |
| HIGH | A10 | Customer-supplied materials / allowances | Do not include/charge shop supplies twice when customer supplies materials; prevent high-priced variants exceeding package net landed allowance and out-of-stock CJ variants being purchased. | Item-by-item SKU, freight, tax, inventory and credits |
| HIGH | A11 | Measurements and visit minimum | Full calculator paths: feet/inches, room walls/ceilings, multiple spaces, decks without ceiling, odd shapes, fractional/zero dimensions, removal/haul-off, prep, $150 minimum and $75/hr; validate recalculation after selections. | Existing earlier 113 calculator paths are not a current-build re-run |
| HIGH | A12 | Customer UI | ZIP-first, short single summary; avoid repeat address/code inputs and duplicated package/labor charges; ensure mobile and desktop parity. Later secure checkout may collect street/city/state after preview. | Exact UI acceptance not yet done on deployed current version |
| HIGH | A13 | Release/D1 | D1 Wrangler config committed but actual Cloudflare binding, schema migrations and deployment not verified. Grey Cloudflare dashboard reported unknown errors. | Confirm latest Cloudflare release, `BUSINESS_DB`, schema and owner queries |
| MEDIUM | A14 | Website polish | Audit links/dropdowns/mobile navigation, pictures relevant to each tier, descriptions, “starting at” labels, duplicate instructions and phone-number privacy. Prior report flags 31 repeated-image nested package groups and Garage Standard/Custom image duplication. | Per-photo licenses and owner review where needed |
| MEDIUM | A15 | Service area/fees | Confirm travel covered in labor within the authorized GA/AL service area, 10% package fees included once, hauling/removal included in stated packages and no unpriced scope silently added. | Verify each package scope and service-area rules |
| MEDIUM | A16 | Price freshness | Reference materials contain approved/researched marked-up costs and 51 supplies, but every SKU/store comparison has not been validated. No markup should be applied twice. | Research/verify current comparable costs for priority missing SKUs |

## Pricing verification queue to review with owner
- Bathroom Basic/Standard/Deluxe: faucet, vanity light, mirror, grab/towel/paper accessories, paint/prep, disposal, labor and quantities. Prior fixed-price examples were replaced with lower bounded preliminary scopes; confirm they match promises.
- Kitchen Basic/Standard: light allowance; cabinets, hardware, sink/faucet, backsplash and actual room dimensions. Kitchen Deluxe requires a defensible cabinet/countertop/scope cost basis.
- Accessibility Premium: compliant straight ramp up to 12 ft including rails/footings/supports/anchors and site/code requirements; do not give a structural guaranteed price from a rough example.
- Garage Standard: $1,920 reconciles; $407.95 is estimated materials deposit before tax/delivery, $1,325.25 net labor and $186.80 included fees; verify delivered costs, scope and final payment timing.
- Accent Walls Deluxe and all additional bounded, repeatable tiers without an itemized start; all Custom/major structural scope may remain individually quoted.

## Next release gate
1. Reproduce all six new CI failures; distinguish outdated labels/tests from real arithmetic bugs. Fix code and tests together.
2. Test cent-exact totals and deposit + tax + freight in each cart mix, with failed/changed ZIP and allowances; ensure no duplicate tax or shipping.
3. Audit each priced tier's card → measured scope → cart deposit/total; then expand costing to feasible remaining tiers.
4. Run all unit, calculator, Cloudflare Functions, build integrity and browser/mobile checks on the same commit; inspect live release manifest.
5. Verify external shipping/tax data and owner review of payment/draw language, then consider controlled sandbox tests. **Do not enable payments automatically.**

Owner review list stays open until actual dollar values are researched, calculated and verified. A source-code audit is not a live transaction verification.

## Remediation progress — November 13, 2026

**Code fixes completed on GitHub `main` (not a release sign-off):**
- Six source/test regressions originally failed, involving package labels, deposit visibility and package/retail math. Updated tests to assert the approved behavior: a **proposed materials deposit must be shown without making payment possible**, and the unconfirmed package labor is not a collectible charge.
- Simplified cart to **ZIP first** for preliminary shipping and destination tax, while deferring the complete street address until final transaction verification.
- Displayed the package material/supply deposit basis, net labor, fees and **estimated balance after deposit**, explicitly payable by progress of approved completed work. Removed fixed “weekly draws” language in both cart and terms.
- Added a clear “deposit itemization pending” warning if a package has missing deposit components instead of presenting an unexplained zero as complete.
- Added cent-exact Garage Standard arithmetic and cart/deposit protection tests.
- Researched the bathroom faucet, light, mirror, accessories, kitchen light, basic kitchen cabinet and laminate counter components; see `docs/FIXTURE-PRICE-RESEARCH-2026-11-13.md`. **No unverified package price was silently lowered or released as guaranteed.**
- `Verify website build` GitHub Actions succeeded on intermediate commits after the initial six failures; confirm the final commit and full browser/calculator workflow again before public acceptance.

**Still engineering-owned (do not ask owner to troubleshoot):** complete package/card/quote math, cost remaining repeatable tiers, tax+shipping allocation, CJ landed-allowance tests, mobile browser checks, deployment verification, menu/image/wording cleanup, and safe payment flow acceptance.

### Small owner decision list — only after engineering checks
1. Confirm exact fixture/material/cabinet/countertop specifications and whether the researched conservative allowances are acceptable; do not need to research prices manually.
2. Approve what scope qualifies for a standard bounded package versus custom/structural site quote (especially ramps and Kitchen Deluxe).
3. Confirm destination sales-tax and shipping-inclusion business policy with appropriate professional/accountant where necessary; do not assert delivery included without costed evidence.
4. When technically ready, approve the written materials-deposit and performance milestone schedule, and separately authorize any future payment enablement.

Items requiring a supplier/account portal or actual address/processor transaction cannot be independently completed from source access. Do not activate online purchases as a workaround.

## Verified engineering acceptance — GitHub commit `2fbfe63`
- **PASS:** GitHub Actions "Verify website build" on the source commit, including JavaScript validation, asset integrity, and static output.
- **PASS:** GitHub Actions "Verify Nik's Remodeling site build" run `43461269618`, including Node unit/integration tests, the calculator audit, Cloudflare Pages Functions compilation, and Playwright browser checks on desktop, tablet, and phone.
- Browser tests were updated for the owner's ZIP-first estimate policy. Full street address is deferred to approved final checkout.
- **NOT YET VERIFIED IN PRODUCTION:** A read-only live `release.json` fetch after these changes still returned the older deployed commit `0e5646b`. GitHub Cloudflare Pages check for newer source remained in progress at last check; the first D1 configuration commit `08d21b1` previously had a Cloudflare Pages build failure (details require authenticated Cloudflare logs). Do **not** infer Cloudflare deployment from GitHub CI success.
- **Checkout remains held:** live readiness response reported `checkoutPaused:true`, `checkoutReadyForVerification:false`, processor `needs setup`, tax configured and supplier configured. These observations do not authorize payment.

**Implementation review result:** Current tested source fixes the identified regressions and improves package deposit transparency, but supplier-delivered prices, taxability, unpriced scope tiers, Cloudflare live publishing and checkout activation remain unresolved. No customer payment accepted or initiated by this audit.

## Production deployment confirmation — follow-up

- GitHub Cloudflare Pages check for commit `79e4b3f045b8a9db343c5db6ac777319410cadf7`: **success**.
- Read-only fetch of `https://niksremodeling.com/release.json` reported the same commit. **Latest audited cart and wording version deployed successfully.** This closes the earlier *site publish* blocker; it does **not** prove the D1 database tables/binding work or any checkout transaction is safe.
- Same live site's `/api/checkout-readiness?zip=30117` reported `checkoutPaused:true`, `checkoutReadyForVerification:false`, `salesTax:ready`, `supplier:configured`, `paymentProcessor:needs setup`.
- Keep remaining owner questions on exact fixture scopes, missing bounded tier pricing, package freight/tax treatment, D1 migrations and Square setup. No purchase has been attempted.

## Further audit repair — mixed project + supplier freight
- Audited a cart containing both a project package and independently priced CJ shopping items. CJ freight only verifies the separate supplier SKU lines; it does **not** automatically include package lumber/paint/supplies.
- Updated `app.js` to keep `remainingShippingPending` true for all project packages and to label a mixed-cart shipping quote as **retail-only, package delivery pending**. An estimated supplier freight total must not imply that every package delivery cost is covered.
- Added a regression case to `tests/garage-deposit-reconciliation.test.mjs` for Garage Standard ($1,920, $407.95 materials deposit) combined with a $100 retail item. The test checks a $507.95 subtotal awaiting taxes, $2,020 combined starting total, package-delivery warning, pending state, and payment lock.
- **Still outstanding:** obtain actual package-material freight basis or explicitly cost/approve an included-delivery allowance per package. ZIP-only estimates for separately purchasable CJ products cannot substitute for that step. Keep online checkout paused.
