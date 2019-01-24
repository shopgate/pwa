import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Bar from './index';

const mockedStore = configureStore();

describe('<Bar />', () => {
  it('should match snapshot', () => {
    const wrapper = mount((
      <Provider store={mockedStore({ router: { currentRoute: {} } })}>
        <Bar />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
