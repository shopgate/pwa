import { render, screen } from '@testing-library/react';
import { ProductListTypeProvider, ProductListEntryProvider } from '@shopgate/engage/product';
import { Swiper } from '@shopgate/pwa-common/components';
import Item from './components/Item';
import { LiveshoppingWidget } from '.';

jest.mock('@shopgate/engage/product', () => ({
  ProductListTypeProvider: jest.fn(({ children }) => children),
  ProductListEntryProvider: jest.fn(({ children }) => children),
}));
jest.mock('@shopgate/pwa-common/components', () => {
  // eslint-disable-next-line no-shadow
  const Swiper = jest.fn(({ children }) => children);
  Swiper.Item = ({ children }) => children;

  return { Swiper };
});
jest.mock('./components/Item', () => jest.fn(({ productId }) => <div>{`Item ${productId}`}</div>));

describe('<LiveshoppingWidget />', () => {
  /**
   * Mocks the liveshopping products pipeline request.
   */
  const fetchProductsMock = () => { };
  const settings = {};
  const products = ['1234', '1235'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render the widget without any data', () => {
    const { container } = render(<LiveshoppingWidget
      settings={settings}
      fetchProducts={fetchProductsMock}
    />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render the widget with no slider for one product', () => {
    const { container } = render(<LiveshoppingWidget
      settings={settings}
      fetchProducts={fetchProductsMock}
      products={[products[0]]}
    />);

    expect(container.querySelector('[data-test-id="liveShoppingWidget"]')).toBeInTheDocument();
    expect(ProductListTypeProvider.mock.lastCall[0]).toEqual(expect.objectContaining({
      type: 'liveshopping',
      subType: 'widgets',
    }));
    expect(Swiper).not.toHaveBeenCalled();
    expect(ProductListEntryProvider.mock.lastCall[0].productId).toBe('1234');
    expect(screen.getAllByText('Item', { exact: false })).toHaveLength(1);
    expect(Item.mock.lastCall[0]).toEqual({ productId: '1234' });
  });

  it('should render the widget with a slider for multiple products', () => {
    const { container } = render(<LiveshoppingWidget
      settings={settings}
      fetchProducts={fetchProductsMock}
      products={products}
    />);

    expect(container.querySelector('[data-test-id="liveShoppingWidget"]')).toBeInTheDocument();
    expect(ProductListTypeProvider.mock.lastCall[0]).toEqual(expect.objectContaining({
      type: 'liveshopping',
      subType: 'widgets',
    }));
    expect(Swiper.mock.lastCall[0]).toEqual(expect.objectContaining({
      indicators: true,
      loop: true,
    }));
    expect(ProductListEntryProvider.mock.lastCall[0].productId).toBe('1235');
    expect(screen.getByText('Item 1234')).toBeInTheDocument();
    expect(screen.getByText('Item 1235')).toBeInTheDocument();
    expect(Item.mock.lastCall[0]).toEqual({
      productId: '1235',
      hasPagination: true,
    });
  });
});
