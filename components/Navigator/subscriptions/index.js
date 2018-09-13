import { UIEvents } from '@shopgate/pwa-core';
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
} from '../constants';
import * as streams from '../streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function navigator(subscribe) {
  /**
   * Gets triggered when leaving the cart or filter route.
   */
  subscribe(streams.cartFilterRoutesDidLeave$, ({ dispatch }) => {
    dispatch(toggleNavigatorCart(true));
    dispatch(toggleNavigatorSearch(true));
  });

  /**
   * Gets triggered when entering the cart or filter route.
   */
  subscribe(streams.cartFilterRoutesDidEnter$, ({ dispatch }) => {
    dispatch(toggleNavigatorCart(false));
    dispatch(toggleNavigatorSearch(false));
  });

  subscribe(streams.toggleNavigator$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR, action.visible);
  });

  subscribe(streams.toggleNavigatorCart$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR_CART, action.visible);
  });

  subscribe(streams.toggleNavigatorSearch$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR_SEARCH, action.visible);
  });

  subscribe(streams.toggleNavigatorTitle$, ({ action }) => {
    UIEvents.emit(TOGGLE_NAVIGATOR_TITLE, action.visible);
  });

  subscribe(streams.setNavigatorBackground$, ({ action }) => {
    UIEvents.emit(SET_NAVIGATOR_BACKGROUND, action.color);
  });

  subscribe(streams.setNavigatorColor$, ({ action }) => {
    UIEvents.emit(SET_NAVIGATOR_COLOR, action.color);
  });

  subscribe(streams.toggleProgressBar$, ({ action }) => {
    UIEvents.emit(TOGGLE_PROGRESSBAR, action.visible);
  });
}
