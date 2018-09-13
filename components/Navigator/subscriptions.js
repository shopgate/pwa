import { UIEvents } from '@shopgate/pwa-core';
import { main$ } from '@shopgate/pwa-common/streams';
import { cartDidEnter$, cartDidLeave$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { filterDidEnter$, filterDidLeave$ } from '@shopgate/pwa-common-commerce/filter/streams';
import {
  toggleNavigatorCart,
  toggleNavigatorSearch,
} from 'Components/Navigator/action-creators';
import {
  SET_NAVIGATOR_BACKGROUND,
  SET_NAVIGATOR_COLOR,
  TOGGLE_NAVIGATOR,
  TOGGLE_NAVIGATOR_CART,
  TOGGLE_NAVIGATOR_SEARCH,
  TOGGLE_NAVIGATOR_TITLE,
  TOGGLE_PROGRESSBAR,
} from './constants';

// TODO: move to streams.js
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

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function navigator(subscribe) {
  /**
   * Gets triggered when leaving the cart or filter route.
   */
  subscribe(cartFilterRoutesDidLeave$, ({ dispatch }) => {
    dispatch(toggleNavigatorCart(true));
    dispatch(toggleNavigatorSearch(true));
  });

  /**
   * Gets triggered when entering the cart or filter route.
   */
  subscribe(cartFilterRoutesDidEnter$, ({ dispatch }) => {
    dispatch(toggleNavigatorCart(false));
    dispatch(toggleNavigatorSearch(false));
  });

  subscribe(toggleNavigator$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR, action.visible);
  });

  subscribe(toggleNavigatorCart$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR_CART, action.visible);
  });

  subscribe(toggleNavigatorSearch$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR_SEARCH, action.visible);
  });

  subscribe(toggleNavigatorTitle$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR_TITLE, action.visible);
  });

  subscribe(toggleNavigatorTitle$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR_TITLE, action.visible);
  });

  subscribe(setNavigatorBackground$, ({ action }) => {
    UIEvents.emit(SET_NAVIGATOR_BACKGROUND, action.color);
  });

  subscribe(setNavigatorColor$, ({ action }) => {
    UIEvents.emit(SET_NAVIGATOR_COLOR, action.color);
  });

  subscribe(toggleProgressBar$, ({ action }) => {
    UIEvents.emit(TOGGLE_PROGRESSBAR, action.visible);
  });
}
