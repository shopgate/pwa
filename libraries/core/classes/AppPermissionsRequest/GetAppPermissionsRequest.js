import AppPermissionsRequest from './AppPermissionsRequest';
import {
  GET_PERMISSIONS_COMMAND_NAME,
  GET_PERMISSIONS_RESPONSE_EVENT_NAME,
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
   * @param {Array} permissionIds The permission ids.
   * @return {GetAppPermissionsRequest}
   */
  setPermissionIds(permissionIds) {
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
    // TODO implement validator.
    return true;
  }
}

export default GetAppPermissionsRequest;
