import { createElement } from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import useLocalStorage from '../useLocalStorage';

const appId = 'shop_10006';

jest.mock('@shopgate/engage', () => ({
  appConfig: { appId: 'shop_10006' },
}));

type Options = Parameters<typeof useLocalStorage>[1];

/**
 * Renders the hook and exposes its latest value and setter through a spy, since this RTL version
 * has no renderHook.
 * @param key The storage key.
 * @param options The hook options.
 * @returns The spy that receives the hook's [value, setValue] tuple on every render.
 */
const renderUseLocalStorage = (key: string, options?: Options) => {
  const spy = jest.fn();

  /**
   * @returns Nothing renderable.
   */
  const Consumer = () => {
    spy(useLocalStorage(key, options));
    return null;
  };

  render(createElement(Consumer));

  return spy;
};

/**
 * Reads the hook's most recent return tuple.
 * @param spy The spy passed to renderUseLocalStorage.
 * @returns The most recent value the hook returned.
 */
const latestValue = (spy: jest.Mock) => spy.mock.calls[spy.mock.calls.length - 1][0][0];

/**
 * Reads the hook's most recent setter.
 * @param spy The spy passed to renderUseLocalStorage.
 * @returns The setter the hook returned.
 */
const setter = (spy: jest.Mock) => spy.mock.calls[spy.mock.calls.length - 1][0][1];

// Options that keep the hook fully in memory, as the frontend settings preview uses it.
const ephemeral: Options = {
  initialValue: 'light',
  persist: false,
};

describe('engage > core > hooks > useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('persist: true (default)', () => {
    it('should write the value under the app-namespaced key', () => {
      const spy = renderUseLocalStorage('color');

      act(() => setter(spy)('dark'));

      expect(latestValue(spy)).toBe('dark');
      expect(window.localStorage.getItem(`${appId}_color`)).toBe(JSON.stringify('dark'));
    });

    it('should read an existing stored value on mount', () => {
      window.localStorage.setItem(`${appId}_color`, JSON.stringify('dark'));

      const spy = renderUseLocalStorage('color', { initialValue: 'light' });

      expect(latestValue(spy)).toBe('dark');
    });
  });

  describe('persist: false', () => {
    it('should ignore an existing stored value and use the initial value', () => {
      window.localStorage.setItem(`${appId}_color`, JSON.stringify('dark'));

      const spy = renderUseLocalStorage('color', ephemeral);

      expect(latestValue(spy)).toBe('light');
    });

    it('should not write to localStorage when the value is set', () => {
      const spy = renderUseLocalStorage('color', ephemeral);

      act(() => setter(spy)('dark'));

      expect(latestValue(spy)).toBe('dark');
      expect(window.localStorage.getItem(`${appId}_color`)).toBeNull();
    });

    it('should not remove a stored value when set to null', () => {
      window.localStorage.setItem(`${appId}_color`, JSON.stringify('dark'));

      const spy = renderUseLocalStorage('color', ephemeral);

      act(() => setter(spy)(null));

      expect(latestValue(spy)).toBeNull();
      expect(window.localStorage.getItem(`${appId}_color`)).toBe(JSON.stringify('dark'));
    });

    it('should resolve an updater against the current in-memory value', () => {
      const spy = renderUseLocalStorage('color', ephemeral);

      act(() => setter(spy)((prev: string) => (prev === 'light' ? 'dark' : 'light')));

      expect(latestValue(spy)).toBe('dark');
    });

    it('should ignore storage events from other tabs', () => {
      const spy = renderUseLocalStorage('color', ephemeral);

      act(() => {
        window.dispatchEvent(new StorageEvent('storage', {
          key: `${appId}_color`,
          newValue: JSON.stringify('dark'),
        }));
      });

      expect(latestValue(spy)).toBe('light');
    });
  });
});
