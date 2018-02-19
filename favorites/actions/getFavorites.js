/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  EFAVORITE,
  EUNKNOWN,
  EBIGAPI,
} from '@shopgate/pwa-core/constants/Pipeline';
import {
  receiveFavorites,
  requestFavorites,
  errorFetchFavorites,
} from '../action-creators';
import { FETCH_FAVORITES_THROTTLE } from '../constants';

let getFavoritesThrottle = null;

/**
 * Dispatches request and returns promise.
 * Handy for unit tests where throttle is always 0.
 * @param {function} dispatch Dispatch.
 * @returns {Promise}
 */
const dispatchRequest = (dispatch) => {
  dispatch(requestFavorites());
  const request = new PipelineRequest('getFavorites')
    .setHandledErrors([EFAVORITE, EUNKNOWN, EBIGAPI])
    .dispatch();
  request
    .then((result) => {
      dispatch(receiveFavorites(result.products));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorFetchFavorites(error));
    });
  return request;
};

/* eslint-disable consistent-return */
/**
 * Get favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Promise|undefined}
 *
 */
const getFavorites = (ignoreCache = false) => (dispatch, getState) => {
  const data = getState().favorites.products;
  if (!ignoreCache && !shouldFetchData(data)) {
    return new Promise(res => res());
  }
  const delay = ignoreCache ? FETCH_FAVORITES_THROTTLE : 0;
  if (delay === 0) {
    return dispatchRequest(dispatch);
  }
  clearTimeout(getFavoritesThrottle);
  getFavoritesThrottle = setTimeout(() => dispatchRequest(dispatch), delay);
};
/* eslint-enable consistent-return */

export default getFavorites;
