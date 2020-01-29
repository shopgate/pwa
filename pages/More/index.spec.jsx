import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import {
  isUserLoggedIn,
  getUserData,
} from '@shopgate/pwa-common/selectors/user';
import More from './index';

jest.mock('@shopgate/engage/components');
jest.mock('Components/AppBar/presets', () => ({
  BackBar: () => <div />,
}));

jest.mock('@shopgate/pwa-common/selectors/user', () => ({
  isUserLoginDisabled: jest.fn().mockReturnValue(false),
  isUserLoggedIn: jest.fn().mockReturnValue(false),
  getUserData: jest.fn().mockReturnValue({}),
}));

/* eslint-disable require-jsdoc */
jest.mock('@shopgate/pwa-ui-shared/ClientInformation', () => {
  const ClientInformation = () => (<div />);
  return ClientInformation;
});

jest.mock('./components/Quicklinks', () => {
  const Quicklinks = () => <div />;
  return Quicklinks;
});
/* eslint-enable require-jsdoc */

const store = createMockStore();

const mockedi18n = jest.fn().mockImplementation(text => text);
const mockContext = {
  context: {
    i18n: () => ({ __: mockedi18n }),
  },
  childContextTypes: {
    i18n: PropTypes.func.isRequired,
  },
};

describe('<More />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected when the user is not logged in', () => {
    const wrapper = mount((
      <Provider store={store}>
        <More />
      </Provider>), mockContext);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Headline').first().text()).toBe('login.headline');
    expect(wrapper.find('Headline + UserMenu').exists()).toBe(true);
    expect(wrapper.find('UserMenu')).toHaveLength(1);
  });

  it('should render as expected when the user is logged in', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Appleseed',
    };

    getUserData.mockReturnValue(userData);
    isUserLoggedIn.mockReturnValue(true);
    const wrapper = mount((
      <Provider store={store}>
        <More />
      </Provider>), mockContext);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Headline').first().text()).toBe('navigation.welcome_message');
    expect(wrapper.find('Headline + UserMenu').exists()).toBe(false);
    expect(wrapper.find('UserMenu')).toHaveLength(1);
    expect(mockedi18n).toHaveBeenCalledWith('navigation.welcome_message', { name: userData.firstName });
  });
});
