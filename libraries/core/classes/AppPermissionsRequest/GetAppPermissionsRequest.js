import { COMMAND_GET_APP_PERMISSIONS } from '../../constants/AppCommands';
import { APP_EVENT_GET_APP_PERMISSIONS_RESPONSE } from '../../constants/AppEvents';

import AppPermissionsRequest from './AppPermissionsRequest';
import { availablePermissionsIds } from '../../constants/AppPermissions';

/**
 * The GetAppPermissionsRequest class is about to get an overview about the already granted
 * permissions by the operation system e.g. location or camera access.
 */
class GetAppPermissionsRequest extends AppPermissionsRequest {
  /**
   * The constructor.
   */
  constructor() {
    super(COMMAND_GET_APP_PERMISSIONS, APP_EVENT_GET_APP_PERMISSIONS_RESPONSE);
  }

  /**
   * Sets the desired permission ids for the request.
   * @param {Array} [permissionIds=[]] The permission ids.
   * @return {GetAppPermissionsRequest}
   */
  setPermissionIds(permissionIds = []) {
    this.setCommandParams({ permissionIds });
    return this;
  }

  /**
   * Validates the request command parameters.
   * @override
   * @private
   * @return {boolean}
   */
  validateCommandParams() {
    // Empty command params are ok for this command.
    if (this.commandParams === null) {
      return true;
    }

    const { permissionIds } = this.commandParams;

    // If permission ids are present they have to be an array.
    if (!Array.isArray(permissionIds)) {
      return false;
    }

    // An empty permissionsIds array is ok for the command.
    if (permissionIds.length === 0) {
      return true;
    }

    // Check if all permission ids are valid.
    return permissionIds.every(permissionId => availablePermissionsIds.includes(permissionId));
  }
}

export default GetAppPermissionsRequest;
