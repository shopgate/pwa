/* eslint-disable react/prop-types */
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { isUserLoginDisabled } from '@shopgate/pwa-common/selectors/user';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { ORDERS_PATH, WISH_LIST_PATH, PROFILE_PATH } from '@shopgate/engage/account/constants';
import UserMenu from './index';

jest.mock('@shopgate/engage/components', () => {
  const Grid = ({ children }) => children;
  Grid.Item = ({ children }) => children;

  return {
    Grid,
    I18n: { Text: ({ string }) => string },
    Link: ({ children, href, role }) => <a href={href} role={role}>{children}</a>,
    SurroundPortals: ({ children }) => children,
    Typography: ({ children, component: Component }) => <Component>{children}</Component>,
  };
});
jest.mock('@shopgate/engage/a11y/components');

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
    const { container } = render((
      <Provider store={store}>
        <UserMenu isLoggedIn logout={logoutHandler} />
      </Provider>));

    expect(screen.getByRole('heading', {
      level: 2,
      name: 'navigation.your_account',
    })).toBeInTheDocument();

    const items = screen.getAllByRole('button');

    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('navigation.logout');
    fireEvent.click(items[0]);
    expect(logoutHandler).toHaveBeenCalledTimes(1);

    expect(container.querySelector(`[href="${PROFILE_PATH}"]`)).not.toBeInTheDocument();
    expect(container.querySelector(`[href="${WISH_LIST_PATH}"]`)).not.toBeInTheDocument();
    expect(container.querySelector(`[href="${ORDERS_PATH}"]`)).not.toBeInTheDocument();
  });

  it('should render as expected when the user is logged out and the buttons are enabled', () => {
    render((
      <Provider store={store}>
        <UserMenu isLoggedIn={false} logout={() => {}} />
      </Provider>));

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('login.button');
    expect(buttons[0]).toBeEnabled();
    expect(buttons[1]).toHaveTextContent('login.signup');
    expect(buttons[1]).toBeEnabled();
  });

  it('should render as expected when the user is logged out and the buttons are disabled', () => {
    isUserLoginDisabled.mockReturnValueOnce(true);

    render((
      <Provider store={store}>
        <UserMenu isLoggedIn={false} logout={() => { }} />
      </Provider>));

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it('should render additional links when logged in and new services are enabled', () => {
    hasNewServices.mockReturnValueOnce(true);

    const { container } = render((
      <Provider store={store}>
        <UserMenu isLoggedIn logout={() => {}} />
      </Provider>));

    expect(container.querySelector(`[href="${PROFILE_PATH}"]`)).toBeInTheDocument();
    expect(container.querySelector(`[href="${WISH_LIST_PATH}"]`)).toBeInTheDocument();
    expect(container.querySelector(`[href="${ORDERS_PATH}"]`)).toBeInTheDocument();
  });
});
/* eslint-enable react/prop-types */
