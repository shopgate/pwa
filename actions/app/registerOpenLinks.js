/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event';
import openLink from '../../action-creators/history/openLink';
import { parseQueryStringToObject } from '../../helpers/router';

/**
 * Sets up a listener for `openLink` events that fires the `openLink` action.
 * Also initially fires the action.
 * @param {Object} location The initial history entry location.
 * @return {Function} A redux thunk.
 */
const registerOpenLinks = location => (dispatch) => {
  event.addCallback('openLink', handler =>
    dispatch(openLink(handler.action, handler.options))
  );

  dispatch(openLink('reactRouter', {
    url: location.pathname,
    queryParams: parseQueryStringToObject(location.search),
  }));
};

export default registerOpenLinks;
