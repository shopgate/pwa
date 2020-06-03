import GetAppPermissionsRequest from '../classes/AppPermissionsRequest/GetAppPermissionsRequest';
import RequestAppPermissionsRequest from '../classes/AppPermissionsRequest/RequestAppPermissionsRequest';

/**
 * Gathers the current permissions from the operating system.
 * @param {Array} [permissionIds=[]] The desired permission ids. If kept empty all will be returned.
 * @param {Function} [dispatchMock=null] An optional mock for the dispatch logic of the request.
 * @return {Promise<Array>}
 */
export const getAppPermissions = (permissionIds = [], dispatchMock = null) =>
  new GetAppPermissionsRequest()
    .setPermissionIds(permissionIds)
    .setDispatchMock(dispatchMock)
    .dispatch();

/**
 * Requests additional permissions from the operating system.
 * @param {Array} permissions The desired permissions. If kept empty all will be returned.
 * @param {Function} [dispatchMock=null] An optional mock for the dispatch logic of the request.
 * @return {Promise<Array>}
 */
export const requestAppPermissions = (permissions, dispatchMock = null) =>
  new RequestAppPermissionsRequest()
    .setPermissions(permissions)
    .setDispatchMock(dispatchMock)
    .dispatch();
