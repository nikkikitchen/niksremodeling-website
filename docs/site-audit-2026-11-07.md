# Nik's Remodeling — source audit, November 7, 2026

## Scope and limitations
This is a repository/source-level audit, **not** a successful live Cloudflare deployment or full browser acceptance test. Cloudflare and the live site could not be inspected through the available browser/network access. Do not claim the changes are visible to customers until `release.json` and on-device behavior are checked.

## Changes made
- Repaired a previously damaged room-projects script and aligned project package cards under the same renderer. Bathroom, Kitchen and Accessibility preserve their existing package scope/prices and distinct approved photos.
- Removed redundant prompts such as “Choose a package below” and repeated desktop “See what's included” descriptions. Desktop uses photo hover; touch devices use one compact Package details control.
- Added Accent Walls to both static fallback menus, the shared dropdown, and homepage picture tiles, and made the top-level 16 choices alphabetical.
- Consolidated homepage project pictures to those same 16 top-level areas. Specialty categories remain reachable under More Ideas, Outdoor Projects, or Themed Rooms. Re-added Flooring, Tile & Stone, and Lighting & Electrical to More Ideas.
- Gave the Accent Wall Basic/Deluxe/Premium cards different relevant photos, retained approved starts ($395/$695/$1,495), kept consultations optional, and added provisional measurement scaling. Quotes are not payment requests.
- Fixed Accessibility package quantity-vs-room measurement routing after the renderer consolidation. Bathroom and Kitchen routes now identify their category by project ID.
- Updated package cart replacement logic to avoid duplicate rows when legacy Bathroom/Kitchen/Accessibility links are measured.
- Standardized the measured-project button to “Add to cart.”
- Added build-time guard checks for consistent homepage tiles and both dropdowns, plus package completeness. Updated affected automated test expectations for the unified designs.

## Source checks performed
- Inspected all **33 HTML pages** for direct local links, images and script references: **no missing local targets found**.
- Inspected **20 JavaScript files** (site scripts and several server functions) for locally referenced pages/assets: **no missing local targets found** among the examined literal references.
- Verified the 16 homepage picture links, fallback desktop navigation, fallback mobile navigation and shared dropdown all use identical ordered project IDs.
- Verified the edited main project JavaScript files pass a syntax parse. The modified test scripts passed syntax parsing after normalizing ESM imports. The ESM source using top-level await was not independently validated by this method.
- Verified the two itemized historic package baseline calculations reconcile: audited Attic Basic $1,760 and historic paint-only Accent Basic $350. The new Accent Basic (with chair rail) is advertised at $395 and is **provisional**, not a fully audited bill of materials.
- Checked sample Accent Basic estimates: 12 × 8 ft retains the $395 starting minimum; 20 × 10 ft produces a provisional $615 starting minimum. Final scope, trim material and site conditions must be confirmed.

## Still outstanding before declaring fully live/verified
1. Run the actual repository CI (`npm ci`, `npm test`, `npm run build`) and investigate any failing log. Source syntax checks alone cannot confirm successful tests.
2. Compare the live `https://niksremodeling.com/release.json` commit with the latest GitHub commit and verify Cloudflare's deployment. A failed build leaves the old live site intact; source changes are not proof of deployment.
3. Perform real phone and desktop clicks for the Projects menu, all 16 picture tiles, package details, measurements, add-to-cart and back links.
4. Finish fully costed labor/materials/supplies baselines for the other quote-only packages before advertising unverified starting prices.
5. End-to-end verify shipping, 8% interim tax, labor pay-later, and no online-payment behavior with live supplier/API responses.
6. Visually inspect every package photo for subject accuracy and repeats; filename/link checks are not sufficient to prove photo suitability. External photo URLs were not live-validated.

Customer-facing priority: **simple and uniform pages, no duplicate instructions or charges, clear starting prices only when responsibly supported, and no automatic consultations or online charges.**
