// @flow
import appConfig from '@shopgate/pwa-common/helpers/config';

type CartConfigShipping = {
  hideFreeShipping: boolean,
  hideAnonymous: boolean | null,
  textForAnonymousUsers: string | null,
  textForFreeShipping: string | null,
  textForNoShipping: string | null,
  hint: string | null,
};

type CartConfigTax = {
  text: string | null,
  hint: string | null,
};

export type CartConfig = {
  hideTotal: boolean,
  hideShipping: boolean,
  hideTax: boolean,
  shipping: CartConfigShipping,
  tax: CartConfigTax
}

/**
 * Retrieves the shipping config based on the legacy configuration and the new Engage config.
 * @returns {Object} The merged shipping configuration.
 */
export function getCartConfig(): CartConfig {
  const cartShippingHideAnonymousLegacy: boolean | null =
    appConfig.cartShippingHideAnonymousLegacy || null;
  const cartShippingTextAnonymousLegacy: string | null =
    appConfig.cartShippingTextAnonymousLegacy || null;
  const cartTaxText: string | null = appConfig.cartTaxText || null;
  const cart: CartConfig = appConfig.cart || {};

  const shipping: CartConfigShipping = cart.shipping || {};
  const tax: CartConfigTax = cart.tax || {};

  let hideAnonymous: boolean | null;
  let textForAnonymousUsers: string | null;
  ({ hideAnonymous = null, textForAnonymousUsers = null } = shipping);

  if (hideAnonymous === null) {
    hideAnonymous = cartShippingHideAnonymousLegacy;
  }
  if (textForAnonymousUsers === null) {
    textForAnonymousUsers = cartShippingTextAnonymousLegacy;
  }

  let text: string | null;
  ({ text = null } = tax);

  if (text === null) {
    text = cartTaxText;
  }

  const cartConfig: CartConfig = {
    ...cart,
    shipping: {
      ...shipping,
      hideAnonymous,
      textForAnonymousUsers,
    },
    tax: {
      ...tax,
      text,
    },
  };

  return cartConfig;
}
