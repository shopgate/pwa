import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
import toggleCartIcon from 'Components/Navigator/actions/toggleCartIcon';

const userAddressesRoute = '/user/addresses';
/**
 * @param {function} subscribe subscribe
 */
export default (subscribe) => {
  const userAddressesRouteDidEnter$ = routeDidEnter(userAddressesRoute);
  const userAddressesRouteDidLeave$ = routeDidLeave(userAddressesRoute);

  // Hide top nav elements
  subscribe(userAddressesRouteDidEnter$, ({ dispatch }) => {
    dispatch(disableNavigatorSearch());
    dispatch(toggleCartIcon(false));
  });

  // UnHide top nav elements
  subscribe(userAddressesRouteDidLeave$, ({ dispatch }) => {
    dispatch(enableNavigatorSearch());
    dispatch(toggleCartIcon(true));
  });
};
