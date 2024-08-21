import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { hasCategoryChildren } from '@shopgate/engage/category/selectors';
import reducers from 'Pages/reducers';
import CategoryListContent from './index';

const store = createMockStore(reducers);

jest.mock('@shopgate/pwa-common-commerce/category/selectors', () => ({
  ...jest.requireActual('@shopgate/pwa-common-commerce/category/selectors'),
  hasCategoryChildren: jest.fn().mockReturnValue(false),
}));
jest.mock('@shopgate/engage/a11y', () => ({
  Section: ({ children }) => children,
}));

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/category/components', () => ({
  CategoryList: () => null,
}));
jest.mock('Components/CategoryGrid', () => ({
  __esModule: true,
  default: function CategoryGrid() { return null; },
}));

describe('<CategoryListContent />', () => {
  it('should render without CategoryList', () => {
    const wrapper = mount((
      <Provider store={store}>
        <CategoryListContent categoryId="1234" />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('CategoryList')).toHaveLength(0);
  });

  it('should render with CategoryList', () => {
    hasCategoryChildren.mockReturnValueOnce(true);
    const wrapper = mount((
      <Provider store={store}>
        <CategoryListContent categoryId="1234" />
      </Provider>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('CategoryList')).toHaveLength(1);
  });
});
