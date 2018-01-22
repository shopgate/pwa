/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_VIEW_TITLE } from '../constants';

/**
 * Creates the dispatched SET_VIEW_TITLE action object.
 * @param {string} title The title of the view.
 * @returns {Object} The dispatched action object.
 */
const setViewTitle = title => ({
  type: SET_VIEW_TITLE,
  title,
});

export default setViewTitle;
