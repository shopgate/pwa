import { main$, routeDidEnter$ } from '@shopgate/pwa-common/streams';
import {
  ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
  BACK_IN_STOCK_PATTERN,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
} from '../constants';

export const backInStockRemindersDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === BACK_IN_STOCK_PATTERN);

export const addBackInStockReminderSuccess$ = main$
  .filter(({ action }) => action.type === ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS);

export const removeBackInStockReminderSuccess$ = main$
  .filter(({ action }) => action.type === REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS);

export const backInStockReminderNeedsFetch$ = addBackInStockReminderSuccess$.merge(
  removeBackInStockReminderSuccess$,
  backInStockRemindersDidEnter$
);
