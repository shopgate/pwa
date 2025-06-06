import { useContext } from 'react';
import ThemeResourcesContext from '../contexts/ThemeResourcesContext';

/**
 * @typedef  {import('../contexts/ThemeResourcesContext').ThemeResourcesContextType
 * ThemeResourcesContextType}
 */

/**
 * @typedef {ThemeResourcesContextType['components']} ThemeComponentsType
 */

/**
 * @typedef {ThemeResourcesContextType['widgets']} ThemeWidgetsType
 */

/**
 * Hook to access to the ThemeResourceContext. The context provides access to different groups
 * of React components provided by the active theme.
 * @returns {ThemeResourcesContextType} Value of the ThemeResourceContext
 */
export function useThemeResources() {
  return useContext(ThemeResourcesContext);
}

/**
 * Hook to access the components provided by the ThemeResourceContext
 * @returns {ThemeComponentsType} Mapping object that contains multiple components provided by the
 * theme.
 * Key is the component name, value is the component
 */
export function useThemeComponents() {
  const { components } = useThemeResources();
  return components;
}

/**
 * Hook to access the widgets provided by the ThemeResourceContext
 * @returns {ThemeWidgetsType} Mapping object that contains all available widgets.
 * Key is the widget code, value is the widget component.
 */
export function useThemeWidgets() {
  const { widgets } = useThemeResources();
  return widgets;
}

