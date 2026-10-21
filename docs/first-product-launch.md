# First furniture listing — October 20, 2026

Product: Farmington Nightstand, Rustic; Brown. CJ product 1963146233541074945, variant 1963146233666904066, SKU CJJT247683401AZ.

Live checks confirmed the Square location is active, USD, and credit-card capable; CJ returned 230 US units. For ZIP 30117, the current marked-up delivered subtotal is $67.13, shipping included, before sales tax. CJ quotes 3–5 days transit, not including order processing or payment settlement. Price and stock are recalculated for each quote.

The furniture page now presents the real product, supplier photo, dimensions, current price and a delivery quote. Customers can contact the business to arrange an order. Online checkout is deliberately unavailable until tax and delivery coverage are configured.

## Required configuration before online payments

The Square account returned no enabled catalog taxes. Confirm the merchant's sales-tax registration, applicable rate and delivery coverage before configuring tax. Do not guess a rate or advertise tax-free sales.

After verification, configure an enabled ADDITIVE Square catalog tax that applies to custom amounts; set STORE_TAX_ID to its ID and STORE_ALLOWED_ZIPS to comma-separated ZIP codes where that exact tax rate is appropriate. Exact ZIP allowlisting is only sufficient where ZIP coverage is known to match the configured jurisdiction; otherwise implement an address-level tax service before expanding coverage.

The checkout endpoint fails closed without both settings. It recalculates inventory, delivery and price on the server, rejects a changed total, and creates a Square-hosted payment link. Creating a link does not charge a customer. Automated tests mock supplier and Square responses; no real card charge or supplier purchase was made. Once configured, verify a hosted link's displayed total, shipping fields, contact details and tax before enabling the purchase button. Sandbox end-to-end payment testing remains to be done with sandbox credentials.

## Manual fulfillment — no supplier spending automation

No CJ order creation, automatic payment, stock deposit, paid membership, or prepaid inventory was enabled. After a sale, check Square directly for COMPLETED payment and verify funds are available. Verify the customer's shipping ZIP matches the quoted ZIP, recheck CJ availability and costs, then manually order using the cleared proceeds. Do not assume a checkout redirect proves payment. Do not send an order to CJ solely because the payment link was created. Square retains the paid order and delivery information.

Agree on delivery and return terms before enabling automated purchases. Delayed payouts, supplier changes, refunds and chargebacks can create costs after a sale; the site cannot promise zero financial risk.

Checkout remains disabled unless STORE_CHECKOUT_ENABLED is explicitly set to true. Keep it unset until registration, correct address-based tax handling, policies, and hosted payment testing are complete.
