import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// Imported via its module path rather than the "core/hooks" barrel, to keep this out of the
// import cycle the barrel pulls in.
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import {
  getAreAppSettingsHydrated,
  getImageSettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import { DEFAULT_SHOW_INNER_SHADOW } from '@shopgate/engage/settings/constants/imageSettings';
import { WIDGET_ID } from './constants';

/**
 * Resolves whether product images render with an inset shadow.
 * @returns Whether to render the shadow.
 */
export const useProductImageShadow = (): boolean => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const { product } = useSelector(getImageSettings);
  // The widget configuration can carry a value from a page builder widget instance, a page config
  // or the global theme settings.
  const { showInnerShadow: legacy } =
    (useWidgetSettings(WIDGET_ID) || {}) as { showInnerShadow?: boolean };

  return useMemo(() => {
    if (areAppSettingsHydrated) {
      return product.showInnerShadow;
    }

    // Until a source hydrates the app settings the legacy widget configuration wins, and failing
    // that the built-in default, which is derived from the legacy app config flag so that each
    // theme keeps its own behavior.
    return legacy ?? DEFAULT_SHOW_INNER_SHADOW;
  }, [areAppSettingsHydrated, product.showInnerShadow, legacy]);
};
