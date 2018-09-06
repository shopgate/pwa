import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { basicProductState } from '@shopgate/pwa-common-commerce/product/mock';
import { categoryState, childCategoryRouteMock, routerState, emptyState } from '@shopgate/pwa-common-commerce/category/mock';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { MockedView } from 'Components/View/mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);

const mockedResolver = jest.fn();
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

const mockedStore = configureStore([thunk]);
let store;

const mockedState = {
  category: {
    ...categoryState.category,
    currentCategoryId: 'women',
  },
  product: {
    ...basicProductState.product,
    currentProduct: {
      ...basicProductState.product.currentProduct,
      productId: null,
      quantity: null,
    },
    resultsByHash: {
      '{"categoryId":"women","filters":{},"pipeline":"shopgate.catalog.getProducts","sort":"relevance"}': {
        isFetching: false,
        expires: 999999999999,
        products: [
          basicProductState.product.currentProduct.productId,
        ],
        totalResultCount: 1,
      },
    },
  },
  favorites: {
    products: {},
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

const results = [
  [{
    type: 'NAVIGATE',
    action: 'PUSH',
    location: '/category/74657374',
    state: { title: 'test' },
  }],
];
/**
 * Creates component
 * @param {Object} state State that would be used for store.
 * @param {Object} props Props used to initialize the component.
 * @return {ReactWrapper}
 */
const createComponent = (state, props = { id: 'women' }) => {
  store = mockedStore(state);
  /* eslint-disable global-require */
  const { UnwrappedCategory } = require('./index');
  /* eslint-enable global-require */
  return mount(
    <Provider store={store}><UnwrappedCategory {...props} /></Provider>,
    mockRenderOptions
  );
};

describe('<Category> page', () => {
  const wrapper = createComponent(mockedState);
  beforeEach(() => {
    jest.resetModules();
  });
  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProductGrid').length).toEqual(1);
    expect(wrapper.find('Connect(pure(Item))').length).toEqual(1);
    expect(wrapper.find('CategoryList').length).toEqual(1);
    expect(wrapper.find('CategoryList').props().categories.length).toEqual(1);
    expect(wrapper.find('CategoryList').find('Item').length).toEqual(1);
  });

  it('should navigate to subcategory', () => {
    wrapper.find('CategoryList').find('Connect(Link)').simulate('click');
    wrapper.update();
    expect(store.getActions()).toEqual(results[0]);
  });

  it('should render empty', () => {
    const empty = createComponent({ ...emptyState }, { id: 'test' });
    expect(wrapper).toMatchSnapshot();

    expect(empty.find('Empty').props().isVisible).toBe(true);
    expect(empty.find('NoResults').exists()).toBe(true);
  });
});
