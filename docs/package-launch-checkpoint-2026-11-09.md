# Nik’s Remodeling — Package Launch Checkpoint

**As of November 9, 2026.** This is a launch-readiness checklist, not an authorization to accept fixed-price work.

## What is now in the site

- General project categories use Basic, Standard, Deluxe, and Custom cards, with quote-required labels where component costs are not known. Accent Walls now shows Basic, Standard, Deluxe, Custom (its legacy internal deluxe/premium IDs remain to preserve existing deep links); Accessibility shows Basic, Standard, Premium, Custom.
- 27 costed **provisional** package tiers in 19 generic project categories are backed by saved, bounded labor/material/supply lines. Itemized Attic Basic now starts at **$1,735** using the 7% labor discount. Its storage-load and electrical assumptions still require on-site verification.
- Historical special-category advertised starts remain Bathroom Basic/Standard/Deluxe **$995/$2,195/$3,195**, Kitchen **$1,995/$6,495/$17,995**, Accent Walls **$585/$695/$1,495** (Basic re-costed November 9; other two historical), and Premium Accessibility **$3,915** (ramp scope not fully re-costed).
- Basic and Standard Accessibility Safety now have separately itemized bounded scopes, and are not the same tier.
- No current starting estimate is an invoice: all measured packages are saved to the Review Cart as a **quote request** (price is null), not a payment request.
- Pricing uses the $75/hour labor assumption, a 7% **labor** discount on costed provisional tiers and the older itemized Attic Basic scope, a 10% fee allowance on their gross component cost, and **already marked-up** materials (35% markup not applied twice). Actual shipping and tax remain separate and require confirmation.
- The separate internal approved-supply catalog is no longer accidentally used for painters tape/sandpaper.

## Newly calculated provisional starting-price schedule

The 'Materials & supplies' column summarizes supplied physical inputs; 'Labor gross' shows labor **before** the 7% discount. The starting figure also includes fees and is rounded up to the nearest $5.

| Project category | Tier | Starting at | Materials & supplies | Labor gross |
|---|---|---:|---:|---:|
| Adult Room | Basic | $1,465 | $275 | $1,125 |
| Arches & Columns | Basic | $870 | $154 | $675 |
| Attic | Standard | $2,690 | $616 | $1,950 |
| Basement | Basic | $1,610 | $337 | $1,200 |
| Bedroom | Basic | $1,335 | $300 | $975 |
| Bedroom | Standard | $2,605 | $861 | $1,605 |
| Bedroom | Deluxe | $3,300 | $979 | $2,155 |
| Closets & Storage | Basic | $685 | $130 | $525 |
| Closets & Storage | Standard | $1,160 | $208 | $900 |
| Dining Room | Basic | $1,335 | $300 | $975 |
| Dining Room | Standard | $1,660 | $381 | $1,200 |
| Dining Room | Deluxe | $2,925 | $943 | $1,830 |
| Entryway & Mudroom | Basic | $1,255 | $226 | $975 |
| Games & Hobbies | Basic | $1,885 | $446 | $1,350 |
| Garage | Basic | $1,005 | $208 | $750 |
| Garage | Standard | $1,920 | $408 | $1,425 |
| Home Office | Basic | $1,540 | $275 | $1,200 |
| Kids’ Room | Basic | $1,540 | $275 | $1,200 |
| Laundry & Utility | Basic | $1,405 | $245 | $1,100 |
| Living & Family Room | Basic | $1,635 | $360 | $1,200 |
| Living & Family Room | Standard | $2,020 | $430 | $1,500 |
| Living & Family Room | Deluxe | $3,985 | $1,304 | $2,475 |
| Mechanic Shop | Basic | $1,340 | $302 | $975 |
| Murals | Basic | $850 | $207 | $600 |
| Music & Creative Studio | Basic | $1,690 | $385 | $1,225 |
| Patios & Concrete | Basic | $585 | $106 | $450 |
| Pet Room | Basic | $1,345 | $308 | $975 |

All provisional scopes assume the exact sizes, quantities, surface conditions, and existing compatible electrical/plumbing connections specified in `data/package-bundle-baselines.json`. Any larger space or changed conditions must be quoted after measuring. Retail-reference prices are allowances, not live supplier stock promises.

## What's still quote-required, and why

Many Standard/Deluxe tiers and special projects remain **quote required**, including custom cabinetry, unsupported or structural ramps, large outdoor decks and railings, gas appliances/fireplaces, remodel additions, specialty acoustic floors, pergolas, and complex utilities. Do not invent a price for missing fixtures, structural components, compliance requirements, or installation labor.

Wallpaper Basic is drafted but deliberately **not advertised at a numeric price** until the wallcovering and adhesive selection is included or clearly customer-supplied and approved. Full package calculations for legacy Bathroom, Kitchen, Accent Walls Standard/Deluxe, and Premium Accessibility need component-level reconciliation. Accent Walls Basic was re-costed to **$585** for up to 12×8 ft with 16 ft chair rail, two paint colors, primer, paintable caulk allowance and consumables; its price is still provisional until product selection and final dimensions are approved. Accent Walls now explicitly marks its historical prices as preliminary estimates rather than final quotes; numeric amounts remain unchanged.

## Remaining launch-gate checks

1. **Commercial approvals (owner):** Confirm bounded scope/hour estimates and the 7% discount policy for legacy Bathroom/Kitchen/Accessibility packages. Recheck Premium Accessibility's 12-ft straight ramp, support and handrail costs.
2. **Presentation and photos:** Visually review photos on every four-card page; generic tiers currently reuse their category cover image, even though the mobile/desktop menu and image-URL checks pass. Check all touch detail controls, label consistency and back links on real devices.
3. **End-to-end acceptance:** On both phone and desktop, choose a priced tier, enter sizes, save to Review Cart, verify fees, estimated tax, materials due now, labor pay later, and send a test quote request; confirm quote email/delivery. Do not enable actual payment until tax licenses and shipping/tax handling are confirmed.

**Status:** The November 9 tier-label and discount changes have regression tests committed, but the newest run results must still be verified. Earlier code/CI verification has been passing on priced releases. The page-level render is live and can be inspected, but the comprehensive human visual and end-to-end acceptance is incomplete. Do not describe the whole website as launch-ready based solely on code tests.
