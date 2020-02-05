import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { themeConfig as mockedConfig } from '@shopgate/pwa-common/helpers/config/mock';
import {
  mockedState,
  mockedEmptyState,
  mockedNotReadyState,
  mockedNextProps,
} from './mock';
import Favorites from './index';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

const mockedStore = configureStore([]);
jest.mock('@shopgate/engage/components');

jest.mock('@shopgate/pwa-common/helpers/config', () => {
  const originalConfig = require.requireActual('@shopgate/pwa-common/helpers/config');
  return ({
    ...originalConfig,
    get hasFavorites() { return true; },
    themeConfig: mockedConfig,
  });
});

/**
 * Creates component
 * @param {boolean} state State that would be used for store.
 * @return {ReactWrapper}
 */
const createComponent = state => mount(
  <Provider store={mockedStore(state)}>
    <Favorites />
  </Provider>,
  mockRenderOptions
);

describe.skip('<Favorites> page', () => {
  describe('Initial page', () => {
    it('should render an initial page with loading indicator', () => {
      const component = createComponent(mockedNotReadyState);
      expect(component).toMatchSnapshot();
      expect(component.find('LoadingIndicator').exists()).toBe(true);
      expect(component.find('EmptyFavorites').exists()).toBe(false);
      expect(component.find('FavoritesList').exists()).toBe(false);
    });
  });

  describe('Empty page', () => {
    let component;
    it('should render an empty page', () => {
      component = createComponent(mockedEmptyState);
      expect(component).toMatchSnapshot();
      expect(component.find('EmptyFavorites').exists()).toBe(true);
      expect(component.find('FavoritesList').exists()).toBe(false);
    });
  });

  describe('Page with items', () => {
    it('should render a page with products', () => {
      const component = createComponent(mockedState);
      expect(component.find('LoadingIndicator').exists()).toBe(false);
      expect(component.find('EmptyFavorites').exists()).toBe(false);
      expect(component.find('FavoritesList').exists()).toBe(true);
    });

    it.skip('should only update when the list changed', () => {
      const component = createComponent(mockedState);

      const result1 = component.find('FavoritesList').instance().shouldComponentUpdate(mockedNextProps);
      expect(result1).toBe(true);

      component.find('FavoritesList').instance().props = mockedNextProps;
      component.update();

      const result2 = component.find('FavoritesList').instance().shouldComponentUpdate(mockedNextProps);
      expect(result2).toBe(false);
    });

    it('should hide when favItemButton is clicked', () => {
      const component = createComponent(mockedState);
      expect(component.find('FavoritesButton').at(0).instance().state.active).toBe(true);
      component.find('FavoritesButton').at(0).instance().props.onRippleComplete(false);
      component.update();
      expect(component.find('FavoritesButton').at(0).instance().state.active).toBe(false);
    });
  });

  describe('Constants', () => {
    it('should export FAVORITES_SHOW_TOAST_DELAY', () => {
      expect(typeof FAVORITES_SHOW_TOAST_DELAY).toBe('number');
    });
  });
});
