import { useContext } from 'react';
import { ThemeContext } from '@shopgate/pwa-common/context';

// eslint-disable-next-line valid-jsdoc
/**
 * Provides the theme API. This does not include the contexts.
 * @deprecated
 * Use `useThemeComponents()` instead.
 *
 * ```js
 * import { useThemeComponents } from '@shopgate/engage/core/hooks';
 * const { components } = useThemeComponents();
 * ```
 *
 * This hook will not expose components that can be imported directly from the `@shopgate/engage`
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
 */
export function useTheme() {
  // The contexts are left out in favor of other hooks.
  const { contexts, ...themeContext } = useContext(ThemeContext);
  return themeContext;
}
