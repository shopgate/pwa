import { logger, hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import { defaultClientInformation } from '@shopgate/pwa-core/helpers/version';
import { getWebStorageEntry } from '@shopgate/pwa-core/commands/webStorage';
import {
  requestClientInformation,
  receiveClientInformation,
  errorClientInformation,
} from '../../action-creators/client';

/**
 * Requests the client information from the web storage.
 * @return {Function} A redux thunk.
 */
function fetchClientInformation() {
  return (dispatch) => {
    dispatch(actions.requestClientInformation());

  if (!hasSGJavaScriptBridge()) {
    dispatch(receiveClientInformation(defaultClientInformation));
    return;
  }

  getWebStorageEntry({ name: 'clientInformation' })
    .then(response => dispatch(receiveClientInformation(response.value)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorClientInformation());
    });
};

export default fetchClientInformation;
