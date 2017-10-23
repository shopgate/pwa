/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import trackingCore from '@shopgate/tracking-core/core/Core';
import setRedirectLocation from '../../action-creators/history/setRedirectLocation';
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
  // Add some params for cross domain tracking to the url
  const newPathname = trackingCore.crossDomainTracking(pathname);

  // Save the the redirect url for later
  dispatch(setRedirectLocation(newPathname, parseQueryStringToObject(search)));
  // Go to the trampoline page
  dispatch(replaceHistory(trampolineLocation));
};

export default trampolineRedirect;
