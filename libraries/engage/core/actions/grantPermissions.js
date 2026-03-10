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
import { logger, hasSGJavaScriptBridge, hasWebBridge } from '@shopgate/engage/core/helpers';
import {
  softOptInShown,
  softOptInSelected,
  hardOptInShown,
  hardOptInSelected,
} from '../action-creators';
import requestAppPermission from './requestAppPermission';
import requestAppPermissionStatus from './requestAppPermissionStatus';
import { createMockedPermissions } from '../helpers/appPermissions';

// List of permissions that need a timing based user interaction check on Android, since we can't
// reliably handle this in the native layer.
const ANDROID_PERMISSIONS_WITH_USER_INTERACTION_CHECK = [
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_BACKGROUND_LOCATION,
  PERMISSION_ID_CAMERA,
];

/**
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 *
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 *
 * When the "resolveWithData" option is set to TRUE, the promise will resolve with an object
 * containing the permission status and additional data, instead of a boolean value.
 * @param {Object} options Action options.
 * @param {string} options.permissionId The id of the permission to request.
 * @param {Object} [options.permissionOptions={}] Additional options for the permission request.
 * @param {boolean} [options.useSettingsModal=false] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {boolean} [options.useRationaleModal=false] Whether a rational modal should be shown that
 * describes why the permission is needed before requesting the permission.
 * @param {Object} [options.rationaleModal={}] Options for the rationale modal.
 * @param {string} options.rationaleModal.title Modal title.
 * @param {string} options.rationaleModal.message Modal message.
 * @param {string} options.rationaleModal.confirm Label for the confirm button.
 * @param {string} options.rationaleModal.dismiss Label for the dismiss button.
 * @param {Object} options.rationaleModal.params Additional parameters for i18n strings.
 * @param {Object} [options.settingsModal={}] Options for the settings modal.
 * @param {string} options.settingsModal.title Modal title.
 * @param {string} options.settingsModal.message Modal message.
 * @param {string} options.settingsModal.confirm Label for the confirm button.
 * @param {string} options.settingsModal.dismiss Label for the dismiss button.
 * @param {Object} options.settingsModal.params Additional parameters for i18n strings.
 * @param {boolean} [options.requestPermissions=true] If set to TRUE no permissions will be
 * requested if not already granted,
 * @param {boolean} [options.resolveWithData=true] When set to TRUE the promise will resolve with
 * an object containing the permission status and whether the opt-in dialog was shown,
 * instead of a boolean value.
 * @param {Object} [options.meta={}] Additional meta data used for opt-in tracking actions
 * @return { Function } A redux thunk.
 */
const grantPermissions = (options = {}) => (
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
    meta = {},
  } = options;

  if (modal) {
    logger.warn('grantPermissions: The "modal" option is deprecated and will be removed in the future. Please use the "settingsModal" option instead.');
  }

  // In case the deprecated "modal" option is used, we want to use this for the settings modal, to
  const settingsModalOptions = settingsModal || modal || {};

  let dispatchMock;
  let optInRequested = false;

  const isAndroidApp = getIsAndroidApp(getState());

  if (!hasSGJavaScriptBridge() || hasWebBridge()) {
    /**
     * The fallbackStatus will be used at browsers that don't support the permissions API. By
     * default it will always resolve with GRANTED, so that further steps still might trigger a
     * permissions dialog. When permissions are not supposed to be requested, it will resolve with
     * the NOT_DETERMINED status, to keep logic between browsers / apps in sync as much as possible.
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

  let status;
  let appPermissionOptions;
  let data;

  // Check the current status of the camera permissions.
  ({ status, options: appPermissionOptions } = await dispatch(requestAppPermissionStatus({
    permissionId,
    dispatchMock,
  })));

  // When the location permission is requested for "always" usage and the permissions where already
  // granted for "whenInUse" we need to trigger the permission request again to get extended
  // permissions.
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

  // The user never seen the permissions dialog yet, or temporary denied the permissions (Android).
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

    let nativeRequestDuration;

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
     * permission acceptance every time its needed. So we also need to try a user interaction guess.
     */
    if (
      upgradeLocationPermission ||
      (isAndroidApp && ANDROID_PERMISSIONS_WITH_USER_INTERACTION_CHECK.includes(permissionId))
    ) {
      // When available, use the duration of the native request as heuristic for user interaction.
      // It's more accurate, since it won't include the time that communication with the app takes.
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
    if ([PERMISSION_STATUS_DENIED, PERMISSION_STATUS_NOT_DETERMINED].includes(status)) {
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

    // Present a modal that describes the situation, and allows the user to enter the app settings.
    const openSettings = await dispatch(showModal({
      title: settingsModalOptions.title || null,
      message: settingsModalOptions.message,
      confirm: settingsModalOptions.confirm ?? 'permissions.access_denied.settings_button',
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

    // Open the settings (protected by a timeout, so that the modal closes before the app is left).
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

export default grantPermissions;
