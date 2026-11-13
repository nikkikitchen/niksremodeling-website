# November 13 continuation

This extends the restored website; it does not replace the customer site. Customer payments remain hard-disabled in the interface and server payment route.

## Projects

All 43 package categories were rendered and checked. The 31 remaining duplicated-photo groups now have four distinct photos each; Garage Custom also no longer repeats its Standard workbench. There are 101 newly downloaded licensed photos, hosted locally, with creator/source/license links on the cards. Existing approved photos are retained where relevant. [Photo provenance and hashes](project-package-photo-licenses-2026-11-13.json) distinguish downloaded licensed photos from pre-existing approved assets; CSS crops are disclosed. Photographs illustrate work types and do not promise that all pictured furnishings/features are included.

Tier names, starting-price/quote position, buttons and details use one shared layout. Existing direct package IDs remain compatible, including Accent Walls. Accessibility retains its established Premium label. Details are available on desktop, keyboard and touch. Custom remains individually quoted.

The [complete package snapshot](package-audit-2026-11-13.json) contains 172 cards: **37 preliminary starting prices, 92 scoped tiers requiring quotes, and 43 Custom tiers**. Existing itemized scopes, the approved labor discount, selling-price material references and fee policy were preserved. No additional complete starting price was supportable from the supplied records: broad work descriptions alone do not establish all quantities, current selected-product costs, consumables, labor hours, delivery/tax, trade work or site conditions. Existing preliminary estimates are not represented as approved final prices.

To resolve a quote-only tier, the owner must approve its minimum complete scope/quantities, selected materials/fixtures, labor hours, required trades and actual shipping/tax/fees. Structural, code-sensitive and Custom work requires individual review. The snapshot lists each tier's actual scope; no missing expense is silently treated as zero.

## Catalog and private workspace

Commit `e52cddd` adds the D1 schema/migrations, private administration, verified owner authentication, shared public catalog, stock/price validation, approved allowance checks and private project-expense/profit/purchasing dashboard. It seeds 121 existing products as drafts; costs and stock are not fabricated. Products have multiple placements pointing to one saved record. Subsequent product edits require no site deployment after the initial database/identity connection.

**Production activation remains pending.** No Cloudflare D1 binding/account credential or owner email was available. `/owner`, its scripts/styles and `/api/owner/*` deny anonymous requests. An unconfigured `/api/catalog` returns 503 and the working legacy shopping experience remains in place. The owner must connect D1 and Cloudflare Access, configure the owner allowlist, review drafts and verify costs/stock before activation. See [exact setup instructions](business-catalog-setup.md). Production owner login and database-backed edits cannot be claimed verified before that connection.

Internal supplier costs, markup, actual expenses and profits are served only through authenticated owner routes. Public responses use an explicit allowlist, and published material reference assets omit raw retail cost/source baselines. Missing expense inputs leave profit unconfirmed. The dashboard records purchasing requirements; it does not place orders.

## Verification

The existing complete unit suite was run after the catalog/dashboard change (195 passing), and again after the final photo/layout work (196 passing). The finished build passed all 21 browser tests, 113 calculator paths, Functions compilation and published-asset integrity verification. The photo/layout change adds photograph bytes/license regression coverage and all-43-category browser checks at desktop, tablet and phone sizes. Additional tests cover category propagation, one selling price across placements, unavailable/stale stock, forged customer allowances/prices, permissions/CSRF, concurrent update conflicts, exact supplier SKU stock refresh and private financial calculations. Browser owner-interface tests use intercepted fixtures; authentication tests use signed test assertions and SQLite-backed D1 adapters. They are not production owner-login evidence.

Checkout remains blocked regardless of configuration or cart terms. Tax, shipping, inventory and payment processing require separate verification and explicit owner authorization before a future payment-enabling change.
