import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import ProductCard, { ProductCardUnwrapped } from './index';

const productId = 'PR0DUCTID';
const mockProduct = {
  id: productId,
  name: 'Product Name',
  featuredImageUrl: null,
  price: {
    currency: 'EUR',
    unitPrice: 5,
    unitPriceStriked: 10,
    discount: 50,
    info: 'Price Info',
  },
  rating: {
    count: 4,
    average: 80,
    reviewCount: 3,
  },
};

/**
 * @param {Object} product A product.
 * @returns {Object}
 */
const createState = (product = mockProduct) => ({
  product: {
    productsById: {
      [productId]: {
        productData: product,
      },
    },
  },
});

/**
 * @param {Object} props  Component props.
 * @param {Object} state Redux state.
 * @returns {JSX}
 */
const renderComponent = (props = {}, state = createState()) => {
  const store = configureStore()(state);
  return mount(
    <Provider store={store}>
      <ProductCard {...props} />
    </Provider>,
    mockRenderOptions
  );
};

describe('<ProductCard />', () => {
  it('should not render when no product could be found', () => {
    const wrapper = renderComponent();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductCardUnwrapped).isEmptyRender()).toBe(true);
  });

  it('should render as expected', () => {
    const wrapper = renderComponent({ productId });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Portal').length).toBe(6);
    expect(wrapper.find('Link').prop('href')).toEqual(`${ITEM_PATH}/${bin2hex(productId)}`);
    expect(wrapper.find('ProductCardBadge').exists()).toBe(true);
    expect(wrapper.find('ProductCardBadge').text()).toEqual(`-${mockProduct.price.discount}%`);
    expect(wrapper.find('RatingStars').exists()).toBe(true);
    expect(wrapper.find('RatingStars').prop('value')).toBe(mockProduct.rating.average);
    expect(wrapper.find('ProductCardTitle').exists()).toBe(true);
    expect(wrapper.find('ProductCardTitle').text()).toBe(mockProduct.name);
    expect(wrapper.find('ProductCardTitle').prop('rows')).toBe(ProductCardUnwrapped.defaultProps.titleRows);
    const productCardPrice = wrapper.find('ProductCardPrice');
    expect(productCardPrice.exists()).toBe(true);
    expect(productCardPrice.find('ProductGridPrice').prop('price')).toEqual(mockProduct.price);
  });

  it('should render without name', () => {
    const wrapper = renderComponent({ productId, hideName: true });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProductCardTitle').exists()).toBe(false);
  });

  it('should render without rating', () => {
    const wrapper = renderComponent({ productId, hideRating: true });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('RatingStars').exists()).toBe(false);
  });

  it('should render without prices', () => {
    const wrapper = renderComponent({ productId, hidePrice: true });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProductCardBadge').exists()).toBe(false);
    expect(wrapper.find('ProductCardPrice').exists()).toBe(false);
  });

  it('should render with one row for the product name', () => {
    const wrapper = renderComponent({ productId, titleRows: 1 });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProductCardTitle').find('Ellipsis').prop('rows')).toBe(1);
  });

  it('should not render the discount badge when the is no discount', () => {
    const state = createState({
      ...mockProduct,
      price: {
        ...mockProduct.price,
        discount: 0,
      },
    });
    const wrapper = renderComponent({ productId }, state);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProductCardBadge').exists()).toBe(false);
  });

  it('should not render the rating stars when there is no average rating', () => {
    const state = createState({
      ...mockProduct,
      rating: {
        ...mockProduct.rating,
        average: 0,
      },
    });
    const wrapper = renderComponent({ productId }, state);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('RatingStars').exists()).toBe(false);
  });
});
