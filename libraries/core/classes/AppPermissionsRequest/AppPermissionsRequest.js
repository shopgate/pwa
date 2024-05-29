import AppCommandRequest from '../AppCommandRequest';
import { hasSGJavaScriptBridge } from '../../helpers';
import {
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_ID_PUSH,
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
} from '../../constants/AppPermissions';

const MOCK_PERMISSIONS_KEY = 'sg-mocked-app-permissions';

let getMockedAppPermissions;

/**
 * In development within the browser, app permissions can be mocked by calling a global functions
 * on the MockedPermissions object. The values are persisted in local storage, so that they survive
 * reload of the PWA.
 *
 * Permissions are stored "globally" and will affect every shop.
 *
 * Example:
 * MockedAppPermissions.setGetAppPermissionsResponse('push', 'notDetermined')
 * MockedAppPermissions.setRequestAppPermissionsResponse('push', 'denied')
 *
 * The object also provides access to the relevant constants.
 *
 * Example:
 * MockedAppPermissions.ID_PUSH
 * MockedAppPermissions.STATUS_DENIED
 *
 * Complete Example:
 * MockedAppPermissions.setRequestAppPermissionsResponse(
 *   MockedAppPermissions.ID_PUSH,
 *   MockedAppPermissions.STATUS_DENIED
 * )
 */
if (process.env.NODE_ENV === 'development') {
  /**
   * Retrieves mocked app permissions from the local storage
   * @returns {Object|null}
   */
  getMockedAppPermissions = () => JSON.parse(localStorage.getItem(MOCK_PERMISSIONS_KEY));

  /**
   * Sets a single mocked app permission status from the local storage
   * @param {string} commandType Command type for which the status is set (get / request)
   * @param {string} permissionId The permissionId for which the status is set
   * @param {string} status The mocked permission status
   */
  const setMockedAppPermission = (commandType, permissionId, status) => {
    let current = getMockedAppPermissions();

    if (current === null) {
      current = {};
    }

    if (!current?.[permissionId]) {
      // Add defaults for the permissionId when not set yet
      current[permissionId] = {
        get: PERMISSION_STATUS_GRANTED,
        request: PERMISSION_STATUS_GRANTED,
      };
    }

    // Add the status to the mocked app permissions
    current[permissionId][commandType] = status;
    // Update local storage
    localStorage.setItem(MOCK_PERMISSIONS_KEY, JSON.stringify(current));
  };

  /**
   * Prepare global object in DEV environment to mock app permissions
   */
  const obj = {
    setGetAppPermissionsResponse: (permissionId, status = PERMISSION_STATUS_GRANTED) => {
      setMockedAppPermission('get', permissionId, status);
    },
    setRequestAppPermissionsResponse: (permissionId, status = PERMISSION_STATUS_GRANTED) => {
      setMockedAppPermission('request', permissionId, status);
    },
  };

  // Populate useful constants
  obj.STATUS_GRANTED = PERMISSION_STATUS_GRANTED;
  obj.STATUS_DENIED = PERMISSION_STATUS_DENIED;
  obj.STATUS_NOT_DETERMINED = PERMISSION_STATUS_NOT_DETERMINED;
  obj.STATUS_NOT_SUPPORTED = PERMISSION_STATUS_NOT_SUPPORTED;
  obj.ID_PUSH = PERMISSION_ID_PUSH;
  obj.ID_CAMERA = PERMISSION_ID_CAMERA;
  obj.ID_LOCATION = PERMISSION_ID_LOCATION;

  window.MockedAppPermissions = obj;
}

/**
 * The AppPermissionsRequest class is the base class for app permission related requests.
 * It contains the logic which in necessary to establish the process of sending an
 * app command and receiving an associated event.
 */
class AppPermissionsRequest extends AppCommandRequest {
  /**
   * The constructor.
   * @param {string} commandName The name of the command which is dispatched to the app.
   * @param {string} eventName The event name which is called by the app to deliver the data.
   */
  constructor(commandName, eventName) {
    super(commandName, eventName);
    this.setLibVersion('18.0');
  }

  /**
   * Creates title for the app command request log
   * @returns {string}
   */
  getRequestLogTitle() {
    const requestType = this.commandName.replace('AppPermissions', '');
    return `AppPermissionsRequest %c${requestType}`;
  }

  /**
   * Creates title for the app command response log
   * @returns {string}
   */
  getResponseLogTitle() {
    const requestType = this.commandName.replace('AppPermissions', '');
    return `AppPermissionsResponse %c${requestType}`;
  }

  /**
   * Dispatches the request.
   * @return {Promise} A promise that is fulfilled when a response is received for this request.
   */
  dispatch() {
    if (!hasSGJavaScriptBridge()) {
      // Mock the response in browser environments, so that the permissions are always granted.
      let { permissionIds } = this.commandParams;
      const { permissions } = this.commandParams;

      if (permissions) {
        permissionIds = permissions.map(permission => permission.permissionId);
      }

      const result = permissionIds.map((permissionId) => {
        let status = PERMISSION_STATUS_GRANTED;

        // Use mocked permissions if available
        if (typeof getMockedAppPermissions === 'function') {
          const permissionMock = getMockedAppPermissions();
          const type = this.commandName === 'getAppPermissions' ? 'get' : 'request';
          status = permissionMock?.[permissionId]?.[type] || PERMISSION_STATUS_GRANTED;
        }

        return {
          permissionId,
          status,
        };
      });

      return Promise.resolve(result);
    }

    return super.dispatch();
  }
}

export default AppPermissionsRequest;
