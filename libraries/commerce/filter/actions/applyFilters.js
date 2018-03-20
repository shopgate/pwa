import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import commitTemporaryFilters from './commitTemporaryFilters';
import { FILTER_PATH } from '../constants';

/**
 * Applies the filters to the products and navigates back to the previous route containing products.
 * @param {boolean} [roundDisplayAmounts=true] If set to TRUE the values of the display_amount will
 *   be rounded to the next full number.
 * @returns {Function} A redux thunk
 */
const applyFilters = (roundDisplayAmounts = true) => (dispatch, getState) => {
  dispatch(commitTemporaryFilters(roundDisplayAmounts));

  const path = getHistoryPathname(getState());

  if (path.startsWith(`${FILTER_PATH}/`)) {
    dispatch(goBackHistory(2));
  } else if (path.startsWith(FILTER_PATH)) {
    dispatch(goBackHistory(1));
  }
};

export default applyFilters;
