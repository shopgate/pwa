/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  UPDATE_HISTORY,
  HISTORY_PUSH_ACTION,
  HISTORY_SET_REDIRECT_LOCATION,
} from '../../constants/ActionTypes';
import { history } from '../../helpers/router';

/**
 * Stores all the history information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (
  state = {
    action: HISTORY_PUSH_ACTION,
    pathname: history.location.pathname,
    queryParams: {},
    length: 1,
    redirectLocation: null,
  },
  action
) => {
  switch (action.type) {
    case UPDATE_HISTORY: {
      const { historyProps } = action;

      return {
        ...state,
        length: historyProps.length,
        action: historyProps.action,
        pathname: historyProps.pathname,
        queryParams: historyProps.queryParams,
      };
    }
    case HISTORY_SET_REDIRECT_LOCATION: {
      const { pathname, params } = action;

      const redirectLocation = pathname ? {
        pathname,
        params,
      } : null;

      return {
        ...state,
        redirectLocation,
      };
    }
    default:
      return state;
  }
};
