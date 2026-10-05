/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import {
  isUserLoggedIn,
  getUserData,
} from '@shopgate/pwa-common/selectors/user';
import {
  NAV_MENU_CONTENT_BEFORE,
  USER_MENU_CONTAINER,
  USER_MENU_CONTAINER_BEFORE,
} from '@shopgate/pwa-common/constants/Portals';
import More from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/pwa-common/components/Portal', () => function Portal({ name, children }) {
  return <div data-portal={name}>{children}</div>;
});
jest.mock('Components/AppBar/presets', () => ({
  BackBar: () => <div />,
}));
jest.mock('@shopgate/pwa-common/selectors/user', () => ({
  isUserLoginDisabled: jest.fn().mockReturnValue(false),
  isUserLoggedIn: jest.fn().mockReturnValue(false),
  getUserData: jest.fn().mockReturnValue({}),
}));
jest.mock('./components/StoreInfo/components/LegalPages', () => function LegalPages() {
  return null;
});

jest.mock('@shopgate/engage/development/components/ClientInformation', () => {
  const ClientInformation = () => (<div />);
  return ClientInformation;
});

jest.mock('./components/Quicklinks', () => {
  const Quicklinks = () => <div />;
  return Quicklinks;
});

const store = createMockStore();

const getPortals = (container, name) => Array.from(container.querySelectorAll(`[data-portal="${name}"]`));

describe('<More />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isUserLoggedIn.mockReturnValue(false);
    getUserData.mockReturnValue({});
  });

  it('should render as expected when the user is not logged in', () => {
    const { container } = render((
      <Provider store={store}>
        <More />
      </Provider>));

    const headline = screen.getByRole('heading', { level: 1 });

    expect(headline).toHaveTextContent('login.headline');
    expect(headline.nextElementSibling).toBe(getPortals(container, USER_MENU_CONTAINER_BEFORE)[0]);
    expect(getPortals(container, USER_MENU_CONTAINER)).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'login.button' })).toBeInTheDocument();
  });

  it('should render as expected when the user is logged in', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Appleseed',
    };

    getUserData.mockReturnValue(userData);
    isUserLoggedIn.mockReturnValue(true);
    const { container } = render((
      <Provider store={store}>
        <More />
      </Provider>));

    const headline = screen.getByRole('heading', { level: 1 });

    expect(headline).toHaveTextContent('navigation.welcome_message');
    expect(headline.nextElementSibling).toBe(getPortals(container, NAV_MENU_CONTENT_BEFORE)[0]);
    expect(getPortals(container, USER_MENU_CONTAINER)).toHaveLength(1);
    expect(screen.getByText('navigation.logout')).toBeInTheDocument();
  });
});
/* eslint-enable react/prop-types */
