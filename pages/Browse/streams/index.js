import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { BROWSE_PATH } from '../constants';

/**
 * @type {Observable}
 */
export const browsePageWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === BROWSE_PATH);
