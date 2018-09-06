import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { SET_VIEW_TITLE } from '@shopgate/pwa-common/constants/ActionTypes';
import { REQUEST_REVIEWS } from '@shopgate/pwa-common-commerce/reviews/constants';
import { reviewsWillEnter$, reviewsWillLeave$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import {
  hash,
  reviewRouteMock,
  mockedStateWithTwoReviews,
} from '@shopgate/pwa-common-commerce/reviews/mock';
import {
  SET_SEARCH_DISABLED,
  SET_SEARCH_ENABLED,
} from 'Components/Navigator/constants';
import { defaultState } from 'Components/Navigator/mock';
import subscribe from './subscriptions';

const mockedStore = configureStore([thunk]);

const mockedResolver = jest.fn();
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

const results = [
  [
    {
      type: SET_VIEW_TITLE,
      title: 'titles.reviews',
    },
    {
      hash,
      type: REQUEST_REVIEWS,
    },
  ],
  [
    {
      type: SET_SEARCH_DISABLED,
    },
    {
      hash,
      type: REQUEST_REVIEWS,
    },
  ],
  [
    {
      type: SET_SEARCH_ENABLED,
    },
  ],
];

describe('Reviews subscriptions', () => {
  let subscribeMock;
  let reviewsEnter;
  let reviewsLeave;
  let store = mockedStore();
  beforeAll(() => {
    jest.resetAllMocks();
    store.clearActions();
    subscribeMock = jest.fn();
  });
  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(2);
    [reviewsEnter, reviewsLeave] = subscribeMock.mock.calls;
    expect(reviewsEnter[0]).toBe(reviewsWillEnter$);
    expect(reviewsLeave[0]).toBe(reviewsWillLeave$);
  });

  describe('reviewsWillEnter$', () => {
    it('should set title and fetch', () => {
      const state = {
        ...defaultState,
        ...mockedStateWithTwoReviews,
        navigator: {
          ...defaultState.navigator,
          showSearch: false,
        },
      };

      store = mockedStore(state);
      reviewsEnter[1]({
        ...store,
        action: {
          route: reviewRouteMock,
        },
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[0]);
    });

    it('should disable navigator search', () => {
      const state = {
        ...defaultState,
        ...mockedStateWithTwoReviews,
        ui: {
          ...mockedStateWithTwoReviews.ui,
          general: {
            ...mockedStateWithTwoReviews.ui.general,
            title: 'titles.reviews',
          },
        },
      };
      store = mockedStore(state);
      reviewsEnter[1]({
        ...store,
        action: {
          route: reviewRouteMock,
        },
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[1]);
    });
  });

  describe('reviewsWillLeave$', () => {
    it('should enable navigator search', () => {
      const state = {
        ...defaultState,
        ...mockedStateWithTwoReviews,
        navigator: {
          ...defaultState.navigator,
          showSearch: false,
        },
      };

      store = mockedStore(state);
      reviewsLeave[1](store);
      const actions = store.getActions();
      expect(actions).toEqual(results[2]);
    });
  });
});
