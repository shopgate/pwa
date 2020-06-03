import { some, isEmpty } from 'lodash';
import { getGeolocation } from '@shopgate/engage/core';
import fetchProductLocations from './fetchProductLocations';
import { makeGetUserSearchCountryCode } from '../selectors';
import { setUserSearchSuccess } from '../action-creators';
import { GEOLOCATION_ERROR_DENIED } from '../../core/constants/geolocationRequest';

/**
 * @param {string} productId The product ID to fetch locations for.
 * @param {string} [searchParams=null] postalCode and CountryCode. If omitted, the user geolocation.
 * @param {boolean} [silent=false] Whether in case of declined geolocation permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {boolean} [useFallback=false] When set to TRUE action will try to fetch product locations
 * without search params when the geolocation search can't be used.
 * @returns {string}
 */
const fetchProductLocationsByUserSearch = (
  productId,
  searchParams = null,
  silent = false,
  useFallback = false
) => async (dispatch, getState) => {
  let params = searchParams;
  if (searchParams === null) {
    try {
      params = await dispatch(getGeolocation({
        useSettingsModal: !silent,
        requestPermissions: !useFallback,
      }));
    } catch (e) {
      if (e.code === GEOLOCATION_ERROR_DENIED && useFallback) {
        const countryCode = makeGetUserSearchCountryCode()(getState());
        params = { countryCode };
      } else {
        return;
      }
    }
  } else if (some(searchParams, isEmpty)) {
    // Set empty postal codes to undefined to avoid that the parameter is added to the request.
    params = {};
  }

  let response = null;

  try {
    response = await dispatch(fetchProductLocations(productId, params));
    dispatch(setUserSearchSuccess(true));
  } catch (e) {
    dispatch(setUserSearchSuccess(false));
    if (e.code === 'ENOTFOUND') {
      throw e;
    }
  }

  // eslint-disable-next-line consistent-return
  return response?.locations || null;
};

export default fetchProductLocationsByUserSearch;
