import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ProductCard as EngageProductCard } from '@shopgate/engage/product/components';
import Card from '@shopgate/engage/components/Card';
import { mockProductId, mockProduct } from './mock';
import ProductCard from './index';

jest.unmock('@shopgate/pwa-core');
jest.mock('@shopgate/engage/core');
jest.mock('@shopgate/engage/product/components', () => ({
  ProductCard: jest.fn(() => null),
}));
jest.mock('@shopgate/engage/components/Card', () => {
  const ActualCard = jest.requireActual('@shopgate/engage/components/Card').default;

  return {
    __esModule: true,
    default: jest.fn(props => <ActualCard {...props} />),
  };
});

/**
 * Creates a state for a mocked store.
 * @param {Object} product A product.
 * @param {string} productId The id for the product.
 * @returns {Object}
 */
export const createMockState = (product = mockProduct) => ({
  product: {
    productsById: {
      [product.id]: {
        productData: product,
      },
    },
  },
});

/**
 * @param {Object} props  Component props.
 * @param {Object} state Redux state.
 * @returns {Object}
 */
const renderComponent = (props = {}, state = createMockState()) => {
  const store = configureStore()(state);
  return render((
    <Provider store={store}>
      <ProductCard {...props} />
    </Provider>
  ));
};

describe('<ProductCard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when no product could be found', () => {
    const { container } = renderComponent();

    expect(container).toBeEmptyDOMElement();
  });

  it('should render as expected', () => {
    const { container } = renderComponent({ productId: mockProductId });

    const card = container.querySelector(`[data-test-id="Product: ${mockProduct.name}"]`);

    expect(card.tagName).toBe('SECTION');
    expect(card).toHaveClass('theme__product-card');
    expect(EngageProductCard.mock.lastCall[0]).toEqual(expect.objectContaining({
      url: `${ITEM_PATH}/${bin2hex(mockProductId)}`,
      product: mockProduct,
    }));
  });

  it('should suppress the card shadow for legacy shadow={false} callers', () => {
    renderComponent({ productId: mockProductId });
    expect(Card.mock.calls[0][0].elevation).toBeUndefined();

    Card.mockClear();

    renderComponent({
      productId: mockProductId,
      shadow: false,
    });
    expect(Card.mock.calls[0][0].elevation).toBe(0);
  });

  it('should render with a custom render prop', () => {
    const text = 'Custom Output';

    /**
     * @returns {JSX}
     */
    const renderProp = () => (
      <div>{text}</div>
    );

    const { container } = renderComponent({
      productId: mockProductId,
      render: renderProp,
    });

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(container.textContent).toBe(text);
  });
});
