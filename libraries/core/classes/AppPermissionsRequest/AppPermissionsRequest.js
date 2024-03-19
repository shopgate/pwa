import Request from '../Request';
import AppCommand from '../AppCommand';
import event from '../Event';
import requestBuffer from '../RequestBuffer';
import { logger, hasSGJavaScriptBridge } from '../../helpers';
import logGroup from '../../helpers/logGroup';
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
 * The AppPermissionsRequest class is be base class for app permission related request.
 * It contains the logic which in necessary to establish the process of sending an
 * app command and receiving an associated event.
 */
class AppPermissionsRequest extends Request {
  /**
   * The constructor.
   * @param {string} commandName The name of the command which is dispatched to the app.
   * @param {string} eventName The event name which is called by the app to deliver the data.
   */
  constructor(commandName, eventName) {
    super();

    this.commandName = commandName;
    this.eventName = eventName;

    this.commandParams = null;

    this.libVersion = '18.0';
    this.createSerial(this.commandName);
    this.createEventCallbackName(this.eventName);
  }

  /**
   * Sets the parameters for the app command.
   * @private
   * @param {Object} commandParams The parameters.
   * @return {AppPermissionsRequest}
   */
  setCommandParams(commandParams) {
    this.commandParams = commandParams;
    return this;
  }

  /**
   * Cleans up the instance after a successful or failed permissions request.
   * @private
   * @param {Function} requestCallback The event callback that processes the response.
   * @return {AppPermissionsRequest}
   */
  cleanUpRequest(requestCallback) {
    // Remove the event listener entry.
    event.removeCallback(this.getEventCallbackName(), requestCallback);
    // Remove the request from the buffer.
    requestBuffer.remove(this.serial);
    return this;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * Validates the command params before dispatch.
   * @private
   * @abstract
   * @throws {Error}
   */
  validateCommandParams() {
    throw new Error('validateCommandParams needs to be overwritten by inherited class.');
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Dispatches the app permissions command.
   * @private
   * @param {Function} resolve The resolve() callback of the dispatch promise.
   * @param {Function} reject The reject() callback of the dispatch promise.
   */
  async onDispatch(resolve, reject) {
    // Prepare the request type for logging.
    const requestType = this.commandName.replace('AppPermissions', '');

    // Validate the command parameters.
    if (this.validateCommandParams(this.commandParams) === false) {
      // In case of an error log a message and reject the request promise.
      const message = `${this.commandName} - invalid command parameters passed`;
      logger.error(message, this.commandParams);

      reject(new Error(message));
      return;
    }

    /**
     * The event callback for the permissions response.
     * @param {string} serial The serial that was used to identify the callback.
     * @param {Array} permissions An array with the current app permissions.
     */
    const requestCallback = (serial, permissions) => {
      logGroup(`AppPermissionsResponse %c${requestType}`, permissions, '#9a9800');
      this.cleanUpRequest(requestCallback);
      resolve(permissions);
    };

    // Add the request to the buffer.
    requestBuffer.add(this, this.serial);
    // Add the event callback for the response.
    event.addCallback(this.getEventCallbackName(), requestCallback);

    // Prepare the permissions command.
    const command = new AppCommand()
      .setCommandName(this.commandName)
      .setLibVersion(this.libVersion)
      .setCommandParams({
        serial: this.serial,
        ...this.commandParams && { ...this.commandParams },
      });

    // Try to dispatch the command.
    const success = await command.dispatch();

    // If the dispatch of the command failed revert everything and reject to promise.
    if (success === false) {
      this.cleanUpRequest(requestCallback);
      reject(new Error(`${this.commandName} command dispatch failed`));
      return;
    }

    logGroup(`AppPermissionsRequest %c${requestType}`, this.commandParams, '#adab00');
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
