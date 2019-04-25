import { UIEvents } from '@shopgate/pwa-core';
import { router } from '@virtuous/conductor';
import {
  push,
  pop,
  replace,
  reset,
  update,
  NAVIGATION_PUSH,
  NAVIGATION_POP,
  NAVIGATION_REPLACE,
  NAVIGATION_RESET,
} from '../helpers';

jest.mock('@shopgate/pwa-core', () => ({
  UIEvents: {
    emit: jest.fn(),
  },
}));

jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
    getCurrentRoute: jest.fn(() => ({ id: '1234' })),
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

  describe('update()', () => {
    it('should use the current route\'s ID if no ID is passed', () => {
      update({ foo: 'bar' });
      expect(router.update).toBeCalledWith('1234', { foo: 'bar' });
    });

    it('should use the custom ID if one is passed', () => {
      update({ foo: 'bar' }, '345');
      expect(router.update).toBeCalledWith('345', { foo: 'bar' });
    });
  });
});
