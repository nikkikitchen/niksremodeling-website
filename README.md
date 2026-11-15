# Nik's Remodeling Website

Production source for niksremodeling.com. Built around the approved Favorite homepage and category-page direction.


Daily supplier inventory is checked by `.github/workflows/daily-inventory.yml`. Confirmed U.S.-warehouse quantities are refreshed on product tiles on page load and every 15 minutes while visible. The daily audit writes `inventory-status.json`; after 30 consecutive days of confirmed zero U.S. stock, an item is archived from active category tiles. Supplier errors are not recorded as zero.

## First-response troubleshooting rule (owner directive, 2026-11-15)

When the public website appears unchanged, broken, or checkout does not work, **inspect the deployment/build first**, before changing UI code or asking the owner to repeatedly refresh the site. Check Cloudflare Pages latest deployment status and its full build log, GitHub commit SHA, `npm test`, `npm run build`, and release artifacts. Distinguish failed tests from failed compilation and failed deployment. If tests refer to retired UI copy, update the tests to validate the currently approved customer experience while preserving checkout safety; do not restore unwanted wording merely to pass tests. Fix the actual failing gate, rerun the relevant checks, verify production deployment and only then ask for a customer-facing check. Do not claim a GitHub commit is a successful production release. Minimize user troubleshooting steps and never request that the owner manually read thousands of log lines.
