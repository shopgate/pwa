import { useContext } from 'react';
import { ThemeComponentsContext } from '../contexts';

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access to the theme components context. The context provides access to different groups
 * of React components provided by the theme.
 */
export function useThemeComponents() {
  return useContext(ThemeComponentsContext);
}

