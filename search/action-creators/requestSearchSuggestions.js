/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_SEARCH_SUGGESTIONS } from '../constants';

/**
 * Creates the dispatched REQUEST_SEARCH_SUGGESTIONS action object.
 * @param {string} searchPhrase The search phrase.
 * @return {Object} The REQUEST_SEARCH_SUGGESTIONS action.
 */
const requestSearchSuggestions = searchPhrase => ({
  type: REQUEST_SEARCH_SUGGESTIONS,
  searchPhrase,
});

export default requestSearchSuggestions;
