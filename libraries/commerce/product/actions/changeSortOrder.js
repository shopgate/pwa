import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { router } from '@virtuous/conductor';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';

/**
 * Updates the sort parameter in the history.
 * @param {string} sort The sort order
 * @returns {Function} A redux thunk.
 */
const changeSortOrder = sort => (dispatch) => {
  const { query, state } = router.getCurrentRoute();
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
