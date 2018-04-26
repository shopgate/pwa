import AppPermissionsRequest from './AppPermissionsRequest';
import {
  GET_PERMISSIONS_COMMAND_NAME,
  GET_PERMISSIONS_RESPONSE_EVENT_NAME,
  availablePermissionsIds,
} from '../../constants/AppPermissions';

/**
 * The GetAppPermissionsRequest class is about to get an overview about the already granted
 * permissions by the operation system e.g. location or camera access.
 */
class GetAppPermissionsRequest extends AppPermissionsRequest {
  /**
   * The constructor.
   */
  constructor() {
    super(GET_PERMISSIONS_COMMAND_NAME, GET_PERMISSIONS_RESPONSE_EVENT_NAME);
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
    // Empty commmand params are ok for this commmand.
    if (this.commandParams === null) {
      return true;
    }

    const { permissionIds } = this.commandParams;

    // If permission ids  are present they have to be an array.
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
