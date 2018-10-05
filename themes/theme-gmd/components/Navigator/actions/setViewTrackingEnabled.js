import { enableViewTracking } from '../action-creators';

/**
 * Enable view tracking if not already enabled.
 * @returns {Function} A redux thunk.
 */
const setViewTrackingEnabled = () => (dispatch, getState) => {
  const { navigator: { viewTracking } } = getState();

  if (!viewTracking) {
    dispatch(enableViewTracking());
  }
};

export default setViewTrackingEnabled;
