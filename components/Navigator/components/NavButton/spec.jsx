import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { ACTION_POP } from '@virtuous/conductor/constants';
import { NAVIGATE } from '@shopgate/pwa-common/constants/ActionTypes';

import { defaultState } from '../../mock';
import { backWhitelist, crossWhitelist } from './helpers';

jest.mock('@shopgate/pwa-ui-material', () => ({
  NavDrawer: {
    open: jest.fn(),
  },
}));

const mockedStore = configureStore([thunk]);
let store;

// eslint-disable-next-line require-jsdoc
const createComponent = (pattern = '/some-route', state = defaultState) => {
  // eslint-disable-next-line global-require
  const NavButton = require('./index').default;
  store = mockedStore(state);
  return mount(<NavButton store={store} pattern={pattern} />);
};

describe('NavButton', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('should render', () => {
    const wrapper = createComponent();
    expect(wrapper.find('Burger').exists()).toBe(true);
  });

  it('should open the NavDrawer when no special button is active', () => {
    const wrapper = createComponent();
    wrapper.find('Button').simulate('click');
    expect(NavDrawer.open).toHaveBeenCalledTimes(1);
  });

  it('should dispatch historyPop when the backButton is active', () => {
    const wrapper = createComponent();
    wrapper.setProps({ pattern: backWhitelist[0] });
    wrapper.find('Button').simulate('click');
    expect(store.getActions()[0]).toEqual({
      type: NAVIGATE,
      params: {
        action: ACTION_POP,
      },
    });
  });

  it('should dispatch historyPop when the crossButton is active', () => {
    const wrapper = createComponent();
    wrapper.setProps({ pattern: crossWhitelist[0] });
    wrapper.find('Button').simulate('click');
    expect(store.getActions()[0]).toEqual({
      type: NAVIGATE,
      params: {
        action: ACTION_POP,
      },
    });
  });
});
