import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import event from '@shopgate/pwa-core/classes/Event';
import { openAppSettings } from '@shopgate/engage/core/commands';
import { showModal } from '@shopgate/engage/core/actions';
import { getIsAndroidApp } from '@shopgate/engage/core/selectors';
import {
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_BACKGROUND_LOCATION,
  PERMISSION_ID_CAMERA,
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_USAGE_ALWAYS,
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
  availablePermissionsIds,
} from '@shopgate/engage/core/constants';
import type {
  PERMISSION_ID_PUSH,
  PERMISSION_ID_APP_TRACKING_TRANSPARENCY,
  PERMISSION_USAGE_WHEN_IN_USE,
} from '@shopgate/engage/core/constants';
import { logger, hasSGJavaScriptBridge, hasWebBridge } from '@shopgate/engage/core/helpers';
import type { AppThunk, RootState } from '@shopgate/engage/core/types';
import {
  softOptInShown,
  softOptInSelected,
  hardOptInShown,
  hardOptInSelected,
} from '../action-creators';
import requestAppPermission from './requestAppPermission';
import requestAppPermissionStatus from './requestAppPermissionStatus';
import { createMockedPermissions } from '../helpers/appPermissions';

/**
 * The status of an app permission.
 */
export type PermissionStatus =
  | typeof PERMISSION_STATUS_NOT_DETERMINED
  | typeof PERMISSION_STATUS_DENIED
  | typeof PERMISSION_STATUS_GRANTED
  | typeof PERMISSION_STATUS_NOT_SUPPORTED;

/**
 * The id of an app permission.
 */
export type PermissionId =
  | typeof PERMISSION_ID_LOCATION
  | typeof PERMISSION_ID_BACKGROUND_LOCATION
  | typeof PERMISSION_ID_CAMERA
  | typeof PERMISSION_ID_PUSH
  | typeof PERMISSION_ID_APP_TRACKING_TRANSPARENCY;

/**
 * The usage of the location permission.
 */
export type PermissionUsage =
  | typeof PERMISSION_USAGE_ALWAYS
  | typeof PERMISSION_USAGE_WHEN_IN_USE;

/**
 * Meta data for the opt-in tracking actions of a permission request.
 */
export interface PermissionMeta {
  permission: 'push' | 'location' | 'backgroundLocation' | 'camera' | 'tracking';
  context?: string;
  contextCounter?: number;
  usesSoftPushOptIn?: boolean;
  usesSoftTrackingOptIn?: boolean;
}

/**
 * Options for the rationale and the settings modal of a permission request.
 */
export interface PermissionModalOptions {
  /**
   * Modal title.
   */
  title?: string | null;
  /**
   * Modal message.
   */
  message?: string;
  /**
   * Label for the confirm button.
   */
  confirm?: string | null;
  /**
   * Label for the dismiss button.
   */
  dismiss?: string;
  /**
   * Additional parameters for i18n strings.
   */
  params?: Record<string, unknown>;
}

/**
 * The options of `grantPermissions`.
 */
export interface GrantPermissionsOptions {
  /**
   * The id of the permission to request.
   */
  permissionId: PermissionId;

  /**
   * Additional options for the permission request.
   */
  permissionOptions?: Record<string, unknown>;

  /**
   * Whether a declined permission shows a modal that leads to the app settings.
   * @default false
   */
  useSettingsModal?: boolean;

  /**
   * Whether a modal explains the permission before it is requested.
   * @default false
   */
  useRationaleModal?: boolean;

  /**
   * Options for the rationale modal.
   * @default {}
   */
  rationaleModal?: PermissionModalOptions;

  /**
   * Options for the settings modal.
   * @default {}
   */
  settingsModal?: PermissionModalOptions;

  /**
   * Options for the settings modal.
   * @deprecated use `settingsModal` instead
   */
  modal?: PermissionModalOptions;

  /**
   * When FALSE, only the current status is checked, without prompting the user.
   * @default true
   */
  requestPermissions?: boolean;

  /**
   * Whether the promise resolves with the status and more data instead of a boolean.
   * @default false
   */
  resolveWithData?: boolean;

  /**
   * Meta data used for opt-in tracking actions.
   */
  meta?: PermissionMeta & Record<string, unknown>;
}

/**
 * What `grantPermissions` resolves with when `resolveWithData` is set.
 */
export interface GrantPermissionsResult {
  /**
   * Whether the permission is granted after the action has been processed.
   */
  success: boolean;
  /**
   * The current status of the permission after the action has been processed.
   */
  status?: PermissionStatus;
  /**
   * Whether the user was prompted to grant permissions during the process.
   */
  optInRequested: boolean;
  /**
   * Additional options for the permission, e.g. usage (forwarded from native).
   */
  options?: {
    usage: PermissionUsage;
  };
  /**
   * Might be set when PWA runs in browser mode. In that cause it can contain resolved
   * location data.
   */
  data?: unknown;
}

/**
 * What `requestAppPermissionStatus` resolves with.
 */
export interface AppPermissionStatusResult {
  /**
   * The status of the permission.
   */
  status: PermissionStatus;
  /**
   * Additional options of the permission, e.g. usage.
   */
  options?: { usage: PermissionUsage };
}

/**
 * What `requestAppPermission` resolves with.
 */
export interface AppPermissionRequestResult extends AppPermissionStatusResult {
  /**
   * Data of the request, e.g. the location within browsers.
   */
  data?: unknown;
  /**
   * How long the native request took in milliseconds.
   */
  duration?: number;
}

// List of permissions that need a timing based user interaction check on Android, since we can't
// reliably handle this in the native layer.
const ANDROID_PERMISSIONS_WITH_USER_INTERACTION_CHECK: PermissionId[] = [
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_BACKGROUND_LOCATION,
  PERMISSION_ID_CAMERA,
];

/**
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 *
 * With the "resolveWithData" option set to TRUE, the promise resolves with an object containing
 * the permission status and additional data.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPermissions<State = unknown>(
  options: GrantPermissionsOptions & { resolveWithData: true }
): ThunkAction<Promise<GrantPermissionsResult>, State, unknown, UnknownAction>;

/**
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPermissions<State = unknown>(
  options: GrantPermissionsOptions & { resolveWithData?: false | undefined }
): ThunkAction<Promise<boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 *
 * The promise resolves with an object when "resolveWithData" is TRUE, otherwise with a boolean.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPermissions<State = unknown>(
  options: GrantPermissionsOptions
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction>;

/**
 * Determines the current state of a specific permission for an app feature.
 * @param options Action options.
 * @returns A redux thunk.
 */
function grantPermissions<State = unknown>(
  options: GrantPermissionsOptions = {} as GrantPermissionsOptions
): ThunkAction<Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction> {
  const thunk: AppThunk<Promise<GrantPermissionsResult | boolean>> = (
    dispatch,
    getState
    // eslint-disable-next-line no-async-promise-executor
  ) => new Promise(async (resolve) => {
    const {
      permissionId,
      permissionOptions,
      useSettingsModal = false,
      useRationaleModal = false,
      rationaleModal: rationaleModalOptions = {},
      settingsModal,
      // @deprecated options, to be removed in future major release
      modal,
      requestPermissions = true,
      resolveWithData = false,
      meta = {} as PermissionMeta,
    } = options;

    if (modal) {
      logger.warn('grantPermissions: The "modal" option is deprecated and will be removed in the future. Please use the "settingsModal" option instead.');
    }

    // In case the deprecated "modal" option is used, we want to use this for the settings modal, to
    const settingsModalOptions = settingsModal || modal || {};

    let dispatchMock: ReturnType<typeof createMockedPermissions> | undefined;
    let optInRequested = false;

    const isAndroidApp = getIsAndroidApp(getState() as RootState);

    if (!hasSGJavaScriptBridge() || hasWebBridge()) {
      /**
       * The fallbackStatus will be used at browsers that don't support the permissions API. By
       * default it will always resolve with GRANTED, so that further steps still might trigger a
       * permissions dialog. When permissions are not supposed to be requested, it will resolve
       * with the NOT_DETERMINED status, to keep logic between browsers / apps in sync as much as
       * possible.
       */
      const fallbackStatus = requestPermissions
        ? PERMISSION_STATUS_GRANTED
        : PERMISSION_STATUS_NOT_DETERMINED;

      dispatchMock = createMockedPermissions(fallbackStatus);
    }

    if (!availablePermissionsIds.includes(permissionId)) {
      logger.error('grandPermissions: %s is no valid permission id', permissionId);
      resolve(resolveWithData ? {
        success: false,
        optInRequested,
      } : false);
      return;
    }

    let status: PermissionStatus;
    let appPermissionOptions: GrantPermissionsResult['options'];
    let data: unknown;

    // Check the current status of the camera permissions.
    ({ status, options: appPermissionOptions } = await dispatch(requestAppPermissionStatus({
      permissionId,
      dispatchMock,
    })));

    // When the location permission is requested for "always" usage and the permissions where
    // already granted for "whenInUse" we need to trigger the permission request again to get
    // extended permissions.
    const upgradeLocationPermission = permissionId === PERMISSION_ID_LOCATION &&
      permissionOptions?.usage === PERMISSION_USAGE_ALWAYS &&
      status === PERMISSION_STATUS_GRANTED;

    // Stop the process when the permission type is not supported.
    if (status === PERMISSION_STATUS_NOT_SUPPORTED) {
      resolve(resolveWithData ? {
        success: false,
        optInRequested,
        status,
        ...appPermissionOptions ? { options: appPermissionOptions } : {},
      } : false);
      return;
    }

    // The user never seen the permissions dialog yet, or temporary denied the permissions
    // (Android).
    if (status === PERMISSION_STATUS_NOT_DETERMINED || upgradeLocationPermission) {
      if (!requestPermissions) {
        resolve(resolveWithData ? {
          success: false,
          optInRequested,
          status,
          ...appPermissionOptions ? { options: appPermissionOptions } : {},
        } : false);
        return;
      }

      if (useRationaleModal) {
        dispatch(softOptInShown({ meta }));

        const requestAllowed = await dispatch(showModal({
          message: rationaleModalOptions.message || '',
          confirm: rationaleModalOptions.confirm || '',
          dismiss: rationaleModalOptions.dismiss || '',
          params: rationaleModalOptions.params,
        }));

        dispatch(softOptInSelected({
          selection: requestAllowed ? 'approved' : 'later',
          meta,
        }));

        if (requestAllowed === false) {
          resolve(resolveWithData ? {
            success: false,
            optInRequested,
            status,
            ...appPermissionOptions ? { options: appPermissionOptions } : {},
          } : false);
          return;
        }
      }

      dispatch(hardOptInShown({
        permissionId,
        meta,
      }));

      const tsBeforeRequest = Date.now();

      let nativeRequestDuration: number | undefined;

      // Trigger the native permissions dialog.
      ({
        status,
        data,
        options: appPermissionOptions,
        duration: nativeRequestDuration,
      } = await dispatch(requestAppPermission({
        permissionId,
        dispatchMock,
        ...permissionOptions ? { options: permissionOptions } : {},
      })));

      let wasUserInteraction = true;

      /**
       * On iOS it's not possible to get "notDetermined" status for "always" location permissions.
       * So we might run into this decision branch of the code for when "always" permissions are
       * requested, even if we don't know if a dialog will be shown.
       * We can only guess that the user interacted with the dialog and if we might need to show
       * the settings modal.
       *
       * Additionally, at some permissions requests on Android we can't prevent that the
       * getPermissions request returns "notDetermined" since there is an user option to ask for
       * permission acceptance every time its needed. So we also need to try a user interaction
       * guess.
       */
      if (
        upgradeLocationPermission ||
        (isAndroidApp && ANDROID_PERMISSIONS_WITH_USER_INTERACTION_CHECK.includes(permissionId))
      ) {
        // When available, use the duration of the native request as heuristic for user
        // interaction. It's more accurate, since it won't include the time that communication
        // with the app takes.
        const requestDuration = typeof nativeRequestDuration === 'number'
          ? nativeRequestDuration
          : (Date.now() - tsBeforeRequest);

        wasUserInteraction = requestDuration > 1000;
      }

      optInRequested = wasUserInteraction;

      dispatch(hardOptInSelected({
        permissionId,
        status,
        meta,
      }));

      // The user denied the permissions within the native dialog.
      if (status === PERMISSION_STATUS_DENIED || status === PERMISSION_STATUS_NOT_DETERMINED) {
        if (wasUserInteraction) {
          resolve(resolveWithData ? {
            success: false,
            optInRequested,
            status,
            ...appPermissionOptions ? { options: appPermissionOptions } : {},
          } : false);
          return;
        }
      }
    }

    if (status === PERMISSION_STATUS_GRANTED) {
      resolve(resolveWithData ? {
        success: true,
        optInRequested,
        status,
        ...appPermissionOptions ? { options: appPermissionOptions } : {},
        ...data !== undefined ? { data } : {},
      } : true);
      return;
    }

    // The user permanently denied the permissions before.
    if (status === PERMISSION_STATUS_DENIED) {
      if (!useSettingsModal) {
        resolve(resolveWithData ? {
          success: false,
          optInRequested,
          status,
          ...appPermissionOptions ? { options: appPermissionOptions } : {},
        } : false);
        return;
      }

      // Present a modal that describes the situation, and allows the user to enter the app
      // settings.
      const openSettings = await dispatch(showModal({
        title: settingsModalOptions.title || null,
        message: settingsModalOptions.message,
        confirm: settingsModalOptions.confirm === undefined
          ? 'permissions.access_denied.settings_button'
          : settingsModalOptions.confirm,
        dismiss: settingsModalOptions.dismiss ?? 'modal.dismiss',
        params: settingsModalOptions.params,
      }));

      // The user just closed the modal.
      if (!openSettings) {
        resolve(resolveWithData ? {
          success: false,
          optInRequested,
          status,
          ...appPermissionOptions ? { options: appPermissionOptions } : {},
        } : false);
        return;
      }

      /**
       * Handler for the app event.
       */
      const handler = async () => {
        event.removeCallback(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND, handler);
        ({ status } = await dispatch(requestAppPermissionStatus({
          permissionId,
        })));

        resolve(resolveWithData ? {
          success: status === PERMISSION_STATUS_GRANTED,
          optInRequested,
          status,
          ...appPermissionOptions ? { options: appPermissionOptions } : {},
        } : status === PERMISSION_STATUS_GRANTED);
      };

      /**
       * Register an event handler, so that we can perform the permissions check again,
       * when the user comes back from the settings.
       */
      event.addCallback(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND, handler);

      // Open the settings (protected by a timeout, so that the modal closes before the app is
      // left).
      setTimeout(() => {
        openAppSettings();
      }, 0);

      return;
    }

    resolve(resolveWithData ? {
      success: false,
      optInRequested,
      status,
      ...appPermissionOptions ? { options: appPermissionOptions } : {},
    } : false);
  });

  return thunk as unknown as ThunkAction<
    Promise<GrantPermissionsResult | boolean>, State, unknown, UnknownAction
  >;
}

export default grantPermissions;
