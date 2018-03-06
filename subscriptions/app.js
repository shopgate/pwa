/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import closeInAppBrowser from '@shopgate/pwa-core/commands/closeInAppBrowser';
import { appDidStart$, appWillStart$ } from '../streams/app';
import registerLinkEvents from '../actions/app/registerLinkEvents';
import { isAndroid } from '../selectors/client';
import {
  hideLegacyNavigation,
  showLegacyNavigation,
  showPreviousTab,
  pageContext,
} from '../helpers/legacy';
import ParsedLink from '../components/Router/helpers/parsed-link';

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
  subscribe(appDidStart$, ({ getState }) => {
    // Register for custom events
    registerEvents([
      'showPreviousTab',
      'closeInAppBrowser',
      // TODO The iOS apps don't emit the event to the webviews without registration till Lib 15.2.
      // This needs to be removed, when IOS-1886 is done and the the iOS apps are updated.
      'httpResponse',
    ]);

    // Add event callbacks
    event.addCallback('pageContext', pageContext);
    if (isAndroid(getState())) {
      event.addCallback('viewWillAppear', hideLegacyNavigation);
      event.addCallback('viewWillDisappear', showLegacyNavigation);
    }
    event.addCallback('showPreviousTab', showPreviousTab);
    /**
     * This event is triggered form the desktop shop in the inAppBrowser.
     * We have to close the inAppBrowser and redirect the user to the given url.
     */
    event.addCallback('closeInAppBrowser', (data = {}) => {
      if (data.redirectTo) {
        new ParsedLink(data.redirectTo).open();
      }

      closeInAppBrowser(isAndroid(getState()));
    });

    /**
     * The following events are sometimes sent by the app, but don't need to be handled right now.
     * To avoid console warnings from the event system, empty handlers are registered here.
     */
    event.addCallback('viewDidAppear', () => {});
    event.addCallback('viewDidDisappear', () => {});
    event.addCallback('pageInsetsChanged', () => {});
  });
}
