import configureStore from 'redux-mock-store';
import middleware from '@shopgate/pwa-common/store/middelwares/streams';
import { UIEvents } from '@shopgate/pwa-core';
import { routeDidEnter, routeDidLeave } from '@shopgate/pwa-common/action-creators/router';
import initSubcribers from '@shopgate/pwa-common/subscriptions';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import subscription from './index';
import * as actions from '../action-creators';
import * as types from '../constants';

const mockedStore = configureStore([middleware]);
const store = mockedStore();
initSubcribers([subscription]);

describe('Navigator Subscriptions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('should dispatch when the cart/filter route enters', () => {
    store.dispatch(routeDidEnter({
      pattern: CART_PATH,
    }));

    const [, cart, search] = store.getActions();
    expect(cart.type).toBe(types.TOGGLE_NAVIGATOR_CART);
    expect(cart.visible).toBe(false);
    expect(search.type).toBe(types.TOGGLE_NAVIGATOR_SEARCH);
    expect(search.visible).toBe(false);
  });

  it('should dispatch when the cart/filter route leaves', () => {
    store.dispatch(routeDidLeave({
      pattern: CART_PATH,
    }));

    const [, cart, search] = store.getActions();
    expect(cart.type).toBe(types.TOGGLE_NAVIGATOR_CART);
    expect(cart.visible).toBe(true);
    expect(search.type).toBe(types.TOGGLE_NAVIGATOR_SEARCH);
    expect(search.visible).toBe(true);
  });

  it('should emit after TOGGLE_NAVIGATOR action', () => {
    store.dispatch(actions.toggleNavigator(true));
    expect(UIEvents.emit).toHaveBeenCalledWith(types.TOGGLE_NAVIGATOR, true);
  });

  it('should emit after TOGGLE_NAVIGATOR_CART action', () => {
    store.dispatch(actions.toggleNavigatorCart(true));
    expect(UIEvents.emit).toHaveBeenCalledWith(types.TOGGLE_NAVIGATOR_CART, true);
  });

  it('should emit after TOGGLE_NAVIGATOR_SEARCH action', () => {
    store.dispatch(actions.toggleNavigatorSearch(true));
    expect(UIEvents.emit).toHaveBeenCalledWith(types.TOGGLE_NAVIGATOR_SEARCH, true);
  });

  it('should emit after TOGGLE_NAVIGATOR_TITLE action', () => {
    store.dispatch(actions.toggleNavigatorTitle(true));
    expect(UIEvents.emit).toHaveBeenCalledWith(types.TOGGLE_NAVIGATOR_TITLE, true);
  });

  it('should emit after SET_NAVIGATOR_BACKGROUND action', () => {
    store.dispatch(actions.setNavigatorBackgroundColor('red'));
    expect(UIEvents.emit).toHaveBeenCalledWith(types.SET_NAVIGATOR_BACKGROUND, 'red');
  });

  it('should emit after SET_NAVIGATOR_COLOR action', () => {
    store.dispatch(actions.setNavigatorTextColor(true));
    expect(UIEvents.emit).toHaveBeenCalledWith(types.SET_NAVIGATOR_COLOR, true);
  });

  it('should emit after TOGGLE_PROGRESSBAR action', () => {
    store.dispatch(actions.toggleProgressBar(true));
    expect(UIEvents.emit).toHaveBeenCalledWith(types.TOGGLE_PROGRESSBAR, true);
  });
});
