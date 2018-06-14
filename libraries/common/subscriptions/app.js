import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import closeInAppBrowser from '@shopgate/pwa-core/commands/closeInAppBrowser';
import { emitter as errorEmitter } from '@shopgate/pwa-core/classes/ErrorManager';
import { SOURCE_APP, SOURCE_PIPELINE } from '@shopgate/pwa-core/classes/ErrorManager/constants';
import pipelineManager from '@shopgate/pwa-core/classes/PipelineManager';
import * as errorCodes from '@shopgate/pwa-core/constants/Pipeline';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import * as events from '@virtuous/conductor-events';
import { navigate } from '../action-creators/router';
import routeWillPush from '../actions/router/routeWillPush';
import routeDidPush from '../actions/router/routeDidPush';
import routeWillPop from '../actions/router/routeWillPop';
import routeDidPop from '../actions/router/routeDidPop';
import routeWillReplace from '../actions/router/routeWillReplace';
import routeDidReplace from '../actions/router/routeDidReplace';
import { appDidStart$, appWillStart$ } from '../streams/app';
import { pipelineError$ } from '../streams/error';
import registerLinkEvents from '../actions/app/registerLinkEvents';
import showModal from '../actions/modal/showModal';
import { isAndroid } from '../selectors/client';
import {
  updateNavigationBarNone,
  showPreviousTab,
  pageContext,
} from '../helpers/legacy';
import { appError, pipelineError } from '../action-creators/error';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  // Gets triggered before the app starts.
  subscribe(appWillStart$, ({ dispatch, action }) => {
    dispatch(registerLinkEvents(action.location));

    events.onWillPush(id => dispatch(routeWillPush(id)));
    events.onDidPush(id => dispatch(routeDidPush(id)));
    events.onWillPop(() => dispatch(routeWillPop()));
    events.onDidPop(() => dispatch(routeDidPop()));
    events.onWillReplace(id => dispatch(routeWillReplace(id)));
    events.onDidReplace(id => dispatch(routeDidReplace(id)));

    // Suppress errors globally
    pipelineManager.addSuppressedErrors([
      errorCodes.EACCESS,
      errorCodes.E999,
    ]);

    // Map the error events into the Observable streams.
    errorEmitter.addListener(SOURCE_APP, error => dispatch(appError(error)));
    errorEmitter.addListener(SOURCE_PIPELINE, error => dispatch(pipelineError(error)));
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ action, dispatch, getState }) => {
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
    // Handle native/legacy navigation bar
    event.addCallback('viewWillAppear', updateNavigationBarNone);
    event.addCallback('showPreviousTab', showPreviousTab);
    /**
     * This event is triggered form the desktop shop in the inAppBrowser.
     * We have to close the inAppBrowser and redirect the user to the given url.
     */
    event.addCallback('closeInAppBrowser', (data = {}) => {
      if (data.redirectTo) {
        dispatch(navigate(ACTION_PUSH, data.redirectTo));
      }

      closeInAppBrowser(isAndroid(getState()));
    });

    /**
     * The following events are sometimes sent by the app, but don't need to be handled right now.
     * To avoid console warnings from the event system, empty handlers are registered here.
     */
    event.addCallback('viewDidAppear', () => {});
    event.addCallback('viewWillDisappear', () => {});
    event.addCallback('viewDidDisappear', () => {});
    event.addCallback('pageInsetsChanged', () => {});

    if (action.location !== INDEX_PATH) {
      dispatch(navigate(ACTION_PUSH, INDEX_PATH));
    }
    dispatch(navigate(ACTION_PUSH, action.location));
  });

  subscribe(pipelineError$, ({ dispatch, action }) => {
    const { error } = action;

    dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: null,
      message: error.message,
      title: null,
    }));
  });
}
