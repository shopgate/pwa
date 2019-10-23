import { PipelineRequest, logger } from '@shopgate/pwa-core';
import * as actions from '../../action-creators/user';
import * as pipelines from '../../constants/Pipelines';
import { mutable } from '../../helpers/redux';

/**
 * Logout the current user.
 * @return {Function} A redux thunk.
 */
function logout() {
  return (dispatch) => {
    dispatch(actions.requestLogout());

    new PipelineRequest(pipelines.SHOPGATE_USER_LOGOUT_USER)
      .setTrusted()
      .dispatch()
      .then(({ success, messages }) => {
        if (success) {
          dispatch(actions.successLogout());
        } else {
          dispatch(actions.errorLogout(messages));
        }
      })
      .catch((error) => {
        logger.error(error);
        dispatch(actions.errorLogout());
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(logout);
