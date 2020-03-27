import { PERMISSION_ID_LOCATION } from '@shopgate/pwa-core/constants/AppPermissions';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the geolocation permissions.
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
 * @return { Function } A redux thunk.
 */
const grantGeolocationPermissions = (options = {}) => (dispatch) => {
  const { useSettingsModal = false, modal = {} } = options;

  return dispatch(grantPermissions({
    permissionId: PERMISSION_ID_LOCATION,
    useSettingsModal,
    modal: {
      title: null,
      message: 'permissions.access_denied.geolocation_message',
      confirm: 'permissions.access_denied.settings_button',
      dismiss: 'modal.dismiss',
      ...modal,
    },
  }));
};

export default grantGeolocationPermissions;
