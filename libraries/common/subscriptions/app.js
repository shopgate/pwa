import {
  event,
  emitter as errorEmitter,
  registerEvents,
  closeInAppBrowser,
  onload,
} from '@shopgate/pwa-core';
import {
  EVENT_KEYBOARD_WILL_CHANGE,
  APP_EVENT_VIEW_WILL_APPEAR,
  APP_EVENT_VIEW_DID_APPEAR,
  APP_EVENT_VIEW_WILL_DISAPPEAR,
  APP_EVENT_VIEW_DID_DISAPPEAR,
} from '@shopgate/pwa-core/constants/AppEvents';
import { SOURCE_APP, SOURCE_PIPELINE } from '@shopgate/pwa-core/constants/ErrorManager';
import pipelineManager from '@shopgate/pwa-core/classes/PipelineManager';
import * as errorCodes from '@shopgate/pwa-core/constants/Pipeline';
import {
  onWillPush,
  onDidPush,
  onWillPop,
  onDidPop,
  onWillReplace,
  onDidReplace,
  onWillReset,
  onDidReset,
  onUpdate,
} from '@virtuous/conductor';
import { UI_VISIBILITY_CHANGE } from '../constants/ui';
import {
  appError, pipelineError, pwaDidAppear, pwaDidDisappear,
} from '../action-creators';
import {
  historyPush,
  routeWillPush,
  routeDidPush,
  routeWillPop,
  routeDidPop,
  routeWillReplace,
  routeDidReplace,
  routeWillReset,
  routeDidReset,
  routeDidUpdate,
} from '../actions/router';
import { receiveClientConnectivity } from '../action-creators/client';
import {
  appWillStart$,
  appDidStart$,
  clientInformationDidUpdate$,
  navigate$,
} from '../streams';
import registerLinkEvents from '../actions/app/registerLinkEvents';
import { APP_PLATFORM } from '../constants/Configuration';
import { getPlatform, isAndroid } from '../selectors/client';
import {
  prepareLegacyNavigation,
  showPreviousTab,
  pageContext,
} from '../helpers/legacy';
import { embeddedMedia, configuration } from '../collections';
import { Vimeo, YouTube } from '../collections/media-providers';
import clearUpInAppBrowser from './helpers/clearUpInAppBrowser';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  // Gets triggered before the app starts.
  subscribe(appWillStart$, ({
    dispatch, action, getState, events,
  }) => {
    embeddedMedia.addProvider(new Vimeo());
    embeddedMedia.addProvider(new YouTube());

    dispatch(registerLinkEvents(action.location));

    onWillPush(({ prev, next }) => dispatch(routeWillPush(prev, next)));
    onDidPush(({ prev, next }) => dispatch(routeDidPush(prev, next)));
    onWillPop(({ prev, next }) => dispatch(routeWillPop(prev, next)));
    onDidPop(({ prev, next }) => dispatch(routeDidPop(prev, next)));
    onWillReplace(({ prev, next }) => dispatch(routeWillReplace(prev, next)));
    onDidReplace(({ prev, next }) => dispatch(routeDidReplace(prev, next)));
    onWillReset(({ prev, next }) => dispatch(routeWillReset(prev, next)));
    onDidReset(({ prev, next }) => dispatch(routeDidReset(prev, next)));
    onUpdate(updated => dispatch(routeDidUpdate(updated)));

    // Suppress errors globally
    pipelineManager.addSuppressedErrors([
      errorCodes.EACCESS,
      errorCodes.E999,
      errorCodes.ENOTFOUND,
      errorCodes.EVALIDATION,
    ]);

    // Map the error events into the Observable streams.
    errorEmitter.addListener(SOURCE_APP, error => dispatch(appError(error)));
    errorEmitter.addListener(SOURCE_PIPELINE, error => dispatch(pipelineError(error)));

    /** @returns {*} */
    const viewVisibility = () => events.emit(UI_VISIBILITY_CHANGE);

    event.addCallback('routeDidChange', viewVisibility);

    event.addCallback(APP_EVENT_VIEW_DID_DISAPPEAR, () => {
      dispatch(pwaDidDisappear());
      viewVisibility();
    });

    event.addCallback(APP_EVENT_VIEW_DID_APPEAR, () => {
      dispatch(pwaDidAppear());
      clearUpInAppBrowser(isAndroid(getState()));
    });
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    // Register for custom events
    registerEvents([
      EVENT_KEYBOARD_WILL_CHANGE,
      'showPreviousTab',
      'closeInAppBrowser',
      // TODO The iOS apps don't emit the event to the webviews without registration till Lib 15.2.
      // This needs to be removed, when IOS-1886 is done and the the iOS apps are updated.
      'httpResponse',
      'connectivityDidChange',
    ]);

    // Add event callbacks
    event.addCallback('pageContext', pageContext);
    // Handle native/legacy navigation bar
    event.addCallback(APP_EVENT_VIEW_WILL_APPEAR, prepareLegacyNavigation);
    event.addCallback('showPreviousTab', showPreviousTab);
    /**
     * This event is triggered form the desktop shop in the inAppBrowser.
     * We have to close the inAppBrowser and redirect the user to the given url.
     */
    event.addCallback('closeInAppBrowser', (data = {}) => {
      if (data.redirectTo) {
        dispatch(historyPush({
          pathname: data.redirectTo,
        }));
      }

      closeInAppBrowser(isAndroid(getState()));
    });

    event.addCallback('connectivityDidChange', (data) => {
      dispatch(receiveClientConnectivity(data));
    });

    /**
     * The following events are sometimes sent by the app, but don't need to be handled right now.
     * To avoid console warnings from the event system, empty handlers are registered here.
     */
    event.addCallback(APP_EVENT_VIEW_WILL_DISAPPEAR, () => {
      // Stop all playing video
      embeddedMedia.stop();
    });
    event.addCallback('pageInsetsChanged', () => {});

    /*
     * Onload must be send AFTER app did start.
     * Interjections events (like openPushMessage) would not work if this command is sent
     * before registering to interjections.
     */
    onload();
  });

  // Add platform to runtime config
  subscribe(clientInformationDidUpdate$, ({ getState }) => {
    const platform = getPlatform(getState());
    configuration.set(APP_PLATFORM, platform);
  });

  // Stop all playing video on navigation
  subscribe(navigate$, () => {
    embeddedMedia.stop();
  });
}
