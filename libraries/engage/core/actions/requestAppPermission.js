import { requestAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import { appPermissionStatusReceived } from '../action-creators';

/**
 * Requests an additional app permission from the operating system.
 * Additionally it propagates * the received status via the APP_PERMISSION_STATUS_RECEIVED action.
 * @param {Object} params The action params
 * @param {string} params.permissionId The desired app permission id
 * @returns {Function} A Redux thunk
 */
const requestAppPermission = ({ permissionId }) => async (dispatch) => {
  const [{ status }] = await requestAppPermissions([{ permissionId }]);

  dispatch(appPermissionStatusReceived({
    permissionId,
    status,
  }));

  return status;
};

export default requestAppPermission;