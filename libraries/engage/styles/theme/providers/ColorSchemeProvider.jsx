import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const ColorSchemeContext = createContext({
  mode: 'light',
  setMode: () => '',
});

/**
 * @param {Object} props The component props
 * @param {string} props.colorScheme The initial color scheme (e.g., 'light' or 'dark')
 * @param {React.ReactNode} props.children The children to render within the provider
 * @returns {JSX.Element} The provider component
 */
const ColorSchemeProvider = ({
  children,
  colorScheme: initialColorScheme,
}) => {
  const [mode, setMode] = useState(initialColorScheme);

  const contextValue = useMemo(() => ({
    mode,
    setMode,
  }), [mode]);

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

ColorSchemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  colorScheme: PropTypes.string.isRequired,
};

export default ColorSchemeProvider;
