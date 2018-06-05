import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { basicProductState } from '@shopgate/pwa-common-commerce/product/mock';
import { categoryState, childCategoryRouteMock, routerState } from '@shopgate/pwa-common-commerce/category/mock';
import ProductGrid from 'Components/ProductGrid';

const mockedStore = configureStore([thunk]);
let store;

const mockedState = {
  ...categoryState,
  product: {
    ...basicProductState.product,
    currentProduct: {
      ...basicProductState.product.currentProduct,
      currentProductId: null,
      quantity: null,
    },
  },
  filter: {
    activeFilters: null,
  },
  router: {
    ...routerState.router,
    stack: [
      ...routerState.router.stack,
      { ...childCategoryRouteMock },
    ],
  },
};

/**
 * Creates component
 * @param {boolean} state State that would be used for store.
 * @return {ReactWrapper}
 */
const createComponent = (state) => {
  store = mockedStore(state);
  /* eslint-disable global-require */
  const Category = require('./index').default;
  /* eslint-enable global-require */
  const component = (
    <Provider store={store}>
      <Category />
    </Provider>
  );

  return mount(component);
};

describe.skip('<Category> page', () => {

  it('should render', () => {
    const wrapper = createComponent(mockedState);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductGrid).length).toEqual(1);
  });
});
