import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { EACCESS } from '@shopgate/pwa-core/constants/Pipeline';
import * as pipelines from '../../constants/Pipelines';
import {
  requestUser,
  receiveUser,
  errorUser,
  toggleLoggedIn,
} from '../../action-creators/user';
import { isUserLoggedIn } from '../../selectors/user';

/**
 * Get the current user
 * @return {Function} A redux thunk.
 */
export default () => (dispatch, getState) => {
  dispatch(requestUser());

  return new PipelineRequest(pipelines.SHOPGATE_USER_GET_USER)
    .setTrusted()
    .setHandledErrors([EACCESS])
    .dispatch()
    .then((user) => {
      dispatch(receiveUser(user));

      // If the user's login state was incorrectly set false then set to true.
      if (!isUserLoggedIn(getState())) {
        dispatch(toggleLoggedIn(true));
      }

      return user;
    })
    .catch((error) => {
      const { code } = error;

      switch (code) {
        case EACCESS:
          dispatch(toggleLoggedIn(false));
          break;
        default:
          logger.error(error);
          break;
      }

      dispatch(errorUser(error));
    });
};
