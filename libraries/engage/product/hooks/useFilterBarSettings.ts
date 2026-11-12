import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  getAreAppSettingsHydrated,
  getProductFilterBarSettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { ProductFilterBarSettings } from '@shopgate/engage/settings/types/appSettings';

const FILTER_BAR_WIDGET_ID = '@shopgate/engage/components/FilterBar';

/**
 * Resolves the settings of the bar with sort and filter. Until the app settings are hydrated,
 * hiding on scroll follows the legacy widget setting.
 * @returns The filter bar settings.
 */
const useFilterBarSettings = (): ProductFilterBarSettings => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const settings = useSelector(getProductFilterBarSettings);

  const { hideOnScroll: legacyHideOnScroll = true } =
    (useWidgetSettings(FILTER_BAR_WIDGET_ID) || {}) as { hideOnScroll?: boolean };

  return useMemo(() => (areAppSettingsHydrated ? settings : {
    ...settings,
    hideOnScroll: legacyHideOnScroll,
  }), [areAppSettingsHydrated, legacyHideOnScroll, settings]);
};

export default useFilterBarSettings;
