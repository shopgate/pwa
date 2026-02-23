import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import type { GrantPermissionsOptions } from './grantPermissions';

export type GetGeolocationResult = {
  /**
   * The longitude of the user's location.
   */
  longitude: number;
  /**
   * The latitude of the user's location.
   */
  latitude: number;
  /**
   * The accuracy of the geolocation data, in meters.
   */
  accuracy: number;
}

export type GetGeolocationReject = Error & { code: string }

/**
 * Determines the current geolocation of the user. When geolocation permissions are not granted yet,
 * the user will be prompted to grant access.
 *
 * When the permissions are granted, the action will resolve with the geolocation data.
 * Otherwise, it will reject with an error.
 */
declare function getGeolocation<State = unknown>(
  options: Omit<GrantPermissionsOptions, 'permissionId'|'permissionOptions'>
): ThunkAction<Promise<GetGeolocationResult, GetGeolocationReject>, State, unknown, UnknownAction>;

export default getGeolocation;
