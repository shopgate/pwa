/* eslint-disable extra-rules/no-single-line-objects */
import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { ENOTFOUND } from '@shopgate/pwa-core';
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { bin2hex as mockBin2Hex } from '@shopgate/pwa-common/helpers/data';
import { routeDidUpdate } from '@shopgate/pwa-common/action-creators/router';
import { ROUTE_WILL_ENTER } from '@shopgate/pwa-common/constants/ActionTypes';
import { ACTION_UPDATE } from '@virtuous/conductor';
import router from '@shopgate/pwa-common/reducers/router';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import receiveProduct from '@shopgate/pwa-common-commerce/product/action-creators/receiveProduct';
import errorProduct from '../action-creators/errorProduct';
import { ITEM_PATTERN } from '../constants';
import {
  productReceived$,
  variantWillUpdate$,
  variantDidChange$,
  visibleProductNotFound$,
} from './index';

jest.mock('../selectors/product', () => ({
  getBaseProduct: () => ({
    id: 'variantId',
  }),
}));

/**
 * Wrapper for the routeWillEnter action. It also sets up the mocked current route.
 * @param {string} pattern A route pattern.
 * @param {string} historyAction A history action.
 * @param {string} productId A product id.
 * @param {string} variantId A variant id.
 * @return {Object}
 */
const wrappedRouteDidUpdate = (pattern, historyAction, productId = '', variantId = '') => routeDidUpdate({
  pattern,
  params: {
    productId: mockBin2Hex(productId),
  },
  state: {
    productId: variantId,
  },
}, historyAction);

describe('Product streams', () => {
  let store;
  let dispatch;

  beforeEach(() => {
    store = createMockStore(combineReducers({
      product,
      router,
    }));
    ({ dispatch } = store);
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

  describe('variantWillUpdate$', () => {
    let variantWillUpdateSubscriber;

    beforeEach(() => {
      variantWillUpdateSubscriber = jest.fn();
      variantWillUpdate$.subscribe(variantWillUpdateSubscriber);
    });

    it('should emit when an item page was updated', () => {
      dispatch(wrappedRouteDidUpdate(ITEM_PATTERN, ACTION_UPDATE));
      expect(variantWillUpdateSubscriber).toHaveBeenCalledTimes(1);
    });
  });

  describe('variantDidChange$', () => {
    let variantDidChangeSubscriber;
    const baseProductId = 'baseProductId';
    const productId = 'productId';
    const variantId = 'variantId';

    beforeEach(() => {
      variantDidChangeSubscriber = jest.fn();
      variantDidChange$.subscribe(variantDidChangeSubscriber);
    });

    it('should emit when a variant was selected and base product data is available', () => {
      dispatch(wrappedRouteDidUpdate(ITEM_PATTERN, ACTION_UPDATE, productId, variantId));
      dispatch(receiveProduct(variantId, {
        id: variantId,
        baseProductId,
      }));

      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);
    });
  });

  describe('visibleProductNotFound$', () => {
    const hex = '5347313030';
    const bin = 'SG100';

    let subscriber;
    beforeEach(() => {
      subscriber = jest.fn();
    });

    it('should emit error action', () => {
      visibleProductNotFound$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ROUTE_WILL_ENTER,
          route: { pattern: ITEM_PATTERN, params: { productId: hex } },
        },
      });
      const notFound = errorProduct(bin, ENOTFOUND);
      mainSubject.next({ action: notFound });
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith({ action: notFound });
    });

    it('should not emit for not visible product', () => {
      visibleProductNotFound$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ROUTE_WILL_ENTER,
          route: { pattern: ITEM_PATTERN, params: { productId: 'OTHER_PRODUCT' } },
        },
      });
      const notFound = errorProduct(bin, ENOTFOUND);
      mainSubject.next({ action: notFound });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
