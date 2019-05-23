/* eslint-disable extra-rules/no-single-line-objects */
import { ENOTFOUND } from '@shopgate/pwa-core';
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { historyPop } from '@shopgate/engage/core';
import expireProductById from '../action-creators/expireProductById';
import subscription from './index';
import { productRelationsReceived$, visibleProductNotFound$ } from '../streams';
import { ERROR_PRODUCT, RECEIVE_PRODUCT_CACHED } from '../constants';

const mockedGetProductsById = jest.fn();
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => jest.fn());
jest.mock('@shopgate/engage/core', () => ({
  historyPop: jest.fn(),
}));
jest.mock('../actions/fetchProductsById', () => (...args) => mockedGetProductsById(...args));
jest.mock('../action-creators/expireProductById', () => jest.fn());

describe('Product subscription', () => {
  const subscribe = jest.fn();
  const getState = jest.fn();
  const dispatch = jest.fn().mockResolvedValue();

  beforeAll(() => {
    subscription(subscribe);
  });

  it('should subscribe', () => {
    expect(subscribe).toHaveBeenCalledTimes(7);
  });

  describe('productRelationsReceived$', () => {
    let productRelationsReceived$Subscription;
    beforeAll(() => {
      ([,,,, productRelationsReceived$Subscription] = subscribe.mock.calls);
    });

    it('should dispatch fetchProductsById when called', () => {
      const [stream, callback] = productRelationsReceived$Subscription;
      expect(stream === productRelationsReceived$).toBe(true);

      const result = ['productId'];
      const hash = 'hash';
      const action = { hash };
      getState.mockReturnValue({
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

  describe('errorCachedProduct$', () => {
    const cachedAction = { type: RECEIVE_PRODUCT_CACHED, productData: { id: 'SG000', name: 'Product 1' } };
    const errorProduct = { type: ERROR_PRODUCT, productId: 'SG000', error: { code: ENOTFOUND } };
    let visibleProductNotFound$Subscription;

    beforeAll(() => {
      ([,,, visibleProductNotFound$Subscription] = subscribe.mock.calls);
    });

    it('should call subscription on correct stream', () => {
      const [stream$] = visibleProductNotFound$Subscription;
      expect(stream$ === visibleProductNotFound$).toBe(true);

      const subscriptionMock = jest.fn();
      stream$.subscribe(subscriptionMock);

      getState.mockReturnValue({
        router: {
          currentRoute: {
            params: { productId: '5347303030' },
            state: { productId: 'SG000' },
          },
        },
      });
      mainSubject.next({ dispatch, getState, action: cachedAction });
      mainSubject.next({ dispatch, getState, action: errorProduct });

      expect(subscriptionMock).toHaveBeenCalledWith(expect.objectContaining({
        action: cachedAction,
      }));
    });
    it('should show modal when product is not more found', () => {
      const [, subscriptionThunk] = visibleProductNotFound$Subscription;

      subscriptionThunk({ dispatch, action: cachedAction });
      expect(showModal).toHaveBeenCalledWith({
        confirm: null,
        dismiss: 'modal.ok',
        title: 'modal.title_error',
        message: 'product.no_more_found',
        params: {
          name: 'Product 1',
        },
      });
      expect(historyPop).toBeCalledTimes(1);
      expect(expireProductById).toHaveBeenCalledWith('SG000');
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
