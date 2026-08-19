import { useContext } from 'react';
import { ColorSchemeContext } from '../providers/ColorSchemeContext';

/**
 * Provides access to the color scheme context.
 * @returns The color scheme context value, containing the current `mode`, a `setMode` function to
 * update it, and the `modes` that can be set.
 */
const useColorScheme = () => useContext(ColorSchemeContext);

export default useColorScheme;
