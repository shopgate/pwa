import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import type { GrantPermissionsOptions, GrantPermissionsResult } from './grantPermissions';

export type GrantAppTrackingTransparencyPermissionsResult = GrantPermissionsResult;

/**
 * Determines the current state of the app tracking transparency permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 */
declare function grantAppTrackingTransparencyPermission<State = unknown>(
  options: Omit<GrantPermissionsOptions, 'permissionId'|'permissionOptions'> & { resolveWithData: true }
): ThunkAction<Promise<GrantAppTrackingTransparencyPermissionsResult>, State, unknown, UnknownAction>;

declare function grantAppTrackingTransparencyPermission<State = unknown>(
  options?: Omit<GrantPermissionsOptions, 'permissionId'|'permissionOptions'> & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

export default grantAppTrackingTransparencyPermission;
