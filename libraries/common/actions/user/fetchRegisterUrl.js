import { PipelineRequest, logger } from '@shopgate/pwa-core';
import * as pipelines from '../../constants/Pipelines';
import * as actions from '../../action-creators/url';
import { getEntryByType } from '../../selectors/url';
import { getRegisterUrl } from '../../selectors/user';
import { shouldFetchData } from '../../helpers/redux';
import { URL_TYPE_REGISTER } from '../../constants/Registration';

/**
 * Get the url for the registration.
 * @return {Function} A redux thunk.
 */
export default function fetchRegisterUrl() {
  return (dispatch, getState) => {
    const state = getState();
    const entry = getEntryByType(state, { type: URL_TYPE_REGISTER });

    return new Promise((resolve, reject) => {
      if (!shouldFetchData(entry, 'url')) {
        resolve(getRegisterUrl(state));
        return;
      }

      dispatch(actions.requestUrl(URL_TYPE_REGISTER));

      new PipelineRequest(pipelines.SHOPGATE_USER_GET_REGISTRATION_URL)
        .setTrusted()
        .dispatch()
        .then(({ url, expires }) => {
          dispatch(actions.receiveUrl(URL_TYPE_REGISTER, url, expires));
          resolve(url);
        })
        .catch((error) => {
          logger.error(error);
          dispatch(actions.errorUrl(URL_TYPE_REGISTER));
          reject();
        });
    });
  };
}
