# Managed catalog and private business workspace

The existing site remains the customer website. The new catalog uses Cloudflare D1 through Pages Functions; the owner workspace is `/owner`. Neither the HTML nor its JavaScript/CSS is a public static asset. Every owner request requires a verified Cloudflare Access RS256 assertion and an explicit owner email allowlist. Missing identity, database or configuration fails closed. No browser or environment flag can enable customer payments.

## One-time production connection

Cloudflare account access is required for this step. No Cloudflare credential or D1 binding was available in the coding environment, so production provisioning cannot be performed from this session.

1. Create a D1 database (for example, `wrangler d1 create niks-business`). Add its actual database ID to `wrangler.jsonc` under `d1_databases` with binding `BUSINESS_DB`, database name and `migrations_dir: "migrations"`. Never use the local development config for remote commands.
2. Apply both committed migrations to that production binding: `wrangler d1 migrations apply BUSINESS_DB --remote`. They create tables and import 121 existing products as drafts, with unknown supplier costs and unverified inventory. Existing records are not overwritten by the seed migration.
3. Create a Cloudflare Access self-hosted application covering **both** `/owner` (including all descendants) and `/api/owner/*` on niksremodeling.com. Allow only the business owner's approved identity and require MFA through the identity provider. Both paths must use the same application audience. Exclude these paths from any public cache rules.
4. Set server-only Pages variables/secrets `OWNER_ACCESS_DOMAIN` (the team's `*.cloudflareaccess.com` domain), `OWNER_ACCESS_AUD` (application audience), and `OWNER_EMAILS` (explicit comma-separated owner email allowlist). Do not paste credentials into chat or commit their values. The site does not accept an unverified email header as authentication.
5. Redeploy once to apply the D1 binding and Access configuration. Sign in at `/owner`. Check the imported drafts, supplier product IDs, exact SKUs, costs, photographs and product placements. Use **Refresh saved CJ SKU cost & US stock** to verify an exact variant through the existing server-only CJ connection, or document a manual stock check. Verification expires after 24 hours.
6. After the catalog records and placements have been reviewed, set server-side `BUSINESS_CATALOG_ACTIVE=true`. This switches managed listings on. Each subsequent product/category/stock edit is a database write and requires **no website deployment**. Existing standalone supplier detail links remain supported, but when activated their product data and availability come from the managed database.
7. Confirm unauthenticated `/owner`, `/owner/app.js`, `/owner/style.css` and all `/api/owner/*` operations return 401; verify a signed-in non-owner is refused. Check the public API response contains no supplier costs, SKUs, markup fields, verification evidence or project expense/profit records. Keep payments disabled.

The initial activation is intentionally separate from binding creation: importing metadata is not evidence of a safe supplier cost or available product. Without activation, the existing verified supplier shopping experience continues.

## Product workflow

The form edits description, pictures, supplier, exact product/SKU, supplier unit cost, markup, stock, warehouse, shipping requirements, installation selling allowance and any number of placements. Selling prices are calculated on the server once from supplier cost plus the saved markup. Price updates, stock withdrawal and category reassignment propagate to each placement on a fresh page load.

Placement keys use `shopping:`, `project:`, `work:`, `labor:` and `package:` namespaces. A product can have several placements. New Shopping placements appear in both dropdowns; project/work/labor/compatible-package placements appear as related product links on the appropriate pages. All links open the same managed product page. The public search also reads managed products. A product's selling price is the same in all placements.

Public products require active status, a positive unit cost/selling price, positive verified quantity, documented stock evidence, a verification age under 24 hours, and a US warehouse when required. Adding to a quote rechecks stock, quantity, placement and price on the server. An allowance is read from the server's approved allowance table, never trusted from the customer. The customer sees a minimum merchandise upgrade and an explicit pending delivered allowance until shipping/tax are verified. Quote cart entries have no payable price. No order or payment is created.

Draft seed metadata does not infer supplier cost by reversing old selling prices. Existing approved material selling-price references still work; production output strips raw retail-baseline/source fields. New actual supplier costs, markup percentages, expense amounts and profit calculations are served only after owner authentication.

## Business dashboard

Create or edit a project estimate with its customer total, planned labor hours, **actual business labor cost per hour**, and estimated business fees. The $75 customer billing rate is not assumed to be a business expense. Add required materials and purchased quantities, actual supplier shipping/tax costs and customer allowances. Record actual expenses by category and date.

The dashboard shows known estimated cost, recorded expenses, estimated profit, missing-cost/stock/allowance warnings, quantities to buy and supplier-cost reserves. It compares recorded category expenses with estimates without charging an expense twice. Unknown labor/material/shipping/tax inputs leave estimated profit unconfirmed. A financial estimate is not an order authorization. Purchasing records never place supplier orders.

## Local verification

`wrangler.local.jsonc` is development-only and deliberately has a local binding ID, not a production database ID.

```
npx wrangler d1 migrations apply BUSINESS_DB --local --config wrangler.local.jsonc
npm run build
npx wrangler pages dev dist --d1 BUSINESS_DB --binding BUSINESS_CATALOG_ACTIVE=true
```

Pages dev does not accept a custom config path; its local `--d1 BUSINESS_DB` ID matches the development migrations. No authentication bypass exists in the local server. Tests mint short-lived test RSA assertions with a mocked trusted certificate endpoint; browser form tests use intercepted fixture routes.

## Not yet verified in production

D1 creation/binding, Access application policy and owner login, database import/backup policy, real supplier refresh through the new private route, and the managed catalog's production activation require the account configuration above. These are not described as complete or live. The public website and locked checkout can deploy independently without exposing an unconfigured owner tool.
