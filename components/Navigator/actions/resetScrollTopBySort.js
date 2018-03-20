import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import setViewTop from 'Components/View/action-creators/setViewTop';

/**
 * Resets the view scroll position if the given sort order
 * is different from the currently set sort order.
 * @param {string} sortOrder The sort order to compare.
 * @return {Function} A redux thunk.
 */
const resetScrollTopBySort = sortOrder => (dispatch, getState) => {
  if (getSortOrder(getState()) !== sortOrder) {
    dispatch(setViewTop());
  }
};

export default resetScrollTopBySort;
