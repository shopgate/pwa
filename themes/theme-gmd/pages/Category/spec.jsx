import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import Category from './index';

const store = createMockStore();

describe('Pages: <Category />', () => {
  it('should render', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <Category />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
