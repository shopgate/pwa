/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { logger } from '@shopgate/pwa-core/helpers';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import getProducts from '../../product/actions/getProducts';
import { getCurrentCategoryId } from '../selectors';

/**
 * Retrieves category products for a certain category by ID.
 * @param {number} offset The offset for the products to request.
 * @param {number} limit The amount of products to request.
 * @param {string} sort The sort order of the products.
 * @return {Function} The dispatched action.
 */
const fetchCategoryProducts =
  (offset = 0, limit = ITEMS_PER_LOAD, sort) =>
    (dispatch, getState) => {
      const state = getState();
      const categoryId = getCurrentCategoryId(state);
      const category = state.category.categoriesById[categoryId];
      const sortOrder = sort || getSortOrder(state);

      if (!category) {
        logger.error(`Category '${categoryId}' doesn't exist in the store. No products fetched.`);
        return;
      }

      dispatch(getProducts({
        params: {
          categoryId,
          offset,
          limit,
          sort: sortOrder,
        },
      }));
    };

export default fetchCategoryProducts;
