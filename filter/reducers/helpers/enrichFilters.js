/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import kebabCase from 'lodash/kebabCase';
import { FILTER_PATH } from '../../constants';

/**
 * Enriches a filter object with additional properties.
 * @param {Array} filters The filters collection.
 * @return {Array} The new collection of enriched filters.
 */
const enrichFilters = filters => filters.map(filter => ({
  ...filter,
  // The route url of this filter.
  url: `${FILTER_PATH}/${kebabCase(filter.id)}`,
}));

export default enrichFilters;
