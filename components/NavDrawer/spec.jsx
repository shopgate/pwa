import React from 'react';
import { shallow, mount } from 'enzyme';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import ConnectedNavDrawer, { Unwrapped as NavDrawer } from './index';
import Item from './components/Item';
import headerStyles from './components/Header/style';

// Mock the portal
jest.mock('react-portal', () => (
  ({ isOpened, children }) => (
    isOpened ? children : null
  )
));

// Mock the parsed link component.
jest.mock('@shopgate/pwa-common/helpers/parsed-link', () => (
  class {
    open = () => {};
  }
));

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);
jest.mock('Components/ClientInformation/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    client: {},
    enableDebugLogging: () => {},
  };

  return newObj;
});

describe('<NavDrawer />', () => {
  let toggleNavDrawerMock;

  beforeEach(() => {
    jest.useFakeTimers();
    toggleNavDrawerMock = jest.fn();
    window.requestAnimationFrame = jest.fn();
  });

  it('should render without optional props', () => {
    const wrapper = shallow(
      <ConnectedNavDrawer toggleNavDrawer={toggleNavDrawerMock} />
    );

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find('Item').length).toBeGreaterThan(0);
  });

  it('should render the navigation drawer opened', () => {
    const wrapper = mount(
      <ConnectedNavDrawer
        navDrawerActive
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find(Backdrop).length).toBe(1);
  });

  it('should trigger the toggle navigation callback when clicked on backdrop', () => {
    const wrapper = mount(
      <ConnectedNavDrawer
        navDrawerActive
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );

    expect(wrapper).toMatchSnapshot();

    const backdrop = wrapper.find(Backdrop);

    expect(toggleNavDrawerMock).not.toHaveBeenCalled();

    backdrop.find('div[aria-hidden]').simulate('click');

    expect(toggleNavDrawerMock).toHaveBeenCalled();
  });

  it('should trigger the toggle navigation callback when clicked on an item', () => {
    const wrapper = mount(
      <ConnectedNavDrawer
        navDrawerActive
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );

    expect(wrapper).toMatchSnapshot();

    const item = wrapper.find(Item).at(0).find('div[aria-hidden]').at(0);

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
    const wrapper = mount(
      <NavDrawer
        user={user}
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );

    expect(wrapper).toMatchSnapshot();

    const headerLoggedInSelector = `.${headerStyles.loggedIn.split(' ').join('.')}`;

    expect(wrapper.find(headerLoggedInSelector).length).toBe(1);
  });

  it('should render the header properly when a user is logged out', () => {
    const wrapper = mount(
      <NavDrawer
        user={null}
        toggleNavDrawer={toggleNavDrawerMock}
      />
    );

    expect(wrapper).toMatchSnapshot();

    const headerLoggedInSelector = `.${headerStyles.loggedIn.split(' ').join('.')}`;

    expect(wrapper.find(headerLoggedInSelector).length).toBe(0);
  });
});
