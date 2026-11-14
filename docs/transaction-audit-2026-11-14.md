# Transaction audit — November 14, 2026

**Not verified as a functioning payment business. No actual sandbox card payment,
live charge, or supplier order has been made by this work.** Local tests use mocked
external providers. The production merchant-location diagnostic is not a payment test.

## Feature findings

“Working?” means the complete requested customer feature is verified in production,
not merely that code exists or a mocked test passes.

| Feature | Working? | Problem | Fix / action |
| --- | --- | --- | --- |
| Shopping payments | No | Four live catalog probes failed before inventory/freight/tax. Only one variant at quantity one is payable; multi-item/greater quantity is incomplete. | Added persisted checkout attempts, stable retry identity, terms/email validation, explicit final-total/address confirmation; kept unsupported carts quote-only. |
| Square payment processing | No | No sandbox credentials or successful sandbox card transaction available. Old checkout had no persisted payment reconciliation. | Added sandbox host selection, exact Square amount/currency checks, signed webhook verification, processor re-fetch, retryable notifications and customer status reconciliation. |
| CJ shipping | No | Product lookup failed with CJ `1602002`, rate limiting `1600200`, or authentication errors; no actual shipping rate was reached. | Retained mandatory physical US inventory and verified freight; shared concurrent CJ authentication per API key and bounded requests. Confirmed free freight can remain zero; unknown freight cannot. Supplier account/product access still needs repair. |
| Sales tax | No | ZIP upper estimate returned 7% for 30117; exact address, shipping taxability and a payable Square order were not verified together. | Retained exact-address ZipTax verification, stopped any mismatched Square total, stored the verified destination and prevented replacing it at hosted checkout. |
| Remodeling package prices | No | Existing estimates are provisional; not all material costs/scopes are purchase-verified. Custom/unverified work requires quotes. Existing discount is 7% of labor, not a verified new rule of 7% off the entire project. | Preserved unknowns as quote-required. Build checks 32 priced package itemizations; calculator audit covers 113 paths. New owner approval validates item totals, material cost + 35%, deposit and tax/scope review before payment. |
| Remodeling deposits | No | No verified live approved-quote payment or sandbox settlement. Requires database migration, private owner access and notification configuration. | Implemented an independent approved-quote deposit/full-payment route, private customer link, immutable quote, one checkout per quote, customer/project/payment linkage and remaining balance. Never calls CJ checkout. |
| Scheduling | No | Original form only opened an unsent email draft. Production persistence and owner access are not verified. | Saves requests in D1, returns a reference, deduplicates retries and adds private owner review. Acceptance/decline is manual; operator must contact customer. No automated calendar reservation/email delivery. |
| Order confirmations | No | Original redirect was not linked to durable verified payment/receipt records. No actual receipt delivery has been observed. | Added status/receipt page backed by authoritative payment checks, persisted receipt URL, pending/review states and manual fulfillment hold. Redirects never mark orders paid. |

## Reproducible failures and their locations

1. **CJ product lookup (production):** `functions/api/store-quote.js:onRequestGet`
   → `cartSupplierRequests` → `commerce.js:cj/accessToken`. Send a read-only GET to
   `/api/store-quote?product=1963146233541074945&variant=1963146233666904066&zip=30117&address=315%20Bradley%20Street&city=Carrollton&state=GA`.
   Initial result: HTTP 503, stage `product lookup`, `Supplier unavailable (HTTP 200
   CJ code 1602002)`. Later probes returned authentication errors. No selected
   variant, inventory or shipping quote was confirmed. Corrective action: supplier
   account/product access must be restored; do not substitute cached stock/prices.
2. **Other actual catalog samples:** refrigerator `1997962863887962114`, drill
   `1956577654308847618`, light `2003346457261682690`. Same quote endpoint/address,
   without an invented variant. Refrigerator lookup returned HTTP 429/CJ `1600200`;
   drill and light returned `CJ authentication HTTP error`. Those requests failed
   *before* variant selection; missing variants were not claimed valid. After
   product access is repaired, fetch actual available variants with
   `/api/store-product?product=PRODUCT_ID` before the full quote test. Concurrent
   authentication requests now share a promise in each isolate; cross-isolate
   supplier limits and permissions remain an external blocker.
3. **Multiple retail items / quantities:** `app.js:initCartSecureCheckout` and
   `functions/api/store-checkout.js:onRequestPost`. Add two merchandise lines, or
   change quantity to two. Pay stays disabled; a direct quantity-two checkout is
   rejected. See `browser-tests/transactions.spec.mjs` for multi-item, quantity and
   mixed-cart cases. Corrective action still required: implement a fresh aggregate
   inventory/freight/tax/payment quote and order model; do not sum ZIP previews.
4. **Actual Square acceptance:** `commerce.js:square`, `transactions.js:createCheckout`
   and `/api/square-webhook`. No sandbox token/location/signature key is available in
   this workspace, and GitHub secret enumeration returns HTTP 403. No Cloudflare
   credential is present. Corrective action: account administrator sets isolated
   preview secrets/subscription and applies migration `0003_transactions.sql`, then
   runs actual sandbox card payments. Instructions: `docs/transactions-setup.md`.
5. **Approved deposits/full payment:** `/api/project-admin/quotes`,
   `/api/project-quote`, `/api/project-checkout`, `project-quotes.js:approvedQuote`.
   A starting estimate or arbitrary browser total cannot pay. Use an authenticated
   owner to approve itemization, receive a private quote link, then choose deposit
   or offered full payment. Missing setup returns 503. Unknown/revoked/expired
   quotes, wrong totals, duplicate modes and already-paid quotes are rejected.
   Local SQL/processor-mock tests cover these cases. Remote migration/access and
   actual sandbox settlement remain required.
6. **Scheduling delivery:** `app.js:initCartSchedulingRequest` →
   `/api/scheduling` → `scheduling_requests`; owner review at
   `/owner#transactions` via `/api/project-admin/scheduling`. Submit a measured
   package with contact details/preferred date. A successful response contains
   a saved reference and “not confirmed.” In missing-database/schema environments
   it fails visibly rather than opening an unsent email and claiming receipt.
   Corrective action: deploy migration, verify private owner access, and establish
   regular review/manual customer confirmation. Automated email/calendar support
   remains absent.
7. **Payment confirmations:** `transactions.js:recordPayment`, `/api/payment-status`
   and `payment.js`. Open `/payment.html#order=ORDER_UUID` before paying: it must
   remain unconfirmed. Signed notifications fetch the real Square payment and check
   status `COMPLETED`, order/reference, USD amount and location. Wrong amounts,
   refunded money or a second payment ID enter review. Every order stays on manual
   fulfillment hold. Cloned hosted-checkout orders resolve using authoritative
   Square `reference_id`. Actual hosted checkout/receipt behavior remains to be
   tested against Square, not inferred from mocks.
8. **Local Firefox execution:** installed Playwright Firefox fails to launch with
   “Could not find profile folder”; using a workspace temp directory also produced
   `browserContext.newPage: Target crashed`. No Firefox functionality pass is
   claimed from those attempts. The CI workflow now installs Firefox and its system
   dependencies and runs the same Firefox project on Ubuntu.

## Automated coverage and limitations

- Baseline: all 210 existing Node tests passed before changes.
- New tests use the real transaction SQL in SQLite and mocked provider APIs. They
  cover exact-value links, wrong totals/currency/location, pending vs paid, duplicate
  and concurrent retries, duplicate payment review, notification signature/retry,
  delayed status reconciliation, cloned Square order references, approved deposit/
  full payment, quote validation, scheduling persistence, owner JWT/CSRF restrictions,
  CJ authentication sharing and merchant/supplier failures.
- Browser tests exercise navigation, cart entry, terms/address/email, a server-quoted
  total, processor failure and refresh/retry identity; Accent Standard measurements,
  bathroom and kitchen measurements; labor-only and unsupported mixed/multiple carts;
  approved deposit/full-payment UI; saved scheduling acknowledgement; and pending vs
  completed payment display. Provider routes are mocked. The retail cart fixture is
  seeded because live product access fails; this is not a real catalog purchase.
- Existing package/navigation tests include all 43 rendered package groups and
  Basic/Standard/Deluxe/Custom controls. Custom and unverified work remain quote-only.
- Supplier stock is not reserved. Paid retail orders require fresh operator stock,
  destination, supplier freight and funds review before manual fulfillment.
- Abandoned project checkout can be resumed using its existing link/status; it does
  not create competing deposit/full links. Subsequent draws require a new approved
  quote. Automatic cancellation, refunds, disputes and email sending are not added.
- Square-hosted sandbox card completion, receipt delivery, processor rejection,
  real notification delivery/retry and actual supplier/tax responses still require
  an accessible configured preview environment. No mocked test is listed as an
  actual Square sandbox payment.

Final commit, CI, browser counts and deployment verification are recorded in the
handoff accompanying this audit. Do not label the business “ready to launch” based
on builds, diagnostic flags or mocked payments.
