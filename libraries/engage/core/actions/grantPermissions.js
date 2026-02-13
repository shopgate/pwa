import event from '@shopgate/pwa-core/classes/Event';
import { openAppSettings } from '@shopgate/engage/core/commands';
import { showModal } from '@shopgate/engage/core/actions';
import {
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_USAGE_WHEN_IN_USE,
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

/**
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
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
 * @param {Object} [options.modal={}] Options for the settings modal.
 * @param {string} options.modal.title Modal title.
 * @param {string} options.modal.message Modal message.
 * @param {string} options.modal.confirm Label for the confirm button.
 * @param {string} options.modal.dismiss Label for the dismiss button.
 * @param {Object} options.modal.params Additional parameters for i18n strings.
 * @param {boolean} [options.requestPermissions=true] If set to TRUE no permissions will be
 * requested if not already granted,
 * @param {boolean} [options.resolveWithData=true] When set to TRUE the promise will resolve with
 * an object containing the permission status and whether the opt-in dialog was shown,
 * instead of a boolean value.
 * @param {Object} [options.meta={}] Additional meta data used for opt-in tracking actions
 * @return { Function } A redux thunk.
 */
const grantPermissions = (options = {}) => dispatch => new Promise(async (resolve) => {
  const {
    permissionId,
    permissionOptions,
    useSettingsModal = false,
    useRationaleModal = false,
    rationaleModal: rationaleModalOptions = {},
    modal: modalOptions = {},
    requestPermissions = true,
    resolveWithData = false,
    meta = {},
  } = options;

  let dispatchMock;

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
      optInRequested: false,
    } : false);
    return;
  }

  let status;
  let statusOptions;
  let data;

  // Check the current status of the camera permissions.
  // eslint-disable-next-line prefer-const
  ({ status, options: statusOptions } = await dispatch(requestAppPermissionStatus({
    permissionId,
    dispatchMock,
  })));

  // When the location permission is requested for "always" usage and the permissions where already
  // granted for "whenInUse" we need to trigger the permission request again to get extended
  // permissions.
  const upgradeLocationPermissions = status === PERMISSION_STATUS_GRANTED &&
    permissionOptions?.usage === PERMISSION_USAGE_ALWAYS &&
    statusOptions?.usage === PERMISSION_USAGE_WHEN_IN_USE;

  // Stop the process when the permission type is not supported.
  if (status === PERMISSION_STATUS_NOT_SUPPORTED) {
    resolve(resolveWithData ? {
      success: false,
      optInRequested: false,
      status,
    } : false);
    return;
  }

  // The user never seen the permissions dialog yet, or temporary denied the permissions (Android).
  if (status === PERMISSION_STATUS_NOT_DETERMINED || upgradeLocationPermissions) {
    if (!requestPermissions) {
      resolve(resolveWithData ? {
        success: false,
        optInRequested: false,
        status,
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
          optInRequested: false,
          status,
          reason: 'rationaleDeclined',
        } : false);
        return;
      }
    }

    dispatch(hardOptInShown({
      permissionId,
      meta,
    }));

    // Trigger the native permissions dialog.
    ({ status, data } = await dispatch(requestAppPermission({
      permissionId,
      dispatchMock,
      ...permissionOptions ? { options: permissionOptions } : {},
    })));

    dispatch(hardOptInSelected({
      permissionId,
      status,
      meta,
    }));

    // The user denied the permissions within the native dialog.
    if ([PERMISSION_STATUS_DENIED, PERMISSION_STATUS_NOT_DETERMINED].includes(status)) {
      resolve(resolveWithData ? {
        success: false,
        optInRequested: true,
        status,
      } : false);
      return;
    }
  }

  if (status === PERMISSION_STATUS_GRANTED) {
    resolve(resolveWithData ? {
      success: true,
      optInRequested: true,
      status,
      data,
    } : true);
    return;
  }

  // The user permanently denied the permissions before.
  if (status === PERMISSION_STATUS_DENIED) {
    if (!useSettingsModal) {
      resolve(resolveWithData ? {
        success: false,
        optInRequested: true,
        status,
      } : false);
      return;
    }

    // Present a modal that describes the situation, and allows the user to enter the app settings.
    const openSettings = await dispatch(showModal({
      title: modalOptions.title || null,
      message: modalOptions.message,
      confirm: modalOptions.confirm,
      dismiss: modalOptions.dismiss,
      params: modalOptions.params,
    }));

    // The user just closed the modal.
    if (!openSettings) {
      resolve(resolveWithData ? {
        success: false,
        optInRequested: true,
        reason: 'openSettingsDeclined',
        status,
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

      resolve(status === PERMISSION_STATUS_GRANTED);
      resolve(resolveWithData ? {
        success: status === PERMISSION_STATUS_GRANTED,
        optInRequested: true,
        status,
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
  }
});

export default grantPermissions;
