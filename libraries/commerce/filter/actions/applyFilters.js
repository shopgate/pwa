import conductor from '@virtuous/conductor';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import commitTemporaryFilters from './commitTemporaryFilters';
import { CATEGORY_PATH } from '../../category/constants';

/**
 * Applies the filters to the products and navigates back to the previous route containing products.
 * @param {boolean} [roundDisplayAmounts=true] If set to TRUE the values of the display_amount will
 *   be rounded to the next full number.
 * @returns {Function} A redux thunk
 */
const applyFilters = (roundDisplayAmounts = true) => (dispatch, getState) => {
  dispatch(commitTemporaryFilters(roundDisplayAmounts));

  const route = getCurrentRoute(getState());

  if (route.pattern === `${CATEGORY_PATH}/:categoryId/filter`) {
    conductor.pop();
  } else if (route.pattern === `${CATEGORY_PATH}/:categoryId/filter/:attribute`) {
    conductor.pop(2);
  }
};

export default applyFilters;
