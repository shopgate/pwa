/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { appDidStart$, appWillStart$ } from '../streams/app';
import registerLinkEvents from '../actions/app/registerLinkEvents';
import {
  hideLegacyNavigation,
  showLegacyNavigation,
  showPreviousTab,
  pageContext,
} from '../helpers/legacy';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  /**
   * Gets triggered before the app starts.
   */
  subscribe(appWillStart$, ({ dispatch, action }) => {
    dispatch(registerLinkEvents(action.location));
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, () => {
    // Register for custom events
    registerEvents(['showPreviousTab']);

    // Add event callbacks
    event.addCallback('pageContext', pageContext);
    event.addCallback('viewWillAppear', hideLegacyNavigation);
    event.addCallback('viewWillDisappear', showLegacyNavigation);
    event.addCallback('showPreviousTab', showPreviousTab);

    /**
     * The following events are sometimes sent by the app, but don't need to be handled right now.
     * To avoid console warnings from the event system, empty handlers are registered here.
     */
    event.addCallback('viewDidAppear', () => {});
    event.addCallback('pageInsetsChanged', () => {});
  });
}
