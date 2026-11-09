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
jest.mock('../ProductCardAddToCart', () => ({ ProductCardAddToCart: () => null }));
jest.mock('../ProductTileActions', () => ({ ProductTileActions: () => null }));
jest.mock('../ProductGridPrice', () => () => null);

const mockStore = configureStore();

/**
 * @param {Object} options The test options.
 * @param {boolean} options.showReviews The review setting of the merchant.
 * @param {Object|null} options.rating The rating of the product.
 * @param {boolean} options.hideRating Whether the card hides the rating itself.
 * @param {boolean} options.hideName Whether the card hides the name.
 * @param {boolean} options.hidePrice Whether the card hides the price.
 * @returns {Object} The render result.
 */
const renderCard = ({
  showReviews = true,
  rating = { average: 80 },
  hideRating = false,
  hideName = false,
  hidePrice = false,
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
          price: {},
        }}
        hideRating={hideRating}
        hideName={hideName}
        hidePrice={hidePrice}
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
});
