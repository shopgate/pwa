import { useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  getAreAppSettingsHydrated,
  getCategorySettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type { CategorySettings } from '@shopgate/engage/settings/types/appSettings';

/**
 * Resolves how categories are presented. Until the app settings are hydrated, the "show all
 * products" entry follows the legacy app config.
 * @returns The category settings.
 */
const useCategorySettings = (): CategorySettings => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const settings = useSelector(getCategorySettings);

  if (!areAppSettingsHydrated) {
    return {
      ...settings,
      showAllProducts: Boolean(
        (appConfig as { categoriesShowAllProducts?: boolean }).categoriesShowAllProducts
      ),
    };
  }

  return settings;
};

export default useCategorySettings;
