import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { PERMISSION_ID_CAMERA } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';
import type { GrantPermissionsOptions, GrantPermissionsResult } from './grantPermissions';

export type GrantCameraPermissionsResult = GrantPermissionsResult;

/**
 * The options of `grantCameraPermissions`.
 */
type CameraGrantOptions = Omit<GrantPermissionsOptions, 'permissionId' | 'permissionOptions'>;

/**
 * Determines the current state of the camera permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantCameraPermissions<State = unknown>(
  options: CameraGrantOptions & { resolveWithData: true }
): ThunkAction<Promise<GrantCameraPermissionsResult>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the camera permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantCameraPermissions<State = unknown>(
  options?: CameraGrantOptions & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the camera permissions.
 *
 * The promise resolves with an object when "resolveWithData" is TRUE, otherwise with a boolean.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantCameraPermissions<State = unknown>(
  options?: CameraGrantOptions
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the camera permissions.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantCameraPermissions<State = unknown>(
  options: CameraGrantOptions = {}
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction> {
  return (dispatch) => {
    const {
      useSettingsModal = false,
      settingsModal,
      // @deprecated modal setting, to be removed in future major release
      modal,
      ...rest
    } = options;

    const settingsModalOptions = settingsModal || modal || {};

    return dispatch(grantPermissions<State>({
      useSettingsModal,
      settingsModal: {
        title: null,
        message: 'permissions.access_denied.camera_message',
        confirm: 'permissions.access_denied.settings_button',
        dismiss: 'common.close',
        ...settingsModalOptions,
      },
      ...rest,
      permissionId: PERMISSION_ID_CAMERA,
    }));
  };
}

export default grantCameraPermissions;
