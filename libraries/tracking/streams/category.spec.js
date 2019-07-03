/* eslint-disable extra-rules/no-single-line-objects */
import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import category from '@shopgate/pwa-common-commerce/category/reducers';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import { routeDidEnter } from '@shopgate/pwa-common/action-creators/router';
import receiveRootCategories from '@shopgate/pwa-common-commerce/category/action-creators/receiveRootCategories';
import requestProducts from '@shopgate/pwa-common-commerce/product/action-creators/requestProducts';
import receiveProducts from '@shopgate/pwa-common-commerce/product/action-creators/receiveProducts';
import {
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import { pwaDidAppear } from '@shopgate/pwa-common/action-creators';
import { categoryIsReady$ } from './category';

let mockedRoutePattern;
let mockedCategoryId;

jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: () => ({
    pattern: mockedRoutePattern,
    params: {
      ...(mockedCategoryId && { categoryId: mockedCategoryId }),
    },
    state: {},
  }),
  getCurrentPathname: () => ({}),
  getCurrentQuery: () => ({}),
  getRouterStack: () => ({}),
  getCurrentState: () => ({}),
  getCurrentParams: () => ({}),
}));

/**
 * A wrapper for the route did enter action creator. Beside returning the action object of the
 * original action creator, it also updates the pattern of the mocked current route.
 * @param {string} pattern The route pattern.
 * @param {string} categoryId A category id.
 * @return {Object} The dispatched action object.
 */
const routeDidEnterWrapped = (pattern, categoryId) => {
  mockedRoutePattern = pattern;
  // Category ids are encrypted within the route states.
  mockedCategoryId = bin2hex(categoryId);

  return routeDidEnter({
    pattern,
    params: {
      ...(mockedCategoryId && { categoryId: mockedCategoryId }),
    },
  });
};

describe('Category streams', () => {
  let categoryIsReadySubscriber;
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRoutePattern = '';
    mockedCategoryId = null;
    ({ dispatch } = createMockStore(combineReducers({ category, product })));

    categoryIsReadySubscriber = jest.fn();
    categoryIsReady$.subscribe(categoryIsReadySubscriber);
  });

  describe('root category route', () => {
    it('should emit when the root category route is active and category data is available', () => {
      dispatch(receiveRootCategories([{ id: 'one' }]));
      dispatch(routeDidEnterWrapped(ROOT_CATEGORY_PATTERN));
      expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit after category data came in when the root category route is active', () => {
      dispatch(routeDidEnterWrapped(ROOT_CATEGORY_PATTERN));
      expect(categoryIsReadySubscriber).not.toHaveBeenCalled();
      dispatch(receiveRootCategories([{ id: 'one' }]));
      expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when category data is incoming but no category route is not active', () => {
      dispatch(routeDidEnterWrapped('/some/pattern'));
      dispatch(receiveRootCategories([{ id: 'one' }]));
      expect(categoryIsReadySubscriber).not.toHaveBeenCalled();
    });
  });

  describe('regular category routes', () => {
    /**
     * Dispatches the receiveProducts action with passed params. Since the state need to be
     * initialized with a fetching entry, it also dispatches the requestProducts action.
     * @param {Array} products A list of products.
     * @param {string} categoryId A category id.
     */
    const dispatchReceiveProducts = (products, categoryId) => {
      const hash = generateResultHash({ categoryId });

      dispatch(requestProducts({ hash }));
      dispatch(receiveProducts({
        hash,
        products,
        totalResultCount: products.length,
      }));
    };

    it('should emit when a category route is active and category date is available', () => {
      const categoryId = 'abc123';
      dispatchReceiveProducts([{ id: 'one' }], categoryId);
      dispatch(routeDidEnterWrapped(CATEGORY_PATTERN, categoryId));
      expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit after category data came in when the root category route is active', () => {
      const categoryId = 'abc123';
      dispatch(routeDidEnterWrapped(CATEGORY_PATTERN, categoryId));
      expect(categoryIsReadySubscriber).not.toHaveBeenCalled();

      dispatchReceiveProducts([{ id: 'one' }], categoryId);
      expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should only emit for the first chunk of products', () => {
      const categoryId = 'abc123';
      dispatch(routeDidEnterWrapped(CATEGORY_PATTERN, categoryId));
      dispatchReceiveProducts([{ id: 'one' }], categoryId);
      dispatchReceiveProducts([{ id: 'two' }], categoryId);
      expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when category data is incoming but no category route is not active', () => {
      dispatch(routeDidEnterWrapped('/some/pattern'));
      dispatchReceiveProducts([{ id: 'one' }], 'someid');
      expect(categoryIsReadySubscriber).not.toHaveBeenCalled();
    });
  });

  describe('navigating back from legacy pages', () => {
    it('should emit when a root category reappeared from a legacy webview', () => {
      mockedRoutePattern = ROOT_CATEGORY_PATTERN;
      dispatch(pwaDidAppear());
      expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit when a category reappeared from a legacy webview', () => {
      mockedRoutePattern = CATEGORY_PATTERN;
      dispatch(pwaDidAppear());
      expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when pwaDidAppear is dispatched and no category path is active', () => {
      mockedRoutePattern = '/some/pattern';
      dispatch(pwaDidAppear());
      expect(categoryIsReadySubscriber).not.toHaveBeenCalled();
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
