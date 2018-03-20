import { logger } from '@shopgate/pwa-core/helpers';
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
const fetchClientInformation = () => (dispatch) => {
  dispatch(requestClientInformation());

  getWebStorageEntry({ name: 'clientInformation' })
    .then(response => dispatch(receiveClientInformation(response.value)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorClientInformation());
    });
};

export default fetchClientInformation;
