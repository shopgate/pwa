import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { ACTION_REPLACE } from '@virtuous/conductor/constants';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';

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

  dispatch(navigate(ACTION_REPLACE, `${window.location.pathname}${newQuery}`, state));
};

export default changeSortOrder;
