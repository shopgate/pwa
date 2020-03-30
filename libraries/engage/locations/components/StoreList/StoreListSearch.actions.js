import { some, isEmpty } from 'lodash';
import { getGeolocation } from '@shopgate/engage/core';
import { fetchProductLocations } from '../../actions';

/**
 * @param {string} productId The product ID to fetch locations for.
 * @param {string} [searchParams=null] postalCode and CountryCode. If omitted, the user geolocation.
 * @param {boolean} [silent=false] Whether in case of declined geolocation permissions a modal
 * shall be presented, which redirects to the app settings.
 * @returns {string}
 */
export function getProductLocations(productId, searchParams = null, silent = false) {
  return async (dispatch) => {
    let params = searchParams;

    if (searchParams === null) {
      try {
        params = await dispatch(getGeolocation({ useSettingsModal: !silent }));
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
