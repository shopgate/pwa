import AppPermissionsRequest from './AppPermissionsRequest';
import {
  REQUEST_PERMISSIONS_COMMAND_NAME,
  REQUEST_PERMISSIONS_RESPONSE_EVENT_NAME,
} from '../../constants/AppPermissions';

/**
 * The RequestAppPermissionsRequest class is about to initiate the process to request
 * additional permissions from the operating system e.g. location or camera access.
 */
class RequestAppPermissionsRequest extends AppPermissionsRequest {
  /**
   * The constructor.
   */
  constructor() {
    super(REQUEST_PERMISSIONS_COMMAND_NAME, REQUEST_PERMISSIONS_RESPONSE_EVENT_NAME);
  }

  /**
   * Sets the desired permissions for the request.
   * @param {Array} permissions The permissions.
   * @return {GetAppPermissionsRequest}
   */
  setPermissions(permissions) {
    this.setCommandParams({ permissions });
    return this;
  }

  /**
   * Validates the request command parameters.
   * @override
   * @private
   * @return {boolean}
   */
  validateCommandParams() {
    // TODO implement validator.
    return true;
  }
}

export default RequestAppPermissionsRequest;
