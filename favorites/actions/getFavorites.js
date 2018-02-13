/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
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

let getFavoritesThrottle = null;
/**
 * Get favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {undefined}
 */
const getFavorites = (ignoreCache = false) => (dispatch, getState) => {
  const data = getState().favorites.products;
  if (!ignoreCache && !shouldFetchData(data)) {
    return;
  }
  const delay = ignoreCache ? 5000 : 0;
  clearTimeout(getFavoritesThrottle);
  getFavoritesThrottle = setTimeout(() => {
    dispatch(requestFavorites());
    new PipelineRequest('getFavorites')
      .setHandledErrors([EFAVORITE, EUNKNOWN, EBIGAPI])
      .dispatch()
      .then((result) => {
        dispatch(receiveFavorites(result.products));
      })
      .catch((err) => {
        console.error(err);
        dispatch(errorFetchFavorites(err));
      });
  }, delay);
};

export default getFavorites;
