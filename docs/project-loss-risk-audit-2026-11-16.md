# Nik's Remodeling — project pricing / loss-exposure audit
**Review:** 2026-11-16. **Source:** main branch of `nikkikitchen/niksremodeling-website`; `room-projects.js`, `project-options.js`, `data/package-bundle-baselines.json`, `docs/package-audit-2026-11-13.json`, `material-price-reference.json`, `data/approved-supply-prices.json`.

## Verified scope and numeric check

- 43 project categories, **172 advertised package options** in the 2026-11-13 snapshot.
- **37 have a numeric starting price**; **135 require a project or custom quote** (not a zero-dollar price).
- **27** provisional room tiers and **5** itemized Bathroom/Kitchen tiers were checked against the same component formula in code; all 32 reconcile exactly with their published starting prices.
- The remaining **5 priced tiers** — Accent Walls Basic/Standard, Accessibility Basic/Standard, Attic Basic — were inspected against their individual costed definitions and displayed starting figures. Their basic formula values also reconcile.
- **This is an arithmetic and scope audit, NOT evidence of a positive cash profit.** A $75 billed labor hour is not the worker's fully loaded wage cost, and materials references are not verified purchase invoices. No reliable actual job durations, vendor freight, disposal bills, merchant fees, callbacks, warranty reserves, or overhead allocations are present for every package.

## Calculation currently used

`starting price = round up to $5 (materials already marked up 35% + listed consumables + 93% of gross labor rates + 10% of gross labor/materials/consumables)`. Gross labor uses the user's $75/hour benchmark or approved fixed-rate line items; 7% package discount is applied only to labor. The 10% fee is a pricing allowance, not necessarily a 10% business profit margin.

**Sensitivity:** When hourly labor is valued internally at the same $75/hour as the pre-discount sales rate, a $75 labor hour contributes only **$77.25** after 7% discount and 10% fee applied to gross labor — **$2.25 before any other overhead**. In real jobs margin depends on actual labor burden, markup margin on purchased products, scope, and fee coverage. Never assume profit simply because the formula passes.

## Risks to resolve before treating all 37 prices as commercially safe

| Risk | Affected examples | Required action |
|---|---|---|
| Unverified actual labor cost and time | **All** priced packages; particularly kitchen cabinet painting, custom paint, attic work | Record owner/subcontractor true hourly cost and scope hours, rework and travel time; compare against the 7% discounted labor plus package fee |
| Supplier cost and stock not guaranteed | Bathroom faucet/light/mirror/accessories; kitchen light and faucet; grab bars | Check delivered unit cost, quantity, actual supplier SKU and applicable tax; don't let a provisional allowance imply an in-stock fixture |
| Possible quantity/waste omission | **Kitchen Standard 25 sq ft backsplash:** material list has exactly 25 sq ft tile, with no added cut/waste; bedroom LVP includes 10% waste, demonstrating expected practice elsewhere | Add appropriate tile waste (and adjust grout, mortar, backer/waterproofing if required), or hold final price for approved material takeoff |
| Prep / finishes / job duration | Kitchen Standard exterior painting of up to 8 boxes / 12 doors / 6 drawer fronts; bathroom painting; surface coatings | Confirm prep method and actual crew hours, primer needs, dry/cure time, second trips and finish products. Unexpected substrate work requires a change order |
| Structural work | Attic decking, accessibility ramp, decks/exterior projects | Verify site bearing/safe load, framing/ventilation clearances, supports/permits, and any licensed trade requirements; keep complex scope quote-only |
| Tax, processing, freight, delivery | All projects with purchases | Validate actual destination tax treatment and shipping; include processing, haul-off, procurement, payment/refund charges where relevant. A deposit can cover initial purchases but is not guaranteed profit |
| Scope creep, underestimated removal | Bathroom Deluxe removal of fixtures, Kitchen Standard and other package scopes | Explicitly limit standard haul-off to listed items and quote additional demolition, disposal, hidden damage or connection changes separately |
| Price precision vs pricing visibility | 135 quote-required tiers | Keep these nonpayable at an invented `$0` or a placeholder; no job accepted below a checked internal cost floor |

## Five lower-priced categories to watch closely

- Accessibility Basic **$460** and Standard **$855**: published included grab bars, limited ramp repair hours and deck boards; check repair limits and structural backing before confirmation.
- Accent Walls Basic **$585** and Standard **$835**: package prices include measured trim, two paint colors, primer and preparation; any more elaborate molding/faux effect requires an upgraded quote.
- Attic Basic **$1,735**: valid only for sound suitably raised existing framing; scope includes plywood decking and existing-connection light; no structural reinforcement, new wiring or insulation alterations.

## Required future acceptance gate

Before describing any price as a **guaranteed sale amount**, require:
1. Exact approved work scope, measurements and applicable permit/inspection needs.
2. Measured material takeoff including reasonable waste, verified installed-compatible supplies and actual delivered cost; apply a 35% markup **once**.
3. Expected labor hours × fully loaded worker cost, compared with the approved customer labor rate. Preserve $75/hr customer benchmark and $150 visit minimum unless owner approves changing them.
4. Travel, disposal, merchant fees, insurance/vehicle/general overhead, return trips, and contingency.
5. Explicit minimum desired gross margin (owner decision) and documented override if a job is accepted below it.
6. Exclude unsupported, uncertain, or structural/custom scopes from automatic payment at fixed totals.

No existing customer price is being secretly increased here. The owner must provide **actual hourly labor burden** and the desired minimum margin before a true no-loss threshold can be certified. Prices may be profitable under actual owner costs; this audit does not establish that.
