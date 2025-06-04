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
 * @param {"v1"|"v2"} [version='v1'] The API version of the widgets to return. Can be 'v1' or 'v2'.
 * @returns Mapping object that contains all available widgets. Key is the widget code, value is
 * the widget component.
 */
export function useThemeWidgets(version = 'v1') {
  const { widgets } = useThemeResources();
  return widgets[version] ? widgets[version] : widgets.v1;
}

