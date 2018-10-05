import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import {
  setFilterOpened,
  setFilterClosed,
} from 'Components/Navigator/action-creators';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filter(subscribe) {
  const filterRouteDidEnter$ = routeDidEnter(FILTER_PATH);
  const filterRouteDidLeave$ = routeDidLeave(FILTER_PATH);

  /**
   * Gets triggered on leaving the filter route.
   */
  subscribe(filterRouteDidLeave$, ({ dispatch, pathname }) => {
    if (!pathname.startsWith(FILTER_PATH)) {
      dispatch(setFilterClosed());
    }
  });

  /**
   * Gets triggered on entering the filter route.
   */
  subscribe(filterRouteDidEnter$, ({ dispatch, prevPathname }) => {
    if (!prevPathname.startsWith(FILTER_PATH)) {
      dispatch(setFilterOpened());
    }
  });
}
