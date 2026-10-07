import { render } from '@testing-library/react';
import { ProductGrid, ProductList } from '@shopgate/engage/product/components';
import { UnwrappedProductsWidget as ProductsWidget } from './ProductsWidget';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/product/components', () => ({
  ProductGrid: jest.fn(() => null),
  ProductList: jest.fn(() => null),
}));

describe('<ProductsWidget />', () => {
  const getProducts = jest.fn();
  const props = {
    classes: { listView: 'listView' },
    id: 'someid',
    products: [],
    totalProductCount: null,
    settings: {
      headline: '',
      layout: 'grid',
      productLimit: 6,
      queryParams: 'Blue',
      queryType: 2,
    },
    getProducts,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the grid only when products are received', () => {
    const { container, rerender } = render(<ProductsWidget {...props} />);

    expect(container).toBeEmptyDOMElement();
    expect(ProductGrid).not.toHaveBeenCalled();

    rerender(<ProductsWidget {...props} products={[{}]} totalProductCount={1} />);

    expect(container).not.toBeEmptyDOMElement();
    expect(ProductGrid.mock.lastCall[0]).toEqual(expect.objectContaining({
      infiniteLoad: false,
      products: [{}],
      scope: 'widgets',
    }));
    expect(ProductList).not.toHaveBeenCalled();
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toHaveBeenCalledWith(
      props.settings.queryType,
      props.settings.queryParams,
      {
        limit: props.settings.productLimit,
        offset: 0,
      },
      props.id
    );
  });

  it('should render the products in the list view', () => {
    const { container, rerender } = render(<ProductsWidget {...props} />);

    rerender((
      <ProductsWidget
        {...props}
        products={[{}]}
        settings={{
          headline: '',
          layout: 'list',
        }}
        totalProductCount={1}
      />
    ));

    expect(container.firstChild).toHaveClass('listView');
    expect(container.querySelector('[data-test-id="Headline"]')).not.toBeInTheDocument();
    expect(ProductList.mock.lastCall[0]).toEqual({
      flags: {
        manufacturer: false,
        name: true,
        price: undefined,
        reviews: undefined,
      },
      infiniteLoad: false,
      products: [{}],
      scope: 'widgets',
    });
    expect(ProductGrid).not.toHaveBeenCalled();
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toHaveBeenCalledWith(
      props.settings.queryType,
      props.settings.queryParams,
      {
        limit: props.settings.productLimit,
        offset: 0,
      },
      props.id
    );
  });
});
