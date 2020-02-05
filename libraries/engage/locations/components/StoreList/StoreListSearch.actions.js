import { getGeolocation } from '@shopgate/engage/core';
import { fetchProductLocations } from '@shopgate/engage/locations';

/**
 * @param {string} productId The product ID to fetch locations for.
 * @param {string} [postalCode=null] Postal code. If omitted, the user geolocation will be used.
 * @returns {string}
 */
export function getProductLocations(productId, postalCode = null) {
  return async (dispatch) => {
    let params;

    if (postalCode === null) {
      try {
        params = await dispatch(getGeolocation({ useSettingsModal: true }));
      } catch (e) {
        return;
      }
    } else {
      params = { postalCode };
    }

    try {
      await dispatch(fetchProductLocations(productId, params));
    } catch (e) {
      if (e.code === 'ENOTFOUND') {
        // eslint-disable-next-line consistent-return
        return 'product.error.wrong_zip_code';
      }
    }
  };
}
