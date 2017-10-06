/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import getProducts from '../../product/actions/getProducts';
import requestSearchResults from '../action-creators/requestSearchResults';
import receiveSearchResults from '../action-creators/receiveSearchResults';
import errorSearchResults from '../action-creators/errorSearchResults';
import { getSearchPhrase } from '../selectors';

/**
 * Retrieves products for a certain search query.
 * @param {number} offset The offset for the products to request.
 * @return {Function} The dispatched action.
 */
const getSearchResults = (offset = 0) => (dispatch, getState) => {
  const state = getState();
  const limit = ITEMS_PER_LOAD;
  const searchPhrase = getSearchPhrase(state).trim();

  if (!searchPhrase) {
    return;
  }

  const promise = dispatch(
    getProducts({
      params: {
        searchPhrase,
        offset,
        limit,
      },
      onBeforeSend: () => {
        // Dispatch the request action before the related pipeline request is executed
        dispatch(requestSearchResults(searchPhrase, offset));
      },
      onCacheHit: (cachedData) => {
        dispatch(requestSearchResults(searchPhrase, offset));
        dispatch(receiveSearchResults(searchPhrase, cachedData));
      },
    })
  );

  if (promise instanceof Promise) {
    /**
     * When getProducts uses a pipelineRequest to fetch fresh data, it returns a promise which can
     * will be used to handle the response and to determine the further actions.
     */
    promise.then((response) => {
      const { products } = response;

      // Inspect the response object to determine, if represents an search result, or an error
      if (Array.isArray(products)) {
        // Dispatch the receive action when the response contains valid data
        dispatch(receiveSearchResults(searchPhrase, response));
      } else {
        // If no valid data is delivered within the response the error action is dispatched
        dispatch(errorSearchResults(searchPhrase, offset));
      }
    });
  }
};

export default getSearchResults;
