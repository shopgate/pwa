import { render } from '@testing-library/react';
import { InfiniteContainer } from '@shopgate/engage/components';
import ProductGrid from '.';

jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: jest.fn(() => false),
  isIOSTheme: jest.fn(() => false),
  withForwardedRef: jest.fn(),
  withCurrentProduct: jest.fn(),
  useWidgetSettings: jest.fn().mockReturnValue({}),
}));
jest.mock('@shopgate/engage/components', () => {
  const { ViewContext } = jest.requireActual('@shopgate/engage/components/View/context');
  return {
    ViewContext,
    InfiniteContainer: jest.fn(() => null),
    LoadingIndicator: () => null,
    // eslint-disable-next-line react/prop-types
    Grid: ({ children, className, 'data-test-id': testId }) => (
      <div className={className} data-test-id={testId}>{children}</div>
    ),
  };
});

jest.mock('./components/Iterator', () =>
  function Iterator() { return null; });

jest.mock('./hooks', () => ({ useProductGridColumns: jest.fn(() => 2) }));

jest.mock('@shopgate/engage/product', () => ({
  ProductListTypeProvider: ({ children }) => children,
  ProductListEntryProvider: ({ children }) => children,
}));

describe('<ProductGrid />', () => {
  beforeEach(() => {
    InfiniteContainer.mockClear();
  });

  it('should render with the InfiniteContainer', () => {
    render((
      <ProductGrid products={[]} />
    ));

    expect(InfiniteContainer.mock.lastCall[0]).toEqual(expect.objectContaining({
      columns: 2,
      items: [],
      initialLimit: 32,
      limit: 32,
      totalItems: null,
      requestHash: null,
      enablePromiseBasedLoading: true,
      iterator: expect.any(Function),
      loader: expect.any(Function),
      wrapper: expect.any(Function),
    }));
  });

  it('should render the original layout', () => {
    const { container } = render((
      <ProductGrid infiniteLoad={false} products={[]} />
    ));

    expect(InfiniteContainer).not.toHaveBeenCalled();
    expect(container.querySelector('[data-test-id="productGrid"]')).toHaveClass('theme__product-grid');
  });
});
