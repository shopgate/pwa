/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { getCurrentCategoryId } from '../../../category/selectors';

/**
 * Creates the filter params.
 * @param {Object} state The application state.
 * @return {Object}
 */
const buildFilterParams = (state) => {
  const categoryId = getCurrentCategoryId(state);
  const searchPhrase = getSearchPhrase(state);

  return {
    ...categoryId && { categoryId },
    ...searchPhrase && { searchPhrase },
  };
};

export default buildFilterParams;
