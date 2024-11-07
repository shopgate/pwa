import {
  hasSGJavaScriptBridge,
  hasWebBridge,
  createMockedPermissions,
} from '@shopgate/engage/core/helpers';
import { getAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import {
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_STATUS_GRANTED,
} from '@shopgate/engage/core/constants';
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
  dispatchMock: dispatchMockParam,
}) => async (dispatch) => {
  let dispatchMock = dispatchMockParam;

  // In development a mock needs to be injected to enable command testing. Command responses
  // can be mocked via the global MockedAppPermissions object see appPermissions.js
  if (!dispatchMockParam && (!hasSGJavaScriptBridge() || hasWebBridge())) {
    dispatchMock = createMockedPermissions(PERMISSION_STATUS_GRANTED);
  }

  const [
    { status, options } = { status: PERMISSION_STATUS_NOT_SUPPORTED },
  ] = await getAppPermissions([permissionId], dispatchMock) ?? [];

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
