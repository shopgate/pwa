import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import grantGeolocationPermissions from './grantGeolocationPermissions';
import GeolocationRequest from '../classes/GeolocationRequest';
import { GEOLOCATION_ERROR_DENIED } from '../constants/geolocationRequest';

/**
 * Determines the geolocation of the user. When not geolocation permissions are granted yet,
 * the user will be prompted to grant access.
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
const getGeolocation = (options = {}) => async (dispatch) => {
  const granted = await dispatch(grantGeolocationPermissions(options));

  if (!granted) {
    const error = new Error('Geolocation permissions not granted.');
    error.code = GEOLOCATION_ERROR_DENIED;
    throw error;
  }

  return new GeolocationRequest(!hasSGJavaScriptBridge()).dispatch();
};

export default getGeolocation;
