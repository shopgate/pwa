/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import requestCategoryChildren from '../action-creators/requestCategoryChildren';
import receiveCategoryChildren from '../action-creators/receiveCategoryChildren';
import errorCategoryChildren from '../action-creators/errorCategoryChildren';

/**
 * Retrieves category children for a certain category by ID.
 * @param {string} categoryId The ID of the category to request children for.
 * @return {Function} The dispatched action.
 */
const fetchCategoryChildren = categoryId => (dispatch, getState) => {
  const state = getState();
  const category = state.category.childrenByCategoryId[categoryId];

  if (!shouldFetchData(category, 'children')) {
    return;
  }

  dispatch(requestCategoryChildren(categoryId));

  new PipelineRequest('getCategoryChildren')
    .setInput({ categoryId })
    .dispatch()
    .then(result => dispatch(receiveCategoryChildren(categoryId, result.categories)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorCategoryChildren(categoryId));
    });
};

export default fetchCategoryChildren;
