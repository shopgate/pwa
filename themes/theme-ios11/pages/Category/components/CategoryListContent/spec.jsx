import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import reducers from 'Pages/reducers';
import CategoryListContent from './index';

const store = createMockStore(reducers);

jest.mock('@shopgate/engage/a11y', () => ({
  Section: ({ children }) => children,
}));

jest.mock('@shopgate/engage/components');

jest.mock('Components/CategoryList', () => function CategoryList() { return null; });

describe('<CategoryListContent />', () => {
  it('should render', () => {
    const wrapper = mount((
      <Provider store={store}>
        <CategoryListContent categoryId="1234" />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
