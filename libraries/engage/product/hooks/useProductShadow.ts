import { useSelector } from 'react-redux';
import { createShadowForSize } from '@shopgate/engage/styles';
import {
  getAreAppSettingsHydrated,
  getProductCardShadow,
  getProductTileShadow,
} from '@shopgate/engage/settings/selectors/appSettings';

// The card shadow from before it became configurable. Honoured until the app settings are
// hydrated, so an app whose settings source is not configured keeps the shadow it always had
// instead of falling back to the `none` the admin needs as the default of a pruned field.
const LEGACY_CARD_SHADOW = '0 4px 8px rgba(0,0,0,0.16)';

/**
 * Resolves the box-shadow of the product card surface (sliders, relations, live shopping).
 * @returns A box-shadow value.
 */
export const useProductCardShadow = (): string => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const { size, color } = useSelector(getProductCardShadow);

  if (!areAppSettingsHydrated) {
    return LEGACY_CARD_SHADOW;
  }

  return createShadowForSize(size, color);
};

/**
 * Resolves the box-shadow of the product tile surface (product grid). Tiles never had a shadow
 * before it became configurable, so the `none` default already reproduces the legacy look and
 * needs no pre-hydration special case.
 * @returns A box-shadow value.
 */
export const useProductTileShadow = (): string => {
  const { size, color } = useSelector(getProductTileShadow);

  return createShadowForSize(size, color);
};
