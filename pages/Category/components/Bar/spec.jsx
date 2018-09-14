import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import Bar from './index';

const store = createMockStore();
jest.mock('../../../../components/View/context.js');

describe('<Bar />', () => {
  it('should render', () => {
    const wrapper = mount((
      <Provider store={store}>
        <Bar />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
