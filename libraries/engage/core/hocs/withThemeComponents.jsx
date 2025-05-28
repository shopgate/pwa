import React from 'react';
import { useThemeComponents } from '@shopgate/engage/core/hooks';

/**
 * HOC that injects the value of the ThemeComponents context as a prop called `themeComponents`.
 * The context provides access to different groups of React components provided by the theme.
 * @param {React.ComponentType<any>} WrappedComponent The wrapped component
 * @returns {React.FC<any>}
 */
export const withThemeComponents = WrappedComponent => function ThemeComponentsWrapper(props) {
  const themeComponents = useThemeComponents();

  return <WrappedComponent {...props} themeComponents={themeComponents} />;
};

