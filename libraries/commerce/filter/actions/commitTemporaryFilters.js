import { shallowEqual } from 'recompose';
import { logger } from '@shopgate/pwa-core/helpers';
import { getSearchPhrase, getSortOrder } from '@shopgate/pwa-common/selectors/history';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getCurrentCategoryId } from '../../category/selectors';
import getProducts from '../../product/actions/getProducts';
import setActiveFilters from '../action-creators/setActiveFilters';
import {
  getActiveFiltersStack,
  getTemporaryFilters,
  getTemporaryFiltersWithRoundedDisplayAmounts,
} from '../selectors';

/**
 * Submits the temporary state to the active filters.
 * @param {boolean} [roundDisplayAmounts=true] If set to TRUE the values of the display_amount will
 *   be rounded to the next full number.
 * @returns {Function} A redux thunk.
 */
const commitTemporaryFilters = (roundDisplayAmounts = true) => (dispatch, getState) => {
  const state = getState();
  const activeFilters = getActiveFiltersStack(state);
  let temporaryFilters;

  if (roundDisplayAmounts) {
    temporaryFilters = getTemporaryFiltersWithRoundedDisplayAmounts(state);
  } else {
    temporaryFilters = getTemporaryFilters(state);
  }

  if (!activeFilters.length) {
    logger.error('Tried to submit temporary filters, but no active filter stack was created.');
    return;
  }

  if (!shallowEqual(temporaryFilters, activeFilters[activeFilters.length - 1].filters)) {
    const categoryId = getCurrentCategoryId(state);
    const searchPhrase = getSearchPhrase(state);

    dispatch(setActiveFilters(temporaryFilters, {
      ...categoryId && { categoryId },
      ...searchPhrase && { searchPhrase },
    }));

    const params = {
      ...categoryId && { categoryId },
      ...searchPhrase && { searchPhrase },
      limit: ITEMS_PER_LOAD,
      offset: 0,
      sort: getSortOrder(state),
    };

    // Enrich the parameters with the getProducts related properties for the initial product "page".
    setTimeout(() => {
      dispatch(getProducts({ params }));
    }, 0);
  }
};

export default commitTemporaryFilters;
