/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_ROOT_CATEGORIES } from '../constants';

/**
 * Dispatches the REQUEST_ROOT_CATEGORIES action.
 * @return {Object} The REQUEST_ROOT_CATEGORIES action.
 */
const requestRootCategories = () => ({
  type: REQUEST_ROOT_CATEGORIES,
});

export default requestRootCategories;
