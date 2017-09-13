/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import getPage from './page';

/**
 * Selects the combined tracking information.
 * @param {Object} state The current state.
 * @returns {Object} The tracking data.
 */
export default createSelector(
  getPage,
  page => ({
    page,
  })
);
