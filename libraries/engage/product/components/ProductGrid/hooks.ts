import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets/WidgetContext';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import type { Breakpoint } from '@shopgate/engage/styles/theme';
import {
  getAreAppSettingsHydrated,
  getProductGridColumns,
} from '@shopgate/engage/settings/selectors/appSettings';
import { SCREEN_SIZE_BREAKPOINTS } from '@shopgate/engage/settings/constants/appSettings';
import type {
  ScreenSize,
  ProductColumns,
} from '@shopgate/engage/settings/types/appSettings';
import { WIDGET_ID } from './constants';

/**
 * Resolves the number of product columns for the ProductGrid, keyed by the
 * active breakpoint.
 *
 * Precedence:
 * - Once the app settings are hydrated from a source (admin sync / jsonp), they
 *   are authoritative everywhere.
 * @returns The resolved number of columns for the active breakpoint.
 */
export const useProductGridColumns = (): number => {
  // Widget-scope detection: the WidgetContext carries a `code` only when the
  // grid renders inside a page-builder widget (WidgetProvider).
  const { code: widgetCode } = useContext(WidgetContext);
  const isInsideWidget = Boolean(widgetCode);

  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  // The built-in default { small: 2, large: 4 } until hydrated, the source value after.
  const appSettingsColumns = useSelector(getProductGridColumns);

  const { columns: legacyColumns } =
    (useWidgetSettings(WIDGET_ID) || {}) as { columns?: number };

  const sizes = useMemo<ProductColumns>(() => {
    // Only special case: pre-hydration, outside a widget, honor the legacy
    // scalar flat across every breakpoint.
    if (!areAppSettingsHydrated && !isInsideWidget && typeof legacyColumns === 'number') {
      return { small: legacyColumns };
    }

    return appSettingsColumns;
  }, [areAppSettingsHydrated, isInsideWidget, legacyColumns, appSettingsColumns]);

  const breakpoints = useMemo<Partial<Record<Breakpoint, number>>>(
    () => (Object.entries(sizes) as [ScreenSize, number][]).reduce(
      (acc, [size, value]) => {
        acc[SCREEN_SIZE_BREAKPOINTS[size]] = value;
        return acc;
      },
      {} as Partial<Record<Breakpoint, number>>
    ),
    [sizes]
  );

  return useResponsiveValue(breakpoints) as number;
};
