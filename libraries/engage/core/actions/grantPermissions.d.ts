import type { UnknownAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

type PermissionStatus =
  | typeof import('@shopgate/engage/core/constants').PERMISSION_STATUS_NOT_DETERMINED
  | typeof import('@shopgate/engage/core/constants').PERMISSION_STATUS_DENIED
  | typeof import('@shopgate/engage/core/constants').PERMISSION_STATUS_GRANTED
  | typeof import('@shopgate/engage/core/constants').PERMISSION_STATUS_NOT_SUPPORTED

type PermissionId =
  | typeof import('@shopgate/engage/core/constants').PERMISSION_ID_LOCATION
  | typeof import('@shopgate/engage/core/constants').PERMISSION_ID_BACKGROUND_LOCATION
  | typeof import('@shopgate/engage/core/constants').PERMISSION_ID_CAMERA
  | typeof import('@shopgate/engage/core/constants').PERMISSION_ID_PUSH
  | typeof import('@shopgate/engage/core/constants').PERMISSION_ID_APP_TRACKING_TRANSPARENCY

type PermissionUsage =
  | typeof import('@shopgate/engage/core/constants').PERMISSION_USAGE_ALWAYS
  | typeof import('@shopgate/engage/core/constants').PERMISSION_USAGE_WHEN_IN_USE

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
  confirm?: string;
  /**
   * Label for the dismiss button.
   */
  dismiss?: string;
  /**
   * Additional parameters for i18n strings.
   */
  params?: Record<string, unknown>;
}

export interface GrantPermissionsOptions {
  /**
   * The id of the permission to request.
   */
  permissionId: PermissionId;

  /**
   * Additional options for the permission request (forwarded to native).
   */
  permissionOptions?: Record<string, unknown>;

  /**
   * Whether in case of declined permissions a modal shall redirect to app settings.
   * Options for the settings modal can be set via `modal` property.
   */
  useSettingsModal?: boolean;

  /**
   * Whether a rationale modal should be shown before requesting the permission.
   * Options for the rationale modal can be set via `rationaleModal` property.
   */
  useRationaleModal?: boolean;

  /**
   * Options for the rationale modal.
   */
  rationaleModal?: PermissionModalOptions;

  /**
   * Options for the settings modal.
   */
  modal?: PermissionModalOptions;

  /**
   * If TRUE, no permissions will be requested if not already granted.
   * (I.e. only check status.)
   */
  requestPermissions?: boolean;

  /**
   * If TRUE, resolves with a data object instead of a boolean.
   * Note: your JS default currently sets `resolveWithData = false`.
   */
  resolveWithData?: boolean;

  /**
   * Meta data used for opt-in tracking actions.
   */
  meta?: Record<string, unknown>;
}

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
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 */
declare function grantPermissions<State = unknown>(
  options: GrantPermissionsOptions
): ThunkAction<Promise<GrantPermissionsResult|boolean>, State, unknown, UnknownAction>;

export default grantPermissions;
