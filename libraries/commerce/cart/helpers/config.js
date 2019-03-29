import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Retrieves the shipping config based on the legacy configuration and the new Engage config.
 * @returns {Object} The merged shipping configuration.
 */
export function getCartConfig() {
  const {
    cartShippingHideAnonymousLegacy = null,
    cartShippingTextAnonymousLegacy = null,
    cart = {},
  } = appConfig;

  const { shipping = {} } = cart;

  let hideAnonymous;
  let textForAnonymousUsers;
  ({ hideAnonymous = null, textForAnonymousUsers = null } = shipping);

  if (hideAnonymous === null) {
    hideAnonymous = cartShippingHideAnonymousLegacy;
  }
  if (textForAnonymousUsers === null) {
    textForAnonymousUsers = cartShippingTextAnonymousLegacy;
  }

  return {
    ...cart,
    shipping: {
      ...shipping,
      hideAnonymous,
      textForAnonymousUsers,
    },
  };
}
