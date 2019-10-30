import { PipelineRequest, logger } from '@shopgate/pwa-core';
import {
  requestUrl,
  receiveUrl,
  errorUrl,
} from '../../action-creators/url';
import { SHOPGATE_USER_GET_REGISTRATION_URL } from '../../constants/Pipelines';
import { URL_TYPE_REGISTER } from '../../constants/Registration';
import { shouldFetchData, mutable } from '../../helpers/redux';
import { getEntryByType } from '../../selectors/url';
import { getRegisterUrl } from '../../selectors/user';

/**
 * Get the url for the registration.
 * @return {Function} A redux thunk.
 */
function fetchRegisterUrl() {
  return (dispatch, getState) => {
    const state = getState();
    const entry = getEntryByType(state, { type: URL_TYPE_REGISTER });

    if (!shouldFetchData(entry, 'url')) {
      return Promise.resolve(getRegisterUrl(state));
    }

    dispatch(requestUrl(URL_TYPE_REGISTER));

    return new PipelineRequest(SHOPGATE_USER_GET_REGISTRATION_URL)
      .setTrusted()
      .dispatch()
      .then(({ url, expires }) => {
        dispatch(receiveUrl(URL_TYPE_REGISTER, url, expires));
        return url;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorUrl(URL_TYPE_REGISTER));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchRegisterUrl);
