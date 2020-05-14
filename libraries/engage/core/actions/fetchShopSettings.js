import { PipelineRequest } from '@shopgate/engage/core';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { getShopSettingsState } from '../selectors';
import { requestShopSettings, receiveShopSettings, errorShopSettings } from '../action-creators';
import { SHOPGATE_CORE_GET_SHOP_SETTINGS } from '../constants';

/**
 * Sends a get shop settings pipeline request.
 * @param {Array} keys A list of requested shop settings.
 * @returns {Function} A redux thunk.
 */
const fetchShopSettings = keys => (dispatch, getState) => {
  const state = getShopSettingsState(getState());
  const keysToFetch = keys.filter(key => shouldFetchData(state[key]));

  if (keysToFetch.length === 0) {
    return Promise.resolve(null);
  }

  dispatch(requestShopSettings(keysToFetch, keys));

  const request = new PipelineRequest(SHOPGATE_CORE_GET_SHOP_SETTINGS)
    .setInput({ keys })
    .dispatch();

  request
    .then((response) => {
      dispatch(receiveShopSettings(response.shopSettings));
    })
    .catch((error) => {
      dispatch(errorShopSettings(keysToFetch, keys, error));
    });

  return request;
};

export default fetchShopSettings;
