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
 * @returns {React.FC<any>}
 */
export const withThemeWidgets = WrappedComponent => function ThemeResourcesWrapper(props) {
  const themeWidgets = useThemeWidgets();

  return <WrappedComponent {...props} themeWidgets={themeWidgets} />;
};
