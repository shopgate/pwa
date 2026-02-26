import React, {
  createContext, memo, useMemo, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '@shopgate/engage/core/hooks';

import ActiveBreakpointProvider from './ActiveBreakpointProvider';

/** @typedef {import('../index').Theme} Theme */

/** @type {import('react').Context<Theme>} */
export const ThemeContext = createContext();

/** @typedef {import('./ThemeProvider').ColorSchemeContextValue} ColorSchemeContextValue */

/** @type {import('react').Context<ColorSchemeContextValue>} */
export const ColorSchemeContext = createContext({
  mode: 'light',
  setMode: () => '',
});

/**
 * The ThemeProvider component provides the theme context to its children.
 * @param {Object} props The component props
 * @param {Theme} props.theme The theme object to provide
 * @param {React.ReactNode} props.children The children to render within the provider
 * @returns {JSX.Element} The ThemeProvider component
 */
const ThemeProvider = ({
  children,
  theme,
}) => {
  const [
    activeColorScheme,
    setActiveColorScheme,
  ] = useLocalStorage('persistedColorScheme', { initialValue: theme.defaultColorScheme });

  const colorSchemeContextValue = useMemo(() => ({
    mode: activeColorScheme,
    setMode: setActiveColorScheme,
  }), [activeColorScheme, setActiveColorScheme]);

  useLayoutEffect(() => {
    if (!activeColorScheme) return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(activeColorScheme);
  }, [activeColorScheme]);

  return (
    <ColorSchemeContext.Provider value={colorSchemeContextValue}>
      <ThemeContext.Provider value={theme}>
        <ActiveBreakpointProvider>
          {children}
        </ActiveBreakpointProvider>
      </ThemeContext.Provider>
    </ColorSchemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.shape().isRequired,
};

export default memo(ThemeProvider);
