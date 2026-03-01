import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';

/**
 * Returns the theme object.
 */
const useTheme = () => useContext(ThemeContext);

export default useTheme;
