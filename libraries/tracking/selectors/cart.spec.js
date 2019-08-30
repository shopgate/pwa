import {
  getSubTotal,
  getCartProducts,
  getDiscountsAmount,
} from '@shopgate/pwa-common-commerce/cart/selectors/index';
import getCart from './cart';

jest.mock('@shopgate/pwa-common-commerce/cart/selectors/index', () => ({
  getSubTotal: jest.fn(),
  getCurrency: jest.fn().mockReturnValue('EUR'),
  getCartProducts: jest.fn(),
  getDiscountsAmount: jest.fn(),
}));

describe('Tracking selector / cart', () => {
  it('should return empty cart', () => {
    getSubTotal.mockReturnValueOnce(0);
    getCartProducts.mockReturnValueOnce([]);
    getDiscountsAmount.mockReturnValueOnce(0);
    expect(getCart({})).toEqual({
      amount: {
        gross: '0.00',
        net: '0.00',
        currency: 'EUR',
      },
      products: [],
      productsCount: 0,
    });
  });

  it('should return cart', () => {
    getSubTotal.mockReturnValueOnce('100.00');
    // eslint-disable-next-line extra-rules/no-single-line-objects
    getCartProducts.mockReturnValueOnce([{ quantity: 1, product: { id: '_ID_', name: '_NAME_', price: { unit: 100 } } }]);
    getDiscountsAmount.mockReturnValueOnce(5);
    expect(getCart({})).toEqual({
      amount: {
        gross: '95.00',
        net: '95.00',
        currency: 'EUR',
      },
      products: [{
        uid: '_ID_',
        name: '_NAME_',
        amount: { gross: '100.00' },
        quantity: 1,
      }],
      productsCount: 1,
    });
  });
});
