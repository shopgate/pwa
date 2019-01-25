import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { isUserLoginDisabled } from '@shopgate/pwa-common/selectors/user';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import UserMenu from './index';

jest.mock('@shopgate/pwa-common/selectors/user', () => ({
  isUserLoginDisabled: jest.fn().mockReturnValue(false),
}));

const store = createMockStore();

describe('<UserMenu />', () => {
  it('should render as expected when the user is logged in', () => {
    const logoutHandler = jest.fn();
    const wrapper = mount((
      <Provider store={store}>
        <UserMenu isLoggedIn logout={logoutHandler} />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('LoggedIn').exists()).toBe(true);
    expect(wrapper.find('nav MoreMenuItem').text()).toBe('navigation.logout');
    wrapper.find('nav MoreMenuItem').simulate('click');
    expect(logoutHandler).toHaveBeenCalledTimes(1);
  });

  it('should render as expected when the user is logged out and the buttons are enabled', () => {
    const wrapper = mount((
      <Provider store={store}>
        <UserMenu isLoggedIn={false} logout={() => {}} />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    const links = wrapper.find('Link');
    expect(links.at(0).text()).toBe('login.button');
    expect(links.at(0).prop('disabled')).toBe(false);
    expect(links.at(1).text()).toBe('login.signup');
    expect(links.at(1).prop('disabled')).toBe(false);
  });

  it('should render as expected when the user is logged out and the buttons are disabled', () => {
    isUserLoginDisabled.mockReturnValueOnce(true);

    const wrapper = mount((
      <Provider store={store}>
        <UserMenu isLoggedIn={false} logout={() => { }} />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    const links = wrapper.find('Link');
    expect(links.at(0).prop('disabled')).toBe(true);
    expect(links.at(1).prop('disabled')).toBe(true);
  });
});
