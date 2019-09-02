import {
  logger,
  hasSGJavaScriptBridge,
  defaultClientInformation,
  getWebStorageEntry,
} from '@shopgate/pwa-core';
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
    dispatch(requestClientInformation());

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
}

export default fetchClientInformation;
