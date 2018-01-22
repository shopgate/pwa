/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import receiveFavorites from '../action-creators/receiveFavorites';
import requestFavorites from '../action-creators/requestFavorites';
import errorFetchFavorites from '../action-creators/errorFetchFavorites';

/**
 * Get favorites action.
 * @param {boolean} ignoreCache Ignores cache when true.
 * @returns {Promise} PipelineRequest dispatch..
 */
const getFavorites = (ignoreCache = false) => (dispatch, getState) => {
  const data = getState().favorites.products;
  if (!ignoreCache && !shouldFetchData(data)) {
    return new Promise(resolve => resolve());
  }
  const request = new PipelineRequest('getFavorites').dispatch();
  dispatch(requestFavorites());
  request
    .then((result) => {
      dispatch(receiveFavorites(result.products));
    })
    .catch((err) => {
      dispatch(errorFetchFavorites(err));
    });

  return request;
};

export default getFavorites;
