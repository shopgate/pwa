/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { shallowEqual } from 'recompose';
import { logger } from '@shopgate/pwa-core/helpers';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import setActiveFilters from '../action-creators/setActiveFilters';
import {
  getActiveFiltersStack,
  getTemporaryFilters,
} from '../selectors';
import getProducts from '../../product/actions/getProducts';
import buildFilterParams from './helpers/buildFilterParams';

/**
 * Submits the temporary state to the active filters.
 * @returns {Function} A redux thunk.
 */
const commitTemporaryFilters = () => (dispatch, getState) => {
  const state = getState();
  const activeFilters = getActiveFiltersStack(state);
  const temporaryFilters = getTemporaryFilters(state);

  if (!activeFilters.length) {
    logger.error('Tried to submit temporary filters, but no active filter stack was created.');
    return;
  }

  if (!shallowEqual(temporaryFilters, activeFilters[activeFilters.length - 1])) {
    dispatch(setActiveFilters(temporaryFilters));

    const sort = getSortOrder(state);
    const params = buildFilterParams(state);

    // Enrich the parameters with the getProducts related properties for the initial product "page".
    dispatch(getProducts({
      params: {
        ...params,
        limit: ITEMS_PER_LOAD,
        offset: 0,
        sort,
      },
    }));
  }
};

export default commitTemporaryFilters;
