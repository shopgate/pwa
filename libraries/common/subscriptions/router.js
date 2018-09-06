import conductor from '@virtuous/conductor';
import {
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
  ACTION_RESET,
} from '@virtuous/conductor/constants';
import { redirects } from '../collections';
import { navigate } from '../action-creators';
import { historyPop, historyReplace } from '../actions/router';
import * as handler from './helpers/handleLinks';
import { navigate$, userDidLogin$ } from '../streams';
import { isUserLoggedIn } from '../selectors/user';
import appConfig from '../helpers/config';

/**
 * Router subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function router(subscribe) {
  subscribe(navigate$, ({ action, dispatch, getState }) => {
    const { params: { action: historyAction, silent, state: routeState } } = action;

    switch (historyAction) {
      case ACTION_POP: {
        conductor.pop();
        return;
      }
      case ACTION_RESET: {
        conductor.reset();
        return;
      }
      default:
        break;
    }

    const state = getState();
    let { pathname: location } = action.params;

    // Remove trailing slashes from the location.
    if (location && location.length > 1 && location.endsWith('/')) {
      location = location.slice(0, -1);
    }

    // Route authentication.
    if (!isUserLoggedIn(state)) {
      // Determine whether or not this location is protected.
      const protector = handler.getProtector(location);

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

    // Check for a redirect url and change location if one is found.
    const redirect = redirects.get(location);

    if (redirect) {
      location = redirect;
    }

    // Override the location if is Shop link is found.
    if (handler.isShopLink(location)) {
      const { pathname, search } = new URL(location);
      location = `${pathname}${search}`;
    }

    // If there is one of the known protocols in the url.
    if (location && handler.hasKnownProtocols(location)) {
      if (handler.isExternalLink(location)) {
        handler.openExternalLink(location);
      } else if (handler.isNativeLink(location)) {
        handler.openNativeLink(location);
      }

      return;
    }

    if (location && handler.isLegacyPage(location)) {
      handler.openLegacy(location);
      return;
    }

    if (location && handler.isLegacyLink(location)) {
      handler.openLegacyLink(location);
      return;
    }

    switch (historyAction) {
      case ACTION_PUSH: {
        conductor.push(location, routeState, silent);
        break;
      }
      case ACTION_REPLACE: {
        conductor.replace(location, routeState, silent);
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
      const { location, state } = action.redirect;
      if (location) {
        dispatch(historyReplace({
          pathname: location,
          state,
        }));
      } else {
        dispatch(historyPop());
      }
    }
  });
}
