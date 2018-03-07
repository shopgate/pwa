/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Removes the display_amount filter from the filters list.
 * @param {Object} filters The filters.
 * @returns {Object} The processed filters.
 */
const processFilters = (filters) => {
  const newFilters = { ...filters };

  delete newFilters.display_amount;

  return newFilters;
};

export default processFilters;
