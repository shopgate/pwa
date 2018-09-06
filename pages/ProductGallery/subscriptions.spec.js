import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { defaultState } from 'Components/Navigator/mock';
import {
  SET_NAVIGATOR_DISABLED,
  SET_NAVIGATOR_ENABLED,
} from 'Components/Navigator/constants';
import {
  galleryWillEnter$,
  galleryWillLeave$,
} from '@shopgate/pwa-common-commerce/product/streams';
import subscribe from './subscriptions';

const mockedStore = configureStore([thunk]);

const results = [
  [{
    type: SET_NAVIGATOR_DISABLED,
  }],
  [{
    type: SET_NAVIGATOR_ENABLED,
  }],
];

describe('ProductGallery subscriptions', () => {
  let subscribeMock;
  let galleryEnter;
  let galleryLeave;
  let store = mockedStore();

  beforeAll(() => {
    jest.resetAllMocks();
    store.clearActions();
    subscribeMock = jest.fn();
  });

  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(2);
    [galleryEnter, galleryLeave] = subscribeMock.mock.calls;
    expect(galleryEnter[0]).toBe(galleryWillEnter$);
    expect(galleryLeave[0]).toBe(galleryWillLeave$);
  });

  describe('galleryWillEnter$', () => {
    it('should do nothing when disabled', () => {
      store = mockedStore({
        ...defaultState,
        navigator: {
          ...defaultState.navigator,
          enabled: false,
        },
      });
      galleryEnter[1](store);
      const actions = store.getActions();
      expect(actions.length).toEqual(0);
    });

    it('should disable navigator when enabled', () => {
      store = mockedStore(defaultState);
      galleryEnter[1](store);
      const actions = store.getActions();
      expect(actions).toEqual(results[0]);
    });
  });

  describe('galleryWillLeave$', () => {
    it('should enable navigator when disabled', () => {
      store = mockedStore({
        ...defaultState,
        navigator: {
          ...defaultState.navigator,
          enabled: false,
        },
      });
      galleryLeave[1](store);
      const actions = store.getActions();
      expect(actions).toEqual(results[1]);
    });

    it('should do nothing when enabled', () => {
      store = mockedStore(defaultState);
      galleryLeave[1](store);
      const actions = store.getActions();
      expect(actions.length).toEqual(0);
    });
  });
});
