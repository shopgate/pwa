import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getFavoritesCount } from '@shopgate/pwa-common-commerce/favorites/selectors';
import {
  mockedState,
  mockedEmptyState,
} from 'Pages/Favorites/mock';
import ConnectedBadge, { FavoritesIconBadge } from './index';

jest.mock('@shopgate/pwa-common-commerce/favorites/selectors', () => ({
  getFavoritesCount: jest.fn(() => 1),
}));

const mockedStore = configureStore();
/**
 * Creates component
 * @param {boolean} state State that would be used for store.
 * @return {ReactWrapper}
 */
const createComponent = state => mount((
  <Provider store={mockedStore(state)}>
    <ConnectedBadge />
  </Provider>
));

describe('TabBar favorites action', () => {
  it('should render only icon when badge is 0', () => {
    getFavoritesCount.mockReturnValueOnce(0);
    const component = createComponent(mockedEmptyState);
    expect(component.isEmptyRender()).toBe(true);
  });
  it('should render exact number', () => {
    const component = createComponent(mockedState);
    expect(component.html().indexOf('1')).toBeGreaterThan(0);
    expect(component).toMatchSnapshot();
  });
});

describe('TabBar favorites action - behavior', () => {
  it('should render empty when unconnected count is 0', () => {
    const component = mount(<FavoritesIconBadge favoritesCount={0} />);
    expect(component.isEmptyRender()).toBe(true);
  });

  it('should show count when number is changed', () => {
    const component = mount(<FavoritesIconBadge favoritesCount={99} />);
    expect(component.text()).toContain('99');
    expect(component).toMatchSnapshot();
  });

  it('should cap display at MAX when number exceeds maximum', () => {
    const component = mount(<FavoritesIconBadge favoritesCount={9999} />);
    expect(component.text()).toContain('999+');
    expect(component).toMatchSnapshot();
  });

  it('should remain 999+ when count stays above max', () => {
    const component = mount(<FavoritesIconBadge favoritesCount={5000} />);
    expect(component.text()).toContain('999+');
    component.setProps({ favoritesCount: 6000 });
    expect(component.text()).toContain('999+');
  });

  it('should show lower count when number goes back to limits', () => {
    const component = mount(<FavoritesIconBadge favoritesCount={9999} />);
    component.setProps({ favoritesCount: 100 });
    expect(component.text()).toContain('100');
  });
});
