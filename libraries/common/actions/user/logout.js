import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import * as pipelines from '../../constants/Pipelines';
import {
  requestLogout,
  successLogout,
  errorLogout,
} from '../../action-creators/user';

/**
 * Logout the current user.
 * @return {Function} A redux thunk.
 */
export default () => (dispatch) => {
  dispatch(requestLogout());

  new PipelineRequest(pipelines.SHOPGATE_USER_LOGOUT_USER)
    .setTrusted()
    .dispatch()
    .then(({ success, messages }) => {
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
};
