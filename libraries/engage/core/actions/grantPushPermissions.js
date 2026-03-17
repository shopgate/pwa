import { PERMISSION_ID_PUSH } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the push permissions.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {boolean} [options.useSettingsModal=true] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {boolean} [options.useRationaleModal=false] Whether a rational modal should be shown
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
 * @param {Object} [options.meta={}] Additional meta data used for opt-in tracking actions
 * @param {boolean} [options.resolveWithData=true] When set to TRUE the promise will resolve with
 * an object containing the permission status and whether the opt-in dialog was shown,
 * instead of a boolean value.
 * @return { Function } A redux thunk.
 */
const grantPushPermissions = (options = {}) => (dispatch) => {
  const {
    permissionId,
    useSettingsModal = true,
    useRationaleModal = false,
    settingsModal = {},
    rationaleModal = {},
    meta = {},
    ...rest
  } = options;

  const settingsModalOptions = settingsModal || {};

  return dispatch(grantPermissions({
    permissionId: PERMISSION_ID_PUSH,
    useSettingsModal,
    useRationaleModal,
    settingsModal: {
      title: null,
      message: 'permissions.access_denied.push_message',
      confirm: 'permissions.access_denied.settings_button',
      dismiss: 'modal.dismiss',
      ...settingsModalOptions,
    },
    rationaleModal,
    meta,
    ...rest,
  }));
};

export default grantPushPermissions;
