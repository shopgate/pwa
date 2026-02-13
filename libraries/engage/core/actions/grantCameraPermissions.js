import { PERMISSION_ID_CAMERA } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the camera permissions.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {boolean} [options.useSettingsModal=false] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {Object} [options.modal={}] Options for the settings modal.
 * @param {string} options.modal.title Modal title.
 * @param {string} options.modal.message Modal message.
 * @param {string} options.modal.confirm Label for the confirm button.
 * @param {string} options.modal.dismiss Label for the dismiss button.
 * @param {Object} options.modal.params Additional parameters for i18n strings.
 * @param {boolean} [options.resolveWithData=true] When set to TRUE the promise will resolve with
 * an object containing the permission status and whether the opt-in dialog was shown,
 * instead of a boolean value.
 * @return { Function } A redux thunk.
 */
const grantCameraPermissions = (options = {}) => (dispatch) => {
  const {
    useSettingsModal = false,
    resolveWithData = false,
    modal = {},
  } = options;

  return dispatch(grantPermissions({
    permissionId: PERMISSION_ID_CAMERA,
    resolveWithData,
    useSettingsModal,
    modal: {
      title: null,
      message: 'permissions.access_denied.camera_message',
      confirm: 'permissions.access_denied.settings_button',
      dismiss: 'common.close',
      ...modal,
    },
  }));
};

export default grantCameraPermissions;
