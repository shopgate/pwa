import { replaceHistory } from '@shopgate/pwa-common/actions/history';

/**
 * Updates the sort parameter in the history.
 * @param {string} sort The sort order
 * @returns {Function} A redux thunk.
 */
const changeSortOrder = sort => (dispatch, getState) => {
  const { history } = getState();
  const params = {
    ...history.queryParams,
    sort,
  };

  dispatch(replaceHistory({ params }));
};

export default changeSortOrder;
