import requestProducts from '@shopgate/pwa-common-commerce/product/action-creators/requestProducts';
import receiveProducts from '@shopgate/pwa-common-commerce/product/action-creators/receiveProducts';
import requestProduct from '@shopgate/pwa-common-commerce/product/action-creators/requestProduct';
import receiveProduct from '@shopgate/pwa-common-commerce/product/action-creators/receiveProduct';
import setProductId from '@shopgate/pwa-common-commerce/product/action-creators/setProductId';
import setProductVariantId from '@shopgate/pwa-common-commerce/product/action-creators/setProductVariantId';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { createStore } from './specHelper';
import { pwaDidAppear } from '../action-creators';
import {
  productsReceived$,
  productReceived$,
  productIsReady$,
} from './product';

describe.skip('Product streams', () => {
  describe('productsReceived$', () => {
    let productsReceivedSubscriber;

    beforeEach(() => {
      productsReceivedSubscriber = jest.fn();
      productsReceived$.subscribe(productsReceivedSubscriber);
    });

    it('should emit when products where received', () => {
      const { dispatch } = createStore();
      const hash = 'hash';
      dispatch(requestProducts({ hash }));
      dispatch(receiveProducts({
        products: [],
        hash,
      }));
      expect(productsReceivedSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit for other actions', () => {
      const { dispatch } = createStore();
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
      const { dispatch } = createStore();
      dispatch(receiveProduct());
      expect(productReceivedSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit for other actions', () => {
      const { dispatch } = createStore();
      dispatch({ type: 'someaction' });
      expect(productReceivedSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('productIsReady$', () => {
    let productIsReadySubscriber;

    beforeEach(() => {
      productIsReadySubscriber = jest.fn();
      productIsReady$.subscribe(productIsReadySubscriber);
    });

    it('should emit when a product is ready to be tracked', () => {
      const { dispatch } = createStore(ITEM_PATH);
      const productId = 'abc123';

      // Put a mocked product into the store.
      dispatch(receiveProduct(productId, {}));
      dispatch(setProductId(productId));

      expect(productIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit after a product was received when a product is currently loading', () => {
      const { dispatch } = createStore(ITEM_PATH);
      const productId = 'abc123';

      // Simulate an ongoing request.
      dispatch(requestProduct(productId));
      dispatch(setProductId(productId));
      expect(productIsReadySubscriber).not.toHaveBeenCalled();
      // Data came in.
      dispatch(receiveProduct());
      expect(productIsReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit if a variant is selected', () => {
      const { dispatch } = createStore(ITEM_PATH);
      const productId = 'abc123';
      const variantId = '123abc';
      dispatch(setProductId(productId));
      dispatch(setProductVariantId(variantId));
      dispatch(receiveProduct(productId, {}));
      dispatch(receiveProduct(variantId, {}));
      expect(productIsReadySubscriber).not.toHaveBeenCalled();
    });

    describe('coming back from legacy pages', () => {
      it('should emit when pwaDidAppear is dispatched and a product path is active', () => {
        const { dispatch } = createStore(ITEM_PATH);
        dispatch(pwaDidAppear());
        expect(productIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when pwaDidAppear is dispatched and no product path is active', () => {
        const { dispatch } = createStore('/somepath');
        dispatch(pwaDidAppear());
        expect(productIsReadySubscriber).not.toHaveBeenCalled();
      });
    });
  });
});

