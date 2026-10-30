import {
  memo, useCallback, useEffect, useMemo, useLayoutEffect,
} from 'react';
import { useSelector } from 'react-redux';
import useLocalStorage from '@shopgate/engage/core/hooks/useLocalStorage';
import { logger } from '@shopgate/engage/core/helpers';
import { GlobalStyles } from '@shopgate/engage/styles';
import { isFrontendSettingsAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { FrontendSettingsPreviewBridge } from '@shopgate/engage/admin-preview/components';
// Imported via its module path rather than a settings barrel, to keep this module out of an import
// cycle - the settings types reach back into the "styles/theme" barrel, which exports this file.
import { getCanSelectColorScheme, getDefaultColorSchemeMode } from '@shopgate/engage/settings/selectors/appSettings';
import { getIsColorSchemeSelectionEnabled } from '@shopgate/engage/development/selectors';
import ActiveBreakpointProvider from './ActiveBreakpointProvider';
import { ColorSchemeContext, type ColorSchemeContextValue } from './ColorSchemeContext';
import { ThemeContext } from './ThemeContext';
import { useMatchMedia } from '../hooks/useMediaQuery';
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

  const configuredMode = useSelector(getDefaultColorSchemeMode);
  const isColorSchemeSelectable = useSelector(getCanSelectColorScheme);

  // The development setting simulates the `selectable` appearance rather than lifting the gate on
  // its own, so a development build resolves the scheme along the very same path a shop does. It is
  // false outside development builds, where the merchant's setting stays the only input.
  const isSelectionEnabledForDevelopment = useSelector(getIsColorSchemeSelectionEnabled);

  // Whether the merchant lets visitors choose. A binding `light` or `dark` rules a pick out, so one
  // left over from when selecting still was allowed does not keep overriding it - and with it the
  // operating system, which only ever reaches the scheme through a `system` pick.
  const canSelectColorScheme = isColorSchemeSelectable || isSelectionEnabledForDevelopment;
  const defaultMode = isSelectionEnabledForDevelopment ? COLOR_SCHEME_SYSTEM : configuredMode;
  const prefersDarkColorScheme = useMatchMedia('(prefers-color-scheme: dark)');
  const systemColorScheme: ColorSchemeName = prefersDarkColorScheme ? 'dark' : 'light';

  const [pickedMode, setPersistedMode] = useLocalStorage<ColorSchemeMode>('persistedColorScheme', {
    // The frontend settings preview runs the app in an iframe on the shop origin. Persisting the
    // color scheme there would write the admin's preview choice into the visitor's own storage and
    // outlive the preview, so the scheme is kept in memory only while previewing.
    persist: !isFrontendSettingsAdminPreviewActive(),
  });

  // The preview forces a scheme through the same setter to show the admin either appearance, which
  // has to work regardless of what the previewed settings configure. It stays out of
  // `canSelectColorScheme`, so the previewed shop offers a picker exactly where visitors get one.
  const isPickApplied = canSelectColorScheme || isFrontendSettingsAdminPreviewActive();

  // The mode the visitor picked wins where it applies, otherwise the configured one does. Resolving
  // that on every render rather than seeding the storage with it keeps `system` following the
  // operating system and lets the preview apply the merchant's edits live.
  const mode = (isPickApplied && pickedMode) || defaultMode;

  const resolvedColorScheme = useMemo<ColorSchemeName>(
    () => (mode === COLOR_SCHEME_SYSTEM ? systemColorScheme : mode),
    [mode, systemColorScheme]
  );

  const isSupportedColorScheme = colorSchemes.includes(resolvedColorScheme);

  const activeColorScheme = isSupportedColorScheme
    ? resolvedColorScheme
    : (theme.defaultColorScheme ?? null);

  useEffect(() => {
    if (isSupportedColorScheme) return;

    logger.warn(`ThemeProvider: "${resolvedColorScheme}" is not a supported color scheme.`);
  }, [isSupportedColorScheme, resolvedColorScheme]);

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
      // An updater is resolved the same way `mode` is, so it sees what the context exposes rather
      // than the storage behind it - which holds no value yet, or one that is currently ignored.
      const effectiveMode = (isPickApplied && currentMode) || defaultMode;
      const nextMode = typeof value === 'function' ? value(effectiveMode) : value;

      if (nextMode !== null && !modes.includes(nextMode)) {
        logger.warn(`ThemeProvider: "${nextMode}" is not a supported color scheme.`);
        return currentMode;
      }

      return nextMode;
    });
  }, [defaultMode, isPickApplied, modes, setPersistedMode]);

  const colorSchemeContextValue = useMemo(() => ({
    mode,
    defaultMode,
    activeColorScheme,
    canSelectColorScheme,
    setMode,
    modes,
  }), [mode, defaultMode, activeColorScheme, canSelectColorScheme, modes, setMode]);

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
