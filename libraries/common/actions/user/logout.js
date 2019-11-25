import { PipelineRequest, logger } from '@shopgate/pwa-core';
import {
  requestLogout,
  successLogout,
  errorLogout,
} from '../../action-creators/user';
import { SHOPGATE_USER_LOGOUT_USER } from '../../constants/Pipelines';
import { mutable } from '../../helpers/redux';

/**
 * Logout the current user.
 * @return {Function} A redux thunk.
 */
function logout() {
  return (dispatch) => {
    dispatch(requestLogout());

    const request = new PipelineRequest(SHOPGATE_USER_LOGOUT_USER)
      .setTrusted()
      .dispatch();

    request
      .then((result) => {
        const { success, messages } = result;

        if (success) {
          dispatch(successLogout());
        } else {
          dispatch(errorLogout(messages));
        }
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorLogout());
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(logout);
