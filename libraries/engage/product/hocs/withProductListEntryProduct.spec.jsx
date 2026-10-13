import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import ProductListEntryContext from '../providers/ProductListEntry/context';
import { getProduct } from '../selectors/product';
import withProductListEntryProduct from './withProductListEntryProduct';

jest.mock('../selectors/product', () => ({
  getProduct: jest.fn(),
}));

const store = configureStore()({});
const entry = {
  productId: 'entry',
  productListType: 'favoritesList',
};

describe('engage > product > hocs > withProductListEntryProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getProduct.mockImplementation((state, { productId }) => ({
      id: productId,
      name: `Product ${productId}`,
    }));
  });

  /**
   * @param {Object} props The props for the wrapped component.
   * @param {Function} Component The wrapped component.
   * @returns {JSX.Element}
   */
  const createTree = (props, Component) => (
    <Provider store={store}>
      <ProductListEntryContext.Provider value={entry}>
        <Component {...props} />
      </ProductListEntryContext.Provider>
    </Provider>
  );

  it('should inject the product list entry and its product', () => {
    const Wrapped = withProductListEntryProduct(({ product, productListEntry }) => (
      <div>{`${product.name} in ${productListEntry.productListType}`}</div>
    ));

    render(createTree({}, Wrapped));

    expect(screen.getByText('Product entry in favoritesList')).toBeInTheDocument();
  });

  it('should reuse a passed product that belongs to the entry', () => {
    const Wrapped = withProductListEntryProduct(({ product }) => <div>{product.name}</div>);

    render(createTree({
      product: {
        id: 'entry',
        name: 'From props',
      },
    }, Wrapped));

    expect(screen.getByText('From props')).toBeInTheDocument();
  });

  it('should inject the product with a custom prop name', () => {
    const Wrapped = withProductListEntryProduct(({ item }) => <div>{item.name}</div>, {
      prop: 'item',
    });

    render(createTree({}, Wrapped));

    expect(screen.getByText('Product entry')).toBeInTheDocument();
  });

  it('should not remount the wrapped component when the parent renders again', () => {
    const onMount = jest.fn();

    /**
     * @returns {JSX.Element}
     */
    const Inner = () => {
      useEffect(() => {
        onMount();
      }, []);

      return <div>inner</div>;
    };

    const Wrapped = withProductListEntryProduct(Inner);
    const { rerender } = render(createTree({ count: 1 }, Wrapped));

    rerender(createTree({ count: 2 }, Wrapped));
    rerender(createTree({ count: 3 }, Wrapped));

    expect(onMount).toHaveBeenCalledTimes(1);
  });
});
