/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { shallowEqual } from 'recompose';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import {
  generateResultHash,
  shouldFetchFilters,
} from '@shopgate/pwa-common/helpers/redux';
import updateHistoryState from '@shopgate/pwa-common/actions/history/updateHistoryState';
import {
  pushHistory,
  goBackHistory,
} from '@shopgate/pwa-common/actions/history/changeHistory';
import {
  getSearchPhrase,
  getHistoryPathname,
  getSortOrder,
} from '@shopgate/pwa-common/selectors/history';
import requestFilters from '../action-creators/requestFilters';
import receiveFilters from '../action-creators/receiveFilters';
import errorFilters from '../action-creators/errorFilters';
import addActiveFiltersAction from '../action-creators/addActiveFilters';
import setActiveFilters from '../action-creators/setActiveFilters';
import removeTemporaryFilter from '../action-creators/removeTemporaryFilter';
import sliceActiveFilters from '../action-creators/sliceActiveFilters';
import {
  getFilterHash,
  getAvailableFiltersStack,
  getActiveFilters,
  getActiveFiltersStack,
  getTemporaryFilters,
  getHistoryFilterIndex,
} from '../selectors';
import { getCurrentCategoryId } from '../../category/selectors';
import getProducts from '../../product/actions/getProducts';
import { FILTER_PATH } from '../constants';

/**
 * Removes the display_amount filter from the filters list.
 * @param {Object} filters The filters.
 * @returns {Object} The processed filters.
 */
const processFilters = (filters) => {
  const newFilters = { ...filters };

  delete newFilters.display_amount;

  return newFilters;
};

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

/**
 * Process the pipeline params to be compatible with the current API specifications.
 * Currently the categoryId field cannot be used in combination with the filter field. In order to
 * use them together the categoryId field has to be extracted into the filter field.
 * TODO: Remove this function once the pipeline specifications have been adjusted.
 * @param {Object} params The request params.
 * @param {Object} filters The current active filters.
 * @returns {Object} A set of compatible params.
 */
const processParams = (params, filters) => {
  const processedFilters = processFilters(filters);

  let newParams = {
    ...params,
    ...(processedFilters && Object.keys(processedFilters).length) && { filters: processedFilters },
  };

  if (params.categoryId && processedFilters && Object.keys(processedFilters).length) {
    newParams = {
      ...params,
      filters: {
        categoryId: params.categoryId,
        ...processedFilters,
      },
    };
    delete newParams.categoryId;
  }

  return newParams;
};

/**
 * Retrieves the available filters for a list of products.
 * @returns {Function} A redux thunk
 */
export const getFilters = () => (dispatch, getState) => {
  const state = getState();
  const activeFilters = getActiveFilters(state);
  const params = buildFilterParams(state);

  const hash = generateResultHash({
    pipeline: 'getFilters',
    ...params,
  }, false);

  const result = getAvailableFiltersStack(state)[hash];

  if (!shouldFetchFilters(result)) {
    return;
  }

  // We need to process the params to handle edge cases in the pipeline params.
  const requestParams = processParams(params, activeFilters);

  dispatch(requestFilters(hash));
  new PipelineRequest('getFilters')
    .setInput(requestParams)
    .dispatch()
      .then(({ filters }) => dispatch(receiveFilters(hash, filters)))
      .catch((error) => {
        logger.error(error);
        dispatch(errorFilters(hash));
      });
};

/**
 * Creates a new stack for active filters.
 *
 * We need to keep track of filters in order to restore them when the view changes and a
 * previous filter needs to be re-applied.
 * When going back the set on top of the stack will be removed and the previous one
 * will be active again.
 *
 * @returns {Function} A redux thunk.
 */
export const addActiveFilters = () => (dispatch, getState) => {
  const state = getState();
  const filterIndex = getHistoryFilterIndex(state);

  if (filterIndex === null) {
    dispatch(addActiveFiltersAction());
    dispatch(updateHistoryState({
      filterIndex: getActiveFiltersStack(state).length,
    }));
  }
};

/**
 * Submits the temporary state to the active filters.
 * @returns {Function} A redux thunk.
 */
export const commitTemporaryFilters = () => (dispatch, getState) => {
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

/**
 * Applies the filters to the products and navigates back to the previous route containing products.
 * @returns {Function} A redux thunk
 */
export const applyFilters = () => (dispatch, getState) => {
  dispatch(commitTemporaryFilters());

  const path = getHistoryPathname(getState());

  if (path.startsWith(`${FILTER_PATH}/`)) {
    dispatch(goBackHistory(2));
  } else if (path.startsWith(FILTER_PATH)) {
    dispatch(goBackHistory(1));
  }
};

/**
 * Removes all temporary filters.
 * @returns {Function} A redux thunk.
 */
export const removeAllTemporaryFilters = () => (dispatch) => {
  dispatch(removeTemporaryFilter(null));
};

/**
 * Opens the filter view and gives it the current filter hash.
 * @param {Object} props The components props.
 * @returns {Function} A redux thunk.
 */
export const openFilterView = props => (dispatch, getState) => {
  const state = getState();
  const filterHash = getFilterHash(state, props);

  dispatch(pushHistory({
    pathname: FILTER_PATH,
    params: {
      ...state.history.queryParams,
    },
    state: {
      filterHash,
    },
  }));
};

/**
 * Removes the last entry from the active filters stack.
 * @returns {Function} A redux thunk.
 */
export const syncActiveFiltersWithHistory = () => (dispatch, getState) => {
  const state = getState();
  const filterIndex = getHistoryFilterIndex(state);

  // Only continue if history has filterIndex and the active filters stack changed.
  if (filterIndex !== null && getActiveFiltersStack(state).length !== (filterIndex + 1)) {
    // Removes the last active filters stack when history is updated.
    dispatch(sliceActiveFilters(filterIndex));
  }
};
