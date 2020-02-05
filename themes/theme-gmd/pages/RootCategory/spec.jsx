import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import RootCategory from './index';

const store = createMockStore();

describe('Pages: <RootCategory />', () => {
  it('should render', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <RootCategory />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
