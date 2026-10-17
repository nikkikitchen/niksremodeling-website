// Readiness only. Never send a credential or token back to the browser.
export function onRequestGet({ env = {} }) {
  const cjKeyPresent = Boolean(env.CJ_API_KEY || env.CJ_ACCESS_TOKEN);
  const squareTokenPresent = Boolean(env.SQUARE_ACCESS_TOKEN || env.TOKEN);
  const squareLocationPresent = Boolean(env.SQUARE_LOCATION_ID);

  return Response.json({
    cj: { credentialsPresent: cjKeyPresent, productFeedEnabled: cjKeyPresent },
    square: { credentialsPresent: squareTokenPresent, locationPresent: squareLocationPresent, checkoutEnabled: false },
    note: 'Credentials present does not mean authenticated. Checkout remains disabled until server-side totals, delivery, and payment confirmation are tested.'
  }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
