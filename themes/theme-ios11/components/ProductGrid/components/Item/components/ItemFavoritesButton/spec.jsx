import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import reducers from 'Pages/reducers';
import ItemFavoritesButton from './index';

const store = createMockStore(reducers);

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
