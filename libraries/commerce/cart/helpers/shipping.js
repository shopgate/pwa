/**
 * Check if shipping line should be shown
 * @param {Object} cartConfig shippingConfig
 * @param {boolean} isUserLoggedIn isUserLoggedIn
 * @param {Object} shippingCost shippingCost
 * @returns {Object|null}
 */
export function getShippingLine(cartConfig, isUserLoggedIn = false, shippingCost = null) {
  if (shippingCost === null) {
    return null;
  }

  if (cartConfig.hideShipping) {
    return null;
  }

  const shippingConfig = cartConfig.shipping;

  if (!isUserLoggedIn) {
    if (shippingConfig.hideAnonymous) {
      return null;
    }
    if (shippingConfig.textForAnonymousUsers) {
      return { label: shippingConfig.textForAnonymousUsers };
    }
  }
  // Continue
  if (shippingCost.amount === null) {
    if (shippingConfig.textForNoShipping) {
      return { label: shippingConfig.textForNoShipping };
    }
    return null;
  }

  if (shippingCost.amount === 0) {
    if (shippingConfig.hideFreeShipping) {
      return null;
    }
    if (shippingConfig.textForFreeShipping) {
      return {
        label: shippingCost.label || 'titles.shipping',
        amount: shippingConfig.textForFreeShipping,
        ...shippingConfig.hint && { hint: shippingConfig.hint },
      };
    }
    return {
      label: shippingCost.label || 'titles.shipping',
      amount: 'shipping.free_short',
      ...shippingConfig.hint && { hint: shippingConfig.hint },
    };
  }

  return {
    label: shippingCost.label || 'titles.shipping',
    amount: shippingCost.amount,
    ...shippingConfig.hint && { hint: shippingConfig.hint },
  };
}
