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
 * @param {boolean} [autoLogout=false] Whether the logout happened because session expired
 * @return {Function} A redux thunk.
 */
function logout(notify = true, autoLogout = false) {
  return (dispatch) => {
    dispatch(requestLogout());

    const request = new PipelineRequest(SHOPGATE_USER_LOGOUT_USER)
      .setTrusted()
      .dispatch();

    request
      .then((result) => {
        const { success, messages } = result;

        if (success) {
          dispatch(successLogout(notify, autoLogout));
        } else {
          dispatch(errorLogout(messages, autoLogout));
        }
      })
      .catch(() => {
        dispatch(errorLogout(undefined, autoLogout));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(logout);
