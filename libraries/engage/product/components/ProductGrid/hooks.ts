import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets/WidgetContext';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import { hasWebBridge } from '@shopgate/engage/core/helpers';
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

type BreakpointColumns = Partial<Record<Breakpoint, number>>;

/** Fewest columns on wide tablets, which the admin's screen sizes don't cover. */
const WIDE_SCREEN_MIN_COLUMNS = {
  lg: 4,
  xl: 5,
};

/**
 * Adds column counts for the wide tablet breakpoints that aren't set yet. They keep the merchant's
 * count for the largest configured screen size, but never fall below the wide screen minimum.
 * @param columns The column counts keyed by breakpoint.
 * @returns The column counts including the wide breakpoints.
 */
export const withWideScreenColumns = (columns: BreakpointColumns): BreakpointColumns => {
  const large = columns.md ?? columns.sm ?? columns.xs;

  if (large === undefined) {
    return columns;
  }

  const lg = columns.lg ?? Math.max(large, WIDE_SCREEN_MIN_COLUMNS.lg);

  return {
    ...columns,
    lg,
    xl: columns.xl ?? Math.max(lg, WIDE_SCREEN_MIN_COLUMNS.xl),
  };
};

/**
 * Resolves the number of product columns for the ProductGrid, keyed by the
 * active breakpoint.
 *
 * Precedence:
 * - Once the app settings are hydrated from a source (admin sync / jsonp), they
 *   are authoritative everywhere.
 * - Before that, outside a widget, the legacy column count only applies to phones.
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
    if (!areAppSettingsHydrated && !isInsideWidget && typeof legacyColumns === 'number') {
      return {
        ...appSettingsColumns,
        small: legacyColumns,
      };
    }

    return appSettingsColumns;
  }, [areAppSettingsHydrated, isInsideWidget, legacyColumns, appSettingsColumns]);

  const breakpoints = useMemo(
    () => {
      const mapped = (Object.entries(sizes) as [ScreenSize, number][]).reduce(
        (acc, [size, value]) => {
          acc[SCREEN_SIZE_BREAKPOINTS[size]] = value;
          return acc;
        },
        {} as BreakpointColumns
      );

      // The app settings only reach up to `md`. In website mode the viewport keeps growing
      // beyond that, so widen the grid instead of stretching the tiles.
      if (hasWebBridge() && !areAppSettingsHydrated) {
        const widest = mapped.md ?? mapped.sm ?? mapped.xs;

        if (typeof widest === 'number') {
          mapped.lg = mapped.lg ?? widest + 1;
          mapped.xl = mapped.xl ?? widest + 2;
        }
      }

      return withWideScreenColumns(mapped);
    },
    [sizes, areAppSettingsHydrated]
  );

  return useResponsiveValue(breakpoints) as number;
};
