import conductor from '@virtuous/conductor';
import {
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
} from '@virtuous/conductor/constants';
import { navigate } from '../action-creators/router';
import * as handler from './helpers/handleLinks';
import { navigate$ } from '../streams/router';
import { userDidLogin$ } from '../streams/user';
import { isUserLoggedIn } from '../selectors/user';
import appConfig from '../helpers/config';

/**
 * Router subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function router(subscribe) {
  subscribe(navigate$, ({ action, dispatch, getState }) => {
    const { action: historyAction, location, state: routeState } = action;
    const state = getState();

    // Route authentication.
    if (!isUserLoggedIn(state)) {
      // Determine whether or not this location is protected.
      const protector = handler.getProtector(location);

      // If protected then navigate to the protector instead.
      if (protector) {
        dispatch(navigate(historyAction, protector, {
          redirect: {
            location: action.location,
            state: routeState,
          },
        }));

        return;
      }
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
      case ACTION_POP: {
        conductor.pop();
        break;
      }
      case ACTION_PUSH: {
        conductor.push(location, routeState);
        break;
      }
      case ACTION_REPLACE: {
        conductor.replace(location, routeState);
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
      dispatch(navigate(ACTION_REPLACE, location, state));
    }
  });
}
