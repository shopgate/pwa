import React, { createContext, memo } from 'react';
import PropTypes from 'prop-types';
import ActiveBreakpointProvider from './ActiveBreakpointProvider';

/** @typedef {import('../index').Theme} Theme */

/** @type {import('react').Context<Theme>} */
export const ThemeContext = createContext();

/**
 * The ThemeProvider component provides the theme context to its children.
 * @param {Object} props The component props
 * @param {Theme} props.theme The theme object to provide
 * @param {React.ReactNode} props.children The children to render within the provider
 * @returns {JSX.Element} The ThemeProvider component
 */
const ThemeProvider = ({ children, theme }) => (
  <ThemeContext.Provider value={theme}>
    <ActiveBreakpointProvider>
      {children}
    </ActiveBreakpointProvider>
  </ThemeContext.Provider>
);

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.shape().isRequired,
};

export default memo(ThemeProvider);
