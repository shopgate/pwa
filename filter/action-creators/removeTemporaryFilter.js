/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REMOVE_TEMPORARY_FILTER } from '../constants';

/**
 * Creates the dispatched REMOVE_TEMPORARY_FILTER action object.
 * @param {string} id A filter attribute id.
 * @param {number} index The index of the appropriate value.
 * @returns {Object} The REMOVE_TEMPORARY_FILTER action.
 */
const removeTemporaryFilter = (id, index = null) => ({
  type: REMOVE_TEMPORARY_FILTER,
  id,
  index,
});

export default removeTemporaryFilter;
