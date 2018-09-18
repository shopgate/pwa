import { setLoading, incrementLoading } from '../../action-creators/view';
import { getLoadingViews } from '../../selectors/view';

/**
 * Toggles the visibility of the loading bar for a pathname.
 * @param {string} pathname The pathname to set to be loading.
 * @return {Function} A redux thunk.
 */
export default function setViewLoading(pathname) {
  return (dispatch, getState) => {
    const loadingViews = getLoadingViews(getState());

    if (!Object.keys(loadingViews).includes(pathname)) {
      dispatch(setLoading(pathname));
    } else {
      dispatch(incrementLoading(pathname));
    }
  };
}
