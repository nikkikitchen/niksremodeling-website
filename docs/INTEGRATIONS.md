# CJdropshipping and Square — connection preparation (Oct 17, 2026)

This branch adds **server-side-only** Cloudflare Pages Functions. It does not change the existing website design, cart, or payment flow and does not enable checkout.

## Routes

- `GET /api/integration-status` reports whether the relevant Cloudflare *variable names* are present. It does not validate credentials and never returns secrets.
- `GET /api/cj-products?keyword=faucet` securely queries CJdropshipping's supported `listV2` API. Only public catalog fields are returned, no supplier costs or credentials. This is an integration test feed, **not** a live purchasable catalog.

## Cloudflare Pages secrets (production and preview)

- `CJ_API_KEY` (preferred, CJdropshipping API key) **or** `CJ_ACCESS_TOKEN` (existing valid CJ access token).
- `SQUARE_ACCESS_TOKEN` (preferred) **or** `TOKEN` (previously requested shorthand, supported for compatibility).
- `SQUARE_LOCATION_ID` (Square location selected for checkout; not yet verified).

These values must be set as encrypted secrets in the **correct live website Cloudflare Pages project**. Never paste them into GitHub or the site's JavaScript. Re-deploy after changing secrets.

## Still required before selling

1. Verify the secrets are configured in the actual Cloudflare Pages project and CJ search succeeds.
2. Curate products for the site's existing shopping categories and select variants/SKUs.
3. Obtain CJ shipping cost to the specific buyer address and calculate the final **(product cost + shipping) × 1.35** price on the server. Do not accept checkout totals sent by a browser.
4. Implement Square-hosted checkout using `POST /v2/online-checkout/payment-links` with a server-validated order and location.
5. Confirm payment by Square webhook/status check, then create or release a CJ fulfillment order. Do not fulfill before payment confirmation; test with Square sandbox first.

Official documentation:
- https://developers.cjdropshipping.com/en/api/api2/api/auth.html
- https://developers.cjdropshipping.com/en/api/api2/api/product.html
- https://developer.squareup.com/docs/checkout-api
- https://developers.cloudflare.com/pages/functions/get-started/
- https://developers.cloudflare.com/pages/functions/bindings/
