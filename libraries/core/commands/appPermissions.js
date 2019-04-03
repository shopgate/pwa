import GetAppPermissionsRequest from '../classes/AppPermissionsRequest/GetAppPermissionsRequest';
import RequestAppPermissionsRequest from '../classes/AppPermissionsRequest/RequestAppPermissionsRequest';

/**
 * Gathers the current permissions from the operating system.
 * @param {Array} [permissionIds=[]] The desired permission ids. If kept empty all will be returned.
 * @return {Promise<Array>}
 */
export const getAppPermissions = (permissionIds = []) =>
  new GetAppPermissionsRequest()
    .setPermissionIds(permissionIds)
    .dispatch();

/**
 * Requests additional permissions from the operating system.
 * @param {Array} permissions The desired permissions. If kept empty all will be returned.
 * @return {Promise<Array>}
 */
export const requestAppPermissions = permissions =>
  new RequestAppPermissionsRequest()
    .setPermissions(permissions)
    .dispatch();
