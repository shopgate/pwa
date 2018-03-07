/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_SEARCH_RESULTS } from '../constants';

/**
 * Creates the dispatched REQUEST_SEARCH_RESULTS action object.
 * @param {string} searchPhrase The search phrase.
 * @param {number} offset The result offset.
 * @return {Object} The REQUEST_SEARCH_RESULTS action.
 */
const requestSearchResults = (searchPhrase, offset) => ({
  type: REQUEST_SEARCH_RESULTS,
  searchPhrase,
  offset,
});

export default requestSearchResults;
