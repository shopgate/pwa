import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import enableNavigator from 'Components/Navigator/actions/enableNavigator';
import disableNavigator from 'Components/Navigator/actions/disableNavigator';
/**
 * Checkout (dummy) page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  const checkoutDidEnter$ = routeDidEnter(CHECKOUT_PATH);
  const checkoutDidLeave$ = routeDidLeave(CHECKOUT_PATH);

  let lockedUserTrigger;

  subscribe(checkoutDidEnter$, ({ dispatch }) => {
    dispatch(disableNavigator());
    // 20 seconds trigger. If user is locked on this page for 20 seconds, go back no matter what.
    lockedUserTrigger = setTimeout(() => {
      dispatch(goBackHistory());
    }, 20000);
  });
  subscribe(checkoutDidLeave$, ({ dispatch }) => {
    clearTimeout(lockedUserTrigger);
    dispatch(enableNavigator());
  });
}
