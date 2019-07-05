import {
  event,
  emitter as errorEmitter,
  registerEvents,
  closeInAppBrowser,
  onload,
} from '@shopgate/pwa-core';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/pwa-core/constants/AppEvents';
import { SOURCE_APP, SOURCE_PIPELINE } from '@shopgate/pwa-core/constants/ErrorManager';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
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
import { appError, pipelineError } from '../action-creators';
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
import { appDidStart$, appWillStart$, pipelineError$ } from '../streams';
import registerLinkEvents from '../actions/app/registerLinkEvents';
import showModal from '../actions/modal/showModal';
import { isAndroid } from '../selectors/client';
import {
  prepareLegacyNavigation,
  showPreviousTab,
  pageContext,
} from '../helpers/legacy';
import { embeddedMedia } from '../collections';
import { Vimeo, YouTube } from '../collections/media-providers';
import clearUpInAppBrowser from './helpers/clearUpInAppBrowser';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  // Gets triggered before the app starts.
  subscribe(appWillStart$, ({ dispatch, action }) => {
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
    ]);

    // Add event callbacks
    event.addCallback('pageContext', pageContext);
    // Handle native/legacy navigation bar
    event.addCallback('viewWillAppear', prepareLegacyNavigation);
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

    event.addCallback('viewDidAppear', () => {
      clearUpInAppBrowser(isAndroid(getState()));
    });

    /**
     * The following events are sometimes sent by the app, but don't need to be handled right now.
     * To avoid console warnings from the event system, empty handlers are registered here.
     */
    event.addCallback('viewWillDisappear', () => {});
    event.addCallback('viewDidDisappear', () => {});
    event.addCallback('pageInsetsChanged', () => {});

    /*
     * Onload must be send AFTER app did start.
     * Interjections events (like openPushMessage) would not work if this command is sent
     * before registering to interjections.
     */
    onload();
  });

  subscribe(pipelineError$, ({ dispatch, action }) => {
    const { error } = action;
    const {
      message, code, context, meta,
    } = error;

    dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: null,
      title: null,
      message,
      type: MODAL_PIPELINE_ERROR,
      params: {
        pipeline: context,
        request: meta.input,
        message: meta.message,
        code,
      },
    }));
  });
}
