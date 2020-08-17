import React from 'react';
import { shallow } from 'enzyme';
import { UnwrappedProductSlider as ProductSlider } from './index';

jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: jest.fn(() => false),
  withWidgetSettings: component => component,
}));

jest.mock('@shopgate/engage/components', () => {
  // eslint-disable-next-line require-jsdoc
  function Swiper({ children }) { return children; }
  Swiper.Item = function SwiperItem({ children }) { return children; };
  return {
    Swiper,
    Card: ({ children }) => children,
  };
});
jest.mock('@shopgate/engage/product', () => ({
  ProductCard: ({ children }) => children,
}));

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
      id: '1234',
      name: 'First product',
      featuredImageUrl: 'http://placekitten.com/300/300',
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
    const wrapper = shallow(<ProductSlider
      id={sliderId}
      settings={settings}
      getProducts={getProducts}
      products={[]}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toHaveBeenCalledWith(
      settings.queryType,
      settings.queryParams,
      { sort: settings.sortOrder },
      sliderId
    );
  });

  it('should not render the widget without any data', () => {
    const wrapper = shallow(<ProductSlider
      id={sliderId}
      settings={getSettings()}
      getProducts={getProductsMock}
      products={createProducts(0)}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Card').length).toBe(0);
  });

  it('should render the widget with data', () => {
    const products = createProducts();

    const wrapper = shallow(<ProductSlider
      id={sliderId}
      settings={getSettings()}
      getProducts={getProductsMock}
      products={products}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Card').length).toBe(products.length);
  });

  it('should not render an empty headline', () => {
    const wrapper = shallow(<ProductSlider
      id={sliderId}
      settings={getSettings(false)}
      getProducts={getProductsMock}
      products={createProducts()}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Headline').length).toBe(0);
  });

  it('should render the headline', () => {
    const wrapper = shallow(<ProductSlider
      id={sliderId}
      settings={getSettings(true)}
      getProducts={getProductsMock}
      products={createProducts()}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Headline').length).toBe(1);
  });

  it('should limit output to a maximum of 30 products', () => {
    const wrapper = shallow(<ProductSlider
      id={sliderId}
      settings={getSettings(true)}
      getProducts={getProductsMock}
      products={createProducts(40)}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Card').length).toBe(30);
  });
});
