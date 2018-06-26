import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { defaultState } from '../../mock';
import { TOGGLE_NAV_DRAWER } from '../../constants';

const mockedStore = configureStore([thunk]);
let store;

// eslint-disable-next-line require-jsdoc
const createComponent = (state = defaultState) => {
  // eslint-disable-next-line global-require
  const NavButton = require('./index').default;
  store = mockedStore(state);
  return mount(<NavButton store={store} />);
};

describe('NavButton', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('should render', () => {
    const wrapper = createComponent();
    expect(wrapper.find('Burger').exists()).toBe(true);
  });

  it('should show navdrawer', () => {
    const wrapper = createComponent();
    wrapper.find('Button').simulate('click');
    const result1 = [{ type: TOGGLE_NAV_DRAWER, active: true }];
    expect(store.getActions()).toEqual(result1);
  });
});
