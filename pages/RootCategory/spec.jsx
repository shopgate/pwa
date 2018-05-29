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
    <Provider store={store} >
      <RootCategory />
    </Provider>,
    mockRenderOptions
  );
};

describe('<RootCategory> page', () => {
  describe('Initial page', () => {
    it('should render', () => {
      const component = createComponent(categoryState);
      expect(component).toMatchSnapshot();
      expect(component.find('CategoryList').length).toEqual(1);
      expect(component.find('List').length).toEqual(2);
    });

    it('should render empty', () => {
      const component = createComponent(initialCategoryState);
      expect(component).toMatchSnapshot();
      expect(component.find('CategoryList').length).toEqual(1);
      expect(component.find('List').length).toEqual(0);
    });
  });
});
