# Material, supply and package price audit — 2026-11-09

## Rules locked for quoting
- Materials use the higher **comparable** Home Depot/Lowe's retail unit price available for the same specification, with 35% markup **once**. If an already marked-up approved reference price exceeds a researched candidate, retain the higher approved reference; do not multiply it again.
- Match thickness, grade, package size, coverage and unit before comparing. No interchangeable price assumptions for structural/exterior products.
- The 51 recorded approved supply figures are **already marked up** and remain unchanged. Treat reusable tools as shop equipment, **not** automatic customer consumables; charge only job-specific quantities of tape, liners, sleeves, adhesives, etc.
- Labor: $75/hr; $150 minimum visit; package tiers use 7% labor-only discount, plus the current 10% fee allowance on applicable bounded provisional tiers. Taxes and shipping separately estimated; no second markup on the reference catalog.
- Never advertise a quote-required tier as a firm, guaranteed fixed-price package.

## Catalog coverage confirmed in current main branch
- `material-price-reference.json`: 70 named material reference items; entries 1–52 are primarily owner approved, 53–70 researched allowances; prices already include markup.
- `data/approved-supply-prices.json`: 51 approved supply/tool prices, all already including markup.
- `data/package-bundle-baselines.json`: itemized provisional package examples; `docs/package-launch-checkpoint-2026-11-09.md` describes 27 newly costed tiers across 19 general categories.
- `material-prices.js` is generated from JSON by the build; edit JSON, not only generated code, when changing a material reference.

## Current supplier spot checks (research only; not localized checkout prices)
| Comparable retail item | Retail evidence | Retail | After 35% markup | Approved reference | Decision |
|---|---|---:|---:|---:|---|
| 2×4×96 in framing stud, Home Depot Premium Cut, model 1011139502 | https://www.homedepot.com/b/Lumber-Composites-Dimensional-Lumber-Framing-Studs/8-ft/N-5yc1vZc562Z1z1rkql | $4.48 | $6.05 | $5.60 (standard stud) | **Flag for specification matching**; premium-cut stud is not automatically the standard stud SKU |
| Quikrete 60-lb concrete mix, Home Depot model 110160 | https://www.homedepot.com/b/Building-Materials-Concrete-Cement-Masonry-Concrete/N-5yc1vZcdpt | $4.85 | $6.55 | $7.76 | Retain higher approved $7.76 |
| GAF Royal Sovereign 3-tab shingles, 33.33 sq ft/bundle, Home Depot | https://www.homedepot.com/b/Building-Materials-Roofing-Roof-Shingles/3-Tab-Shingle/N-5yc1vZc5rbZ1z1a0hn | $38.97 | $52.61 | $52.65 | Retain higher approved $52.65 |

These spot checks confirm *some* approved safeguards, **not** a completed two-store comparison for all 70 items. Supplier pages can change by ZIP/store; the current research did not reliably provide comparable Lowe's prices. Do not claim that the highest store price for every item has been checked.

## Next highest-value pricing gaps to resolve before promotion
1. **Bathroom Basic/Standard/Deluxe ($995/$2,195/$3,195 historical starting at)**: reconcile paint coverage, fixture and accessory counts, trim, ceiling one-coat policy, supplies, disposal and labor; keep them marked preliminary until itemized.
2. **Kitchen Basic/Standard/Deluxe ($1,995/$6,495/$17,995 historical)**: establish realistic cabinet, flooring and backsplash quantities and fixtures for a larger baseline kitchen, without quietly adding optional upgrades to lower tiers.
3. **Accent Walls Basic/Standard/Deluxe ($395/$695/$1,495 historical)**: check chair rail, two-color wall paint and prep against the $395 base tier; charge for needed primer, caulk, fasteners and consumables; check shiplap coverage for higher tiers.
4. **Premium Accessibility ($3,915 historical)**: fully quantity the <=12-ft straight ramp framing, decking, footings, handrails, edge protection, anchors, fasteners, delivery and labor; never convert the current number into a firm fixed quote without access and code review.
5. Continue the remaining standard/deluxe packages only after each has a bounded, complete bill of quantities and proper labor rates, rather than inventing a number.

## Acceptance tests for the pricing change cycle
- Test material reference JSON and generated `material-prices.js` stay identical after builds.
- Confirm priced tier yields the same displayed starting price and correct labor/material/supply cart splits.
- Confirm only labor gets the 7% package discount, materials get exactly one 35% markup, and fee allowance is not silently removed.
- Confirm estimated tax, shipping and pay-later labor are independently labeled.
- Verify live Cloudflare build and mobile/desktop calculator before considering any changed price released.

**Status:** research spot-check completed and repository coverage recorded; no live price/catalog value changed by this audit. Do not claim the whole catalog has been externally verified.
