/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import setRedirectLocation from '../../action-creators/history/setRedirectLocation';
import {
  replaceHistory,
  goBackHistory,
} from './changeHistory';

/**
 * Redirect to the redirectLocation from the state and resets it.
 * @returns {Function} A redux thunk.
 */
const redirectRoute = () => (dispatch, getState) => {
  const { history: { redirectLocation } } = getState();

  // If there is a redirect location set, go to this page.
  if (redirectLocation) {
    dispatch(replaceHistory(redirectLocation));
    dispatch(setRedirectLocation(null));
  } else {
    // No further redirect set. Go back the previous page.
    dispatch(goBackHistory(1));
  }
};

export default redirectRoute;
