import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';

// eslint-disable-next-line valid-jsdoc
/**
 * Returns the theme object.
 */
const useTheme = () => useContext(ThemeContext);

export default useTheme;
