/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
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

  describe('welcome headline', () => {
    /**
     * Renders the page for a logged in user with the given user data.
     * @param {Object} userData The user data.
     * @returns {HTMLElement} The headline.
     */
    const renderHeadline = (userData) => {
      isUserLoggedIn.mockReturnValue(true);
      getUserData.mockReturnValue(userData);
      render((
        <Provider store={store}>
          <More />
        </Provider>));

      return screen.getByRole('heading', { level: 1 });
    };

    it('should show the generic headline when the user data could not be fetched', () => {
      const headline = renderHeadline({ isFetching: false });

      expect(headline).toHaveTextContent('login.headline');
    });

    it('should show the headline with the name once it is known', () => {
      const headline = renderHeadline({
        firstName: 'John',
        isFetching: false,
      });

      expect(headline).toHaveTextContent('navigation.welcome_message');
    });

    /**
     * Collects the CSS rules of the generated classes of an element.
     * @param {Element} element The element.
     * @returns {string} The rules, one per line.
     */
    const getRules = (element) => {
      const generated = Array.from(element.classList).filter(name => /^(tss|css|sg)-/.test(name));

      return Array.from(document.styleSheets)
        .flatMap(sheet => Array.from(sheet.cssRules))
        .map(rule => rule.cssText)
        .filter(rule => generated.some(name => rule.includes(`.${name}`)))
        .join('\n');
    };

    /**
     * Renders the page for a logged in user whose data is still being fetched. The returned
     * function makes the given user data arrive.
     * @returns {Function} Lets the user data arrive.
     */
    const renderWhileFetching = () => {
      const updatingStore = createStore((state, action) => (
        action.type === 'UPDATE' ? { updates: state.updates + 1 } : state
      ), { updates: 0 });

      isUserLoggedIn.mockReturnValue(true);
      getUserData.mockReturnValue({ isFetching: true });
      render((
        <Provider store={updatingStore}>
          <More />
        </Provider>));

      return (userData) => {
        getUserData.mockReturnValue(userData);
        act(() => {
          updatingStore.dispatch({ type: 'UPDATE' });
        });
      };
    };

    it('should not animate the headline it starts with', () => {
      renderWhileFetching();

      const headline = screen.getByRole('heading', { level: 1 });

      expect(headline).toHaveTextContent('login.headline');
      expect(getRules(headline)).not.toContain('animation:');
    });

    it('should render the headline anew and fade it in when the name arrives', () => {
      const receiveUserData = renderWhileFetching();
      const initialHeadline = screen.getByRole('heading', { level: 1 });

      receiveUserData({
        firstName: 'John',
        isFetching: false,
      });

      const headline = screen.getByRole('heading', { level: 1 });

      expect(headline).toHaveTextContent('navigation.welcome_message');
      expect(headline).not.toBe(initialHeadline);
      expect(getRules(headline)).toMatch(/animation: .* 0\.3s ease-out/);
    });

    it('should not fade the headline in for users who prefer reduced motion', () => {
      const receiveUserData = renderWhileFetching();

      receiveUserData({
        firstName: 'John',
        isFetching: false,
      });

      const reducedMotion = getRules(screen.getByRole('heading', { level: 1 }))
        .split('\n')
        .filter(rule => rule.startsWith('@media (prefers-reduced-motion: reduce)'));

      expect(reducedMotion.join('\n')).toContain('animation: none;');
    });
  });
});
/* eslint-enable react/prop-types */
