import { main$ } from '@shopgate/pwa-common/streams';
import { cartDidEnter$, cartDidLeave$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { filterDidEnter$, filterDidLeave$ } from '@shopgate/pwa-common-commerce/filter/streams';
import {
  SET_NAVIGATOR_BACKGROUND,
  SET_NAVIGATOR_COLOR,
  TOGGLE_NAVIGATOR,
  TOGGLE_NAVIGATOR_CART,
  TOGGLE_NAVIGATOR_SEARCH,
  TOGGLE_NAVIGATOR_TITLE,
  TOGGLE_PROGRESSBAR,
} from './constants';

export const cartFilterRoutesDidEnter$ = cartDidEnter$.merge(filterDidEnter$);

export const cartFilterRoutesDidLeave$ = cartDidLeave$.merge(filterDidLeave$);

export const toggleNavigator$ = main$
  .filter(({ action }) => action.type === TOGGLE_NAVIGATOR);

export const toggleProgressBar$ = main$
  .filter(({ action }) => action.type === TOGGLE_PROGRESSBAR);

export const toggleNavigatorCart$ = main$
  .filter(({ action }) => action.type === TOGGLE_NAVIGATOR_CART);

export const toggleNavigatorSearch$ = main$
  .filter(({ action }) => action.type === TOGGLE_NAVIGATOR_SEARCH);

export const toggleNavigatorTitle$ = main$
  .filter(({ action }) => action.type === TOGGLE_NAVIGATOR_TITLE);

export const setNavigatorBackground$ = main$
  .filter(({ action }) => action.type === SET_NAVIGATOR_BACKGROUND);

export const setNavigatorColor$ = main$
  .filter(({ action }) => action.type === SET_NAVIGATOR_COLOR);
