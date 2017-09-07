/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { EACCESS } from '@shopgate/pwa-core/constants/Pipeline';
import requestUser from '../../action-creators/user/requestUser';
import receiveUser from '../../action-creators/user/receiveUser';
import errorUser from '../../action-creators/user/errorUser';
import toggleLoggedIn from '../../action-creators/user/toggleLoggedIn';
import { isUserLoggedIn } from '../../selectors/user';

/**
 * Get the current user
 * @return {Function} A redux thunk.
 */
export default () => (dispatch, getState) => {
  dispatch(requestUser());

  return new PipelineRequest('getUser')
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

      dispatch(errorUser());
    });
};
