import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Retrieves the shipping config based on the legacy configuration and the new Engage config.
 * @returns {Object} The merged shipping configuration.
 */
export function getShippingConfig() {
  const {
    shippingHideLegacy = null, shippingUnavailableLegacy = null, shipping,
  } = appConfig;
  const {
    show, freeShipping, unavailable, hint,
  } = shipping;

  // It is using the NMA config over the legacy config.
  const showShipping = (typeof show !== 'undefined') ? show : shippingHideLegacy;
  const freeShippingText = (typeof freeShipping !== 'undefined') ? freeShipping : false;
  const shippingUnavailbaleText = (typeof unavailable !== 'undefined') ? unavailable : shippingUnavailableLegacy;
  const shippingHint = (typeof hint !== 'undefined') ? hint : false;

  return {
    show: showShipping,
    freeShipping: freeShippingText,
    unavailable: shippingUnavailbaleText,
    hint: shippingHint,
  };
}
