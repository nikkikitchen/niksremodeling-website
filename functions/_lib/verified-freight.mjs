/**
 * Verify a CJ Dropshipping US freight quote.
 *
 * CJ sometimes returns 0 in its freight fields without explicitly marking
 * delivery as free. Do not convert that into a customer-facing $0.00 charge.
 * Only use a named service with a strictly positive, finite supplier rate.
 * If no paid rate is confirmed, make the quote unavailable rather than guess.
 */
const asNonnegativeAmount = value => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (!/^(?:\d+)(?:\.\d+)?$/.test(String(value).trim())) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

export function selectConfirmedFreight(rates) {
  if (!Array.isArray(rates)) return null;
  const options = [];
  for (const rate of rates) {
    if (!rate || typeof rate.logisticName !== 'string' || !rate.logisticName.trim()) continue;
    const total = asNonnegativeAmount(rate.totalPostageFee);
    const base = asNonnegativeAmount(rate.logisticPrice);
    const taxes = asNonnegativeAmount(rate.taxesFee);
    const clearance = asNonnegativeAmount(rate.clearanceOperationFee);
    // An explicit zero total or missing prices are NOT confirmed free freight.
    if (total === 0) continue;
    // Prefer CJ's all-in postage total. If absent, only accept a positive
    // base with numeric, nonnegative optional adjustments.
    const freight = total !== null ? total :
      (base !== null && base > 0 ? base + (taxes ?? 0) + (clearance ?? 0) : null);
    if (freight === null || freight <= 0 || !Number.isFinite(freight)) continue;
    options.push({rate, freight});
  }
  options.sort((a, b) => a.freight - b.freight);
  return options[0] || null;
}

export const UNCONFIRMED_SHIPPING_MESSAGE =
  'Shipping could not be confirmed from the supplier for this ZIP code. Please contact us for a verified delivery quote; no $0 shipping charge is assumed.';
