import event from '@shopgate/pwa-core/classes/Event';
import { openAppSettings } from '@shopgate/engage/core/commands';
import { showModal } from '@shopgate/engage/core/actions';
import {
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
  availablePermissionsIds,
} from '@shopgate/engage/core/constants';
import { logger, hasSGJavaScriptBridge, hasWebBridge } from '@shopgate/engage/core/helpers';
import requestAppPermission from './requestAppPermission';
import requestAppPermissionStatus from './requestAppPermissionStatus';
import { createMockedPermissions } from '../helpers/appPermissions';

/**
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {string} options.permissionId The id of the permission to request.
 * @param {boolean} [options.useSettingsModal=false] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {boolean} [options.useRationaleModal=false] Whether a rational modal should be shown
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
 * @param {boolean} [options.resolveWithData=false] If set to TRUE the Promise will resolve with
 * data if available (e.g. geolocation).
 * @return { Function } A redux thunk.
 */
const grantPermissions = (options = {}) => dispatch => new Promise(async (resolve) => {
  const {
    permissionId,
    useSettingsModal = false,
    useRationaleModal = false,
    rationaleModal: rationaleModalOptions = {},
    modal: modalOptions = {},
    requestPermissions = true,
    resolveWithData = false,
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
    resolve(false);
    return;
  }

  let status;
  let data;

  // Check the current status of the camera permissions.
  ({ status } = await dispatch(requestAppPermissionStatus({
    permissionId,
    dispatchMock,
  })));

  // Stop the process when the permission type is not supported.
  if (status === PERMISSION_STATUS_NOT_SUPPORTED) {
    resolve(false);
    return;
  }

  // The user never seen the permissions dialog yet, or temporary denied the permissions (Android).
  if (status === PERMISSION_STATUS_NOT_DETERMINED) {
    if (!requestPermissions) {
      resolve(false);
      return;
    }

    if (useRationaleModal) {
      const requestAllowed = await dispatch(showModal({
        message: rationaleModalOptions.message || '',
        confirm: rationaleModalOptions.confirm || '',
        dismiss: rationaleModalOptions.dismiss || '',
        params: rationaleModalOptions.params,
      }));

      if (requestAllowed === false) {
        resolve(false);
        return;
      }
    }

    // Trigger the native permissions dialog.
    ({ status, data } = await dispatch(requestAppPermission({
      permissionId,
      dispatchMock,
    })));

    // The user denied the permissions within the native dialog.
    if ([PERMISSION_STATUS_DENIED, PERMISSION_STATUS_NOT_DETERMINED].includes(status)) {
      resolve(false);
      return;
    }
  }

  if (status === PERMISSION_STATUS_GRANTED) {
    resolve(resolveWithData && data ? data : true);
    return;
  }

  // The user permanently denied the permissions before.
  if (status === PERMISSION_STATUS_DENIED) {
    if (!useSettingsModal) {
      resolve(false);
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
      resolve(false);
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
