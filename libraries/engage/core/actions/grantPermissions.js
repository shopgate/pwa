import event from '@shopgate/pwa-core/classes/Event';
import { APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND } from '@shopgate/pwa-core/constants/AppEvents';
import openAppSettings from '@shopgate/pwa-core/commands/openAppSettings';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import {
  STATUS_DENIED,
  STATUS_GRANTED,
  STATUS_NOT_DETERMINED,
  STATUS_NOT_SUPPORTED,
  availablePermissionsIds,
} from '@shopgate/pwa-core/constants/AppPermissions';
import {
  getAppPermissions,
  requestAppPermissions,
} from '@shopgate/pwa-core/commands/appPermissions';
import { logger } from '@shopgate/pwa-core/helpers';

/**
 * Determines the current state of a specific permission for an app feature. If not already
 * happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {string} options.permissionId The id of the permission to request.
 * @param {boolean} [options.useSettingsModal=false] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {Object} [options.modal={}] Options for the settings modal.
 * @param {string} options.modal.title Modal title.
 * @param {string} options.modal.message Modal message.
 * @param {string} options.modal.confirm Label for the confirm button.
 * @param {string} options.modal.dismiss Label for the dismiss button.
 * @param {Object} options.modal.params Additional parameters for i18n strings.
 * @return { Function } A redux thunk.
 */
const grantPermissions = (options = {}) => dispatch => new Promise(async (resolve) => {
  const {
    permissionId,
    useSettingsModal = false,
    modal: modalOptions = {},
  } = options;

  if (!availablePermissionsIds.includes(permissionId)) {
    logger.error('grandPermissions: %s is no valid permission id', permissionId);
    resolve(false);
    return;
  }

  let status;

  // Check the current status of the camera permissions.
  [{ status }] = await getAppPermissions([permissionId]);

  // Stop the process when the permission type is not supported.
  if (status === STATUS_NOT_SUPPORTED) {
    resolve(false);
    return;
  }

  // The user never seen the permissions dialog yet, or temporary denied the permissions (Android).
  if (status === STATUS_NOT_DETERMINED) {
    // Trigger the native permissions dialog.
    [{ status }] = await requestAppPermissions([{ permissionId }]);

    // The user denied the permissions within the native dialog.
    if ([STATUS_DENIED, STATUS_NOT_DETERMINED].includes(status)) {
      resolve(false);
      return;
    }
  }

  if (status === STATUS_GRANTED) {
    resolve(true);
    return;
  }

  // The user permanently denied the permissions before.
  if (status === STATUS_DENIED) {
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
      [{ status }] = await getAppPermissions([permissionId]);
      resolve(status === STATUS_GRANTED);
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
