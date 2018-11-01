import configureStore from 'redux-mock-store';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { getCartItems } from '@shopgate/pwa-common-commerce/cart/selectors';
import { cartUpdatedWhileVisible$ } from '@shopgate/pwa-common-commerce/cart/streams';
import {
  enableTabBar,
  disableTabBar,
} from './actions';
import subscriptions from './subscriptions';

/**
 * Creates a mocked store.
 * @return {Object}
 */
const createMockedStore = () => configureStore()({});

jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => jest.fn());
jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({ getCartItems: jest.fn() }));

describe('TabBar subscriptions', () => {
  let mockedSubscribe;

  beforeAll(() => {
    mockedSubscribe = jest.fn();
    subscriptions(mockedSubscribe);
  });

  it('should call subscribe as expected', () => {
    expect(mockedSubscribe).toHaveBeenCalledTimes(2);
  });

  let routeDidEnterStream;
  let routeDidEnterCallback;
  let cartUpdateStream;
  let cartUpdateCallback;

  beforeAll(() => {
    [
      [routeDidEnterStream, routeDidEnterCallback],
      [cartUpdateStream, cartUpdateCallback],
    ] = mockedSubscribe.mock.calls;
  });

  it('should be initialized as expected', () => {
    expect(routeDidEnterStream).toEqual(routeDidEnter$);
    expect(routeDidEnterCallback).toBeInstanceOf(Function);
    expect(cartUpdateStream).toEqual(cartUpdatedWhileVisible$);
    expect(cartUpdateCallback).toBeInstanceOf(Function);
  });

  it('should enable the tabbar on a not blacklisted route', () => {
    const { dispatch, getActions } = createMockedStore();
    getCurrentRoute.mockReturnValue({ pattern: '/something' });

    routeDidEnterCallback({ dispatch });

    const actions = getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(enableTabBar());
  });

  it('should disable the tabbar on a blacklisted route', () => {
    const { dispatch, getActions } = createMockedStore();
    getCurrentRoute.mockReturnValue({ pattern: LOGIN_PATH });

    routeDidEnterCallback({ dispatch });

    const actions = getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(disableTabBar());
  });

  it('should enable tabbar when cart is empty', () => {
    const { dispatch, getActions } = createMockedStore();
    getCartItems.mockReturnValue([]);

    cartUpdateCallback({ dispatch, getState: () => ({}) });

    const actions = getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(enableTabBar());
  });

  it('should disable tabbar when cart is not empty', () => {
    const { dispatch, getActions } = createMockedStore();
    getCartItems.mockReturnValue([{ id: '123' }]);

    cartUpdateCallback({ dispatch, getState: () => ({}) });

    const actions = getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(disableTabBar());
  });
});
