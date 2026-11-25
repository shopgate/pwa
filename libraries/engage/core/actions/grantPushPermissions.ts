import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { PERMISSION_ID_PUSH } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';
import type { GrantPermissionsOptions, GrantPermissionsResult } from './grantPermissions';

export type GrantPushPermissionsResult = GrantPermissionsResult;

/**
 * The options of `grantPushPermissions`.
 */
type PushGrantOptions =
  Omit<GrantPermissionsOptions, 'permissionId' | 'permissionOptions' | 'useSettingsModal'> & {
    /**
     * Whether a declined permission shows a modal that leads to the app settings.
     * @default true
     */
    useSettingsModal?: boolean;
  };

/**
 * Determines the current state of the push permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPushPermissions<State = unknown>(
  options: PushGrantOptions & { resolveWithData: true }
): ThunkAction<Promise<GrantPushPermissionsResult>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the push permissions.
 * If not already happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPushPermissions<State = unknown>(
  options?: PushGrantOptions & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the push permissions.
 *
 * The promise resolves with an object when "resolveWithData" is TRUE, otherwise with a boolean.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPushPermissions<State = unknown>(
  options?: PushGrantOptions
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of the push permissions.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPushPermissions<State = unknown>(
  options: PushGrantOptions = {}
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction> {
  return (dispatch) => {
    const {
      useSettingsModal = true,
      useRationaleModal = false,
      settingsModal = {},
      rationaleModal = {},
      meta = {} as NonNullable<GrantPermissionsOptions['meta']>,
      ...rest
    } = options;

    const settingsModalOptions = settingsModal || {};

    return dispatch(grantPermissions<State>({
      useSettingsModal,
      useRationaleModal,
      settingsModal: {
        title: null,
        message: 'permissions.access_denied.push_message',
        confirm: 'permissions.access_denied.settings_button',
        dismiss: 'modal.dismiss',
        ...settingsModalOptions,
      },
      rationaleModal,
      meta,
      ...rest,
      permissionId: PERMISSION_ID_PUSH,
    }));
  };
}

export default grantPushPermissions;
