import { ACTION_REPLACE, ACTION_PUSH } from '@virtuous/conductor';
import { navigate$ } from '@shopgate/pwa-common/streams/router';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

const actionsWl = [ACTION_PUSH, ACTION_REPLACE];

export const checkoutDidEnter$ = navigate$
  .filter(({ action, getState }) => {
    if (action.params.pathname !== CHECKOUT_PATH) {
      return false;
    }

    const userLoggedIn = isUserLoggedIn(getState());
    const navigateAction = action.params.action;

    // When not logged in users try to navigate to the checkout, they are redirected to the login.
    if (!userLoggedIn && navigateAction === ACTION_PUSH) {
      return false;
    }

    /**
     * A checkout route can be pushed when a logged in user opens the checkout. It can also replace
     * the current route when a user is redirected from the login form after a successful login.
     */
    return actionsWl.includes(navigateAction);
  });
