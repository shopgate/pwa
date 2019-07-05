import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { bin2hex as mockBin2Hex } from '@shopgate/pwa-common/helpers/data';
import { routeDidUpdate } from '@shopgate/pwa-common/action-creators/router';
import { ACTION_UPDATE } from '@virtuous/conductor';
import router from '@shopgate/pwa-common/reducers/router';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import receiveProduct from '@shopgate/pwa-common-commerce/product/action-creators/receiveProduct';
import { ITEM_PATTERN } from '../constants';
import {
  productReceived$,
  variantWillUpdate$,
  variantDidChange$,
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
});
