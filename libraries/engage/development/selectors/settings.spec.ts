import type { DevelopmentSettingsState, DevelopmentState } from '../types';

import type * as settingsSelectors from './settings';

type SettingsSelectors = typeof settingsSelectors;

/**
 * Builds a state holding the given development settings.
 * @param settings The development settings to place in the state.
 * @returns The application state.
 */
const stateWith = (settings: Partial<DevelopmentSettingsState>): DevelopmentState => ({
  development: {
    settings: {
      showInsets: null,
      showInsetHighlight: false,
      cms2PreviewEnabled: false,
      colorSchemeSelectionEnabled: false,
      ...settings,
    },
  },
} as DevelopmentState);

interface LoadOptions {
  /**
   * Whether the selectors should behave like a development build.
   */
  isDev: boolean;
  /**
   * Whether the app runs inside the native app rather than a browser.
   */
  hasSGJavaScriptBridge?: boolean;
  /**
   * The operating system `mobile-detect` reports.
   */
  os?: string | null;
}

/**
 * Loads the selectors with their module level dependencies mocked. Both `isDev` and the
 * `MobileDetect` instance are captured at import time, so they cannot be changed per test.
 * @param options What the mocked dependencies should report.
 * @returns The freshly imported selectors.
 */
const loadSelectors = (options: LoadOptions) => {
  const { isDev, hasSGJavaScriptBridge = false, os = null } = options;
  let selectors: SettingsSelectors | undefined;

  jest.isolateModules(() => {
    jest.doMock('@shopgate/engage/core/helpers', () => ({
      isDev,
      hasSGJavaScriptBridge: () => hasSGJavaScriptBridge,
    }));
    jest.doMock('mobile-detect', () => class {
      /**
       * @returns The mocked operating system.
       */
      // eslint-disable-next-line class-methods-use-this
      os() { return os; }
    });
    selectors = jest.requireActual<SettingsSelectors>('./settings');
  });

  return selectors as SettingsSelectors;
};

describe('development / selectors / settings', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getIsDev', () => {
    it.each([[true], [false]])('should report %s', (isDev) => {
      const { getIsDev } = loadSelectors({ isDev });

      expect(getIsDev(stateWith({}))).toBe(isDev);
    });
  });

  describe('getAreInsetsVisible / getIsInsetHighlightVisible', () => {
    it('should pass the stored values through in a development build', () => {
      const { getAreInsetsVisible, getIsInsetHighlightVisible } = loadSelectors({ isDev: true });
      const state = stateWith({
        showInsets: true,
        showInsetHighlight: true,
      });

      expect(getAreInsetsVisible(state)).toBe(true);
      expect(getIsInsetHighlightVisible(state)).toBe(true);
    });

    it('should report false outside a development build', () => {
      const { getAreInsetsVisible, getIsInsetHighlightVisible } = loadSelectors({ isDev: false });
      const state = stateWith({
        showInsets: true,
        showInsetHighlight: true,
      });

      expect(getAreInsetsVisible(state)).toBe(false);
      expect(getIsInsetHighlightVisible(state)).toBe(false);
    });
  });

  describe('getAreSimulatedInsetsInjected', () => {
    it('should respect an explicit decision', () => {
      const { getAreSimulatedInsetsInjected } = loadSelectors({
        isDev: true,
        os: 'iOS',
      });

      expect(getAreSimulatedInsetsInjected(stateWith({ showInsets: false }))).toBe(false);
      expect(getAreSimulatedInsetsInjected(stateWith({ showInsets: true }))).toBe(true);
    });

    // Without a decision the insets default to on wherever an iOS device is being simulated,
    // which is the only case they are meant to stand in for.
    it.each([
      ['a simulated iOS device', 'iOS', true],
      ['any other platform', 'AndroidOS', false],
    ])('should default to the simulated insets on %s', (_, os, expected) => {
      const { getAreSimulatedInsetsInjected } = loadSelectors({
        isDev: true,
        os,
      });

      expect(getAreSimulatedInsetsInjected(stateWith({ showInsets: null }))).toBe(expected);
    });

    it('should report false while running inside the app', () => {
      const { getAreSimulatedInsetsInjected } = loadSelectors({
        isDev: true,
        hasSGJavaScriptBridge: true,
        os: 'iOS',
      });

      expect(getAreSimulatedInsetsInjected(stateWith({ showInsets: true }))).toBe(false);
    });

    it('should report false outside a development build', () => {
      const { getAreSimulatedInsetsInjected } = loadSelectors({
        isDev: false,
        os: 'iOS',
      });

      expect(getAreSimulatedInsetsInjected(stateWith({ showInsets: true }))).toBe(false);
    });
  });

  describe('getIsCMS2PreviewEnabled', () => {
    // Not a development tool, so it applies in production builds too.
    it.each([[true], [false]])('should report the stored value while isDev is %s', (isDev) => {
      const { getIsCMS2PreviewEnabled } = loadSelectors({ isDev });

      expect(getIsCMS2PreviewEnabled(stateWith({ cms2PreviewEnabled: true }))).toBe(true);
    });
  });

  describe('getIsColorSchemeSelectionEnabled', () => {
    it('should report the stored value in a development build', () => {
      const { getIsColorSchemeSelectionEnabled } = loadSelectors({ isDev: true });

      expect(getIsColorSchemeSelectionEnabled(stateWith({
        colorSchemeSelectionEnabled: true,
      }))).toBe(true);
    });

    // In production the merchant's appearance setting is the only thing that may enable it.
    it('should report false outside a development build', () => {
      const { getIsColorSchemeSelectionEnabled } = loadSelectors({ isDev: false });

      expect(getIsColorSchemeSelectionEnabled(stateWith({
        colorSchemeSelectionEnabled: true,
      }))).toBe(false);
    });
  });
});
