/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Swiper } from '@shopgate/engage/components';
import { ProductCard } from '@shopgate/engage/product/components';
import {
  PRODUCT_SLIDER_WIDGET_LIMIT,
  UnwrappedProductSlider as ProductSlider,
} from './index';

jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: jest.fn(() => false),
}));

jest.mock('@shopgate/engage/product/hooks', () => ({
  useSlidesPerView: jest.fn(() => 2.3),
}));

jest.mock('@shopgate/engage/components', () => {
  // eslint-disable-next-line no-shadow
  const Swiper = jest.fn(({ children }) => children);
  Swiper.Item = function SwiperItem({ children }) { return children; };
  return {
    Swiper,
    Card: ({ children }) => <article>{children}</article>,
  };
});
jest.mock('@shopgate/engage/product/providers', () => ({
  ProductListTypeProvider: ({ children }) => children,
  ProductListEntryProvider: ({ children }) => children,
}));
jest.mock('@shopgate/engage/product/components', () => ({
  ProductCard: jest.fn(() => null),
}));
jest.mock('Components/Headline', () => ({ text }) => <h2>{text}</h2>);

describe('<ProductSlider />', () => {
  /**
   * Mocks the products pipeline request.
   */
  const getProductsMock = () => {};

  /**
   * Creates some fake settings.
   * @param {boolean} withHeadline Whether the headline argument should be provided.
   * @param {boolean} withName Whether the product names should be enabled.
   * @param {boolean} withPrice Whether the product price should be enabled.
   * @param {boolean} withReviews Whether the product reviews should be enabled.
   * @return {Object} The settings object.
   */
  const getSettings = (
    withHeadline = false,
    withName = true,
    withPrice = true,
    withReviews = true
  ) => {
    const settings = {
      headline: '',
      layout: '',
      queryType: 1,
      queryParams: '',
      showName: withName,
      showPrice: withPrice,
      showReviews: withReviews,
      sortOrder: 'asc',
      sliderSettings: {
        autostart: false,
        delay: '1000',
        loop: false,
      },
    };

    if (withHeadline) {
      // Add a headline parameter.
      settings.headline = 'Lorem ipsum';
    }

    return settings;
  };

  /**
   * Creates a set of fake products.
   * @param {number} amount The number of products to create.
   * @param {Array} products An array to append the generated products to.
   * @returns {Array} The created products.
   */
  const createProducts = (amount = 5, products = []) => {
    if (amount <= 0) {
      return products;
    }

    products.push({
      id: `${1234 + products.length}`,
      name: 'First product',
      featuredImageUrl: 'http://placekitten.com/300/300',
      featuredImageBaseUrl: 'http://placekitten.com',
      rating: {
        count: 100,
        average: 0.5,
      },
      price: {
        currency: 'EUR',
        unitPriceStriked: 20,
        unitPriceMin: 0,
        unitPrice: 100,
      },
      liveshoppings: [{
        from: 0,
        to: 123456789,
      }],
    });

    return createProducts(amount - 1, products);
  };

  const sliderId = 'some-slider-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the products callback on mount', () => {
    const getProducts = jest.fn();
    const settings = getSettings();
    const { container } = render(<ProductSlider
      id={sliderId}
      settings={settings}
      getProducts={getProducts}
      products={[]}
    />);

    expect(container).toBeEmptyDOMElement();
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toHaveBeenCalledWith(
      settings.queryType,
      settings.queryParams,
      {
        sort: settings.sortOrder,
        limit: PRODUCT_SLIDER_WIDGET_LIMIT,
      },
      sliderId
    );
  });

  it('should render the widget with data', () => {
    const products = createProducts();

    render(<ProductSlider
      id={sliderId}
      settings={getSettings()}
      getProducts={getProductsMock}
      products={products}
    />);

    expect(screen.getAllByRole('article')).toHaveLength(products.length);
    expect(Swiper.mock.lastCall[0]).toEqual(expect.objectContaining({
      loop: false,
      indicators: false,
      controls: false,
      freeMode: true,
      slidesPerView: 2.3,
    }));
    expect(Swiper.mock.lastCall[0].autoplay).toBeUndefined();
    expect(ProductCard.mock.calls[0][0]).toEqual({
      product: products[0],
      hideName: false,
      hidePrice: false,
      hideRating: false,
    });
  });

  it('should not render an empty headline', () => {
    render(<ProductSlider
      id={sliderId}
      settings={getSettings(false)}
      getProducts={getProductsMock}
      products={createProducts()}
    />);

    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should render the headline', () => {
    render(<ProductSlider
      id={sliderId}
      settings={getSettings(true)}
      getProducts={getProductsMock}
      products={createProducts()}
    />);

    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Lorem ipsum' })).toBeInTheDocument();
  });

  it('should limit output to a maximum of 30 products', () => {
    render(<ProductSlider
      id={sliderId}
      settings={getSettings(true)}
      getProducts={getProductsMock}
      products={createProducts(40)}
    />);

    expect(screen.getAllByRole('article')).toHaveLength(30);
  });
});
/* eslint-enable react/prop-types */
