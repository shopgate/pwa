import {
  memo, useCallback, useMemo, useLayoutEffect,
} from 'react';
import { useSelector } from 'react-redux';
import useLocalStorage from '@shopgate/engage/core/hooks/useLocalStorage';
import { logger } from '@shopgate/engage/core/helpers';
import { GlobalStyles } from '@shopgate/engage/styles';
import { isFrontendSettingsAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { FrontendSettingsPreviewBridge } from '@shopgate/engage/admin-preview/components';
// Imported via its module path rather than a settings barrel, to keep this module out of an import
// cycle - the settings types reach back into the "styles/theme" barrel, which exports this file.
import { getDefaultColorSchemeMode } from '@shopgate/engage/settings/selectors/appSettings';
import ActiveBreakpointProvider from './ActiveBreakpointProvider';
import { ColorSchemeContext, type ColorSchemeContextValue } from './ColorSchemeContext';
import { ThemeContext } from './ThemeContext';
import useMediaQuery from '../hooks/useMediaQuery';
import {
  COLOR_SCHEME_SYSTEM, type ThemeInternal, type ColorSchemeMode, type ColorSchemeName,
} from '../createTheme';

export { ColorSchemeContext, type ColorSchemeContextValue } from './ColorSchemeContext';
export { ThemeContext } from './ThemeContext';

/**
 * The ThemeProvider component provides the theme context to its children.
 */
const ThemeProvider = ({
  children,
  theme,
}: ThemeProviderProps) => {
  // The color schemes the active theme actually provides. createTheme() can be configured with only
  // a subset of the possible schemes (it defaults to just `light`), so this list and the validation
  // below are derived from the resolved theme rather than the full COLOR_SCHEME_NAMES tuple.
  // Otherwise the provider could expose and accept a scheme (e.g. `dark`) the theme doesn't style,
  // and setActiveColorScheme would flip the root selector to an unstyled scheme.
  const colorSchemes = useMemo(
    () => Object.keys(theme.colorSchemes) as ColorSchemeName[],
    [theme]
  );

  const defaultMode = useSelector(getDefaultColorSchemeMode);
  const prefersDarkColorScheme = useMediaQuery('(prefers-color-scheme: dark)');
  const systemColorScheme: ColorSchemeName = prefersDarkColorScheme ? 'dark' : 'light';

  const [pickedMode, setPersistedMode] = useLocalStorage<ColorSchemeMode>('persistedColorScheme', {
    // The frontend settings preview runs the app in an iframe on the shop origin. Persisting the
    // color scheme there would write the admin's preview choice into the visitor's own storage and
    // outlive the preview, so the scheme is kept in memory only while previewing.
    persist: !isFrontendSettingsAdminPreviewActive(),
  });

  // The mode the visitor picked wins, otherwise the configured one applies. Resolving that on every
  // render rather than seeding the storage with it keeps `system` following the operating system
  // and lets the preview apply the merchant's edits live.
  const mode = pickedMode ?? defaultMode;

  const activeColorScheme = useMemo(() => {
    const resolved = mode === COLOR_SCHEME_SYSTEM ? systemColorScheme : mode;

    if (colorSchemes.includes(resolved)) {
      return resolved;
    }

    logger.warn(`ThemeProvider: "${mode}" is not a supported color scheme.`);
    return theme.defaultColorScheme ?? null;
  }, [mode, systemColorScheme, colorSchemes, theme]);

  // What a picker can offer and what setMode accepts. 'system' is not a scheme the theme styles -
  // it resolves to one above - so it is added here rather than derived from the theme.
  const modes = useMemo<ColorSchemeMode[]>(
    () => [...colorSchemes, COLOR_SCHEME_SYSTEM],
    [colorSchemes]
  );

  // Wraps the raw storage setter, so an unsupported mode is rejected before it is persisted.
  // Setting null is allowed and clears the stored preference, which returns to the configured one.
  const setMode = useCallback<ColorSchemeContextValue['setMode']>((value) => {
    setPersistedMode((currentMode) => {
      // An updater is resolved against the effective mode, so it sees what `mode` exposes rather
      // than the empty storage behind it.
      const nextMode = typeof value === 'function' ? value(currentMode ?? defaultMode) : value;

      if (nextMode !== null && !modes.includes(nextMode)) {
        logger.warn(`ThemeProvider: "${nextMode}" is not a supported color scheme.`);
        return currentMode;
      }

      return nextMode;
    });
  }, [defaultMode, modes, setPersistedMode]);

  const colorSchemeContextValue = useMemo(() => ({
    mode,
    defaultMode,
    activeColorScheme,
    setMode,
    modes,
  }), [mode, defaultMode, activeColorScheme, modes, setMode]);

  useLayoutEffect(() => {
    if (!activeColorScheme) return;

    theme.setActiveColorScheme(activeColorScheme);
  }, [activeColorScheme, theme]);

  const styleSheets = useMemo(() => theme.generateStyleSheets(), [theme]);

  return (
    <ColorSchemeContext.Provider value={colorSchemeContextValue}>
      {isFrontendSettingsAdminPreviewActive() && <FrontendSettingsPreviewBridge />}
      <ThemeContext.Provider value={theme}>
        <ActiveBreakpointProvider>
          {children}
        </ActiveBreakpointProvider>
        <GlobalStyles styles={styleSheets} />
      </ThemeContext.Provider>
    </ColorSchemeContext.Provider>
  );
};

type ThemeProviderProps = {
  /**
   * The theme object to provide to the context.
   */
  theme: ThemeInternal;
  children: React.ReactNode;
}

export default memo(ThemeProvider);
