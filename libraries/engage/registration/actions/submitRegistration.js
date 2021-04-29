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
 * @param {Object} customer Customer data
 * @returns {Function} A redux thunk.
 */
function submitRegistration(customer) {
  return (dispatch) => {
    dispatch(requestRegistration(customer));

    const request = new PipelineRequest(SHOPGATE_USER_REGISTER)
      .setTrusted()
      .setErrorBlacklist([EVALIDATION])
      .setInput({
        customer,
      })
      .dispatch();

    request
      .then((response) => {
        dispatch(successRegistration(response));
      })
      .catch((error) => {
        if (error.code === EVALIDATION) {
          dispatch(validationErrorsRegistration(error.errors));
        } else {
          dispatch(errorRegistration(error, customer));
        }
      });

    return request;
  };
}

export default submitRegistration;
