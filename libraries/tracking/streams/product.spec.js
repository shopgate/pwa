/* eslint-disable extra-rules/no-single-line-objects */
import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { bin2hex as mockBin2Hex } from '@shopgate/pwa-common/helpers/data';
import { routeWillEnter } from '@shopgate/pwa-common/action-creators/router';
import { HISTORY_PUSH_ACTION, HISTORY_REPLACE_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import requestProducts from '@shopgate/pwa-common-commerce/product/action-creators/requestProducts';
import receiveProducts from '@shopgate/pwa-common-commerce/product/action-creators/receiveProducts';
import receiveProduct from '@shopgate/pwa-common-commerce/product/action-creators/receiveProduct';
import { ITEM_PATTERN, ITEM_REVIEWS_PATTERN } from '@shopgate/pwa-common-commerce/product/constants';
import { pwaDidAppear } from '../action-creators';
import {
  productsReceived$,
  productReceived$,
  productRouteReappeared$,
  productWillEnter$,
  productWillUpdate$,
  productIsReady$,
  variantDidChange$,
} from './product';

let mockedRoutePattern;
let mockedRouteProductId;
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({
  pattern: mockedRoutePattern,
  params: {
    productId: mockBin2Hex(mockedRouteProductId),
  },
}));

/**
 * Wrapper for the routeWillEnter action. It also sets up the mocked current route.
 * @param {string} pattern A route pattern.
 * @param {string} historyAction A history action.
 * @param {string} productId A product id.
 * @return {Object}
 */
const wrappedRouteWillEnter = (pattern, historyAction, productId = '') => {
  mockedRoutePattern = pattern;
  mockedRouteProductId = productId;

  return routeWillEnter({
    pattern,
  }, historyAction);
};

describe('Product streams', () => {
  let store;
  let dispatch;

  beforeEach(() => {
    store = createMockStore(combineReducers({ product }));
    ({ dispatch } = store);
    mockedRoutePattern = ITEM_PATTERN;
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
      mockedRoutePattern = ITEM_REVIEWS_PATTERN;
      dispatch(pwaDidAppear());
      expect(productRouteReappearedSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productWillEnter$', () => {
    let productWillEnterSubscriber;

    beforeEach(() => {
      productWillEnterSubscriber = jest.fn();
      productWillEnter$.subscribe(productWillEnterSubscriber);
    });

    it('should emit when an item page was pushed', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_PUSH_ACTION));
      expect(productWillEnterSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when an item page was replaced', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION));
      expect(productWillEnterSubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when an page was pushed which is not the item page', () => {
      dispatch(wrappedRouteWillEnter(ITEM_REVIEWS_PATTERN, HISTORY_PUSH_ACTION));
      expect(productWillEnterSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productWillUpdate$', () => {
    let productWillUpdateSubscriber;

    beforeEach(() => {
      productWillUpdateSubscriber = jest.fn();
      productWillUpdate$.subscribe(productWillUpdateSubscriber);
    });

    it('should emit when an item page was replaced', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION));
      expect(productWillUpdateSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when an item page was pushed', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_PUSH_ACTION));
      expect(productWillUpdateSubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when an page was replaced which is not the item page', () => {
      dispatch(wrappedRouteWillEnter(ITEM_REVIEWS_PATTERN, HISTORY_REPLACE_ACTION));
      expect(productWillUpdateSubscriber).not.toHaveBeenCalled();
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
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_PUSH_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId }));

      expect(productIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when a product route was entered but the product data was not received yet', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_PUSH_ACTION));
      expect(productIsReadySubscriber).not.toHaveBeenCalled();
    });

    it('should emit when the PWA webview reappeared with an active product page', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_PUSH_ACTION));
      dispatch(pwaDidAppear());
      expect(productIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when the PWA webview reappeared but the product page is not active', () => {
      dispatch(wrappedRouteWillEnter(ITEM_REVIEWS_PATTERN, HISTORY_PUSH_ACTION));
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

      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId, baseProductId }));

      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit until base product data is available', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId, baseProductId }));
      expect(variantDidChangeSubscriber).not.toHaveBeenCalled();

      dispatch(receiveProduct(baseProductId, { id: baseProductId }));
      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
