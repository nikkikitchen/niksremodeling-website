# Customer layout and request-storage repair

This update addresses visible customer problems found by inspecting real desktop and
390px phone screenshots, rather than treating button presence as usable design.

- The home-page headline was dark over a busy photograph. It now has white text,
  a dark overlay, and direct project, installation and shopping actions.
- The phone home page showed 16 large project pictures in one column. Its project
  choices now use a compact two-column layout, retaining the existing photographs.
- Phone cart descriptions were squeezed between a symbol and the price. Prices now
  sit below readable descriptions. Quote fields have stacked labels and touch-sized
  inputs, and summary rows no longer have distracting nested borders.
- Unapproved service/project carts no longer present an unusable Pay/receipt-email
  section. A visible quote-request action explains the approved-quote payment step.
  Actual approved quote links still offer the approved deposit/full payment.
- Duplicate project subtotal/deposit rows and the double `+ + tax pending` label
  were removed from the visible summary. Unknown components in older saved carts
  are labeled pending rather than silently priced at zero. Missing measurements
  no longer display as zero feet or zero square feet.

## Record storage without a manual dashboard migration

The existing server-side `BUSINESS_DB` binding is sufficient to initialize the
application's fixed record tables. The new `transaction-schema.js` helper executes
only the versioned additive `CREATE TABLE/INDEX IF NOT EXISTS` statements. It does
not modify existing catalog data, accept arbitrary SQL, grant owner permissions,
configure payment providers, or make supplier/payment API calls.

Public request handling initializes missing record tables before saving a valid
request. The release can initialize them explicitly using the narrowly scoped
`POST /api/initialize-records` endpoint with `{ "initializeRecords": true }` and a
same-origin header. Read-only readiness diagnostics do not initialize tables.
The versioned migration remains safe to run later through the ordinary D1 workflow.

An actual local Cloudflare worker with a fresh local D1 database was tested:
record initialization changed diagnostics from uninitialized to ready, a scheduling
request returned a saved reference, a retry returned the same reference, anonymous
owner access remained 401, and payment without notification configuration remained
503. Native SQLite tests also verify existing catalog rows survive initialization.

## Supplier findings

Live supplier search succeeded for a current nightstand product. Product detail
returned selected variants and confirmed physical U.S. warehouse units; the delivery
endpoint returned a real supplier freight quote for one such variant. This establishes
that supplier credentials are not universally broken. Older catalog entries still
fail at product lookup; their identifiers/availability need further repair.
No new product is represented as purchased or fulfilled by these read-only checks.

## Limits

Local unit/browser tests and live provider reads are not successful Square sandbox
payments. Square sandbox credentials, payment-notification setup, actual settlement,
receipt delivery and hosted-link lifecycle still require verification. Owner review
needs authenticated access. Saved scheduling requests remain unconfirmed until the
owner accepts them. No automatic calendar reservations or outbound email sending
were introduced. No live charges or supplier orders were created.

See `transactions-setup.md` for current configuration guidance. The original
transaction audit predates automatic record initialization; its manual-database
blocker is superseded by this update. The final handoff records production verification.
