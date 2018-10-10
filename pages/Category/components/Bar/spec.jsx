import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import Bar from './index';

const store = createMockStore();

describe('<Bar />', () => {
  it('should match snapshot', () => {
    const wrapper = mount((
      <Provider store={store}>
        <Bar />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
