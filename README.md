# Nik's Remodeling Website

Production source for niksremodeling.com. Built around the approved Favorite homepage and category-page direction.

## Approved sources

- Homepage: `cf89fa0` (September 16, 2026), "Align homepage with approved Favorite Home Page".
- Branding direction: `9ad1084`, "Use the exact approved NR logo artwork sitewide".
- The PNG embedded in that branding commit was truncated (2,162 bytes, invalid IDAT CRC). `assets/nr-logo.png` restores the intact 175 × 201 original (2,168 bytes) from the owner's `Niks Remodeling/images/logo.png`; SHA-256: `16934363dc48a6166b5cb140b75e954c686b2855c7b3c8465bbb1b9759b19ddf`.
- The September 20 restoration completes the missing styles for the approved homepage's project steps, product categories, tile descriptions and assurance strip. It also fixes the Inspiration anchor and keeps the cart accessible on mobile.

## Verify and build

Use Node.js 20 or newer; no third-party packages are required.

```sh
npm test
npm run build
```

Publish `dist/`, which contains only the public site files plus `release.json` with the source commit and SHA-256 of every deployed file. Preview it with a static HTTP server at the domain root. HTML references versioned CSS/JavaScript, and Cloudflare Pages `_headers` requests revalidation.

## Cloudflare Pages production settings

- Git repository: `nikkikitchen/niksremodeling-website`
- Production branch: `main`
- Framework preset: None
- Root directory: repository root
- Build command: `npm test && npm run build`
- Build output directory: `dist`

These are the intended settings, not proof that the hosting account is connected. After a push, verify the Cloudflare deployment succeeds for the new commit, then compare `/release.json` and the homepage on both the assigned Pages URL and `https://niksremodeling.com/`. Check the custom-domain association if the Pages URL updates but the live domain does not.

On September 20 inspection, the live domain returned the older "Home Remodeling Made Simple" site with `cf-cache-status: DYNAMIC`, while this repository contained the approved "Everything You Need to Build a Space You Love" homepage. The latest existing commit had no reported deployment status. Earlier GitHub Pages automation was intentionally removed in `31a31aa`; pushing a commit alone must not be treated as proof of production deployment.

## Existing functionality limits

This is a static project-planning site. The cart saves locally and the material calculator estimates quantities. Catalog search, category filters and sorting remain placeholders; supplier inventory, payment processing, and online checkout are not connected. Current prices and availability require confirmation with Nik's Remodeling. The restoration does not add a commerce backend.
