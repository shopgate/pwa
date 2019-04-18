import { UIEvents } from '@shopgate/pwa-core';
import {
  push,
  pop,
  replace,
  reset,
  NAVIGATION_PUSH,
  NAVIGATION_POP,
  NAVIGATION_REPLACE,
  NAVIGATION_RESET,
} from './helpers';

jest.mock('@shopgate/pwa-core', () => ({
  UIEvents: {
    emit: jest.fn(),
  },
}));

describe('Router > helpers', () => {
  test('push()', () => {
    push({ pathname: '/test1' });
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_PUSH, { pathname: '/test1' });
  });
  test('pop()', () => {
    pop();
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_POP);
  });
  test('replace()', () => {
    replace({ pathname: '/test2' });
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_REPLACE, { pathname: '/test2' });
  });
  test('reset()', () => {
    reset();
    expect(UIEvents.emit).toBeCalledWith(NAVIGATION_RESET);
  });
});
