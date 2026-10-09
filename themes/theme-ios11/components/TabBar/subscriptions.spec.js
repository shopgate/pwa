import configureStore from 'redux-mock-store';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { configuration } from '@shopgate/pwa-common/collections';
import { TAB_BAR_PATTERNS_BLACK_LIST } from '@shopgate/pwa-common/constants/Configuration';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import {
  ITEM_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_GALLERY_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  enableTabBar,
  disableTabBar,
  setTabLastRoute,
} from './actions';
import subscriptions from './subscriptions';

/**
 * Creates a mocked store.
 * @return {Object}
 */
const createMockedStore = () => configureStore()({});

jest.mock('@shopgate/engage/checkout', () => ({
  ...jest.requireActual('@shopgate/engage/checkout/constants'),
}));

jest.mock('@shopgate/engage/login', () => ({
  FORGOT_PASSWORD_PATTERN: 'FORGOT_PASSWORD_PATTERN',
}));

jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: jest.fn(),
}));

describe('TabBar subscriptions', () => {
  let mockedSubscribe;
  let appWillStartCallback;
  let routeDidEnterStream;
  let routeDidEnterCallback;

  beforeAll(() => {
    mockedSubscribe = jest.fn();
    subscriptions(mockedSubscribe);
    [
      [, appWillStartCallback],
      [routeDidEnterStream, routeDidEnterCallback],
    ] = mockedSubscribe.mock.calls;
    appWillStartCallback();
  });

  /**
   * Enters a route and returns the dispatched actions.
   * @param {Object} route The route.
   * @returns {Object[]}
   */
  const enter = (route) => {
    const { dispatch, getActions, getState } = createMockedStore();
    getCurrentRoute.mockReturnValue(route);
    routeDidEnterCallback({
      dispatch,
      getState,
    });
    return getActions();
  };

  it('should call subscribe as expected', () => {
    expect(mockedSubscribe).toHaveBeenCalledTimes(2);
    expect(routeDidEnterStream).toEqual(routeDidEnter$);
  });

  it('should set configuration tab bar blacklist on app start', () => {
    const blacklist = configuration.get(TAB_BAR_PATTERNS_BLACK_LIST);

    expect(blacklist).toHaveLength(17);
    expect(blacklist).not.toContain(ITEM_PATTERN);
    expect(blacklist).not.toContain(ITEM_REVIEWS_PATTERN);
    expect(blacklist).toContain(ITEM_GALLERY_PATTERN);
  });

  it('should enable the tab bar on a not blacklisted route', () => {
    expect(enter({
      pattern: '/something',
      pathname: '/something',
    })).toEqual([enableTabBar()]);
  });

  it('should disable the tab bar on a blacklisted route', () => {
    expect(enter({
      pattern: LOGIN_PATH,
      pathname: LOGIN_PATH,
    })).toEqual([disableTabBar()]);
  });

  it('should enable the tab bar on the product page and remember it for the browse tab', () => {
    const route = {
      pattern: ITEM_PATTERN,
      pathname: '/item/123',
      state: { title: 'Jacket' },
    };

    expect(enter(route)).toEqual([enableTabBar(), setTabLastRoute('browse', route)]);
  });

  it('should enable the tab bar in the cart', () => {
    const route = {
      pattern: CART_PATH,
      pathname: CART_PATH,
    };

    expect(enter(route)).toEqual([enableTabBar(), setTabLastRoute('cart', route)]);
  });

  it('should not remember routes that hide the tab bar', () => {
    expect(enter({
      pattern: ITEM_GALLERY_PATTERN,
      pathname: '/item/123/gallery/0',
    })).toEqual([disableTabBar()]);
  });

  it('should ignore updates without a current route', () => {
    expect(enter(null)).toHaveLength(0);
  });
});
