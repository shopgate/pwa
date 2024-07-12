import { getAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import { PERMISSION_STATUS_NOT_SUPPORTED } from '@shopgate/engage/core/constants';
import { appPermissionStatusReceived } from '../action-creators';

/**
 * Determines the current status of an app permission from the operating system.
 * Additionally it propagates the received status via the APP_PERMISSION_STATUS_RECEIVED action.
 * @param {Object} params The action params
 * @param {string} params.permissionId The desired app permission id
 * @param {Function} [params.dispatchMock=null] An optional mock for the request dispatch logic.
 * Usually used when PWA is running inside a browser and app command logic can be simulated via
 * browser APIs like for geolocation access.
 * @returns {Function} A Redux thunk
 */
const requestAppPermissionStatus = ({
  permissionId,
  dispatchMock,
}) => async (dispatch) => {
  const [
    { status, options } = { status: PERMISSION_STATUS_NOT_SUPPORTED },
  ] = await getAppPermissions([permissionId], dispatchMock) || [];

  dispatch(appPermissionStatusReceived({
    permissionId,
    status,
    options,
  }));

  return {
    status,
  };
};

export default requestAppPermissionStatus;
