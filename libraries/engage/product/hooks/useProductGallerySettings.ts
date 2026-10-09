import { useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { PRODUCT_GALLERY_PAGINATIONS } from '@shopgate/engage/settings/constants/appSettings';
import {
  getAreAppSettingsHydrated,
  getProductGallerySettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type {
  ProductGalleryPagination,
  ProductGallerySettings,
} from '@shopgate/engage/settings/types/appSettings';

/**
 * Checks whether a value is a supported pagination of the product gallery.
 * @param value The value to check.
 * @returns Whether the value is a supported pagination.
 */
const isPagination = (value: unknown): value is ProductGalleryPagination => (
  PRODUCT_GALLERY_PAGINATIONS.includes(value as ProductGalleryPagination)
);

/**
 * Resolves the settings of the image gallery of the product page. Until the app settings are
 * hydrated, the pagination follows the legacy app config.
 * @returns The product gallery settings.
 */
const useProductGallerySettings = (): ProductGallerySettings => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const settings = useSelector(getProductGallerySettings);

  if (!areAppSettingsHydrated) {
    const { pdpImageSliderPaginationType } =
      appConfig as { pdpImageSliderPaginationType?: unknown };

    if (isPagination(pdpImageSliderPaginationType)) {
      return {
        ...settings,
        pagination: pdpImageSliderPaginationType,
      };
    }
  }

  return settings;
};

export default useProductGallerySettings;
