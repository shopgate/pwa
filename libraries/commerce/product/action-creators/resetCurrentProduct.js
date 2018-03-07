/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RESET_CURRENT_PRODUCT } from '../constants';

/**
 * Dispatches the RESET_CURRENT_PRODUCT action.
 * @return {Object} The RESET_CURRENT_PRODUCT action.
 */
const resetCurrentProduct = () => ({
  type: RESET_CURRENT_PRODUCT,
});

export default resetCurrentProduct;
