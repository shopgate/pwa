import { useContext } from 'react';
import { ColorSchemeContext } from '../providers/ColorSchemeContext';

/**
 * Returns the currently selected color scheme and a function to update it.
 * @returns An object containing the current color scheme and a function to update it.
 */
const useColorScheme = () => useContext(ColorSchemeContext);

export default useColorScheme;
