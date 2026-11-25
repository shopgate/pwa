import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { PERMISSION_ID_LOCATION, PERMISSION_USAGE_ALWAYS } from '@shopgate/engage/core/constants';
import { hasWebBridge } from '@shopgate/engage/core';
import grantPermissions from './grantPermissions';
import type { GrantPermissionsOptions, GrantPermissionsResult } from './grantPermissions';

export type GrantGeolocationPermissionsResult = GrantPermissionsResult;

/**
 * The geolocation specific options of `grantGeolocationPermissions`.
 */
type GeolocationOptions = {
  /**
   * Whether to request background location access. It causes extended reviews by Google and
   * Apple, so Shopgate needs to enable it.
   */
  requireBackgroundAccess?: boolean;
};

/**
 * The options of `grantGeolocationPermissions`.
 */
export type GeolocationGrantOptions =
  Omit<GrantPermissionsOptions, 'permissionId' | 'permissionOptions'> & GeolocationOptions;

/**
 * Determines the current state of the geolocation permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantGeolocationPermissions<State = unknown>(
  options: GeolocationGrantOptions & { resolveWithData: true }
): ThunkAction<Promise<GrantGeolocationPermissionsResult>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the geolocation permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantGeolocationPermissions<State = unknown>(
  options?: GeolocationGrantOptions & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the geolocation permissions.
 *
 * The promise resolves with an object when "resolveWithData" is TRUE, otherwise with a boolean.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantGeolocationPermissions<State = unknown>(
  options?: GeolocationGrantOptions
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the geolocation permissions.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantGeolocationPermissions<State = unknown>(
  options: GeolocationGrantOptions = {}
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction> {
  return (dispatch) => {
    const {
      useSettingsModal = false,
      settingsModal,
      // @deprecated modal setting, to be removed in future major release
      modal,
      requestPermissions = true,
      resolveWithData = false,
      requireBackgroundAccess = false,
      ...rest
    } = options;

    const settingsModalOptions = settingsModal || modal || {};

    return dispatch(grantPermissions<State>({
      ...requireBackgroundAccess ? { permissionOptions: { usage: PERMISSION_USAGE_ALWAYS } } : {},
      requestPermissions,
      resolveWithData,
      useSettingsModal,
      settingsModal: {
        title: null,
        message: `permissions.access_denied.${requireBackgroundAccess ? 'geolocationMessageBackground' : 'geolocation_message'}`,
        confirm: !hasWebBridge() ? 'permissions.access_denied.settings_button' : null,
        dismiss: 'modal.dismiss',
        ...settingsModalOptions,
      },
      ...rest,
      permissionId: PERMISSION_ID_LOCATION,
    }));
  };
}

export default grantGeolocationPermissions;
