/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import setRedirectLocation from '../../action-creators/history/setRedirectLocation';
import { getRedirectLocation } from '../../selectors/history';
import replaceHistory from './replaceHistory';
import goBackHistory from './goBackHistory';

/**
 * Redirects the user to the redirectLocation property within the history state and resets it
 * afterwards.
 * @returns {Function} A redux thunk.
 */
const redirectRoute = () => (dispatch, getState) => {
  const redirectLocation = getRedirectLocation(getState());

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
