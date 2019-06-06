/* eslint-disable extra-rules/no-single-line-objects */
import { ENOTFOUND } from '@shopgate/pwa-core';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { historyPop } from '@shopgate/engage/core';
import expireProductById from '../action-creators/expireProductById';
import subscription from './index';
import errorProduct from '../action-creators/errorProduct';
import fetchProductImages from '../actions/fetchProductImages';
import { galleryWillEnter$, productRelationsReceived$ } from '../streams';
import { productImageFormats } from '../collections';

const mockedGetProductsById = jest.fn();
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => jest.fn());
jest.mock('@shopgate/engage/core', () => ({
  historyPop: jest.fn(),
}));
jest.mock('../actions/fetchProductsById', () => (...args) => mockedGetProductsById(...args));
jest.mock('../action-creators/expireProductById', () => jest.fn());
jest.mock('../actions/fetchProductImages', () => jest.fn());

describe('Product subscription', () => {
  const subscribe = jest.fn();
  const getState = jest.fn();
  const dispatch = jest.fn().mockResolvedValue();

  beforeAll(() => {
    subscription(subscribe);
  });

  it('should subscribe', () => {
    expect(subscribe).toHaveBeenCalledTimes(8);
  });

  describe('galleryWillEnter$', () => {
    let galleryWillEnter$Subscription;
    beforeAll(() => {
      ([, galleryWillEnter$Subscription] = subscribe.mock.calls);
    });

    it('should dispatch fetchProductImages when called', () => {
      const formats = [{ height: 1024, width: 1024 }];
      productImageFormats.set('GROUP', formats);
      const [stream, callback] = galleryWillEnter$Subscription;
      expect(stream === galleryWillEnter$).toBe(true);

      const action = {
        route: {
          params: {
            productId: '31333337',
          },
        },
      };

      callback({
        dispatch,
        action,
      });

      expect(fetchProductImages).toHaveBeenCalledWith('1337', formats);
    });
  });

  describe('productRelationsReceived$', () => {
    let productRelationsReceived$Subscription;
    beforeAll(() => {
      ([, , , , , productRelationsReceived$Subscription] = subscribe.mock.calls);
    });

    it('should dispatch fetchProductsById when called', () => {
      const [stream, callback] = productRelationsReceived$Subscription;
      expect(stream === productRelationsReceived$).toBe(true);

      const result = ['productId'];
      const hash = 'hash';
      const action = { hash };
      getState.mockReturnValueOnce({
        product: {
          productRelationsByHash: {
            [hash]: {
              productIds: result,
            },
          },
        },
      });
      callback({
        dispatch,
        getState,
        action,
      });
      expect(mockedGetProductsById).toHaveBeenCalledWith(result);
    });
  });

  describe('visibleProductNotFound$ subscription', () => {
    let visibleProductNotFound$Subscription;
    let subscriptionThunk;
    beforeAll(() => {
      ([, , , , visibleProductNotFound$Subscription] = subscribe.mock.calls);
      ([, subscriptionThunk] = visibleProductNotFound$Subscription);
    });

    it('should show modal with product name', () => {
      subscriptionThunk([
        { dispatch, action: errorProduct('SG100', ENOTFOUND) },
        { dispatch, action: { productData: { id: 'SG100', name: 'SG100 name' } } },
      ]);

      expect(showModal).toHaveBeenCalledWith({
        confirm: null,
        dismiss: 'modal.ok',
        title: 'modal.title_error',
        message: 'product.no_more_found',
        params: {
          name: 'SG100 name',
        },
      });
      expect(historyPop).toBeCalledTimes(1);
      expect(expireProductById).toHaveBeenCalledWith('SG100');
    });

    it('should show modal with product id', () => {
      subscriptionThunk([
        { dispatch, action: errorProduct('SG100', ENOTFOUND) },
        { dispatch, action: { productData: { id: 'SG200', name: 'SG200 name' } } },
      ]);

      expect(showModal).toHaveBeenCalledWith({
        confirm: null,
        dismiss: 'modal.ok',
        title: 'modal.title_error',
        message: 'product.no_more_found',
        params: {
          name: 'SG100',
        },
      });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
