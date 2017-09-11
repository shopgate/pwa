/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import removeTemporaryFilter from '../action-creators/removeTemporaryFilter';

/**
 * Removes all temporary filters.
 * @returns {Function} A redux thunk.
 */
const removeAllTemporaryFilters = () => (dispatch) => {
  dispatch(removeTemporaryFilter(null));
};

export default removeAllTemporaryFilters;
