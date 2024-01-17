import { routeDidEnter$, routeWillEnter$ } from '@shopgate/pwa-common/streams';
import { BACK_IN_STOCK_PATTERN } from '../constants';

export const backInStockRemindersDidEnter$ = routeDidEnter$
  .filter(({ action }) => {
    console.log('sasa: :6:action.route.pattern:', action.route.pattern);
    return action.route.pattern === BACK_IN_STOCK_PATTERN;
  });
