import queryString from 'query-string';
import {
  router,
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
  ACTION_RESET,
} from '@virtuous/conductor';
import Route from '@virtuous/conductor/Route';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { logger } from '@shopgate/pwa-core';
import { LoadingProvider } from '../providers';
import { redirects } from '../collections';
import { navigate } from '../action-creators';
import { historyRedirect, historyPush, windowOpenOverride } from '../actions/router';
import * as handler from './helpers/handleLinks';
import {
  navigate$, userDidLogin$, appWillStart$, windowOpenOverride$,
} from '../streams';
import { isUserLoggedIn } from '../selectors/user';
import { getIsConnected } from '../selectors/client';
import appConfig from '../helpers/config';
import authRoutes from '../collections/AuthRoutes';
import ToastProvider from '../providers/toast';

/**
 * Router subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function routerSubscriptions(subscribe) {
  subscribe(navigate$, async (params) => {
    const {
      action, dispatch, getState, events,
    } = params;

    /**
     * Triggers a connectivity error toast message
     */
    const showConnectivityError = () => {
      events.emit(ToastProvider.ADD, {
        id: 'navigate.error',
        message: 'error.general',
      });
    };

    const { params: { action: historyAction, silent, state: routeState } } = action;

    switch (historyAction) {
      case ACTION_POP: {
        router.pop();
        return;
      }
      case ACTION_RESET: {
        router.reset();
        return;
      }
      default:
        break;
    }

    const state = getState();
    let { pathname: location } = action.params;

    location = handler.sanitizeLink(location);

    // Stop further processing if the location is empty.
    if (!location) {
      return;
    }

    const { pathname: currentPathname } = getCurrentRoute(state);

    // Prevent the current route from being pushed again.
    if (historyAction === ACTION_PUSH && location === currentPathname) {
      return;
    }

    // Abort navigation when the internet connection got lost.
    if (!getIsConnected(state)) {
      showConnectivityError();
      return;
    }

    // Route authentication.
    if (!isUserLoggedIn(state)) {
      // Determine whether or not this location is protected.
      const protector = authRoutes.getProtector(location);

      // If protected then navigate to the protector instead.
      if (protector) {
        dispatch(navigate({
          action: historyAction,
          pathname: protector,
          state: {
            redirect: {
              location,
              state: routeState,
            },
          },
        }));

        return;
      }
    }

    /* eslint-disable prefer-const */
    // Check for a redirect and change location if one is found.
    let {
      handler: redirect,
      matcher,
      pathParams,
      queryParams,
    } = redirects.getRedirectExtended(location) ?? {};
    /* eslint-enable prefer-const */

    if (redirect) {
      if (typeof redirect === 'function' || redirect instanceof Promise) {
        const { pathname } = getCurrentRoute(state);
        LoadingProvider.setLoading(pathname);

        const pattern = router.findPattern(location.split('?')[0]);
        const { transform } = router.patterns[pattern] || {};
        const route = new Route({
          pathname: location,
          pattern,
          routeState,
          transform,
        });

        try {
          redirect = await redirect({
            ...params,
            action: {
              ...params.action,
              params: {
                ...params.action.params,
                // Merge the sanitized location into the redirect handler payload.
                pathname: location,
              },
              route,
              redirectMeta: {
                location,
                matcher,
                pathParams,
                queryParams,
              },
            },
          });
        } catch (e) {
          redirect = null;
          logger.error(e);
        }

        LoadingProvider.unsetLoading(pathname);

        if (!redirect) {
          return;
        }
      }

      location = redirect;
    }

    const parsed = queryString.parseUrl(location);

    if (!parsed.url) {
      // The URL is not valid - show a toast message
      showConnectivityError();
      return;
    }

    // Override the location if is Shop link is found.
    if (handler.isShopLink(location)) {
      const { pathname, search } = new URL(location);
      location = `${pathname}${search}`;
    }

    // If there is one of the known protocols in the url.
    if (location && handler.hasKnownProtocols(location)) {
      if (handler.isExternalLink(location)) {
        handler.openExternalLink(location, historyAction, state, routeState);
      } else if (handler.isNativeLink(location)) {
        handler.openNativeLink(location);
      }

      return;
    }

    if (location && handler.isLegacyPage(location)) {
      handler.openLegacy(location, historyAction, state);
      return;
    }

    if (location && handler.isLegacyLink(location)) {
      handler.openLegacyLink(location, historyAction, state);
      return;
    }

    switch (historyAction) {
      case ACTION_PUSH: {
        router.push({
          pathname: location,
          state: routeState,
          emitBefore: silent,
          emitAfter: silent,
        });
        break;
      }
      case ACTION_REPLACE: {
        router.replace({
          pathname: location,
          state: routeState,
          emitBefore: silent,
          emitAfter: silent,
        });
        break;
      }
      default:
        break;
    }
  });

  /**
   * Added a 100ms delay here to allow the Redux action to complete.
   * Without it the store would show that the user is still not
   * logged in during the upcoming navigate() action.
   */
  const redirectUser$ = userDidLogin$.delay(100);

  subscribe(redirectUser$, ({ action, dispatch }) => {
    if (appConfig.webCheckoutShopify === null) {
      dispatch(historyRedirect(action.redirect));
    }
  });

  subscribe(appWillStart$, ({ dispatch }) => {
    /**
     * Override for the window.open method which is usually used by external SDKs to open URLs.
     * Calls of this method would usually replace the PWA with the passed url. The override ensures
     * that the URL is passed through the router system which implements logic for various URL
     * formats.
     *
     * With debugging in mind "historyPush" is not directly dispatched. Instead it dispatches
     * a dedicated action which is eventually transformed to "historyPush".
     *
     * @param {string} url A string indicating the URL or path of the resource to be loaded.
     * @returns {null}
     */
    window.open = (url = '') => {
      dispatch(windowOpenOverride({ pathname: url }));
      return null;
    };
  });

  subscribe(windowOpenOverride$, ({ action, dispatch }) => {
    if (action.pathname) {
      dispatch(historyPush({
        pathname: action.pathname,
      }));
    }
  });
}
