import { PipelineRequest, logger } from '@shopgate/pwa-core';
import * as pipelines from '../../constants/Pipelines';
import * as actions from '../../action-creators/user';

/**
 * Logout the current user.
 * @return {Function} A redux thunk.
 */
export default function logout() {
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
