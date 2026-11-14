# Transaction setup and remaining acceptance

This release adds server-side order recording, signed Square payment notifications,
private owner quote approval, approved-project deposit/full payment, saved scheduling
requests, and customer status/receipt pages. It does **not** establish that live
checkout is functional. See the transaction audit for exact verification results.

## Cloudflare setup

Use the existing GitHub → Cloudflare Pages project and `BUSINESS_DB` binding in
`wrangler.jsonc`. Do not create another database or copy production credentials into
browser scripts. The new migration is additive; existing catalog data is preserved.

An account administrator with Cloudflare access must run:

```
npx wrangler d1 migrations apply niks-business --remote
```

Apply the same migration to the preview database before sandbox tests. Use a separate
preview database and **sandbox** Square account credentials. Do not test transactions
on production using production tokens. Dashboard: Pages → existing project → Settings
→ Variables and Secrets; set each environment separately, then redeploy.

Server-only configuration:

| Setting | Purpose |
| --- | --- |
| `SQUARE_ENVIRONMENT` | `sandbox` in preview; `production` for live |
| `SQUARE_ACCESS_TOKEN` | Corresponding Square token; `TOKEN` is a legacy fallback |
| `SQUARE_LOCATION_ID` | Corresponding active USD card-processing location |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Signature key from that Square webhook subscription |
| `SQUARE_WEBHOOK_URL` | Exact public HTTPS notification URL, including `/api/square-webhook` |
| `CJ_API_KEY` or `CJ_ACCESS_TOKEN` | Supplier product/inventory/freight access |
| `ZIPTAX_API_KEY` | Exact destination-address retail sales tax and freight treatment |

Square Developer Dashboard → the matching environment → Webhooks → subscribe to
`payment.created` and `payment.updated`, using the exact webhook URL above. Square
notification retries must stay enabled. Never copy tokens or signature keys into
GitHub, audit reports, browser tools, or chat.

The existing private `/owner` dashboard also requires its established Cloudflare
Access policy and `OWNER_ACCESS_DOMAIN`, `OWNER_ACCESS_AUD`, and `OWNER_EMAILS`.
Protect `/owner*`, `/api/owner*`, and `/api/project-admin*` in Access. The API verifies
JWT issuer, audience, signature, expiry and allowed email even without an edge policy.

## Operator workflow

- At `/owner#transactions`, check scheduling requests regularly. Accept/decline with
  a note and contact the customer at their recorded phone/email. Saving a decision
  does not send email. Requests stay unconfirmed until reviewed. There is no automatic
  calendar reservation or outbound email integration in this release.
- Approve a project quote only after measurements, scope, material purchase costs,
  required supplies/removal, fees and applicable taxes have been checked. The form
  applies 35% markup to material costs. It retains the existing **7% labor** package
  discount; it does not silently change policy to 7% off the entire project.
- Choose an explicit deposit and whether to offer full payment, then send the private
  approved quote link to that customer. Quote URLs grant access: treat them as private.
- There is one payment attempt per immutable project quote. A deposit and full payment
  cannot be paid through competing links. Subsequent draws/balances need a new approved
  quote. Cancelling/replacing an issued pending Square link is currently a manual
  Square-dashboard operation; do not issue a competing quote while it can still pay.
- Review payment records and their authoritative Square receipt before fulfillment.
  **All supplier fulfillment remains manual and on hold. No CJ order API is called.**
  Use the stored verified delivery address; Square's billing address does not replace it.
- Review refunds, disputes, cancellations, late payments and duplicate-payment review
  states manually in Square. No refund, dispute or automatic fulfillment system is
  implemented here.

## Required acceptance before live payment availability

Run `npm ci`, `npm test`, `npm run build`, `npm run verify:dist`,
`npm run build:functions`, `npm run test:calculator`, and `npm run test:browser`.
Browser setup: `npx playwright install --with-deps chromium firefox`.

Unit tests exercise the real SQL schema in SQLite, with mocked external provider
responses. Browser transaction tests mock API responses. Neither is a Square sandbox
payment or proof of CJ/ZipTax business configuration.

Complete actual sandbox card payments for retail, approved deposits and approved full
payments. Verify stored paid status, receipt, duplicate retries, webhook delivery/retry,
remaining project balance, shipping destination and manual fulfillment hold. Reject
out-of-stock, invalid variants, unverified freight/tax, changed totals and mixed carts.

Retail is still limited to **one verified catalog variant, quantity one**. Multi-item
and quantity-greater-than-one checkout remain incomplete and require a quote. Do not
label Shopping fully functional until those transactions and real supplier/address
quotes work. Project estimates, custom and unverified scopes remain quote-only.

After a passing deployment, compare `/release.json` with the deployed Git commit and
repeat the key read-only and sandbox checks. Real-money test charges and real supplier
orders require separate explicit user authorization.
