/**
 * Check if shipping line should be shown
 * @param {Object} cartConfig shippingConfig
 * @param {Object} tax tax
 * @returns {Object|null}
 */
export function getTaxLine(cartConfig, tax = null) {
  if (tax === null || !tax.amount) {
    return null;
  }

  if (cartConfig.hideTax) {
    return null;
  }

  const taxConfig = cartConfig.tax;

  if (taxConfig.text) {
    return {
      amount: taxConfig.text,
      ...taxConfig.hint && { hint: taxConfig.hint },
    };
  }

  return {
    label: tax.label,
    amount: tax.amount,
    ...taxConfig.hint && { hint: taxConfig.hint },
  };
}
