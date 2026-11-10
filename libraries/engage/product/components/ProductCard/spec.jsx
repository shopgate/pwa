import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import { DEFAULT_APP_SETTINGS } from '@shopgate/engage/settings/reducers/appSettings';
import ProductCard from './index';

const mockShowEmptyRatingStars = jest.fn(() => false);

jest.mock('@shopgate/engage/core/helpers', () => ({
  isBeta: () => false,
}));
jest.mock('@shopgate/engage/product/hooks', () => ({
  useProductListType: () => ({ meta: {} }),
  useShowEmptyRatingStars: () => mockShowEmptyRatingStars(),
}));
jest.mock('@shopgate/engage/components', () => ({
  /* eslint-disable react/prop-types */
  Link: ({ children }) => <div data-testid="link">{children}</div>,
  RatingStars: ({ value }) => <div data-testid="rating-stars">{value}</div>,
  /* eslint-enable react/prop-types */
  DiscountBadge: () => null,
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/product', () => ({
  getProductRoute: id => `/item/${id}`,
}));
jest.mock('@shopgate/engage/product/components', () => ({
  MapPriceHint: () => null,
  ProductImage: () => null,
  OrderQuantityHint: () => null,
  FeaturedMedia: () => null,
  Swatches: () => null,
  ProductName: () => null,
  ProductBadges: () => null,
}));
jest.mock('@shopgate/engage/category', () => ({
  PRODUCT_ITEM_DISCOUNT: 'product-item.discount',
  PRODUCT_ITEM_PRICE: 'product-item.price',
}));
jest.mock('../ProductCardAddToCart', () => ({
  ProductCardAddToCart: () => <button type="button">cart</button>,
}));
jest.mock('../ProductTileActions', () => ({
  /* eslint-disable react/prop-types */
  ProductTileActions: ({ hideFavorites, hideAddToCart }) => (
    <div
      data-testid="tile-actions"
      data-hide-favorites={String(hideFavorites)}
      data-hide-add-to-cart={String(hideAddToCart)}
    />
  ),
  /* eslint-enable react/prop-types */
}));
jest.mock('../ProductGridPrice', () => () => null);

const mockStore = configureStore();

/**
 * @param {Object} options The test options.
 * @param {boolean} options.showReviews The review setting of the merchant.
 * @param {string} options.addToCart The add to cart setting of the action buttons.
 * @param {Object|null} options.rating The rating of the product.
 * @param {boolean} options.hideRating Whether the card hides the rating itself.
 * @param {boolean} options.hideName Whether the card hides the name.
 * @param {boolean} options.hidePrice Whether the card hides the price.
 * @param {boolean} options.hideFavorites Whether the card hides the favorites button.
 * @param {boolean} options.hideAddToCart Whether the card hides the add to cart button.
 * @returns {Object} The render result.
 */
const renderCard = ({
  showReviews = true,
  addToCart = DEFAULT_APP_SETTINGS.product.actionButtons.addToCart,
  rating = { average: 80 },
  hideRating = false,
  hideName = false,
  hidePrice = false,
  hideFavorites = false,
  hideAddToCart = false,
} = {}) => {
  const store = mockStore({
    settings: {
      appSettings: {
        ...DEFAULT_APP_SETTINGS,
        product: {
          ...DEFAULT_APP_SETTINGS.product,
          rating: {
            ...DEFAULT_APP_SETTINGS.product.rating,
            showReviews,
          },
          actionButtons: {
            ...DEFAULT_APP_SETTINGS.product.actionButtons,
            addToCart,
          },
        },
      },
    },
  });

  return render(
    <Provider store={store}>
      <ProductCard
        product={{
          id: 'product',
          name: 'Product',
          rating,
          price: { discount: 0 },
        }}
        hideRating={hideRating}
        hideName={hideName}
        hidePrice={hidePrice}
        hideFavorites={hideFavorites}
        hideAddToCart={hideAddToCart}
      />
    </Provider>
  );
};

describe('<ProductCard />', () => {
  beforeEach(() => {
    mockShowEmptyRatingStars.mockReturnValue(false);
  });

  it('should render the rating stars of a rated product', () => {
    renderCard();

    expect(screen.getByTestId('rating-stars')).toHaveTextContent('80');
  });

  it('should hide the rating stars when the card hides the rating', () => {
    renderCard({ hideRating: true });

    expect(screen.queryByTestId('rating-stars')).not.toBeInTheDocument();
  });

  it('should hide the rating stars when reviews are switched off', () => {
    renderCard({ showReviews: false });

    expect(screen.queryByTestId('rating-stars')).not.toBeInTheDocument();
  });

  it('should render empty rating stars when they are switched on', () => {
    mockShowEmptyRatingStars.mockReturnValue(true);
    renderCard({ rating: { average: 0 } });

    expect(screen.getByTestId('rating-stars')).toHaveTextContent('0');
  });

  it('should render no details when reviews are off and name and price are hidden', () => {
    renderCard({
      showReviews: false,
      hideName: true,
      hidePrice: true,
    });

    expect(screen.getAllByTestId('link')).toHaveLength(1);
  });

  it('should hide empty rating stars when reviews are switched off', () => {
    mockShowEmptyRatingStars.mockReturnValue(true);
    renderCard({
      showReviews: false,
      rating: { average: 0 },
    });

    expect(screen.queryByTestId('rating-stars')).not.toBeInTheDocument();
  });

  it('shows the buttons configured in the app settings by default', () => {
    renderCard({ addToCart: 'button' });

    const actions = screen.getByTestId('tile-actions');
    expect(actions).toHaveAttribute('data-hide-favorites', 'false');
    expect(actions).toHaveAttribute('data-hide-add-to-cart', 'false');
    expect(screen.getByRole('button', { name: 'cart' })).toBeInTheDocument();
  });

  it('passes hideFavorites and hideAddToCart to the tile actions', () => {
    renderCard({
      addToCart: 'actionButton',
      hideFavorites: true,
      hideAddToCart: true,
    });

    const actions = screen.getByTestId('tile-actions');
    expect(actions).toHaveAttribute('data-hide-favorites', 'true');
    expect(actions).toHaveAttribute('data-hide-add-to-cart', 'true');
  });

  it('hides the add to cart button below the card', () => {
    renderCard({
      addToCart: 'button',
      hideAddToCart: true,
    });

    expect(screen.queryByRole('button', { name: 'cart' })).not.toBeInTheDocument();
  });
});
