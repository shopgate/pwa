import {
  event,
  openAppSettings,
  getAppPermissions,
  requestAppPermissions,
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
  PERMISSION_ID_CAMERA,
  STATUS_DENIED,
  STATUS_GRANTED,
  STATUS_NOT_DETERMINED,
  STATUS_NOT_SUPPORTED,
} from '@shopgate/pwa-core';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';

/**
 * Grant camera permissions.
 * @return { Function } A redux thunk.
 */
export default () => dispatch => new Promise(async (resolve) => {
  let status;

  // Check the current status of the camera permissions.
  [{ status }] = await getAppPermissions([PERMISSION_ID_CAMERA]);

  // Stop the process when the permission type is not supported.
  if (status === STATUS_NOT_SUPPORTED) {
    resolve(false);
    return;
  }

  // The user never seen the permissions dialog yet, or temporary denied the permissions (Android).
  if (status === STATUS_NOT_DETERMINED) {
    // Trigger the native permissions dialog.
    [{ status }] = await requestAppPermissions([{ permissionId: PERMISSION_ID_CAMERA }]);

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
    // Present a modal that describes the situation, and allows the user to enter the app settings.
    const openSettings = await dispatch(showModal({
      title: null,
      message: 'scanner.camera_access_denied.message',
      confirm: 'scanner.camera_access_denied.settings_button',
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
      [{ status }] = await getAppPermissions([PERMISSION_ID_CAMERA]);
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
    }, 100);
  }
});
