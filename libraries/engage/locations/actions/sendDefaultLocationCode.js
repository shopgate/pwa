import {
  sendSetDefaultLocationCodeRequest,
  sendSetDefaultLocationCodeSuccess,
  sendSetDefaultLocationCodeError,
} from '@shopgate/engage/locations/action-creators';
import { PipelineRequest } from '../../core';

/**
 * pipeline call to shopgate.user.sendDefaultLocationCodeCode.v1
 * to set user default location in data base
 * @param {string} locationCode The location code to send to backend
 * @returns {Function} redux thunk
 */
const sendDefaultLocationCode = locationCode => (dispatch) => {
  dispatch(sendSetDefaultLocationCodeRequest(locationCode));

  const request = new PipelineRequest('shopgate.user.setDefaultLocationCode')
    .setInput({ locationCode })
    .dispatch();

  request
    .then(() => {
      dispatch(sendSetDefaultLocationCodeSuccess(locationCode));
    })
    .catch((error) => {
      dispatch(sendSetDefaultLocationCodeError(locationCode, error.code));
    });

  return request;
};

export default sendDefaultLocationCode;
