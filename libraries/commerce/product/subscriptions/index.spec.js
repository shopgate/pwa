import subscription from './index';
import { productRelationsReceived$ } from '../streams';

const mockedGetProductsById = jest.fn();
jest.mock('../actions/fetchProductsById', () => (...args) => mockedGetProductsById(...args));

describe('Product subscription', () => {
  const subscribe = jest.fn();
  // eslint-disable-next-line no-unused-vars
  let itemRouteDidEnter$Subscription;
  // eslint-disable-next-line no-unused-vars
  let itemRouteDidLeave$Subscription;
  let productRelationsReceived$Subscription;

  it('should subscribe', () => {
    subscription(subscribe);
    [
      itemRouteDidEnter$Subscription,
      itemRouteDidLeave$Subscription,
      productRelationsReceived$Subscription,
    ] = subscribe.mock.calls;
  });

  describe('productRelationsReceived$', () => {
    it('should dispatch fetchProductsById when called', () => {
      const [stream, callback] = productRelationsReceived$Subscription;
      expect(stream === productRelationsReceived$).toBe(true);

      const dispatch = jest.fn();
      const result = ['productId'];
      const hash = 'hash';
      const action = { hash };
      // eslint-disable-next-line require-jsdoc
      const getState = () => ({
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
});
