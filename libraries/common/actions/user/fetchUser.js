import { PipelineRequest, logger, EACCESS } from '@shopgate/pwa-core';
import * as pipelines from '../../constants/Pipelines';
import * as actions from '../../action-creators/user';
import { isUserLoggedIn } from '../../selectors/user';

/**
 * Get the current user
 * @return {Function} A redux thunk.
 */
export default function fetchUser() {
  return (dispatch, getState) => {
    dispatch(actions.requestUser());

    return new PipelineRequest(pipelines.SHOPGATE_USER_GET_USER)
      .setTrusted()
      .setErrorBlacklist([EACCESS])
      .dispatch()
      .then((user) => {
        dispatch(actions.receiveUser(user));

        // If the user's login state was incorrectly set false then set to true.
        if (!isUserLoggedIn(getState())) {
          dispatch(actions.toggleLoggedIn(true));
        }

        return user;
      })
      .catch((error) => {
        switch (error.code) {
          case EACCESS:
            dispatch(actions.toggleLoggedIn(false));
            break;
          default:
            logger.error(error);
            break;
        }

        dispatch(actions.errorUser(error));
      });
  };
}
