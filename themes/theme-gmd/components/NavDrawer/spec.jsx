import React from 'react';
import { shallow, mount } from 'enzyme';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { themeConfig as mockedConfig } from '@shopgate/pwa-common/helpers/config/mock';
// eslint-disable-next-line import/named
import ConnectedNavDrawer, { Unwrapped as NavDrawer } from './index';
import headerStyles from './components/Header/style';

// Mock the portal
jest.mock('react-portal', () => (
  ({ isOpened, children }) => (
    isOpened ? children : null
  )
));

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);
jest.mock('@shopgate/pwa-ui-shared/ClientInformation/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    client: {},
    enableDebugLogging: () => {},
  };

  return newObj;
});
let mockedHasFavorites = true;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  componentsConfig: { portals: {} },
  get hasFavorites() { return mockedHasFavorites; },
  themeConfig: mockedConfig,
}));
describe.skip('<NavDrawer />', () => {
  let toggleNavDrawerMock;

  beforeEach(() => {
    jest.useFakeTimers();
    toggleNavDrawerMock = jest.fn();
    window.requestAnimationFrame = jest.fn();
  });

  it('should render without optional props', () => {
    const wrapper = shallow(<ConnectedNavDrawer toggleNavDrawer={toggleNavDrawerMock} />);

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find('Item').length).toBeGreaterThan(0);
  });

  it('should render the navigation drawer opened', () => {
    const Component = (
      <ConnectedNavDrawer
        navDrawerActive
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Backdrop).length).toBe(1);
  });

  it('should trigger the toggle navigation callback when clicked on backdrop', () => {
    const Component = (
      <ConnectedNavDrawer
        navDrawerActive
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();

    const backdrop = wrapper.find(Backdrop);

    expect(toggleNavDrawerMock).not.toHaveBeenCalled();

    backdrop.find('div[aria-hidden]').simulate('click');

    expect(toggleNavDrawerMock).toHaveBeenCalled();
  });

  it('should trigger the toggle navigation callback when clicked on an item', () => {
    const Component = (
      <ConnectedNavDrawer
        navDrawerActive
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();

    const item = wrapper.find('Item').at(0).find('div[aria-hidden]').at(0);

    expect(toggleNavDrawerMock).not.toHaveBeenCalled();

    // Simulate the click.
    item.simulate('click');
    // Simulate the click delay.
    jest.runAllTimers();

    expect(toggleNavDrawerMock).toHaveBeenCalled();
  });

  it('should render the header properly when a user is logged in', () => {
    const user = {
      firstName: 'Foo',
      mail: 'foo@bar.baz',
    };
    const Component = (
      <NavDrawer
        user={user}
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();

    const headerLoggedInSelector = `.${headerStyles.loggedIn.split(' ').join('.')}`;

    expect(wrapper.find(headerLoggedInSelector).length).toBe(1);
  });

  it('should render the header properly when a user is logged out', () => {
    const Component = (
      <NavDrawer
        user={null}
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();

    const headerLoggedInSelector = `.${headerStyles.loggedIn.split(' ').join('.')}`;

    expect(wrapper.find(headerLoggedInSelector).length).toBe(0);
  });

  it('should render favorites list link with an indicator', () => {
    const Component = (
      <NavDrawer toggleNavDrawer={toggleNavDrawerMock} highlightFavorites />
    );
    const wrapper = mount(Component);
    expect(wrapper).toMatchSnapshot();
  });

  let itemsCountwithFavoritesLink;
  it('should render favorites list link without an indicator', () => {
    const Component = (
      <NavDrawer toggleNavDrawer={toggleNavDrawerMock} highlightFavorites={false} />
    );
    const wrapper = mount(Component);
    expect(wrapper).toMatchSnapshot();
    itemsCountwithFavoritesLink = wrapper.find('Item').length;
  });

  it('should not render a favorites link at all when feature flag is off', () => {
    mockedHasFavorites = false;
    const Component = (<NavDrawer toggleNavDrawer={toggleNavDrawerMock} />);
    const wrapper = mount(Component);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Item').length).toBe(itemsCountwithFavoritesLink - 1);
  });
});
