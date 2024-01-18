import { main$, routeDidEnter$ } from '@shopgate/pwa-common/streams';
import { ADD_BACK_IN_STOCK_REMINDERS_SUCCESS, BACK_IN_STOCK_PATTERN } from '../constants';

export const backInStockRemindersDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === BACK_IN_STOCK_PATTERN);

export const addBackInStockReminderSuccess$ = main$
  .filter(({ action }) => action.type === ADD_BACK_IN_STOCK_REMINDERS_SUCCESS);

