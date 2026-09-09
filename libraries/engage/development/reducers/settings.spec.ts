import {
  toggleInsets,
  toggleInsetHighlight,
  toggleCms2Preview,
  toggleColorSchemeSelection,
} from '../action-creators/settings';
import type { DevelopmentSettingsState } from '../types';

type SettingsReducer = (
  state: DevelopmentSettingsState | undefined,
  action: { type: string }
) => DevelopmentSettingsState;

/**
 * Loads the reducer with `isDev` mocked to the given value. The flag is read from a module level
 * constant, so it is captured at import time and cannot be changed per test.
 * @param isDev Whether the reducer should behave like a development build.
 * @returns The freshly imported reducer and the state it starts out with.
 */
const loadReducer = (isDev: boolean) => {
  let loaded: { reducer: SettingsReducer; initialState: DevelopmentSettingsState } | undefined;

  jest.isolateModules(() => {
    jest.doMock('@shopgate/engage/core/helpers', () => ({ isDev }));

    const settings = jest.requireActual<{
      default: SettingsReducer;
      DEFAULT_DEVELOPMENT_SETTINGS: DevelopmentSettingsState;
    }>('./settings');

    loaded = {
      reducer: settings.default,
      initialState: settings.DEFAULT_DEVELOPMENT_SETTINGS,
    };
  });

  return loaded as { reducer: SettingsReducer; initialState: DevelopmentSettingsState };
};

describe('development / reducers / settings', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should start out with everything disabled and no inset decision', () => {
    const { reducer, initialState } = loadReducer(true);

    expect(reducer(undefined, { type: 'INIT' })).toEqual(initialState);
    expect(initialState.showInsets).toBeNull();
  });

  it('should leave the state untouched for an unrelated action', () => {
    const { reducer, initialState } = loadReducer(true);

    expect(reducer(undefined, { type: 'SOMETHING_ELSE' })).toBe(initialState);
  });

  describe('within a development build', () => {
    it.each([
      ['the simulated insets on', toggleInsets(true), { showInsets: true }],
      ['the simulated insets off', toggleInsets(false), { showInsets: false }],
      ['the inset highlight', toggleInsetHighlight(true), { showInsetHighlight: true }],
      ['the color scheme selection', toggleColorSchemeSelection(true), {
        colorSchemeSelectionEnabled: true,
      }],
    ])('should toggle %s', (_, action, expected) => {
      const { reducer, initialState } = loadReducer(true);

      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        ...expected,
      });
    });
  });

  // Everything but the CMS 2.0 preview is a development tool, and must not become reachable in a
  // production build even when the action is dispatched.
  describe('outside a development build', () => {
    it.each([
      ['the simulated insets', toggleInsets(true)],
      ['the inset highlight', toggleInsetHighlight(true)],
      ['the color scheme selection', toggleColorSchemeSelection(true)],
    ])('should refuse to enable %s', (_, action) => {
      const { reducer, initialState } = loadReducer(false);

      expect(reducer(undefined, action)).toEqual(initialState);
    });

    it('should still toggle the CMS 2.0 preview, which is not development only', () => {
      const { reducer } = loadReducer(false);

      expect(reducer(undefined, toggleCms2Preview(true)).cms2PreviewEnabled).toBe(true);
    });
  });
});
