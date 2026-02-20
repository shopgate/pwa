import { PERMISSION_ID_APP_TRACKING_TRANSPARENCY } from '@shopgate/engage/core/constants';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the app tracking transparency permission.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {Object} [options.meta={}] Additional meta data used for opt-in tracking actions
 * @param {Object} [options.settingsModal={}] Options for the settings modal.
 * @param {string} options.settingsModal.title Modal title.
 * @param {string} options.settingsModal.message Modal message.
 * @param {string} options.settingsModal.confirm Label for the confirm button.
 * @param {string} options.settingsModal.dismiss Label for the dismiss button.
 * @param {Object} options.settingsModal.params Additional parameters for i18n strings.
 * @return { Function } A redux thunk.
 */
const grantAppTrackingTransparencyPermission = (options = {}) => (dispatch) => {
  const {
    permissionId,
    meta = {},
    settingsModal,
    // @deprecated options, to be removed in future major release
    modal,
    ...rest
  } = options;

  const settingsModalOptions = settingsModal || modal || {};

  return dispatch(grantPermissions({
    permissionId: PERMISSION_ID_APP_TRACKING_TRANSPARENCY,
    meta,
    settingsModal: {
      message: 'permissions.access_denied.trackingMessage',
      confirm: 'permissions.access_denied.settings_button',
      dismiss: 'modal.dismiss',
      ...settingsModalOptions,
    },
    ...rest,
  }));
};

export default grantAppTrackingTransparencyPermission;
