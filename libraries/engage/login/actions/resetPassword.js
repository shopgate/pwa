import {
  PipelineRequest, LoadingProvider, EUSERNOTFOUND,
} from '@shopgate/engage/core';
import { SHOPGATE_USER_RESET_PASSWORD, RESET_PASSWORD_PATTERN } from '../constants';
import { resetPassword, successResetPassword, errorResetPassword } from '../action-creators';

/**
 * Sends a reset password pipeline request.
 * @param {string} email The email for which the password shall be reset.
 * @returns {Function} A redux thunk.
 */
const resetPasswordAction = email => (dispatch) => {
  LoadingProvider.setLoading(RESET_PASSWORD_PATTERN);
  dispatch(resetPassword(email));

  const request = new PipelineRequest(SHOPGATE_USER_RESET_PASSWORD)
    .setInput({ email })
    .setTrusted()
    .setErrorBlacklist([
      EUSERNOTFOUND,
    ])
    .dispatch();

  request
    .then(() => {
      dispatch(successResetPassword(email));
      LoadingProvider.resetLoading(RESET_PASSWORD_PATTERN);
    })
    .catch((error) => {
      dispatch(errorResetPassword(email, error));
      LoadingProvider.resetLoading(RESET_PASSWORD_PATTERN);
    });

  return request;
};

export default resetPasswordAction;
