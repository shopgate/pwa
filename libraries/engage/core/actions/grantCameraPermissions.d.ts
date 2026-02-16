import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

export type { GrantPermissionsOptions, GrantPermissionsResult } from './grantPermissions';
export type { GrantPermissionsOptions, GrantPermissionsResult };

/**
 * Determines the current state of the camera permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 */
declare function grantCameraPermissions<State = unknown>(
  options: Omit<GrantPermissionsOptions, 'permissionId'> & { resolveWithData: true }
): ThunkAction<Promise<GrantPermissionsResult>, State, unknown, UnknownAction>;

declare function grantCameraPermissions<State = unknown>(
  options?: Omit<GrantPermissionsOptions, 'permissionId'> & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

export default grantCameraPermissions;
