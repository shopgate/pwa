import { redirects } from '@shopgate/pwa-common/collections';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import { hasProductVariety } from '@shopgate/pwa-common-commerce/product';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { DIRECT_SHIP, getPreferredFulfillmentMethod } from '@shopgate/engage/locations';
import addCouponsToCart from '../actions/addCouponsToCart';
import addProductsToCart from '../actions/addProductsToCart';
import {
  CART_PATH,
  DEEPLINK_CART_ADD_COUPON_PATTERN,
  DEEPLINK_CART_ADD_PRODUCT_PATTERN,
} from '../constants';
import {
  cartUpdateFailed$,
  routeAddProductNavigate$,
  routeWithCouponWillEnter$,
} from '../streams';
import subscription from './index';

const mockModalHandler = jest.fn();
jest.mock('@shopgate/engage/core', () => ({
  errorBehavior: { modal: jest.fn(() => mockModalHandler) },
}));

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  getProductRoute: jest.fn(productId => productId),
  hasProductVariety: jest.fn(),
  getProduct: jest.fn(),
}));
jest.mock('@shopgate/engage/locations', () => ({
  DIRECT_SHIP: 'DIRECT_SHIP',
  getPreferredLocation: jest.fn(),
  getPreferredFulfillmentMethod: jest.fn(),
}));

jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyReplace: jest.fn(),
}));

jest.mock('../actions/addCouponsToCart', () => jest.fn());
jest.mock('../actions/addProductsToCart', () => jest.fn());
jest.mock('../actions/updateProductsInCart', () => jest.fn());

describe('Cart subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn().mockImplementation(action => action);
  const getState = jest.fn();

  beforeAll(() => {
    getPreferredFulfillmentMethod.mockReturnValue(DIRECT_SHIP);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    subscription(subscribe);
  });

  describe('appWillStart$', () => {
    let stream;
    let callback;

    const redirectsSetSpy = jest.spyOn(redirects, 'set');

    beforeEach(() => {
      [[stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe as expected', () => {
      expect(stream).toEqual(appWillStart$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should setup a redirect handler for cart_add_coupon deeplinks', () => {
      callback();

      expect(redirectsSetSpy).toHaveBeenCalledTimes(2);
      expect(redirectsSetSpy.mock.calls).toEqual([
        [DEEPLINK_CART_ADD_COUPON_PATTERN, expect.any(Function)],
        [DEEPLINK_CART_ADD_PRODUCT_PATTERN, expect.any(Function)],
      ]);
    });

    it('should dispatch the addCouponsToCart action when a cart_add_coupon deeplink was opened', () => {
      callback();
      const coupon = '10PERCENTOFF';
      const action = {
        params: {
          pathname: `/cart_add_coupon/${coupon}?get=parameter`,
        },
      };

      const handlerResult = redirects.get(DEEPLINK_CART_ADD_COUPON_PATTERN)({
        dispatch,
        action,
      });

      expect(handlerResult).toBeNull();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(addCouponsToCart).toHaveBeenCalledTimes(1);
      expect(addCouponsToCart).toHaveBeenCalledWith([coupon], false);
    });
  });

  describe('routeWithCouponWillEnter$', () => {
    let stream;
    let callback;

    beforeEach(() => {
      [,,,,,,,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe as expected', () => {
      expect(stream).toEqual(routeWithCouponWillEnter$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch the addCouponsToCart action', () => {
      const coupon = '10PERCENTOFF';
      const action = {
        route: {
          query: {
            coupon,
            some: 'param',
          },
          pathname: '/pathname',
        },
      };

      callback({
        dispatch,
        action,
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(addCouponsToCart).toHaveBeenCalledTimes(1);
      expect(addCouponsToCart).toHaveBeenCalledWith([coupon], false);
      expect(historyReplace).toHaveBeenCalledTimes(1);
      expect(historyReplace).toHaveBeenCalledWith({ pathname: '/pathname?some=param' });
    });
  });

  describe('routeAddProductNavigate$', () => {
    let stream;
    let callback;

    const action = { productId: 'prod1' };

    beforeEach(() => {
      [,,,,,,,,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe as expected', () => {
      expect(stream).toEqual(routeAddProductNavigate$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should navigate to PDP when product has variety', () => {
      hasProductVariety.mockReturnValueOnce(true);
      callback({
        dispatch,
        action,
        getState,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyReplace).toHaveBeenCalledTimes(1);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: action.productId,
      });
    });
    it('should navigate to cart when product has no variety', () => {
      hasProductVariety.mockReturnValueOnce(false);
      callback({
        dispatch,
        action,
        getState,
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(addProductsToCart).toHaveBeenCalledWith([{
        productId: action.productId,
        quantity: 1,
      }]);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: CART_PATH,
      });
    });
  });

  describe('cartUpdateFailed$', () => {
    let callback;

    beforeEach(() => {
      const call = subscribe.mock.calls.find(([stream]) => stream === cartUpdateFailed$);
      // Guard the lookup so a missing subscription fails the explicit assertion below rather than
      // throwing "undefined is not iterable" in setup and crashing every test in this block.
      callback = call?.[1];
    });

    it('should subscribe as expected', () => {
      const call = subscribe.mock.calls.find(([stream]) => stream === cartUpdateFailed$);
      expect(call).toBeDefined();
      expect(callback).toBeInstanceOf(Function);
    });

    it('should forward messageParams as additionalParams and derive context from the pipeline', () => {
      const action = {
        errors: [{
          code: 'ECART :: ESTOCKREACHED',
          message: 'ApiteSW6Utility.notice.product-stock-reached',
          pipeline: 'shopgate.cart.updateProducts.v1',
          translated: false,
          messageParams: {
            parameters: {
              name: 'Rinderpansen',
              quantity: 50,
            },
          },
        }],
      };

      callback({
        dispatch,
        action,
      });

      expect(mockModalHandler).toHaveBeenCalledTimes(1);
      expect(mockModalHandler).toHaveBeenCalledWith(expect.objectContaining({
        dispatch,
        error: expect.objectContaining({
          code: 'ECART :: ESTOCKREACHED',
          context: 'shopgate.cart.updateProducts.v1',
          meta: expect.objectContaining({
            message: 'ApiteSW6Utility.notice.product-stock-reached',
            translated: false,
            additionalParams: action.errors[0].messageParams,
          }),
        }),
      }));
    });

    it('should use the message key and the backend translated flag', () => {
      const action = {
        errors: [{
          code: 'ECART :: ENOTFOUND',
          message: 'ApiteSW6Utility.notice.product-not-found',
          pipeline: 'shopgate.cart.updateProducts.v1',
          translated: false,
          messageParams: {},
        }],
      };

      callback({
        dispatch,
        action,
      });

      expect(mockModalHandler).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          meta: expect.objectContaining({
            message: 'ApiteSW6Utility.notice.product-not-found',
            translated: false,
          }),
        }),
      }));
    });

    it('should support the legacy result.messages shape (context/additionalParams)', () => {
      const action = {
        errors: [{
          code: '1001',
          message: 'cart.error.product.1001',
          context: 'shopgate.cart.updateProducts',
          translated: false,
          additionalParams: {
            minQty: 2,
          },
        }],
      };

      callback({
        dispatch,
        action,
      });

      expect(mockModalHandler).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          code: '1001',
          context: 'shopgate.cart.updateProducts',
          meta: expect.objectContaining({
            message: 'cart.error.product.1001',
            translated: false,
            additionalParams: action.errors[0].additionalParams,
          }),
        }),
      }));
    });

    it('should not show a modal for already handled errors', () => {
      const action = {
        errors: [{
          code: 'ECART :: ESTOCKREACHED',
          message: 'ApiteSW6Utility.notice.product-stock-reached',
          handled: true,
          messageParams: {},
        }],
      };

      callback({
        dispatch,
        action,
      });

      expect(mockModalHandler).not.toHaveBeenCalled();
    });
  });
});
