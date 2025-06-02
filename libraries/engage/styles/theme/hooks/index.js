import { useContext } from 'react';
import { ThemeContext } from '@shopgate/engage/styles/theme/providers/ThemeProvider';

// eslint-disable-next-line valid-jsdoc
/**
 * The useTheme hook
 */
export const useTheme = () => useContext(ThemeContext);
