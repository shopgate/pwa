import { useContext } from 'react';
import { ColorSchemeContext } from '../providers/ThemeProvider';

// eslint-disable-next-line valid-jsdoc
/**
 * Returns the currently selected color scheme and a function to update it.
 */
const useColorScheme = () => useContext(ColorSchemeContext);

export default useColorScheme;
