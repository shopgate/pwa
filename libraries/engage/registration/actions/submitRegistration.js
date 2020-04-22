import { PipelineRequest, EVALIDATION } from '@shopgate/engage/core';
import {
  SHOPGATE_USER_REGISTER,
} from '../constants';

import {
  requestRegistration,
  validationErrorsRegistration,
  successRegistration,
  errorRegistration,
} from '../action-creators';

/**
 * @param {Array} contacts A contacts array for the request.
 * @returns {Function} A redux thunk.
 */
function submitRegistration(contacts) {
  return (dispatch) => {
    dispatch(requestRegistration(contacts));

    const request = new PipelineRequest(SHOPGATE_USER_REGISTER)
      .setTrusted()
      .setErrorBlacklist([EVALIDATION])
      .setInput({ contacts })
      .dispatch();

    request
      .then((response) => {
        dispatch(successRegistration(response));
      })
      .catch((error) => {
        if (error.code === EVALIDATION) {
          dispatch(validationErrorsRegistration(error.errors));
        } else {
          dispatch(errorRegistration(error, contacts));
        }
      });

    return request;
  };
}

export default submitRegistration;
