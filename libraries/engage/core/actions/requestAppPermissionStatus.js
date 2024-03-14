import { getAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import { PERMISSION_STATUS_NOT_SUPPORTED } from '@shopgate/pwa-core/constants/AppPermissions';
import { appPermissionStatusReceived } from '../action-creators';

/**
 * Determines the current status of an app permission from the operating system.
 * Additionally it propagates the received status via the APP_PERMISSION_STATUS_RECEIVED action.
 * @param {Object} params The action params
 * @param {string} params.permissionId The desired app permission id
 * @returns {Function} A Redux thunk
 */
const requestAppPermissionStatus = ({ permissionId }) => async (dispatch) => {
  const [
    { status, options } = { status: PERMISSION_STATUS_NOT_SUPPORTED },
  ] = await getAppPermissions([permissionId]) ?? [];

  dispatch(appPermissionStatusReceived({
    permissionId,
    status,
    options,
  }));

  return status;
};

export default requestAppPermissionStatus;
