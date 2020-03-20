import { some, isEmpty } from 'lodash';
import { getGeolocation } from '@shopgate/engage/core';
import { fetchProductLocations } from '../../actions';

/**
 * @param {string} productId The product ID to fetch locations for.
 * @param {string} [searchParams=null] postalCode and CountryCode. If omitted, the user geolocation.
 * @returns {string}
 */
export function getProductLocations(productId, searchParams = null) {
  return async (dispatch) => {
    let params = searchParams;

    if (searchParams === null) {
      try {
        params = await dispatch(getGeolocation({ useSettingsModal: true }));
      } catch (e) {
        return;
      }
    } else if (some(searchParams, isEmpty)) {
      // Set empty postal codes to undefined to avoid that the parameter is added to the request.
      params = {};
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
