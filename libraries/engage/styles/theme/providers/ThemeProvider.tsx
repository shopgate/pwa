import {
  createContext, memo, useCallback, useMemo, useLayoutEffect,
} from 'react';
import useLocalStorage from '@shopgate/engage/core/hooks/useLocalStorage';
import { logger } from '@shopgate/engage/core/helpers';
import { GlobalStyles } from '@shopgate/engage/styles';
import { isFrontendSettingsAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { FrontendSettingsPreviewBridge } from '@shopgate/engage/admin-preview/components';
import ActiveBreakpointProvider from './ActiveBreakpointProvider';
import { ColorSchemeContext, type ColorSchemeContextValue } from './ColorSchemeContext';
import {
  COLOR_SCHEME_NAMES, type Theme, type ThemeInternal, type ColorSchemeName,
} from '../createTheme';

export { ColorSchemeContext, type ColorSchemeContextValue } from './ColorSchemeContext';

export const ThemeContext = createContext<Theme>({ } as Theme);

// Derived from the same tuple that ColorSchemeName is generated from, so the runtime list and the
// type can never drift apart.
const modes: ColorSchemeName[] = [...COLOR_SCHEME_NAMES];

/**
 * The ThemeProvider component provides the theme context to its children.
 */
const ThemeProvider = ({
  children,
  theme,
}: ThemeProviderProps) => {
  const [
    activeColorScheme,
    setActiveColorScheme,
  ] = useLocalStorage<ColorSchemeName>('persistedColorScheme', {
    initialValue: theme.defaultColorScheme,
    // The frontend settings preview runs the app in an iframe on the shop origin. Persisting the
    // color scheme there would write the admin's preview choice into the visitor's own storage and
    // outlive the preview, so the scheme is kept in memory only while previewing.
    persist: !isFrontendSettingsAdminPreviewActive(),
  });

  // Wraps the raw storage setter, so an unsupported mode is rejected before it is persisted.
  // Setting null is allowed and clears the stored preference.
  const setMode = useCallback<ColorSchemeContextValue['setMode']>((value) => {
    setActiveColorScheme((currentColorScheme) => {
      const nextColorScheme = typeof value === 'function' ? value(currentColorScheme) : value;

      if (nextColorScheme !== null && !modes.includes(nextColorScheme)) {
        logger.warn(`ThemeProvider: "${nextColorScheme}" is not a supported color scheme.`);
        return currentColorScheme;
      }

      return nextColorScheme;
    });
  }, [setActiveColorScheme]);

  const colorSchemeContextValue = useMemo(() => ({
    mode: activeColorScheme,
    setMode,
    modes,
  }), [activeColorScheme, setMode]);

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
