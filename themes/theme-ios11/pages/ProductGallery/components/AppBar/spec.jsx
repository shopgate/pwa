import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import DefaultBar from 'Components/AppBar/presets/DefaultBar';
import AppBarIcon from '@shopgate/pwa-ui-ios/AppBar/components/Icon';
import AppBar from './index';

jest.mock('Components/AppBar/presets/DefaultBar');
jest.mock('@shopgate/pwa-ui-ios/AppBar/components/Icon');

const mockedStore = configureStore();

describe('<ProductGallery.Appbar> page', () => {
  it('should render a default app bar', () => {
    const store = mockedStore();

    const wrapper = mount((
      <Provider store={store}>
        <AppBar />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(DefaultBar).length).toEqual(1);

    const AppBarLeft = mount(wrapper.find(DefaultBar).prop('left'));
    expect(AppBarLeft.find(AppBarIcon).length).toEqual(1);
    expect(AppBarLeft.find(AppBarIcon).prop('shadow')).toEqual(true);
  });
});
