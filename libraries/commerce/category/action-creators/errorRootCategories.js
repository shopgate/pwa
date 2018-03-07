/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_ROOT_CATEGORIES } from '../constants';

/**
 * Dispatches the ERROR_ROOT_CATEGORIES action.
 * @return {Object} The ERROR_ROOT_CATEGORIES action.
 */
const errorRootCategories = () => ({
  type: ERROR_ROOT_CATEGORIES,
});

export default errorRootCategories;
