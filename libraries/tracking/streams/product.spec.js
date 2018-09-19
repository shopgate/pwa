/* eslint-disable extra-rules/no-single-line-objects */
import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { bin2hex as mockBin2Hex } from '@shopgate/pwa-common/helpers/data';
import { routeDidEnter } from '@shopgate/pwa-common/action-creators/router';
import { HISTORY_PUSH_ACTION, HISTORY_REPLACE_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import requestProducts from '@shopgate/pwa-common-commerce/product/action-creators/requestProducts';
import receiveProducts from '@shopgate/pwa-common-commerce/product/action-creators/receiveProducts';
import receiveProduct from '@shopgate/pwa-common-commerce/product/action-creators/receiveProduct';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { PATTERN_ITEM_PAGE } from '../constants';
import { pwaDidAppear } from '../action-creators';
import {
  productsReceived$,
  productReceived$,
  productRouteReappeared$,
  productDidEnter$,
  productDidUpdate$,
  productIsReady$,
  variantDidChange$,
} from './product';

const PATTERN_REVIEWS_PAGE = `${ITEM_PATH}/:productId/reviews`;

let mockedRoutePattern;
let mockedRouteProductId;
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({
  pattern: mockedRoutePattern,
  params: {
    productId: mockBin2Hex(mockedRouteProductId),
  },
}));

/**
 * Wrapper for the routeDidEnter action. It also sets up the mocked current route.
 * @param {string} pattern A route pattern.
 * @param {string} historyAction A history action.
 * @param {string} productId A product id.
 * @return {Object}
 */
const wrappedRouteDidEnter = (pattern, historyAction, productId = '') => {
  mockedRoutePattern = pattern;
  mockedRouteProductId = productId;

  return routeDidEnter({
    pattern,
  }, historyAction);
};

describe('Product streams', () => {
  let store;
  let dispatch;

  beforeEach(() => {
    store = createMockStore(combineReducers({ product }));
    ({ dispatch } = store);
    mockedRoutePattern = PATTERN_ITEM_PAGE;
    mockedRouteProductId = '';
  });

  describe('productsReceived$', () => {
    let productsReceivedSubscriber;

    beforeEach(() => {
      productsReceivedSubscriber = jest.fn();
      productsReceived$.subscribe(productsReceivedSubscriber);
    });

    it('should emit when products where received', () => {
      const hash = 'hash';
      dispatch(requestProducts({ hash }));
      dispatch(receiveProducts({
        products: [],
        hash,
      }));
      expect(productsReceivedSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit for other actions', () => {
      dispatch({ type: 'someaction' });
      expect(productsReceivedSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productReceived$', () => {
    let productReceivedSubscriber;

    beforeEach(() => {
      productReceivedSubscriber = jest.fn();
      productReceived$.subscribe(productReceivedSubscriber);
    });

    it('should emit when a product was received', () => {
      dispatch(receiveProduct());
      expect(productReceivedSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit for other actions', () => {
      dispatch({ type: 'someaction' });
      expect(productReceivedSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productRouteReappeared$', () => {
    let productRouteReappearedSubscriber;

    beforeEach(() => {
      productRouteReappearedSubscriber = jest.fn();
      productRouteReappeared$.subscribe(productRouteReappearedSubscriber);
    });

    it('should emit when the pwaDidAppear action was dispatched on the item route', () => {
      dispatch(pwaDidAppear());
      expect(productRouteReappearedSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when the pwaDidAppear action was dispatched on the item route', () => {
      mockedRoutePattern = PATTERN_REVIEWS_PAGE;
      dispatch(pwaDidAppear());
      expect(productRouteReappearedSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productDidEnter$', () => {
    let productDidEnterSubscriber;

    beforeEach(() => {
      productDidEnterSubscriber = jest.fn();
      productDidEnter$.subscribe(productDidEnterSubscriber);
    });

    it('should emit when an item page was pushed', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_PUSH_ACTION));
      expect(productDidEnterSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when an item page was replaced', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_REPLACE_ACTION));
      expect(productDidEnterSubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when an page was pushed which is not the item page', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_REVIEWS_PAGE, HISTORY_PUSH_ACTION));
      expect(productDidEnterSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productDidUpdate$', () => {
    let productDidUpdateSubscriber;

    beforeEach(() => {
      productDidUpdateSubscriber = jest.fn();
      productDidUpdate$.subscribe(productDidUpdateSubscriber);
    });

    it('should emit when an item page was replaced', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_REPLACE_ACTION));
      expect(productDidUpdateSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when an item page was pushed', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_PUSH_ACTION));
      expect(productDidUpdateSubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when an page was replaced which is not the item page', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_REVIEWS_PAGE, HISTORY_REPLACE_ACTION));
      expect(productDidUpdateSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productIsReady$', () => {
    let productIsReadySubscriber;

    beforeEach(() => {
      productIsReadySubscriber = jest.fn();
      productIsReady$.subscribe(productIsReadySubscriber);
    });

    it('should emit when a product is ready to be tracked', () => {
      const productId = 'abc123';
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_PUSH_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId }));

      expect(productIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when a product route was entered but the product data was not received yet', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_PUSH_ACTION));
      expect(productIsReadySubscriber).not.toHaveBeenCalled();
    });

    it('should emit when the PWA webview reappeared with an active product page', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_PUSH_ACTION));
      dispatch(pwaDidAppear());
      expect(productIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when the PWA webview reappeared but the product page is not active', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_REVIEWS_PAGE, HISTORY_PUSH_ACTION));
      dispatch(pwaDidAppear());
      expect(productIsReadySubscriber).not.toHaveBeenCalled();
    });
  });

  describe('variantDidChange$', () => {
    const baseProductId = 'baseProductId';
    const productId = 'productId';

    let variantDidChangeSubscriber;

    beforeEach(() => {
      variantDidChangeSubscriber = jest.fn();
      variantDidChange$.subscribe(variantDidChangeSubscriber);
    });

    it('should emit when a variant was selected and base product data is available', () => {
      dispatch(receiveProduct(baseProductId, { id: baseProductId }));

      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_REPLACE_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId, baseProductId }));

      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit until base product data is available', () => {
      dispatch(wrappedRouteDidEnter(PATTERN_ITEM_PAGE, HISTORY_REPLACE_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId, baseProductId }));
      expect(variantDidChangeSubscriber).not.toHaveBeenCalled();

      dispatch(receiveProduct(baseProductId, { id: baseProductId }));
      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
