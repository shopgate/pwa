import React, { createContext, memo } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {import('..').createTheme} CreateThemeFn
 * @typedef {ReturnType<CreateThemeFn>} ThemeContext
 */

/** @type {import('react').Context<ThemeContext>} */
export const ThemeContext = createContext();

/**
 * The ThemeProvider component provides the theme context to its children.
 * @param {Object} props THe component props
 * @param {Object} props.theme The theme object to provide
 * @param {React.ReactNode} props.children The children to render within the provider
 * @returns {JSX.Element} The ThemeProvider component
 */
const ThemeProvider = ({ children, theme }) => (
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
);

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.shape().isRequired,
};

export default memo(ThemeProvider);
