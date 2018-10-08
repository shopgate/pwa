import changeSortOrder from '@shopgate/pwa-common-commerce/product/actions/changeSortOrder';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';

/**
 * Changes the sort order of the products.
 * @param {string} newSort The new sort order value.
 * @return {Function} A redux thunk.
 */
const changeSort = newSort => (dispatch, getState) => {
  const state = getState();
  const oldSort = getSortOrder(state);

  if (newSort === oldSort) {
    return;
  }

  // Change the sort order
  dispatch(changeSortOrder(newSort));
};

export default changeSort;
