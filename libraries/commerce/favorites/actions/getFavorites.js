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
  const timestamp = Date.now();
  dispatch(requestFavorites());
  const promise = new PipelineRequest('getFavorites')
    .setHandledErrors([EFAVORITE, EUNKNOWN, EBIGAPI])
    .dispatch();
  promise
    .then((result) => {
      dispatch(receiveFavorites(result.products, timestamp));
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorFetchFavorites(err));
    });
  return promise;
};

export default getFavorites;
