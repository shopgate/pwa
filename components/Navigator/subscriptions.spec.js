import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { routeDidChange$ } from '@shopgate/pwa-common/streams';
import subscribe, {
  searchRouteDidEnter$,
  cartFilterRoutesDidEnter$,
  cartFilterRoutesDidLeave$,
} from './subscriptions';
import {
  TOGGLE_NAVIGATOR_SEARCH,
  TOGGLE_NAVIGATOR_CART_ICON,
  SET_NAVIGATOR_SEARCH_QUERY,
  SET_SEARCH_ENABLED,
  SET_SEARCH_DISABLED,
} from './constants';
import { defaultState } from './mock';

const mockedStore = configureStore([thunk]);

const results = [
  [{
    type: TOGGLE_NAVIGATOR_SEARCH,
    active: false,
  }],
  [{
    type: SET_NAVIGATOR_SEARCH_QUERY,
    query: null,
  }],
  [{
    type: TOGGLE_NAVIGATOR_CART_ICON,
    active: true,
  },
  {
    type: SET_SEARCH_ENABLED,
  }],
  [{
    type: TOGGLE_NAVIGATOR_CART_ICON,
    active: false,
  },
  {
    type: SET_SEARCH_DISABLED,
  }],
];

describe('Navigator subscriptions', () => {
  let subscribeMock;
  let routeEnter;
  let searchEnter;
  let cartFilterLeave;
  let cartFilterEnter;
  let store = mockedStore();

  beforeAll(() => {
    jest.resetAllMocks();
    store.clearActions();
    subscribeMock = jest.fn();
  });

  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(4);
    [routeEnter, searchEnter, cartFilterLeave, cartFilterEnter] = subscribeMock.mock.calls;
    expect(routeEnter[0]).toBe(routeDidChange$);
    expect(searchEnter[0]).toBe(searchRouteDidEnter$);
    expect(cartFilterLeave[0]).toBe(cartFilterRoutesDidLeave$);
    expect(cartFilterEnter[0]).toBe(cartFilterRoutesDidEnter$);
  });

  describe('routeDidChange$', () => {
    it('should toggle search field', () => {
      const payload = {
        pathname: '/',
        prevPathname: null,
      };
      const mockedState = {
        ...defaultState,
        navigator: {
          ...defaultState.navigator,
          searchActive: true,
        },
      };

      store = mockedStore(mockedState);
      routeEnter[1]({
        ...store,
        ...payload,
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[0]);
    });
  });
  describe('searchRouteDidEnter$', () => {
    it('should set search phrase', () => {
      store = mockedStore(defaultState);
      searchEnter[1](store);
      const actions = store.getActions();
      expect(actions).toEqual(results[1]);
    });
    it('should not set search phrase', () => {
      const mockedState = {
        ...defaultState,
        navigator: {
          ...defaultState.navigator,
          searchPhrase: 'Shirt red',
        },
      };

      store = mockedStore(mockedState);
      searchEnter[1](store);
      const actions = store.getActions();
      expect(actions[0]).toBe(undefined);
    });
  });
  describe('cartFilterRoutesDidLeave$', () => {
    it('should show cart icon and enable search', () => {
      const state = {
        ...defaultState,
        navigator: {
          ...defaultState.navigator,
          showSearch: false,
          showCartIcon: false,
        },
        cart: {
          items: [{
            type: 'product',
            quantity: 1,
          }],
          productPendingCount: 0,
        },
      };
      store = mockedStore(state);
      cartFilterLeave[1](store);
      const actions = store.getActions();
      expect(actions).toEqual(results[2]);
    });
  });
  describe('cartFilterRoutesDidEnter$', () => {
    it('should hide cart icon and disable search', () => {
      const state = {
        ...defaultState,
        cart: {
          items: [{
            type: 'product',
            quantity: 1,
          }],
          productPendingCount: 0,
        },
      };

      store = mockedStore(state);
      cartFilterEnter[1](store);
      const actions = store.getActions();
      expect(actions).toEqual(results[3]);
    });
  });
});
