import queryString from 'query-string';
import {
  router,
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
  ACTION_RESET,
} from '@virtuous/conductor';
import Route from '@virtuous/conductor/Route';
import { HISTORY_RESET_TO } from '@shopgate/pwa-common/constants/ActionTypes';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { logger } from '@shopgate/pwa-core';
import { LoadingProvider } from '../providers';
import { redirects } from '../collections';
import { navigate } from '../action-creators';
import { historyRedirect } from '../actions/router';
import * as handler from './helpers/handleLinks';
import { navigate$, userDidLogin$ } from '../streams';
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

    const {
      params: {
        silent,
        steps,
        pathname: resetToPathname,
        action: historyAction,
        state: routeState,
      },
    } = action;

    switch (historyAction) {
      case ACTION_POP: {
        router.pop({
          ...(typeof steps === 'number' && { steps }),
        });
        return;
      }
      case ACTION_RESET: {
        router.reset();
        return;
      }
      case HISTORY_RESET_TO: {
        router.resetTo(resetToPathname);
        return;
      }
      default:
        break;
    }

    const state = getState();
    let { pathname: location } = action.params;

    /**
     * Further on we will only use the sanitized location except when link is external.
     * In that case we want to preserve the original location.
     */
    const originalLocation = location;
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

    // Check for a redirect and change location if one is found.
    let redirect = redirects.getRedirect(location);

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
      if (handler.isExternalLink(originalLocation)) {
        handler.openExternalLink(originalLocation, historyAction, state, routeState);
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
}
