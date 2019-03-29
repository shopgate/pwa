import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Retrieves the shipping config based on the legacy configuration and the new Engage config.
 * @returns {Object} The merged shipping configuration.
 */
export function getCartConfig() {
  const {
    cartShippingHideAnonymousLegacy = null,
    cartShippingTextAnonymousLegacy = null,
    cartTaxText = null,
    cart = {},
  } = appConfig;

  const { shipping = {}, tax = {} } = cart;

  let hideAnonymous;
  let textForAnonymousUsers;
  ({ hideAnonymous = null, textForAnonymousUsers = null } = shipping);

  if (hideAnonymous === null) {
    hideAnonymous = cartShippingHideAnonymousLegacy;
  }
  if (textForAnonymousUsers === null) {
    textForAnonymousUsers = cartShippingTextAnonymousLegacy;
  }

  let text;
  ({ text = null } = tax);

  if (text === null) {
    text = cartTaxText;
  }

  return {
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
}
