import {
  PERMISSION_ID_PUSH,
  STATUS_GRANTED,
} from '@shopgate/pwa-core/constants/AppPermissions';
import { getAppPermissions } from '@shopgate/pwa-core';
import grantPermissions from './grantPermissions';

/**
 * Determines the current state of the push permissions.
 * If not already happened, the user will be prompted to grant permissions.
 * The action returns a promise which resolves with a boolean value, that indicates the state.
 * @param {Object} options Action options.
 * @param {boolean} [options.useSettingsModal=false] Whether in case of declined permissions a modal
 * shall be presented, which redirects to the app settings.
 * @param {Object} [options.requestModal={}] Options for the request permissions modal.
 * @param {string} options.requestModal.title Modal title.
 * @param {string} options.requestModal.message Modal message.
 * @param {string} options.requestModal.confirm Label for the confirm button.
 * @param {string} options.requestModal.dismiss Label for the dismiss button.
 * @param {Object} options.requestModal.params Additional parameters for i18n strings.
 * @param {Object} [options.modal={}] Options for the settings modal.
 * @param {string} options.modal.title Modal title.
 * @param {string} options.modal.message Modal message.
 * @param {string} options.modal.confirm Label for the confirm button.
 * @param {string} options.modal.dismiss Label for the dismiss button.
 * @param {Object} options.modal.params Additional parameters for i18n strings.
 * @return { Function } A redux thunk.
 */
const grantPushPermissions = (options = {}) => dispatch => new Promise(async (resolve) => {
  const { useSettingsModal = true, modal = {}, requestModal = {} } = options;
  const [{ status }] = await getAppPermissions([PERMISSION_ID_PUSH]);

  if (status === STATUS_GRANTED) {
    resolve(true);
    return;
  }

  const allowed = await dispatch(grantPermissions({
    permissionId: PERMISSION_ID_PUSH,
    useSettingsModal,
    modal: {
      title: null,
      message: 'permissions.access_denied.push_message',
      confirm: 'permissions.access_denied.settings_button',
      ...modal,
    },
    requestModal: {
      message: 'permissions.back_in_stock_push_notifications.message',
      confirm: 'permissions.back_in_stock_push_notifications.confirm',
      dismiss: 'permissions.back_in_stock_push_notifications.dismiss',
      ...requestModal,
    },

  }));

  resolve(allowed);
});

export default grantPushPermissions;
