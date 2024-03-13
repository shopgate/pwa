import {
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
      return Promise.resolve(defaultClientInformation);
    }

    return getWebStorageEntry({ name: 'clientInformation' })
      .then(response => dispatch(receiveClientInformation(response.value)))
      .catch(() => {
        dispatch(errorClientInformation());
      });
  };
}

export default fetchClientInformation;
