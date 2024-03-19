import { APP_PERMISSION_STATUS_RECEIVED } from '../constants/actionTypes';

/**
 * Creates the APP_PERMISSION_STATUS_RECEIVED Redux action object that's supposed to be dispatched
 * when a permission status was requested from the app.
 * @param {Object} params Action params
 * @param {string} params.permissionId The updated permission id
 * @param {string} params.status The new status
 * @param {Object} [params.options={}], Extended options for the permission
 * @returns {Object} The Redux action object
 */
export const appPermissionStatusReceived = ({
  permissionId,
  status,
  options = {},
}) => ({
  type: APP_PERMISSION_STATUS_RECEIVED,
  permissionId,
  status,
  options,
});
