import { useContext } from 'react';
import ThemeResourcesContext from '../contexts/ThemeResourcesContext';

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access to the ThemeResourceContext. The context provides access to different groups
 * of React components provided by the active theme.
 * @returns Value of the ThemeResourceContext
 */
export function useThemeResources() {
  return useContext(ThemeResourcesContext);
}

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the components provided by the ThemeResourceContext
 * @returns Mapping object that contains multiple components provided by the theme.
 * Key is the component name, value is the component
 */
export function useThemeComponents() {
  const { components } = useThemeResources();
  return components;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the widgets provided by the ThemeResourceContext
 * @returns Mapping object that contains all available widgets. Key is the widget code, value is
 * the widget component.
 */
export function useThemeWidgets() {
  const { widgets } = useThemeResources();
  return widgets;
}

