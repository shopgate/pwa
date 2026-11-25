import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { PERMISSION_ID_APP_TRACKING_TRANSPARENCY } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';
import type { GrantPermissionsOptions, GrantPermissionsResult } from './grantPermissions';

export type GrantAppTrackingTransparencyPermissionsResult = GrantPermissionsResult;

/**
 * The options of `grantAppTrackingTransparencyPermission`.
 */
type TrackingGrantOptions = Omit<GrantPermissionsOptions, 'permissionId' | 'permissionOptions'>;

/**
 * Determines the current state of the app tracking transparency permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantAppTrackingTransparencyPermission<State = unknown>(
  options: TrackingGrantOptions & { resolveWithData: true }
): ThunkAction<
  Promise<GrantAppTrackingTransparencyPermissionsResult>, State, unknown, UnknownAction
>;

/**
 * Determines the current state of the app tracking transparency permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantAppTrackingTransparencyPermission<State = unknown>(
  options?: TrackingGrantOptions & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the app tracking transparency permissions.
 *
 * The promise resolves with an object when "resolveWithData" is TRUE, otherwise with a boolean.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantAppTrackingTransparencyPermission<State = unknown>(
  options?: TrackingGrantOptions
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the app tracking transparency permissions.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantAppTrackingTransparencyPermission<State = unknown>(
  options: TrackingGrantOptions = {}
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction> {
  return (dispatch) => {
    const {
      meta = {} as NonNullable<GrantPermissionsOptions['meta']>,
      settingsModal,
      // @deprecated modal setting, to be removed in future major release
      modal,
      ...rest
    } = options;

    const settingsModalOptions = settingsModal || modal || {};

    return dispatch(grantPermissions<State>({
      meta,
      settingsModal: {
        message: 'permissions.access_denied.trackingMessage',
        confirm: 'permissions.access_denied.settings_button',
        dismiss: 'modal.dismiss',
        ...settingsModalOptions,
      },
      ...rest,
      permissionId: PERMISSION_ID_APP_TRACKING_TRANSPARENCY,
    }));
  };
}

export default grantAppTrackingTransparencyPermission;
