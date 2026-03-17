import { PERMISSION_ID_CAMERA } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the camera permissions.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {boolean} [options.useSettingsModal=false] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {Object} [options.settingsModal={}] Options for the settings modal.
 * @param {string} options.settingsModal.title Modal title.
 * @param {string} options.settingsModal.message Modal message.
 * @param {string} options.settingsModal.confirm Label for the confirm button.
 * @param {string} options.settingsModal.dismiss Label for the dismiss button.
 * @param {Object} options.settingsModal.params Additional parameters for i18n strings.
 * @return { Function } A redux thunk.
 */
const grantCameraPermissions = (options = {}) => (dispatch) => {
  const {
    permissionId,
    useSettingsModal = false,
    settingsModal,
    // @deprecated modal setting, to be removed in future major release
    modal,
    ...rest
  } = options;

  const settingsModalOptions = settingsModal || modal || {};

  return dispatch(grantPermissions({
    permissionId: PERMISSION_ID_CAMERA,
    useSettingsModal,
    settingsModal: {
      title: null,
      message: 'permissions.access_denied.camera_message',
      confirm: 'permissions.access_denied.settings_button',
      dismiss: 'common.close',
      ...settingsModalOptions,
    },
    ...rest,
  }));
};

export default grantCameraPermissions;
