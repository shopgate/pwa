import AppCommandRequest from '../AppCommandRequest';

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
    this.dispatchMock = null;
    this.setLibVersion('18.0');
  }

  /**
   * Sets a mock for the dispatch method
   * @private
   * @param {Function} dispatchMock The dispatch mock
   * @returns {AppPermissionsRequest}
   */
  setDispatchMock(dispatchMock = null) {
    this.dispatchMock = dispatchMock;
    return this;
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
    if (typeof this.dispatchMock === 'function') {
      return this.dispatchMock(this.commandName, this.commandParams);
    }

    return super.dispatch();
  }
}

export default AppPermissionsRequest;
