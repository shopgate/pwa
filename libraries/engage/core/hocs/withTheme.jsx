import React from 'react';
import { ThemeContext } from '@shopgate/pwa-common/context';

/**
 * Gets the context props for the wrapped component.
 * @param {Object} context The context.
 * @param {string|null} prop The optional prop name.
 * @returns {Object}
 */
const getInjectedProps = (context, prop) => {
  if (!prop) {
    return context;
  }

  return {
    [prop]: { ...context },
  };
};

/**
 * Injects the theme API into the desired component. This does not include the contexts.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options={}] Options for the HOC.
 * @param {string} [options.prop] An optional prop name to inject the theme properties.
 * @deprecated
 *
 * Use `withThemeComponents()` instead.
 * ```js
 * import { withThemeComponents } from '@shopgate/engage/core/hocs';
 *
 * function MyComponent({ themeComponents }) {
 *   const { ProductCard } = themeComponents;
 *   return <ProductCard />;
 * }
 * ````
 * This HOC will NOT expose components that can be imported directly from the `@shopgate/engage`
 * package (see list below).
 *
 * ---
 * Use these updated imports instead of deprecated context values:
 *
 * ```js
 * // Deprecated: Drawer → use SheetDrawer
 * import { SheetDrawer } from '@shopgate/engage/components';
 *
 * // Deprecated: PriceDifference → use PriceDifference
 * import { PriceDifference } from '@shopgate/engage/product/components';
 *
 * // Deprecated: ProductSlider → use ProductSlider
 * import { ProductSlider } from '@shopgate/engage/product/components';
 *
 * // Deprecated: SelectOption → use SelectOption
 * import { SelectOption } from '@shopgate/engage/product/components';
 *
 * // Deprecated: TextOption → use TextOption
 * import { TextOption } from '@shopgate/engage/product/components';
 *
 * // Deprecated: View → use View
 * import { View } from '@shopgate/engage/components'
 *
 * // Deprecated: { contexts: { ProductContext }} → use ProductContext
 * import { ProductContext } from '@shopgate/engage/product/contexts';
 * ```
 * @returns {JSX.Element}
 */
export function withTheme(WrappedComponent, options = {}) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX.Element}
   */
  const WithTheme = props => (
    <ThemeContext.Consumer>
      {({ contexts, ...themeContext }) => ( // The contexts are left out in favor of other HOCs.
        <WrappedComponent {...getInjectedProps(themeContext, options.prop)} {...props} />
      )}
    </ThemeContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithTheme.displayName = `WithTheme(${displayName})`;

  return WithTheme;
}
