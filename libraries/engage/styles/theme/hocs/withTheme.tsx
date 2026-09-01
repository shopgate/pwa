import type { ComponentType } from 'react';
import type { Theme } from '../createTheme';
import useTheme from '../hooks/useTheme';

/**
 * Props injected by the `withTheme` HOC.
 */
export interface WithThemeProps {
  /** The active styling theme (same object returned by `useTheme()`). */
  theme: Theme;
}

/**
 * Injects the styling theme as a `theme` prop into the wrapped component.
 *
 * Intended for legacy class components that cannot use the `useTheme` hook.
 * For function components, prefer the `useTheme` hook instead.
 *
 * @param WrappedComponent The component to inject the theme into.
 * @returns The wrapped component with `theme` supplied automatically.
 */
export function withTheme<P extends WithThemeProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<Omit<P, keyof WithThemeProps>> {
  /**
   * The actual HOC.
   * @param props The component props.
   * @returns The wrapped component with the theme injected.
   */
  const WithTheme = (props: Omit<P, keyof WithThemeProps>) => {
    const theme = useTheme();
    return <WrappedComponent {...(props as P)} theme={theme} />;
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithTheme.displayName = `WithTheme(${displayName})`;

  return WithTheme;
}

export default withTheme;
