import {
  PipelineRequest, LoadingProvider, EUSERNOTFOUND,
} from '@shopgate/engage/core';
import { SHOPGATE_USER_RESET_PASSWORD, FORGOT_PASSWORD_PATTERN } from '../constants';
import { requestResetPassword, receiveResetPassword, errorResetPassword } from '../action-creators';

/**
 * Sends a reset password pipeline request.
 * @param {string} email The email for which the password shall be reset.
 * @returns {Function} A redux thunk.
 */
const resetPasswordAction = email => (dispatch) => {
  LoadingProvider.setLoading(FORGOT_PASSWORD_PATTERN);
  dispatch(requestResetPassword(email));

  const request = new PipelineRequest(SHOPGATE_USER_RESET_PASSWORD)
    .setInput({ email })
    .setTrusted()
    .setErrorBlacklist([
      EUSERNOTFOUND,
    ])
    .dispatch();

  request
    .then(() => {
      dispatch(receiveResetPassword(email));
      LoadingProvider.resetLoading(FORGOT_PASSWORD_PATTERN);
    })
    .catch((error) => {
      dispatch(errorResetPassword(email, error));
      LoadingProvider.resetLoading(FORGOT_PASSWORD_PATTERN);
    });

  return request;
};

export default resetPasswordAction;
