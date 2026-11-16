# Installation & Labor supplied-materials audit — working findings

Status: **Partial audit, not production-approved.** Prepared in draft PR #20. Full project estimate/checkout behavior remains unchanged until the category-level bill-of-materials work in issue #19 is completed and tested.

## Owner rules

- Default offer: Nik's Remodeling installs the item and supplies its materials and job consumables where reasonably priceable.
- Show one concise total to customer rather than a tool/supply shopping list. Supply and material budgets remain internal.
- Customer opt-out: “I’ll supply my own materials” (unchecked by default); only the materials/fixture portion is removed, not necessary labor, overhead or incidental installation consumables.
- Labor baseline: $75/hour, minimum $150 visit; preserve owner-approved per-item/area charges.
- Material reference catalog already contains the approved 35% markup. **Never apply markup twice.**
- Do not include reusable tools (hammer, drill bits where no replacement needed, measuring tape, saw) as a fresh material charge for every project.
- Exact model, unknown substrate, new wiring/plumbing, gas connection, structural work or special fixtures can need measured or in-person pricing. Don't invent a complete payable amount.

## Verified differences

| Area | Current behavior | Required before calling it supplied-inclusive |
|---|---|---|
| Bathroom core installations | `app.js` has supplied fixture allowance overrides, and `installation.html` links to measured calculator. Draft PR displays fixture-included total first. | Confirm source/quantity/allowance against catalog and ensure same authoritative figure in cart/payment. Avoid fall-through to outdated base figures. |
| Appliances | Installation catalog mostly lists labor prices, often with appliances/connection materials extra. Some internal budgets are reserved for new dryer vent, water line or wiring. | Select actual appliance and compatible hoses, connectors or installation kit; avoid pricing entire appliances as part of an installation service unless specifically selected. |
| Cabinets and kitchens | Many fixed per-box/fixture/task labor rates, with no reliable cabinet, sink, faucet, hardware, countertop and connection material bundle for each. | Tie selections and measured cabinet quantity to stock/material cost, with default supplied bundle or a pending quote. |
| Carpentry, doors and windows | Labor lines include trim/casing and door installations; various materials are distinct. | BOM for stock lengths, fasteners, shims, sealant and exact door/window type. |
| Drywall and painting | Some approved internal consumable budgets and markup-included material reference prices exist, but many labor-only tasks are priced independently. | Compute sheet/area/paint coverage, waste, required primer/tape/compound and appropriate fractional consumables. |
| Flooring and tile | Flooring labor tiers exist; default floor coverings, grout/thinset and trim are not consistently bundled from measured area. | Measured quantity, waste, product selection and installation consumables; avoid duplicate underlayment/trim/grout. |
| Electrical and lighting | Basic replacement labor prices and selected internal wiring budgets; physical fixtures often separate. | Existing-vs-new connection, model/fixture selection, safe electrical scope and any required licensed work. |
| Exterior, structural, unusual/custom | Diverse tasks and unknown conditions. | Scoped measured project quote rather than fictitious fixed all-inclusive charge. |
| Diagnostic/adjustment/removal work | Often legitimately labor-only or flat service; no new fixture needed. | Treat ordinary consumables as included where appropriate; don't pad a nonexistent material price. |

## Specific code issues to resolve

1. `installation.html` `internalJobSupplyBudget()` returns zero for categories beyond appliances, electrical, drywall, paint, flooring and doors. These are **internal reserves**, not verified materials billings. It also skips removal and adjustment work, which is sometimes appropriate.
2. `installation.html` `renderReview()` displays **Priced labor** and passes catalog labor-only entries to cart. Simply changing the label would misrepresent the amount; finish BOM pricing first.
3. `project-calculator-options.js` initially selects `Materials` based on URL having `material` or `product`; confirm every direct labor-service path and edit path sets the supplied-material state consistently. Customer-own option is created in `calculator-steps.js` and carried in `customerProvidesMaterials`.
4. `app.js` still keeps pre-override dollar amounts for bathroom jobs alongside `BATHROOM_STARTER_ESTIMATES`. Effective amounts for simple options are $730 vanity installed (labor $300, material allowance $430), $305 faucet, $260 vanity light, $405 toilet and $1,500 entry smart toilet. Keep the effective prices consistent across link/calculator/cart and avoid separately billing internal supply reserves.
5. Supply and material catalogs are price references, not product stock confirmation or true checkout-ready freight/tax estimates.
6. Distinguish `start-at`/estimate from payment-certified charges; do not enable collection against unverified deposit/retail/shipping/tax totals.

## Verification for PR #20

- Changes only bathroom price display order, customer-own label, related regression tests, and this audit note.
- No approved rate, cart math, payment capability or live checkout changed in this first pass.
- Full implementation remains issue #19; preserve draft PR until checks and browser review pass.
