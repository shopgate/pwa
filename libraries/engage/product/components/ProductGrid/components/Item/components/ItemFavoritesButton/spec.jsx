import React from 'react';
import { shallow } from 'enzyme';
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
  it('should not render when its not a favorite', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <ItemFavoritesButton productId="1234" />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('should render if its a favorite', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <ItemFavoritesButton productId="1234" isFavorite />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
