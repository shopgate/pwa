import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { UIEvents } from '@shopgate/pwa-core';
import {
  ACTION_PUSH,
  ACTION_POP,
  ACTION_REPLACE,
  ACTION_RESET,
} from '@virtuous/conductor';
import { createMockStore } from '@shopgate/pwa-common/store';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import NavigationHandler from './index';
import {
  NAVIGATION_PUSH,
  NAVIGATION_POP,
  NAVIGATION_REPLACE,
  NAVIGATION_RESET,
  push,
  pop,
  replace,
  reset,
} from '../../core/router/helpers';

jest.mock('@shopgate/pwa-core', () => {
  const map = {};

  return {
    UIEvents: {
      addListener: jest.fn((event, cb) => {
        map[event] = cb;
      }),
      removeListener: jest.fn(),
      emit: jest.fn((event, params) => {
        map[event](params);
      }),
    },
  };
});

const navigationEvents = [
  NAVIGATION_PUSH,
  NAVIGATION_POP,
  NAVIGATION_REPLACE,
  NAVIGATION_RESET,
];

describe('<NavigationHandler />', () => {
  let store;

  const renderHandler = () => render((
    <Provider store={store}>
      <NavigationHandler>
        <div>Some content</div>
      </NavigationHandler>
    </Provider>
  ));

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line default-param-last
    store = createMockStore((state = [], action) => [...state, action]);
  });

  it('should render as expected', () => {
    renderHandler();
    expect(screen.getByText('Some content')).toBeInTheDocument();
  });

  it('should trigger the push() callbacks on navigation.push event', () => {
    renderHandler();
    push({ pathname: '/test' });
    expect(store.getState()).toContainEqual(navigate({
      pathname: '/test',
      action: ACTION_PUSH,
    }));
  });

  it('should trigger the pop() callbacks on navigation.pop event', () => {
    renderHandler();
    pop();
    expect(store.getState()).toContainEqual(navigate({ action: ACTION_POP }));
  });

  it('should forward pop() params so that multiple routes can be popped', () => {
    renderHandler();
    pop({ steps: 2 });
    expect(store.getState()).toContainEqual(navigate({
      steps: 2,
      action: ACTION_POP,
    }));
  });

  it('should trigger the replace() callbacks on navigation.replace event', () => {
    renderHandler();
    replace({ pathname: '/test' });
    expect(store.getState()).toContainEqual(navigate(expect.objectContaining({
      pathname: '/test',
      action: ACTION_REPLACE,
    })));
  });

  it('should trigger the reset() callbacks on navigation.reset event', () => {
    renderHandler();
    reset();
    expect(store.getState()).toContainEqual(navigate({ action: ACTION_RESET }));
  });

  it('should register the navigation event listener', () => {
    renderHandler();
    navigationEvents.forEach((event) => {
      expect(UIEvents.addListener).toHaveBeenCalledWith(event, expect.any(Function));
    });
  });

  it('should unregister the navigation event listener when the component unmounts', () => {
    const { unmount } = renderHandler();
    expect(UIEvents.removeListener).not.toHaveBeenCalled();
    unmount();
    expect(UIEvents.removeListener.mock.calls).toEqual(UIEvents.addListener.mock.calls);
  });
});
