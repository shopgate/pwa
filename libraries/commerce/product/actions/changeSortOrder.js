import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { getCurrentRoute, parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';

/**
 * Updates the sort parameter in the history.
 * @param {string} sort The sort order
 * @returns {Function} A redux thunk.
 */
const changeSortOrder = sort => (dispatch) => {
  const { query, state } = getCurrentRoute();
  const newQuery = parseObjectToQueryString({
    ...query,
    sort,
  });

  dispatch(historyReplace({
    pathname: `${window.location.pathname}${newQuery}`,
    state,
  }));
};

export default changeSortOrder;
