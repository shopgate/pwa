import React from 'react';
import { mount } from 'enzyme';
import StoreListProduct from '../StoreListProduct';
import { FulfillmentContext } from '../../../locations.context';

const product = {
  featuredImageUrl: 'http://www.some.com&height=200',
  featuredImageBaseUrl: 'http://www.some.com',
  name: 'Test Product',
};

jest.mock('@shopgate/engage/styles', () => ({
  // makeStyles()(styleDef) returns useStyles; the component calls useStyles().
  // Middle function ignores styleDef (same as optional extra arg in JS).
  makeStyles: () => () => () => ({
    classes: {
      productContainer: 'productContainer',
      productContainerInner: 'productContainerInner',
      productImage: 'productImage',
      productContent: 'productContent',
    },
  }),
  cx: (...args) => args.filter(Boolean).join(' '),
  css: () => '',
  keyframes: () => 'mock-keyframes',
  GlobalStyles: () => null,
  withStyles: Component => Component,
  tss: {},
}));

jest.mock('../../../../components', () => ({
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/product');
jest.mock('../StoreListProductName', () => function StoreListProductName() { return null; });
jest.mock('../StoreListProductInfo', () => function StoreListProductInfo() { return null; });

jest.mock('../../../locations.context', () => {
  const { createContext } = jest.requireActual('react');
  return {
    FulfillmentContext: createContext(null),
  };
});

/**
 * @param {Object} value FulfillmentContext provider value.
 * @returns {Object} Enzyme mount wrapper
 */
function mountWithFulfillment(value) {
  return mount(
    <FulfillmentContext.Provider value={value}>
      <StoreListProduct />
    </FulfillmentContext.Provider>
  );
}

describe('<StoreListProduct />', () => {
  it('should not render if not product is supplied', () => {
    const wrapper = mountWithFulfillment({});
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[role="text"]')).toHaveLength(0);
    wrapper.unmount();
  });

  it('should render a product without selected variants.', () => {
    const wrapper = mountWithFulfillment({ product });
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
});
