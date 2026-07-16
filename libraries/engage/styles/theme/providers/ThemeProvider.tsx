import {
  createContext, memo, useMemo, useLayoutEffect,
} from 'react';
import useLocalStorage from '@shopgate/engage/core/hooks/useLocalStorage';
import { GlobalStyles } from '@shopgate/engage/styles';
import { isFrontendSettingsAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { FrontendSettingsPreviewBridge } from '@shopgate/engage/admin-preview/components';
import ActiveBreakpointProvider from './ActiveBreakpointProvider';
import { type Theme, type ThemeInternal, type ColorSchemeName } from '../createTheme';

export interface ColorSchemeContextValue {
  /**
   * The current color scheme (e.g., 'light' or 'dark')
   */
  mode: ColorSchemeName | null;
  /**
   * Function to update the color scheme
   */
  setMode: React.Dispatch<React.SetStateAction<ColorSchemeName | null>>;
}

export const ThemeContext = createContext<Theme>({ } as Theme);

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  mode: 'light',
  setMode: () => '',
});

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
  ] = useLocalStorage<ColorSchemeName>('persistedColorScheme', { initialValue: theme.defaultColorScheme });

  const colorSchemeContextValue = useMemo(() => ({
    mode: activeColorScheme,
    setMode: setActiveColorScheme,
  }), [activeColorScheme, setActiveColorScheme]);

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
