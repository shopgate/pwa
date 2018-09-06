import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SET_VIEW_TITLE } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  TOGGLE_NAVIGATOR_CART_ICON,
  SET_SEARCH_DISABLED,
} from 'Components/Navigator/constants';
import { cartWillEnter$, cartWillLeave$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { emptyState, cartState, uiState } from '@shopgate/pwa-common-commerce/cart/mock';
import { defaultState } from 'Components/Navigator/mock';
import subscribe from './subscriptions';

const mockedStore = configureStore([thunk]);

const results = [
  [
    {
      type: SET_VIEW_TITLE,
      title: 'titles.cart',
    },
    { type: SET_SEARCH_DISABLED },
  ],
  [
    {
      type: SET_VIEW_TITLE,
      title: 'titles.cart',
    },
    {
      type: TOGGLE_NAVIGATOR_CART_ICON,
      active: false,
    },
  ],
  [
    {
      type: SET_VIEW_TITLE,
      title: 'titles.cart',
    },
  ],
];

describe('Cart subscriptions', () => {
  let subscribeMock;
  let cartEnter;
  let cartLeave;
  let store = mockedStore();
  beforeAll(() => {
    jest.resetAllMocks();
    store.clearActions();
    subscribeMock = jest.fn();
  });
  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(2);
    [cartEnter, cartLeave] = subscribeMock.mock.calls;
    expect(cartEnter[0]).toBe(cartWillEnter$);
    expect(cartLeave[0]).toBe(cartWillLeave$);
  });

  describe('cartWillEnter$', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      store.clearActions();
    });

    it('should dispatch actions with empty cart', () => {
      const state = {
        ...emptyState,
        ...uiState,
        navigator: {
          ...defaultState.navigator,
          showSearch: true,
        },
      };
      store = mockedStore(state);
      cartEnter[1]({
        dispatch: store.dispatch,
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[0]);
    });

    it('should dispatch actions with non-empty cart', () => {
      const state = {
        ...cartState,
        ...uiState,
        navigator: {
          ...defaultState.navigator,
          showSearch: false,
          showCartIcon: true,
        },
      };
      store = mockedStore(state);
      cartEnter[1]({
        dispatch: store.dispatch,
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[1]);
    });

    it('should only set title', () => {
      const state = {
        ...cartState,
        ...uiState,
        navigator: {
          ...defaultState.navigator,
          showSearch: false,
          showCartIcon: false,
        },
      };
      store = mockedStore(state);
      cartEnter[1]({
        dispatch: store.dispatch,
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[2]);
    });
  });
});
