import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import type { GrantPermissionsOptions, GrantPermissionsResult } from './grantPermissions';
export type { GrantPermissionsOptions, GrantPermissionsResult };

type GeolocationOptions = {
  /**
   * Whether to request background location access.
   *
   * **Note:** Since background location access will cause extended reviews by Google and Apple,
   * this feature needs to be explicitly enabled by Shopgate.
   */
  requireBackgroundAccess?: boolean;
}

type GeolocationGrantOptions = Omit<GrantPermissionsOptions, 'permissionId'> & GeolocationOptions;

/**
 * Determines the current state of the geolocation permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 */
declare function grantGeolocationPermissions<State = unknown>(
  options: GeolocationGrantOptions & { resolveWithData: true }
): ThunkAction<Promise<GrantPermissionsResult>, State, unknown, UnknownAction>;

declare function grantGeolocationPermissions<State = unknown>(
  options?: GeolocationGrantOptions & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

export default grantGeolocationPermissions;
