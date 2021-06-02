import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import Content from './index';

const store = createMockStore();

describe.skip('<Content />', () => {
  it('should render', () => {
    const wrapper = mount((
      <Provider store={store}>
        <Content categoryId="1234" />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
