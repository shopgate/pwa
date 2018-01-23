/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_VIEW_TOP } from '../constants';

/**
 * Creates the dispatched SET_VIEW_TOP action object.
 * @param {boolean} isTop Whether or not the view is scrolled to the top.
 * @returns {Object} The dispatched action object.
 */
const setViewTop = isTop => ({
  type: SET_VIEW_TOP,
  isTop,
});

export default setViewTop;
