import {
  PERMISSION_ID_PUSH,
} from '@shopgate/pwa-core/constants/AppPermissions';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the push permissions.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {boolean} [options.useSettingsModal=false] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {boolean} [options.useRationaleModal=true] Whether a rational modal should be shown
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
 * @return { Function } A redux thunk.
 */
const grantPushPermissions = (options = {}) => (dispatch) => {
  const {
    useSettingsModal = true,
    useRationaleModal = true,
    modal = {},
    rationaleModal = {},
  } = options;

  return dispatch(grantPermissions({
    permissionId: PERMISSION_ID_PUSH,
    useSettingsModal,
    useRationaleModal,
    modal: {
      title: null,
      message: 'permissions.access_denied.push_message',
      confirm: 'permissions.access_denied.settings_button',
      ...modal,
    },
    rationaleModal,
  }));
};

export default grantPushPermissions;
