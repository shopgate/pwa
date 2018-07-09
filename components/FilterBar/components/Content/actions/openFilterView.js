import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { getCurrentParams, getCurrentQuery } from '@shopgate/pwa-common/selectors/router';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';

/**
 * Opens the filter view and gives it the current filter hash.
 * @param {Object} props The component props.
 * @returns {Function} A redux thunk.
 */
const openFilterView = props => (dispatch, getState) => {
  const state = getState();
  const params = getCurrentParams(state);
  const query = getCurrentQuery(state);

  const queryString = parseObjectToQueryString(query);

  if (params.categoryId) {
    dispatch(navigate(ACTION_PUSH, `${CATEGORY_PATH}/${props.categoryId}/filter${queryString}`));
  } else if (query.s) {
    dispatch(navigate(ACTION_PUSH, `${SEARCH_PATH}/filter${queryString}`));
  }
};

export default openFilterView;
