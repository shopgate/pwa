import { disableViewTracking } from '../action-creators';

/**
 * Disables view tracking if not already disabled.
 * @returns {Function} A redux thunk.
 */
const setViewTrackingDisabled = () => (dispatch, getState) => {
  const { navigator: { viewTracking } } = getState();

  if (viewTracking) {
    dispatch(disableViewTracking());
  }
};

export default setViewTrackingDisabled;
