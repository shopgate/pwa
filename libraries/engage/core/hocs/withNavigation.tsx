import type { ComponentType } from 'react';
import { useNavigation, type Navigation } from '../hooks/useNavigation';

/**
 * Navigation functions injected by the `withNavigation` HOC.
 */
export interface WithNavigationProps {
  historyPush: Navigation['push'];
  historyPop: Navigation['pop'];
  historyReplace: Navigation['replace'];
  historyReset: Navigation['reset'];
  historyUpdate: Navigation['update'];
}

/**
 * Options of the `withNavigation` HOC.
 */
export interface WithNavigationOptions<K extends string = string> {
  /** Bundles the navigation functions within a single prop with this name. */
  prop?: K;
}

/**
 * Injects navigation functions into the desired component.
 *
 * Intended for legacy class components that cannot use the `useNavigation` hook.
 * For function components, prefer the `useNavigation` hook instead.
 *
 * @param WrappedComponent The react component to wrap.
 * @param options Optional options.
 * @param options.prop An optional prop name to inject the navigation properties.
 * @returns The wrapped component with the navigation functions supplied automatically.
 */
export function withNavigation<P extends WithNavigationProps>(
  WrappedComponent: ComponentType<P>,
  options?: WithNavigationOptions<never>
): ComponentType<Omit<P, keyof WithNavigationProps>>;
export function withNavigation<P extends Record<K, WithNavigationProps>, K extends string>(
  WrappedComponent: ComponentType<P>,
  options: Required<WithNavigationOptions<K>>
): ComponentType<Omit<P, K>>;
export function withNavigation(
  WrappedComponent: ComponentType<object>,
  options: WithNavigationOptions = {}
) {
  /**
   * The actual HOC.
   * @param props The component props.
   * @returns The wrapped component with the navigation functions injected.
   */
  const WithNavigation = (props: object) => {
    const {
      push, pop, replace, reset, update,
    } = useNavigation();

    const navigation: WithNavigationProps = {
      historyPush: push,
      historyPop: pop,
      historyReplace: replace,
      historyReset: reset,
      historyUpdate: update,
    };

    const injected = options.prop ? { [options.prop]: navigation } : navigation;

    return <WrappedComponent {...injected} {...props} />;
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithNavigation.displayName = `WithNavigation(${displayName})`;

  return WithNavigation;
}
