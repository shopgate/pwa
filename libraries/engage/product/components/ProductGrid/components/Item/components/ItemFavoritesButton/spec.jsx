import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import favorites from '@shopgate/pwa-common-commerce/favorites/reducers';
import ItemFavoritesButton from './index';

jest.mock('@shopgate/engage/components');

const store = createMockStore(combineReducers({
  favorites,
}));

describe('<ItemFavoritesButton />', () => {
  it('should not render when it\'s not a favorite', () => {
    const wrapper = render((
      <Provider store={store}>
        <ItemFavoritesButton productId="1234" />
      </Provider>
    ));
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('should render if it\'s a favorite', () => {
    const wrapper = render((
      <Provider store={store}>
        <ItemFavoritesButton productId="1234" isFavorite />
      </Provider>
    ));
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });
});
