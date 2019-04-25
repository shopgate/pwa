import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { UIEvents } from '@shopgate/pwa-core';
import { createMockStore } from '@shopgate/pwa-common/store';
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

describe('<NavigationHandler />', () => {
  const store = createMockStore();
  const wrapper = mount((
    <Provider store={store}>
      <NavigationHandler>
        <div>Some content</div>
      </NavigationHandler>
    </Provider>
  ));

  it('should render as expected', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the push() callbacks on navigation.push event', async () => {
    await push({ pathname: '/test' });
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_PUSH, { pathname: '/test' });
    UIEvents.emit.mockClear();
  });

  it('should trigger the pop() callbacks on navigation.pop event', async () => {
    await pop();
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_POP);
    UIEvents.emit.mockClear();
  });

  it('should trigger the replace() callbacks on navigation.replace event', async () => {
    await replace({ pathname: '/test' });
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_REPLACE, { pathname: '/test' });
    UIEvents.emit.mockClear();
  });

  it('should trigger the reset() callbacks on navigation.reset event', async () => {
    await reset();
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_RESET);
    UIEvents.emit.mockClear();
  });

  it('should register the navigation event listener', () => {
    const props = wrapper.find('NavigationHandler').props();
    expect(UIEvents.addListener.mock.calls.length).toBe(4);
    expect(UIEvents.addListener.mock.calls[0][0]).toEqual(NAVIGATION_PUSH, props.push);
    expect(UIEvents.addListener.mock.calls[1][0]).toEqual(NAVIGATION_POP, props.pop);
    expect(UIEvents.addListener.mock.calls[2][0]).toEqual(NAVIGATION_REPLACE, props.replace);
    expect(UIEvents.addListener.mock.calls[3][0]).toEqual(NAVIGATION_RESET, props.reset);
    UIEvents.addListener.mockClear();
  });

  it('should unregister the navigation event listener when the component unmounts', () => {
    const props = wrapper.find('NavigationHandler').props();
    wrapper.unmount();
    expect(UIEvents.removeListener.mock.calls.length).toBe(4);
    expect(UIEvents.removeListener.mock.calls[0][0]).toEqual(NAVIGATION_PUSH, props.push);
    expect(UIEvents.removeListener.mock.calls[1][0]).toEqual(NAVIGATION_POP, props.pop);
    expect(UIEvents.removeListener.mock.calls[2][0]).toEqual(NAVIGATION_REPLACE, props.replace);
    expect(UIEvents.removeListener.mock.calls[3][0]).toEqual(NAVIGATION_RESET, props.reset);
    UIEvents.removeListener.mockClear();
  });
});
