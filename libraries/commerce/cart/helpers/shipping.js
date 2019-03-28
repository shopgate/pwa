/**
 * Check if shipping line should be shown
 * @param {Object} cartConfig shippingConfig
 * @param {boolean} isUserLoggedIn isUserLoggedIn
 * @param {Object} shippingCost shippingCost
 * @returns {Object|null}
 */
export function getShippingLine(cartConfig, isUserLoggedIn, shippingCost) {
  const config = cartConfig;
  if (config.hideShipping) {
    return null;
  }

  if (!isUserLoggedIn) {
    if (config.hideAnonymous) {
      return null;
    }
    if (config.textForAnonymousUsers) {
      return { label: config.textForAnonymousUsers };
    }
  }
  // Continue
  if (shippingCost === null) {
    if (config.textForNoShipping) {
      return { label: config.textForNoShipping };
    }
    return null;
  }

  if (shippingCost === 0) {
    if (config.hideFreeShipping) {
      return null;
    }
    if (config.textForFreeShipping) {
      return { label: config.textForFreeShipping };
    }
    return {
      label: shippingCost.label || 'titles.shipping',
      amount: 'shipping.free_short',
    };
  }

  return {
    label: shippingCost.label || 'titles.shipping',
    amount: shippingCost.amount,
  };
}
