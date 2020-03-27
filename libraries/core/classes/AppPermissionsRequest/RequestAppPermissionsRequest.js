import { COMMAND_REQUEST_APP_PERMISSIONS } from '../../constants/AppCommands';
import { APP_EVENT_REQUEST_APP_PERMISSIONS_RESPONSE } from '../../constants/AppEvents';

import AppPermissionsRequest from './AppPermissionsRequest';
import { availablePermissionsIds } from '../../constants/AppPermissions';

/**
 * The RequestAppPermissionsRequest class is about to initiate the process to request
 * additional permissions from the operating system e.g. location or camera access.
 */
class RequestAppPermissionsRequest extends AppPermissionsRequest {
  /**
   * The constructor.
   */
  constructor() {
    super(COMMAND_REQUEST_APP_PERMISSIONS, APP_EVENT_REQUEST_APP_PERMISSIONS_RESPONSE);
  }

  /**
   * Sets the desired permissions for the request.
   * @param {Array} permissions The permissions.
   * @return {RequestAppPermissionsRequest}
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
    // The command can't be sent without command params.
    if (this.commandParams === null) {
      return false;
    }

    const { permissions } = this.commandParams;

    // If permissions are present they have to be an array.
    if (!Array.isArray(permissions) || permissions.length === 0) {
      return false;
    }

    return permissions.every((permission) => {
      // Check if the permission is a plain object.
      if (permission === null || typeof permission !== 'object') {
        return false;
      }

      const { permissionId } = permission;
      // Check if the permission id is valid.
      if (!availablePermissionsIds.includes(permissionId)) {
        return false;
      }

      return true;
    });
  }
}

export default RequestAppPermissionsRequest;
