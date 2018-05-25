import {
  unsetLoading,
  decrementLoading,
} from '../../action-creators/view';
import { getLoadingViews } from '../../selectors/view';

/**
 * Toggles the visibility of the loading bar for a pathname.
 * @param {boolean} pathname The pathname to set to be not loading.
 * @param {boolean} flush Sets counter to zero.
 * @return {Function} A redux thunk.
 */
const unsetViewLoading = (pathname, flush = false) => (dispatch, getState) => {
  const loadingViews = getLoadingViews(getState());

  if (!flush && loadingViews[pathname] > 1) {
    dispatch(decrementLoading(pathname));
  } else {
    dispatch(unsetLoading(pathname));
  }
};

export default unsetViewLoading;
