import { logger, getWebStorageEntry } from '@shopgate/pwa-core';
import * as actions from '../../action-creators/client';

/**
 * Requests the client information from the web storage.
 * @return {Function} A redux thunk.
 */
export default function fetchClientInformation() {
  return (dispatch) => {
    dispatch(actions.requestClientInformation());

    getWebStorageEntry({ name: 'clientInformation' })
      .then(({ value }) => {
        dispatch(actions.receiveClientInformation(value));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(actions.errorClientInformation());
      });
  };
}
