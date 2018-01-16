/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { openDeepLink } from '../../action-creators/app';
import handleLink from './handleLink';

/**
 * Opens a DeepLink.
 * @param {Object} [payload={}] The deep link event payload.
 * @return {Function} A redux thunk.
 */
const handleDeepLink = (payload = {}) => (dispatch) => {
  handleLink(payload);
  dispatch(openDeepLink(payload));
};

export default handleDeepLink;
