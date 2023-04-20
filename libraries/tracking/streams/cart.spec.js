import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/action-creators/addProductsToCart';
import {
  getProductById,
  fetchProductsById,
} from '@shopgate/engage/product';
import { productsAdded$ } from './cart';

jest.mock('@shopgate/engage/product', () => ({
  getProductById: jest.fn().mockReturnValue({ productData: { id: 'mock' } }),
  fetchProductsById: jest.fn().mockReturnValue(() => Promise.resolve({
    products: [
      { id: 'SG' },
      { id: 'ACME' },
    ],
  })),
}));

describe('Cart streams', () => {
  let dispatch;

  beforeEach(() => {
    ({ dispatch } = createMockStore(combineReducers({ product })));
  });

  describe('productsAdded$', () => {
    let productsAddedSubscriber;
    let subscription;

    let action;

    beforeEach(() => {
      jest.clearAllMocks();
      productsAddedSubscriber = jest.fn();
      subscription = productsAdded$.subscribe(productsAddedSubscriber);

      action = addProductsToCart([{
        productId: 'SG',
        quantity: 1,
      }, {
        productId: 'ACME',
        quantity: 2,
      }]);
    });

    afterEach(() => {
      subscription.unsubscribe();
    });

    it('should directly emit when all product data is available in store', (done) => {
      dispatch(action);

      // ugly trick, but async screens are complicated to test
      setTimeout(() => {
        expect(productsAddedSubscriber).toHaveBeenCalledTimes(1);
        expect(getProductById).toHaveBeenCalledTimes(2);
        expect(fetchProductsById).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should emit after products where fetched when product data is not in store', (done) => {
      // one product not available in store
      getProductById.mockReturnValueOnce(null);

      dispatch(action);

      setTimeout(() => {
        expect(productsAddedSubscriber).toHaveBeenCalledTimes(1);
        // Array.every seems to stop the loop after first check failed - so only one call here
        expect(getProductById).toHaveBeenCalledTimes(1);
        expect(fetchProductsById).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('should not call the subscriber when request fails', (done) => {
      getProductById.mockReturnValueOnce(null);
      fetchProductsById.mockReturnValue(() => Promise.reject());

      dispatch(action);

      setTimeout(() => {
        expect(productsAddedSubscriber).toHaveBeenCalledTimes(0);
        done();
      }, 0);
    });

    it('should not call the subscriber when request returns no products', (done) => {
      getProductById.mockReturnValueOnce(null);
      fetchProductsById.mockReturnValueOnce(() => Promise.resolve({ products: [] }));

      dispatch(action);

      setTimeout(() => {
        expect(productsAddedSubscriber).toHaveBeenCalledTimes(0);
        expect(getProductById).toHaveBeenCalledTimes(1);
        expect(fetchProductsById).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });
  });
});
