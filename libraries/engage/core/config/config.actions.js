import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import {
  requestConfig,
  receiveConfig,
  errorConfig,
} from './config.action-creators';
import { makeGetConfig } from './config.selectors';
import { PIPELINE_CORE_GET_CONFIG } from './config.constants';

/**
 * @returns {Function} A redux thunk.
 */
export const fetchConfig = () => (dispatch, getState) => {
  const getConfig = makeGetConfig();
  const config = getConfig(getState());

  if (!shouldFetchData(config)) {
    return Promise.resolve(config);
  }

  dispatch(requestConfig());

  const request = new PipelineRequest(PIPELINE_CORE_GET_CONFIG)
    .dispatch();

  request
    .then((result) => {
      dispatch(receiveConfig(result));
    })
    .catch((error) => {
      dispatch(errorConfig(error));
    });

  return request;
};
