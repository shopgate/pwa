import { historyPush, getCurrentRoute, parseObjectToQueryString } from '@shopgate/engage/core';
import { CATEGORY_PATH } from '@shopgate/engage/category';
import { SEARCH_PATH } from '@shopgate/engage/search';

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
  } = getCurrentRoute(getState());

  const forwardState = {
    filters: state.filters || null,
    parentId: id,
  };

  if (categoryId) {
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
