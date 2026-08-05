import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mockProductId, mockProduct } from './mock';
import ProductCard, { ProductCardUnwrapped } from './index';

jest.unmock('@shopgate/pwa-core');
jest.mock('@shopgate/engage/core');
jest.mock('@shopgate/engage/product/components', () => ({
  ProductCard: () => null,
}));

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
 * @returns {JSX}
 */
const renderComponent = (props = {}, state = createMockState()) => {
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
    const wrapper = renderComponent({ productId: mockProductId });
    expect(wrapper).toMatchSnapshot();

    const renderWrapper = wrapper.find('ProductCard ProductCard');
    expect(renderWrapper.prop('url')).toBe(`${ITEM_PATH}/${bin2hex(mockProductId)}`);
    expect(renderWrapper.prop('product')).toBe(mockProduct);
  });

  it('should suppress the card shadow for legacy shadow={false} callers', () => {
    const getCardClass = wrapper => Array
      .from(wrapper.find('section').getDOMNode().classList)
      .find(name => name.startsWith('sg-'));

    const withShadow = getCardClass(renderComponent({ productId: mockProductId }));
    const withoutShadow = getCardClass(renderComponent({
      productId: mockProductId,
      shadow: false,
    }));

    expect(withoutShadow).not.toBe(withShadow);

    // The shadow is drawn by the card inside, so it is switched off by targeting that card.
    // Emotion inserts its rules via the CSSOM, so they are read from the sheet, not from the tag.
    const css = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules).map(rule => rule.cssText))
      .join('');

    expect(css).toMatch(
      new RegExp(`\\.${withoutShadow} \\.engage__product-card[^}]*box-shadow: ?none`)
    );
  });

  it('should render with a custom render prop', () => {
    const text = 'Custom Output';

    /**
     * @returns {JSX}
     */
    const render = () => (
      <div>{text}</div>
    );

    const wrapper = renderComponent({
      productId: mockProductId,
      render,
    });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toBe(text);
  });
});
