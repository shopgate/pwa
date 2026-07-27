import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets/WidgetContext';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import {
  getAreAppSettingsHydrated,
  getProductGridColumns,
} from '@shopgate/engage/settings/selectors/appSettings';
import { WIDGET_ID } from './constants';

/**
 * Resolves the number of product columns for the ProductGrid, keyed by the
 * active breakpoint.
 *
 * Precedence:
 * - Once the app settings are hydrated from a source (admin sync / jsonp), they
 *   are authoritative everywhere.
 * - Before hydration, when the grid is rendered outside a page-builder widget
 *   (Category / Search / legacy Products widget), the single legacy
 *   `useWidgetSettings` scalar is honored flat across all breakpoints. This
 *   reproduces the old theme grid and preserves the merchant's configured value.
 * - Otherwise (inside a widget, pre-hydration) the built-in responsive default
 *   from the app settings is used ({ xs: 2, md: 4 }), so the inherited legacy
 *   `columns: 2` default no longer pins tablet to 2.
 * @returns {number} The resolved number of columns for the active breakpoint.
 */
export const useProductGridColumns = () => {
  // Widget-scope detection: the WidgetContext carries a `code` only when the
  // grid renders inside a page-builder widget (WidgetProvider).
  const { code: widgetCode } = useContext(WidgetContext);
  const isInsideWidget = Boolean(widgetCode);

  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  // The built-in default { xs: 2, md: 4 } until hydrated, the source value after.
  const appSettingsColumns = useSelector(getProductGridColumns);

  const { columns: legacyColumns } = useWidgetSettings(WIDGET_ID) || {};

  const breakpoints = useMemo(() => {
    // Only special case: pre-hydration, outside a widget, honor the legacy
    // scalar flat across every breakpoint.
    if (!areAppSettingsHydrated && !isInsideWidget && typeof legacyColumns === 'number') {
      return { xs: legacyColumns };
    }

    return appSettingsColumns;
  }, [areAppSettingsHydrated, isInsideWidget, legacyColumns, appSettingsColumns]);

  return useResponsiveValue(breakpoints);
};
