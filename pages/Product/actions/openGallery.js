/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';
import { openProductGallery } from '../action-creators';

/**
 * Opens the Product Image Gallery from a product detail page.
 * @param {string} productId The current product ID.
 * @param {string} currentSlide The current slide ID.
 * @return {Function} The dispatched action.
 */
const openGallery = (productId, currentSlide) => (dispatch) => {
  const url = `${ITEM_PATH}/${bin2hex(productId)}/gallery/${currentSlide}`;

  dispatch(openProductGallery(productId, currentSlide));
  dispatch(pushHistory(url));
};

export default openGallery;
