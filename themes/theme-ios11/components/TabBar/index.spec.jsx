import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { INDEX_PATH } from '@shopgate/engage/core';
import { CART_PATH } from '@shopgate/engage/cart';
import { FAVORITES_PATH } from '@shopgate/engage/favorites';
import { themeConfig as mockedConfig } from '@shopgate/pwa-common/helpers/config/mock';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
  TAB_FAVORITES,
} from './constants';
import {
  mockedStateDefault,
  // eslint-disable-next-line import/named
  mockedStateRoute,
} from './mock';

const mockedStore = configureStore();
const activePathsToTabs = {
  [INDEX_PATH]: TAB_HOME,
  [BROWSE_PATH]: TAB_BROWSE,
  [MORE_PATH]: TAB_MORE,
  [FAVORITES_PATH]: TAB_FAVORITES,
};

const allTabs = {
  ...activePathsToTabs,
  ...{
    [CART_PATH]: TAB_CART,
  },
};

beforeEach(() => {
  jest.resetModules();
});

jest.mock('react-portal', () => (
  ({ isOpened, children }) => (
    isOpened ? children : null
  )
));

/**
 * Creates a connected component
 * @param {Object} mockedState state
 * @return {*}
 */
const createComponent = (mockedState) => {
  /* eslint-disable global-require */
  const TabBarConnected = require('./index').default;
  const store = mockedStore(mockedState);
  /* eslint-enable global-require */

  return mount(<Provider store={store}><TabBarConnected /></Provider>);
};

// const mockOpen = jest.fn();

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  hasFavorites: true,
  themeConfig: mockedConfig,
}));

describe.skip('<TabBar />', () => {
  it('should render when visible', () => {
    const wrapper = createComponent(mockedStateDefault);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TabBarAction').length).toBe(Object.keys(allTabs).length);
  });

  it('should not render when invisible', () => {
    const invisibleState = mockedStateRoute(CART_PATH, true, false);
    const wrapper = createComponent(invisibleState);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TabBarAction').length).toBe(0);
  });

  it('should highlight the active tab', () => {
    Object.keys(activePathsToTabs).forEach((path) => {
      const state = mockedStateRoute(path);
      const wrapper = createComponent(state);
      expect(wrapper.find('TabBarAction[isHighlighted=true]').length).toBe(1);
      expect(wrapper.find('TabBarAction[isHighlighted=true]').props().type).toEqual(activePathsToTabs[path]);
    });
  });

  describe.skip('custom props', () => {
    it('should pass custom props to the tab action', () => {
      const customProp = 'my custom prop';
      /**
       * Selector mock
       * @return {{
       * getVisibleTabs: function(): *[],
       * getActiveTab: function(): string,
       * isTabBarVisible: function(): boolean
       * }}
       */
      const mockedSelector = () => ({
        getVisibleTabs: () => (
          [{
            type: 'foo',
            label: 'bar',
            customProp,
          }]
        ),
        getActiveTab: () => '/',
        isTabBarVisible: () => false,
      });
      jest.mock('./selectors.js', () => mockedSelector);
      const wrapper = createComponent(mockedStateDefault);

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(`TabBarAction[customProp="${customProp}"]`).length).toBe(1);
    });
  });
});
