import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';

/**
 * Opens the filter view and gives it the current filter hash.
 * @returns {Function} A redux thunk.
 */
const openFilterView = () => (dispatch, getState) => {
  const state = getState();

  dispatch(pushHistory({
    pathname: FILTER_PATH,
    params: {
      ...state.history.queryParams,
    },
  }));
};

export default openFilterView;
