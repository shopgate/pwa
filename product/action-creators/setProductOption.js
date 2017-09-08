/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_PRODUCT_OPTION } from '../constants';

/**
 * Dispatches the SET_PRODUCT_OPTION action.
 * @param {string} optionId The ID of the option.
 * @param {string} valueId The ID of the selected value.
 * @return {Object} The SET_PRODUCT_OPTIONS action.
 */
const setProductOption = (optionId, valueId) => ({
  type: SET_PRODUCT_OPTION,
  optionId,
  valueId,
});

export default setProductOption;
