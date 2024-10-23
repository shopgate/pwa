import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { isUserLoginDisabled } from '@shopgate/pwa-common/selectors/user';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { ORDERS_PATH, WISH_LIST_PATH, PROFILE_PATH } from '@shopgate/engage/account/constants';
import UserMenu from './index';

jest.mock('@shopgate/engage/components');

jest.mock('@shopgate/pwa-common/selectors/user', () => ({
  isUserLoginDisabled: jest.fn().mockReturnValue(false),
}));

jest.mock('@shopgate/engage/core/helpers/environment', () => ({
  hasNewServices: jest.fn().mockReturnValue(false),
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
    expect(wrapper.find('MoreMenuItem').last().text()).toBe('navigation.logout');
    wrapper.find('MoreMenuItem').last().simulate('click');
    expect(logoutHandler).toHaveBeenCalledTimes(1);

    expect(wrapper.exists({ href: PROFILE_PATH })).toBe(false);
    expect(wrapper.exists({ href: WISH_LIST_PATH })).toBe(false);
    expect(wrapper.exists({ href: ORDERS_PATH })).toBe(false);
  });

  it('should render as expected when the user is logged out and the buttons are enabled', () => {
    const wrapper = mount((
      <Provider store={store}>
        <UserMenu isLoggedIn={false} logout={() => {}} />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    const links = wrapper.find('Link');
    expect(links.find('Text').at(0).prop('string')).toBe('login.button');
    expect(links.at(0).prop('disabled')).toBe(false);
    expect(links.find('Text').at(1).prop('string')).toBe('login.signup');
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

  it('should render additional links when logged in and new services are enabled', () => {
    hasNewServices.mockReturnValueOnce(true);

    const wrapper = mount((
      <Provider store={store}>
        <UserMenu isLoggedIn logout={() => {}} />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.exists({ href: PROFILE_PATH })).toBe(true);
    expect(wrapper.exists({ href: WISH_LIST_PATH })).toBe(true);
    expect(wrapper.exists({ href: ORDERS_PATH })).toBe(true);
  });
});
