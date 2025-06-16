import React from 'react';
import { RouterContext, RouteContext } from '@virtuous/react-conductor';

export { RouterContext };
export { RouteContext };

/**
 * @deprecated
 * Use `ThemeResourcesContext` instead.
 *
 * This context will NOT expose components that can be imported directly from the `@shopgate/engage`
 * package (see list below). All other components can be accessed through the `components` property.
 *
 * ```js
 * import { ThemeResourcesContext } from '@shopgate/engage/core/contexts';
 * ```
 *
 * To access the `components` property value use the `useThemeComponents()` hook:
 *
 * ```js
 * import { useThemeComponents } from '@shopgate/engage/core/hooks';
 * const { ProductCard } = useThemeComponents();
 * ```
 *
 * Or inject the components context value using the HOC:
 *
 * ```js
 * import { withThemeComponents } from '@shopgate/engage/core/hocs';
 *
 * function MyComponent({ themeComponents }) {
 *   const { ProductCard } = themeComponents;
 *   return <ProductCard />;
 * }
 *
 * export default withThemeComponents(MyComponent);
 * ```
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
 */
export const ThemeContext = React.createContext({
  /** @deprecated */
  Drawer: null,
  /** @deprecated */
  ProductSlider: null,
  /** @deprecated */
  View: null,
  /** @deprecated */
  TextOption: null,
  /** @deprecated */
  SelectOption: null,
  /** @deprecated */
  PriceDifference: null,
  AppBar: null,
  ProductCard: null,
  ProductGrid: null,
  ProductHeader: null,
  contexts: {
    /** @deprecated */
    ProductContext: null,
  },
});

/**
 * @deprecated
 * Use `useThemeComponents()` or `withThemeComponents()` instead.
 *
 * Hook and HOC will NOT expose components that can be imported directly from the `@shopgate/engage`
 * package (see list below).
 *
 * ```js
 * import { useThemeComponents } from '@shopgate/engage/core/hooks';
 * const { ProductCard } = useThemeComponents();
 * ```
 *
 * Or inject the full context value using the HOC:
 *
 * ```js
 * import { withThemeComponents } from '@shopgate/engage/core/hocs';
 *
 * function MyComponent({ themeComponents }) {
 *   const { ProductCard } = themeComponents;
 *   return <ProductCard />;
 * }
 *
 * export default withThemeComponents(MyComponent);
 *````
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
 */
export const Theme = ThemeContext.Consumer;
