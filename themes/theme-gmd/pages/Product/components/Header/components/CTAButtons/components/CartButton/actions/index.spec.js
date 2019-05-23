/* eslint-disable extra-rules/no-single-line-objects */
import { addProductsToCart } from '@shopgate/engage/cart';
import { addProductToCart } from './index';

jest.mock('@shopgate/pwa-common-commerce/cart/actions/addProductsToCart', () =>
  jest.fn().mockReturnValue('addProductsToCart'));

const mockedState = {
  product: {
    productsById: {
      product_2: {
        productData: {
          flags: { hasOptions: true },
        },
      },
    },
    optionsByProductId: {
      product_2: {
        options: [
          {
            id: '1',
            type: 'select',
            label: 'Option one',
            values: [{ id: '4', label: 'Option value one' }],
          }, {
            id: '3',
            type: 'select',
            label: 'Option two',
            values: [{ id: '2', label: 'Option value two' }],
          },
        ],
      },
    },
  },
};

describe('addProductToCart()', () => {
  const dispatch = jest.fn();
  const getState = jest.fn().mockReturnValue(mockedState);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch addProductsToCart without options', () => {
    const input = {
      productId: 'product_1',
      quantity: 2,
    };

    addProductToCart(input)(dispatch, getState);

    expect(addProductsToCart).toHaveBeenCalledTimes(1);
    expect(addProductsToCart).toHaveBeenCalledWith([input]);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(addProductsToCart());
  });

  it('should dispatch addProductsToCart with options', () => {
    const input = {
      productId: 'product_2',
      quantity: 1,
      options: {
        1: '4',
        3: '2',
      },
    };

    const expected = {
      productId: 'product_2',
      quantity: 1,
      options: [
        { id: '1', type: 'select', value: '4' },
        { id: '3', type: 'select', value: '2' },
      ],
    };

    addProductToCart(input)(dispatch, getState);

    expect(addProductsToCart).toHaveBeenCalledTimes(1);
    expect(addProductsToCart).toHaveBeenCalledWith([expected]);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(addProductsToCart());
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
