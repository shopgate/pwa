import { useContext } from 'react';
import { ColorSchemeContext } from '../providers/ColorSchemeContext';

/**
 * Provides access to the color scheme context.
 * @returns The color scheme context value, containing the current `mode`, a `setMode` function to
 * update it, and the list of `modes` the active theme actually provides.
 */
const useColorScheme = () => useContext(ColorSchemeContext);

export default useColorScheme;
