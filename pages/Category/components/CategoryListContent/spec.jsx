import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import reducers from 'Pages/reducers';
import CategoryListContent from './index';

const store = createMockStore(reducers);

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
