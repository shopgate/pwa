import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import * as pipelines from '../../constants/Pipelines';
import {
  requestUrl,
  receiveUrl,
  errorUrl,
} from '../../action-creators/url';
import { getEntryByType } from '../../selectors/url';
import { getRegisterUrl } from '../../selectors/user';
import { shouldFetchData } from '../../helpers/redux';
import { URL_TYPE_REGISTER } from '../../constants/Registration';

/**
 * Get the url for the registration.
 * @return {Function} A redux thunk.
 */
export default () => (dispatch, getState) => {
  const state = getState();

  return new Promise((resolve, reject) => {
    if (shouldFetchData(getEntryByType(URL_TYPE_REGISTER, state), 'url')) {
      dispatch(requestUrl(URL_TYPE_REGISTER));

      new PipelineRequest(pipelines.SHOPGATE_USER_GET_REGISTRATION_URL)
        .setTrusted()
        .dispatch()
        .then(({ url, expires }) => {
          dispatch(receiveUrl(URL_TYPE_REGISTER, url, expires));
          resolve(url);
        })
        .catch((error) => {
          logger.error(error);
          dispatch(errorUrl(URL_TYPE_REGISTER));
          reject();
        });
    } else {
      // The registrationUrl is still valid
      resolve(getRegisterUrl(state));
    }
  });
};
