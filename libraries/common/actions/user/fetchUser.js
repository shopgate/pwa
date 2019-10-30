import { PipelineRequest, logger, EACCESS } from '@shopgate/pwa-core';
import {
  requestUser,
  receiveUser,
  errorUser,
  toggleLoggedIn,
} from '../../action-creators/user';
import { SHOPGATE_USER_GET_USER } from '../../constants/Pipelines';
import { mutable } from '../../helpers/redux';
import { isUserLoggedIn } from '../../selectors/user';

/**
 * Get the current user
 * @return {Function} A redux thunk.
 */
function fetchUser() {
  return (dispatch, getState) => {
    dispatch(requestUser());

    return new PipelineRequest(SHOPGATE_USER_GET_USER)
      .setTrusted()
      .setErrorBlacklist([EACCESS])
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
        if (error.code !== EACCESS) {
          logger.error(error);
        }

        dispatch(toggleLoggedIn(false));
        dispatch(errorUser(error));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchUser);
