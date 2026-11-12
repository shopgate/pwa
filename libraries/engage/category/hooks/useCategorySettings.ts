import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { appConfig } from '@shopgate/engage';
import {
  getAreAppSettingsHydrated,
  getCategorySettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { CategorySettings } from '@shopgate/engage/settings/types/appSettings';

/**
 * Resolves how categories are presented on the browse page and on category pages. Until the app
 * settings are hydrated, the "show all products" entry follows the legacy app config.
 * @returns The category settings.
 */
const useCategorySettings = (): CategorySettings => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const settings = useSelector(getCategorySettings);

  return useMemo(() => (areAppSettingsHydrated ? settings : {
    ...settings,
    showAllProducts: Boolean(
      (appConfig as { categoriesShowAllProducts?: boolean }).categoriesShowAllProducts
    ),
  }), [areAppSettingsHydrated, settings]);
};

export default useCategorySettings;
