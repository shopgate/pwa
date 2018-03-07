/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { setRedirectLocation } from '../../action-creators/history';
import replaceHistory from './replaceHistory';
import { parseQueryStringToObject } from '../../helpers/router';

/**
 * Perform the trampolineRedirect. Dispatch setRedirectLocation and replaceHistory
 * @param {Object} trampolineLocation Location of the trampoline page that shows up first.
 * @param {Object} redirectUrlLocation Location of the redirect location where the user will be
 *                                     redirected to
 * @returns {Function} A redux thunk.
 */
const trampolineRedirect = (trampolineLocation, redirectUrlLocation) => (dispatch) => {
  const { pathname, search } = redirectUrlLocation;

  // Save the the redirect url for later
  dispatch(setRedirectLocation(pathname, parseQueryStringToObject(search)));
  // Go to the trampoline page
  dispatch(replaceHistory(trampolineLocation));
};

export default trampolineRedirect;
