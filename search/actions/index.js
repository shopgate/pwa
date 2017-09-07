/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
// TODO: remove mocked pipeline as soon as real pipeline is available.
import PipelineRequest from './MockedPipeline';
import getProducts from '../../product/actions/getProducts';
import requestSearchSuggestions from '../action-creators/requestSearchSuggestions';
import receiveSearchSuggestions from '../action-creators/receiveSearchSuggestions';
import {
  getCurrentSearchSuggestionsObject,
  getSearchPhrase,
} from '../selectors';

/**
 * Retrieves products for a certain search query.
 * @param {number} offset The offset for the products to request.
 * @return {Function} The dispatched action.
 */
export const getSearchResults = (offset = 0) => (dispatch, getState) => {
  const state = getState();
  const sort = getSortOrder(state);
  const limit = ITEMS_PER_LOAD;
  const searchPhrase = getSearchPhrase(state).trim();

  if (!searchPhrase) {
    return;
  }

  dispatch(
    getProducts({
      params: {
        searchPhrase,
        offset,
        limit,
        sort,
      },
    })
  );
};

/**
 * Get suggestions from cache or pipeline.
 * @param {string} searchPhrase The search phrase.
 * @returns {undefined}
 */
export const fetchSearchSuggestions = () => (dispatch, getState) => {
  const state = getState();
  const searchPhrase = getSearchPhrase(state);
  const cachedSuggestions = getCurrentSearchSuggestionsObject(state);

  if (!shouldFetchData(cachedSuggestions)) {
    return;
  }

  dispatch(requestSearchSuggestions(searchPhrase));

  new PipelineRequest('getSearchSuggestions')
    .setInput({ searchPhrase })
    .dispatch()
    .then(({ suggestions }) => {
      dispatch(receiveSearchSuggestions(searchPhrase, suggestions));
    });
};
