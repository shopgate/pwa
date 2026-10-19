import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import withProductStock from './withProductStock';

const stock = {
  quantity: 5,
  minOrderQuantity: 2,
};

const store = configureStore()({
  product: {
    productsById: {
      p1: {
        productData: {
          id: 'p1',
          stock,
        },
      },
      p2: {
        productData: { id: 'p2' },
      },
    },
  },
});

const Wrapped = withProductStock(({ stock: injected }) => (
  <div>{JSON.stringify(injected === undefined ? 'undefined' : injected)}</div>
));

/**
 * @param {Object} props The props for the wrapped component.
 * @returns {string} The rendered stock.
 */
const renderStock = (props) => {
  const { container } = render(<Provider store={store}><Wrapped {...props} /></Provider>);
  return JSON.parse(container.textContent);
};

describe('engage > product > hocs > withProductStock', () => {
  it('should inject the stock of the product', () => {
    expect(renderStock({ productId: 'p1' })).toEqual(stock);
  });

  it('should inject the stock of a variant', () => {
    expect(renderStock({
      productId: 'p2',
      variantId: 'p1',
    })).toEqual(stock);
  });

  it('should inject no stock for a product without stock information', () => {
    expect(renderStock({ productId: 'p2' })).toBe('undefined');
  });

  it('should inject null when the product is not available', () => {
    expect(renderStock({ productId: 'unknown' })).toBeNull();
  });
});
