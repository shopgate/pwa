import event from '../Event';
import requestBuffer from '../RequestBuffer';
import Request from '../Request';
import AppCommand from '../AppCommand';

export const TYPE_GET = 'getAppPermissions';
export const TYPE_REQUEST = 'requestAppPermissions';

/**
 * The pipeline request class which is about to retreive the current state of the
 * various app permissions. It sends an app permissions request and returns a promise.
 */
class AppPermissionsRequest extends Request {
  /**
   * Initializes the AppPermissionsRequest
   */
  constructor() {
    super();

    this.permissionIds = [];

    this.createSerial();
    this.createEventCallbackName('getAppPermissionsResponse');
    this.type = TYPE_GET;
  }

  /**
   * Sets the type of the permissions request. It can either retreive the current
   * active permissions (TYPE_GET), or request a permissions grant dialog (TYPE_REQUEST).
   * @param {string} type The type of the request.
   * @return {AppPermissionsRequest}
   */
  setRequestType(type) {
    this.type = type;
    return this;
  }

  /**
   * Sets the desired permissions ids for the request.
   * @param {Array} permissionIds The permissions.
   * @return {AppPermissionsRequest}
   */
  setPermissionsIds(permissionIds) {
    this.permissionIds = permissionIds;

    return this;
  }

  /**
   * Dispatches the app permissions request.
   * @param {Function} resolve The resolve() callback of the request promise.
   * @param {Function} reject The reject() callback of the request promise.
   */
  async onDispatch(resolve, reject) {
    // Add the request to the buffer.
    requestBuffer.add(this, this.serial);

    const requestCallbackName = this.getEventCallbackName();

    /**
     * The request event callback for the response call.
     * @param {string} serial The serial that was used to identify the request callback.
     * @param {Array} permissions An array with the current app permissions.
     */
    const requestCallback = (serial, permissions) => {
      // eslint-disable-next-line no-use-before-define
      cleanUpRequest();
      resolve(permissions);
    };

    /**
     * Removes the callback from the event listener and the request buffer.
     */
    const cleanUpRequest = () => {
      event.removeCallback(requestCallbackName, requestCallback);
      requestBuffer.remove(this.serial);
    };

    // Only send commands with valid payload.
    if (!Array.isArray(this.permissionIds)) {
      reject(new Error('Invalid format for app permission ids - array expected'));
      return;
    }

    // Add the event callback for the response.
    event.addCallback(requestCallbackName, requestCallback);

    // Send the permissions request.
    const command = new AppCommand()
      .setCommandName(this.type)
      .setLibVersion('18.0')
      .setCommandParams({
        serial: this.serial,
        permissionIds: this.permissionIds,
      });

    const success = await command.dispatch();
    // If the dispatch of the command failed revert everything and reject to promise.
    if (success === false) {
      cleanUpRequest();
      reject(new Error(`${this.type} command dispatch failed`));
    }
  }
}

export default AppPermissionsRequest;
