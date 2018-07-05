import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { initialCategoryState, categoryState } from '@shopgate/pwa-common-commerce/category/mock';

const mockedView = MockedView;
const mockedStore = configureStore();
jest.mock('Components/View', () => mockedView);
let store;

const results = [
  [{
    type: 'NAVIGATE',
    action: 'PUSH',
    location: '/category/6d656e',
    state: { title: 'Men' },
  }],
];

/**
 * Creates component
 * @param {boolean} state State that would be used for store.
 * @return {ReactWrapper}
 */
const createComponent = (state) => {
  store = mockedStore(state);
  /* eslint-disable global-require */
  const RootCategory = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={store} ><RootCategory /></Provider>,
    mockRenderOptions
  );
};

describe('<RootCategory> page', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('should render', () => {
    const component = createComponent(categoryState);
    expect(component).toMatchSnapshot();
    expect(component.find('CategoryList').length).toEqual(1);
    expect(component.find('ListItem').length).toEqual(2);
  });

  it('should render empty', () => {
    const component = createComponent(initialCategoryState);
    expect(component).toMatchSnapshot();
    expect(component.find('CategoryList').length).toEqual(0);
    expect(component.find('ListItem').length).toEqual(0);
  });

  it('should navigate to subcategory', () => {
    const wrapper = createComponent(categoryState);

    wrapper.find('CategoryList').find('Connect(Link)').at(0).simulate('click');
    wrapper.update();
    expect(store.getActions()).toEqual(results[0]);
  });
});
