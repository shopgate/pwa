import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  mockedState,
  mockedEmptyState,
} from 'Pages/Favorites/mock';
import ConnectedBadge, { FavoritesIconBadge } from './index';

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
    const component = createComponent(mockedEmptyState);
    expect(component.html()).toBe('');
  });
  it('should render exact number', () => {
    const component = createComponent(mockedState);
    expect(component.html().indexOf('1')).toBeGreaterThan(0);
    expect(component).toMatchSnapshot();
  });
});
describe('TabBar favorites action - lifecycle', () => {
  let component;
  it('should create component', () => {
    component = mount(<FavoritesIconBadge favoritesCount={0} />);
  });
  it('should not update when number is the same', () => {
    expect(component.at(0).instance().shouldComponentUpdate({ favoritesCount: 0 })).toBe(false);
  });
  it('should update when number is changed', () => {
    component.setProps({ favoritesCount: 99 });
    expect(component.props().favoritesCount).toBe(99);
    expect(component).toMatchSnapshot();
  });
  it('should update when number exceeds maximum', () => {
    component.setProps({ favoritesCount: 9999 });
    expect(component.html().indexOf('999+')).toBeGreaterThan(0);
    expect(component).toMatchSnapshot();
  });
  it('should not update when number still exceeds maximum', () => {
    expect(component.at(0).instance().shouldComponentUpdate({ favoritesCount: 1000 })).toBe(false);
  });
  it('should update when number goes back to limits', () => {
    expect(component.at(0).instance().shouldComponentUpdate({ favoritesCount: 100 })).toBe(true);
  });
  it('should update when number goes back to 0', () => {
    expect(component.at(0).instance().shouldComponentUpdate({ favoritesCount: 0 })).toBe(true);
  });
});
