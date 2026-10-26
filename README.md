# Nik's Remodeling Website

Production source for niksremodeling.com. Built around the approved Favorite homepage and category-page direction.


Daily supplier inventory is checked by `.github/workflows/daily-inventory.yml`. Confirmed U.S.-warehouse quantities are refreshed on product tiles on page load and every 15 minutes while visible. The daily audit writes `inventory-status.json`; after 30 consecutive days of confirmed zero U.S. stock, an item is archived from active category tiles. Supplier errors are not recorded as zero.
