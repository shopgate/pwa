import { PipelineRequest, logger, EACCESS } from '@shopgate/pwa-core';
import * as actions from '../../action-creators/user';
import * as pipelines from '../../constants/Pipelines';
import { mutable } from '../../helpers/redux';
import { isUserLoggedIn } from '../../selectors/user';

/**
 * Get the current user
 * @return {Function} A redux thunk.
 */
function fetchUser() {
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
        if (error.code !== EACCESS) {
          logger.error(error);
        }

        dispatch(actions.toggleLoggedIn(false));
        dispatch(actions.errorUser(error));
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchUser);
