import {
  hasSGJavaScriptBridge,
  hasWebBridge,
  createMockedPermissions,
} from '@shopgate/engage/core/helpers';
import { requestAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import {
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_STATUS_GRANTED,
} from '@shopgate/engage/core/constants';
import { appPermissionStatusReceived } from '../action-creators';

/**
 * Requests an additional app permission from the operating system.
 * Additionally it propagates the received status via the APP_PERMISSION_STATUS_RECEIVED action.
 * @param {Object} params The action params
 * @param {string} params.permissionId The desired app permission id
 * @param {Object} [params.options={}] Additional options for the permission request.
 * E.g. the usage object for geolocation permissions.
 * @param {Function} [params.dispatchMock=null] An optional mock for the request dispatch logic.
 * Usually used when PWA is running inside a browser and app command logic can be simulated via
 * browser APIs like for geolocation access.
 * @returns {Function} A Redux thunk
 */
const requestAppPermission = ({
  permissionId,
  options: requestOptions,
  dispatchMock: dispatchMockParam,
}) => async (dispatch) => {
  let dispatchMock = dispatchMockParam;
  // In development a mock needs to be injected to enable command testing. Command responses
  // can be mocked via the global MockedAppPermissions object see appPermissions.js
  if (!dispatchMockParam && (!hasSGJavaScriptBridge() || hasWebBridge())) {
    dispatchMock = createMockedPermissions(PERMISSION_STATUS_GRANTED);
  }

  const [
    {
      status, options, data, duration,
    } = { status: PERMISSION_STATUS_NOT_SUPPORTED },
  ] = await requestAppPermissions([{
    permissionId,
    ...requestOptions ? { options: requestOptions } : {},
  }], dispatchMock) ?? [];

  dispatch(appPermissionStatusReceived({
    permissionId,
    status,
    options,
  }));

  return {
    status,
    options,
    data,
    duration,
  };
};

export default requestAppPermission;
