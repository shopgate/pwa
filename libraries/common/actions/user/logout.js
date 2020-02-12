import { PipelineRequest } from '@shopgate/pwa-core';
import {
  requestLogout,
  successLogout,
  errorLogout,
} from '../../action-creators/user';
import { SHOPGATE_USER_LOGOUT_USER } from '../../constants/Pipelines';
import { mutable } from '../../helpers/redux';

/**
 * Logout the current user.
 * @param {boolean} [notify=true] If set to TRUE users are notified when the logout was successful.
 * @return {Function} A redux thunk.
 */
function logout(notify = true) {
  return (dispatch) => {
    dispatch(requestLogout());

    const request = new PipelineRequest(SHOPGATE_USER_LOGOUT_USER)
      .setTrusted()
      .dispatch();

    request
      .then((result) => {
        const { success, messages } = result;

        if (success) {
          dispatch(successLogout(notify));
        } else {
          dispatch(errorLogout(messages));
        }
      })
      .catch(() => {
        dispatch(errorLogout());
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(logout);
