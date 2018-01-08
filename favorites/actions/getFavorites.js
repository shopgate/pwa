/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { MockedPipelineRequest } from '../mock';
import receiveFavorites from '../action-creators/receiveFavorites';
import requestFavorites from '../action-creators/requestFavorites';
import errorFetchFavorites from '../action-creators/errorFetchFavorites';

/**
 * Get favorites action.
 * @returns {Promise} PipelineRequest dispatch..
 */
const getFavorites = () => (dispatch, getState) => {
  const data = getState().favorites.products;
  if (!shouldFetchData(data)) {
    return new Promise(resolve => resolve());
  }
  const request = new MockedPipelineRequest().dispatch();
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
