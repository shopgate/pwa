/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { SET_CURRENT_CATEGORY_ID } from '../constants';

/**
 * Dispatches the SET_CURRENT_CATEGORY_ID action.
 * @param {string} pathname The ID of the category to receive children for.
 * @return {Object} The SET_CURRENT_CATEGORY_ID action.
 */
const setCurrentCategoryId = (pathname = '') => ({
  type: SET_CURRENT_CATEGORY_ID,
  categoryId: hex2bin(pathname.split('/')[2]),
});

export default setCurrentCategoryId;
