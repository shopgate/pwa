import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { hasWebBridge, hasSGJavaScriptBridge } from '@shopgate/engage/core/helpers';
import { GEOLOCATION_ERROR_DENIED } from '@shopgate/engage/core/constants';
import grantGeolocationPermissions from './grantGeolocationPermissions';
import type { GeolocationGrantOptions } from './grantGeolocationPermissions';
import GeolocationRequest from '../classes/GeolocationRequest';

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
};

/**
 * The error `getGeolocation` rejects with.
 */
export type GetGeolocationReject = Error & { code: string };

/**
 * Determines the current geolocation of the user. When geolocation permissions are not granted
 * yet, the user will be prompted to grant access.
 *
 * When the permissions are granted, the action will resolve with the geolocation data.
 * Otherwise, it will reject with a `GetGeolocationReject` error.
 * @param options Action options.
 * @returns A redux thunk.
 */
function getGeolocation<State = unknown>(
  options: GeolocationGrantOptions = {}
): ThunkAction<Promise<GetGeolocationResult>, State, unknown, UnknownAction> {
  return async (dispatch) => {
    const result = await dispatch(grantGeolocationPermissions<State>({
      ...options,
      resolveWithData: true,
    }));

    if (result?.data) {
      // Other than the app, within browsers we might already have a geolocation.
      return Promise.resolve(result.data as GetGeolocationResult);
    }

    if (!result.success) {
      const error = new Error('Geolocation permissions not granted.') as GetGeolocationReject;
      error.code = GEOLOCATION_ERROR_DENIED;
      throw error;
    }

    return new GeolocationRequest(!hasSGJavaScriptBridge() || hasWebBridge()).dispatch();
  };
}

export default getGeolocation;
