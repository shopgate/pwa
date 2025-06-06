import { useContext } from 'react';
import ThemeResourcesContext from '../contexts/ThemeResourcesContext';

/**
 * @typedef  {import('../contexts/ThemeResourcesContext').ThemeResourcesContextType
 * ThemeResourcesContextType}
 */

/**
 * @typedef {import('../contexts/ThemeResourcesContext').ThemeComponentMap ThemeComponentMap}
 */

/**
 * @typedef {import('../contexts/ThemeResourcesContext').ThemeWidgetMap ThemeWidgetMap}
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
 * @returns {ThemeComponentMap} Mapping object that contains multiple components provided by the
 * theme.
 * Key is the component name, value is the component
 */
export function useThemeComponents() {
  const { components } = useThemeResources();
  return components;
}

/**
 * Hook to access the widgets provided by the ThemeResourceContext
 * @param {string} [version='v1'] The version of the widget API to use. Defaults to 'v1'.
 * @returns {ThemeWidgetMap} Mapping object that contains all available widgets.
 * Key is the widget code, value is the widget component.
 */
export function useThemeWidgets(version = 'v1') {
  const { widgets } = useThemeResources();
  return widgets[version] ? widgets[version] : widgets.v1;
}
