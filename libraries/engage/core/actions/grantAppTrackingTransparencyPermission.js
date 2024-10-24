import { PERMISSION_ID_APP_TRACKING_TRANSPARENCY } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the app tracking transparency permission.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @return { Function } A redux thunk.
 */
const grantAppTrackingTransparencyPermission = () => dispatch => dispatch(grantPermissions({
  permissionId: PERMISSION_ID_APP_TRACKING_TRANSPARENCY,
}));

export default grantAppTrackingTransparencyPermission;
