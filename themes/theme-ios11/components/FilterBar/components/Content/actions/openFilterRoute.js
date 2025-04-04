import { historyPush } from '@shopgate/engage/core/actions';
import { getCurrentRoute } from '@shopgate/engage/core/selectors';
import { parseObjectToQueryString } from '@shopgate/engage/core/helpers';
import { CATEGORY_PATH, CATEGORY_ALL_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';

/**
 * Opens the filter route with the relevant url.
 * @param {Object} props The component props.
 * @returns {Function} A redux thunk.
 */
const openFilterRoute = () => (dispatch, getState) => {
  const {
    id,
    params: { categoryId },
    query,
    state,
    pattern,
  } = getCurrentRoute(getState());

  const forwardState = {
    filters: state.filters || null,
    parentId: id,
  };

  if (pattern === CATEGORY_ALL_PATTERN) {
    dispatch(historyPush({
      pathname: `${CATEGORY_PATH}/${categoryId}/all/filter`,
      state: forwardState,
    }));
  } else if (categoryId) {
    dispatch(historyPush({
      pathname: `${CATEGORY_PATH}/${categoryId}/filter`,
      state: forwardState,
    }));
  } else if (query.s) {
    const queryString = parseObjectToQueryString(query);

    dispatch(historyPush({
      pathname: `${SEARCH_PATH}/filter${queryString}`,
      state: forwardState,
    }));
  }
};

export default openFilterRoute;
