import AppPermissionsRequest, { TYPE_GET, TYPE_REQUEST } from '../classes/AppPermissionsRequest';

/**
 * Gathers the current permissions from the app.
 * @param {Array} permissionIds The desired permission ids. If kept empty all will be retured.
 * @return {Promise<Object>}
 */
export const getAppPermissions = (permissionIds = []) => {
  const request = new AppPermissionsRequest();
  return request
    .setType(TYPE_GET)
    .setPermissionIds(permissionIds)
    .dispatch();
};

/**
 * Requests additional permissions from the app.
 * @param {Array} permissionIds The desired permission ids. If kept empty all will be retured.
 * @return {Promise<Object>}
 */
export const requestAppPermissions = (permissionIds = []) => {
  const request = new AppPermissionsRequest();
  return request
    .setType(TYPE_REQUEST)
    .setPermissionIds(permissionIds)
    .dispatch();
};

