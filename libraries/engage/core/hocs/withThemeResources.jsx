import React from 'react';
import {
  useThemeResources,
  useThemeComponents,
  useThemeWidgets,
} from '@shopgate/engage/core/hooks';

/**
 * HOC that injects the value of the ThemeResources context as a prop called `themeResources`.
 * The context provides access to different groups of React components provided by the theme.
 * @param {React.ComponentType<any>} WrappedComponent The wrapped component
 * @returns {React.FC<any>}
 */
export const withThemeResources = WrappedComponent => function ThemeResourcesWrapper(props) {
  const themeResources = useThemeResources();

  return <WrappedComponent {...props} themeResources={themeResources} />;
};

/**
 * HOC that injects the `components` value of the ThemeResources context as a prop called
 * `themeComponents`.
 * @param {React.ComponentType<any>} WrappedComponent The wrapped component
 * @returns {React.FC<any>}
 */
export const withThemeComponents = WrappedComponent => function ThemeResourcesWrapper(props) {
  const themeComponents = useThemeComponents();

  return <WrappedComponent {...props} themeComponents={themeComponents} />;
};

/**
 * HOC that injects the `widgets` value of the ThemeResources context as a prop called
 * `themeWidgets`.
 * @param {React.ComponentType<any>} WrappedComponent The wrapped component
 * @param {Object} [options={}] Options for the HOC.
 * @param {"v1"|"v2"} [options.version='v1'] The API version of the widgets to return. Can be 'v1'
 * or 'v2'.
 * @returns {React.FC<any>}
 */
export const withThemeWidgets = (
  WrappedComponent,
  options = {}
) => function ThemeResourcesWrapper(props) {
  const { version = 'v1' } = options;
  const themeWidgets = useThemeWidgets(version);

  return <WrappedComponent {...props} themeWidgets={themeWidgets} />;
};
