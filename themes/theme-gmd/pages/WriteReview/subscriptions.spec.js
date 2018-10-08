import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import {
  REQUEST_USER_REVIEW,
  FLUSH_USER_REVIEWS,
} from '@shopgate/pwa-common-commerce/reviews/constants';
import {
  SET_VIEW_LOADING,
  UNSET_VIEW_LOADING,
  CREATE_TOAST,
  SET_VIEW_TITLE,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { userDidLogout$ } from '@shopgate/pwa-common/streams/user';
import { writeReviewRouteMock } from '@shopgate/pwa-common-commerce/reviews/mock';
import {
  requestReviewSubmit$,
  responseReviewSubmit$,
  successReviewSubmit$,
} from '@shopgate/pwa-common-commerce/reviews/streams';
import { mockedStateWithoutReview } from './mock';
import {
  productRoutesWillEnter$,
  reviewsRouteWillEnter$,
} from './streams';
import subscribe from './subscriptions';

const mockedStore = configureStore([thunk]);

jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => jest.fn());

const mockedResolver = jest.fn();
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
      mockedResolver(mockInstance, resolve, reject);
    })
  )
);

const results = [
  [
    {
      productId: 'foo',
      type: REQUEST_USER_REVIEW,
    },
  ],
  [
    {
      title: 'titles.reviews',
      type: SET_VIEW_TITLE,
    },
  ],
  [
    {
      pathname: '/item/666f6f/write_review',
      type: SET_VIEW_LOADING,
    },
  ],
  [
    {
      pathname: '/item/666f6f/write_review',
      type: UNSET_VIEW_LOADING,
    },
  ],
  [
    {
      options: {
        action: null,
        actionOnClick: null,
        duration: 4000,
        id: 1,
        message: 'reviews.success_message',
      },
      type: CREATE_TOAST,
    },
  ],
  [
    { type: FLUSH_USER_REVIEWS },
  ],
];

describe('Reviews subscriptions', () => {
  let subscribeMock;
  let productEnter;
  let reviewsEnter;
  let submitReview;
  let submitResponse;
  let submitSuccess;
  let userLogout;
  let store = mockedStore();

  beforeAll(() => {
    jest.resetAllMocks();
    store.clearActions();
    subscribeMock = jest.fn();
    getCurrentRoute.mockReturnValue({ ...writeReviewRouteMock });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    subscribe(subscribeMock);

    [
      productEnter,
      reviewsEnter,
      submitReview,
      submitResponse,
      submitSuccess,
      userLogout,
    ] = subscribeMock.mock.calls;
  });

  it('should subscribe', () => {
    expect(subscribeMock.mock.calls.length).toBe(6);
    expect(productEnter[0]).toBe(productRoutesWillEnter$);
    expect(reviewsEnter[0]).toBe(reviewsRouteWillEnter$);
    expect(submitReview[0]).toBe(requestReviewSubmit$);
    expect(submitResponse[0]).toBe(responseReviewSubmit$);
    expect(submitSuccess[0]).toBe(successReviewSubmit$);
    expect(userLogout[0]).toBe(userDidLogout$);
  });

  describe('productRoutesWillEnter$', () => {
    const action = {
      route: {
        params: {
          productId: '666f6f',
        },
      },
    };

    it('should not fetch when product id not present', () => {
      store = mockedStore(...mockedStateWithoutReview);
      productEnter[1]({
        ...store,
        action: {
          ...action,
          route: {
            ...action.route,
            params: {
              productId: null,
            },
          },
        },
      });
      const actions = store.getActions();
      expect(actions).toEqual([]);
    });

    it('should not fetch when not logged in', () => {
      const state = {
        ...mockedStateWithoutReview,
        user: {
          ...mockedStateWithoutReview.user,
          login: {
            ...mockedStateWithoutReview.user.login,
            isLoggedIn: false,
          },
        },
      };

      store = mockedStore(state);
      productEnter[1]({
        ...store,
        action,
      });
      const actions = store.getActions();
      expect(actions).toEqual([]);
    });

    it('should fetch when logged in', () => {
      store = mockedStore({ ...mockedStateWithoutReview });
      productEnter[1]({
        ...store,
        action,
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[0]);
    });
  });

  describe('reviewsRouteWillEnter$', () => {
    it('should set view title', () => {
      store = mockedStore({ ...mockedStateWithoutReview });
      reviewsEnter[1]({
        ...store,
      });
      const actions = store.getActions();
      expect(actions).toEqual(results[1]);
    });
  });

  describe('requestReviewSubmit$', () => {
    it('should set view loading', () => {
      store = mockedStore({
        view: { isLoading: {} },
      });
      submitReview[1](store);
      const actions = store.getActions();
      expect(actions).toEqual(results[2]);
    });
  });

  describe('responseReviewSubmit$', () => {
    it('should unset view loading', () => {
      const view = {
        isLoading: {
          [writeReviewRouteMock.pathname]: 1,
        },
      };

      store = mockedStore({
        view,
      });
      submitResponse[1](store);

      const actions = store.getActions();
      expect(actions).toEqual(results[3]);
    });
  });

  describe.skip('successReviewSubmit$', () => {
    it('should navigate back and show toast', () => {
      store = mockedStore({ });
      submitSuccess[1](store);

      const actions = store.getActions();
      expect(actions).toEqual(results[4]);
    });
  });

  describe('userDidLogout$', () => {
    it('should unset userReviews state', () => {
      store = mockedStore({});
      userLogout[1](store);

      const actions = store.getActions();
      expect(actions).toEqual(results[5]);
    });
  });
});
