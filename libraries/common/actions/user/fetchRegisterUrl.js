import { PipelineRequest } from '@shopgate/pwa-core';
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
  return (dispatch, getState) => (
    new Promise((resolve, reject) => {
      const state = getState();
      const entry = getEntryByType(state, { type: URL_TYPE_REGISTER });

      if (!shouldFetchData(entry, 'url')) {
        resolve(getRegisterUrl(state));
        return;
      }

      dispatch(requestUrl(URL_TYPE_REGISTER));

      new PipelineRequest(SHOPGATE_USER_GET_REGISTRATION_URL)
        .setTrusted()
        .dispatch()
        .then(({ url, expires }) => {
          dispatch(receiveUrl(URL_TYPE_REGISTER, url, expires));
          resolve(url);
        })
        .catch(() => {
          dispatch(errorUrl(URL_TYPE_REGISTER));
          reject();
        });
    })
  );
}

/** @mixes {MutableFunction} */
export default mutable(fetchRegisterUrl);
