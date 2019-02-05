import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';

/**
 * Updates the sort parameter in the history.
 * @param {string} sort The sort order
 * @returns {Function} A redux thunk.
 */
const changeSortOrder = sort => (dispatch, getState) => {
  const { query, state } = getCurrentRoute(getState());
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
