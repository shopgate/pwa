import { getGeolocation } from '@shopgate/engage/core';
import { fetchProductLocations } from '../../actions';

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
      // Set empty postal codes to undefined to avoid that the parameter is added to the request.
      params = {
        ...(postalCode && { postalCode }),
      };
    }

    try {
      await dispatch(fetchProductLocations(productId, params));
    } catch (e) {
      if (e.code === 'ENOTFOUND') {
        // eslint-disable-next-line consistent-return
        return 'locations.error_invalid_zip_code';
      }
    }
  };
}
