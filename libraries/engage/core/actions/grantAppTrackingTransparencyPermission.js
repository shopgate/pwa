import { PERMISSION_ID_APP_TRACKING_TRANSPARENCY } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the app tracking transparency permission.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {Object} [options.meta={}] Additional meta data used for opt-in tracking actions
 * @return { Function } A redux thunk.
 */
const grantAppTrackingTransparencyPermission = (options = {}) => (dispatch) => {
  const {
    meta = {},
  } = options;

  return dispatch(grantPermissions({
    permissionId: PERMISSION_ID_APP_TRACKING_TRANSPARENCY,
    meta,
  }));
};

export default grantAppTrackingTransparencyPermission;
