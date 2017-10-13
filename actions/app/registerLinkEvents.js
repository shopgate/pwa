/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import willRegisterLinkEvents from '../../action-creators/app/willRegisterLinkEvents';
import didRegisterLinkEvents from '../../action-creators/app/didRegisterLinkEvents';
import openLink from '../../action-creators/history/openLink';
import { parseQueryStringToObject } from '../../helpers/router';
import handlePushNotification from './handlePushNotification';
import handleDeepLink from './handleDeepLink';

/**
 * Registers all link events.
 * @param {Object} location The current history location object.
 * @return {Function} A redux thunk.
 */
const registerLinkEvents = location => (dispatch) => {
  dispatch(willRegisterLinkEvents());

  registerEvents([
    'openPushNotification',
    'openDeepLink',
  ]);

  event.addCallback('openLink', handler =>
    dispatch(openLink(handler.action, handler.options))
  );
  event.addCallback('openPushNotification', payload =>
    dispatch(handlePushNotification(payload))
  );
  event.addCallback('openDeepLink', payload =>
    dispatch(handleDeepLink(payload))
  );

  window.push = (payload) => dispatch(handlePushNotification(payload));
  window.deeplink = (payload) => dispatch(handleDeepLink(payload));


  dispatch(didRegisterLinkEvents());

  // ??

  dispatch(openLink('reactRouter', {
    url: location.pathname,
    queryParams: parseQueryStringToObject(location.search),
  }));
};

export default registerLinkEvents;
