import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  getAreAppSettingsHydrated,
  getImageSettings,
} from '../selectors/appSettings';
import {
  resolveImageServiceSettings,
  resolveProductImageSettings,
} from '../helpers';
import type {
  ResolvedImageServiceSettings,
  ResolvedProductImageSettings,
} from '../helpers';

/**
 * Resolves the resolutions and aspect ratio to request for every product image context, keyed by
 * `pdp`, `gallery` and `list`.
 *
 * Prefer giving ProductImage a `context` prop, which resolves its own settings. This hook is for
 * the places that render the plain Image component instead, e.g. the fullscreen gallery sliders,
 * which need its unwrapped mode.
 *
 * `ratio` may be null, which the Image component reads as "derive one from the largest
 * resolution" - pass it through rather than substituting a value.
 * @returns The resolved settings, keyed by context.
 */
export const useProductImageSettings = (): ResolvedProductImageSettings => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const imageSettings = useSelector(getImageSettings);

  return useMemo(
    () => resolveProductImageSettings(areAppSettingsHydrated, imageSettings),
    [areAppSettingsHydrated, imageSettings]
  );
};

/**
 * Resolves the quality and fill color for image service urls, in the shape getFullImageSource
 * takes as its third argument.
 *
 * Components rarely need this - the Image component already calls it and applies the result. It is
 * separate from useProductImageSettings because both values apply to every image the service
 * serves, not just product images.
 *
 * `fillColor` is a hash free hex, not a CSS color, and the transparency flag is a separate
 * `fillTransparent` - the image sources spell the pair differently.
 * @returns The image service settings.
 */
export const useImageServiceSettings = (): ResolvedImageServiceSettings => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const imageSettings = useSelector(getImageSettings);

  return useMemo(
    () => resolveImageServiceSettings(areAppSettingsHydrated, imageSettings),
    [areAppSettingsHydrated, imageSettings]
  );
};
