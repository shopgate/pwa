import { historyPush } from '@shopgate/pwa-common/actions/router';
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
    dispatch(historyPush({
      pathname: `${CATEGORY_PATH}/${props.categoryId}/filter${queryString}`,
    }));
  } else if (query.s) {
    dispatch(historyPush({
      pathname: `${SEARCH_PATH}/filter${queryString}`,
    }));
  }
};

export default openFilterView;
