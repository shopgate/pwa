// Imported via its module path rather than the "core" barrel, since that barrel pulls in
// getFullImageSource which reads these settings back, and would create a circular import.
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getThemeSettings } from '@shopgate/engage/core/config/getThemeSettings';
import type { ProductImageContext } from '../types/appSettings';

/**
 * The base widths every product image context requests from the image service, ordered ascending.
 *
 * Each array is a progressive loading ladder, not a responsive pick: the Image component loads the
 * second to last entry first as a low resolution preview and the last entry as the actual source.
 * Heights are derived from the configured aspect ratio, so at the default 1:1 these reproduce the
 * legacy AppImages resolutions exactly.
 */
export const PRODUCT_IMAGE_BASE_WIDTHS: Record<ProductImageContext, number[]> = {
  list: [440],
  pdp: [440, 1024],
  gallery: [1024, 2048],
};

/**
 * The largest width or height that may be requested from the image service.
 *
 * A configured aspect ratio is applied to the base widths, so an extreme one would otherwise ask for
 * dimensions the service rejects. Comfortably above the largest base width in use.
 */
export const MAX_IMAGE_DIMENSION = 4096;

/**
 * The key the legacy image settings live under in the theme configuration.
 */
export const LEGACY_IMAGE_SETTINGS_KEY = 'AppImages';

/**
 * Compression quality used when the theme configuration does not provide one.
 */
const FALLBACK_IMAGE_QUALITY = 75;

/**
 * The compression quality passed to the image service when nothing is configured.
 *
 * Derived from the theme configuration, so an app whose settings never carry a quality keeps the
 * one its theme configured.
 *
 * Safe to read once at module scope: the theme config is inlined into the bundle at build time.
 */
export const DEFAULT_IMAGE_QUALITY: number = (
  (getThemeSettings(LEGACY_IMAGE_SETTINGS_KEY) ?? {}) as { quality?: number }
).quality ?? FALLBACK_IMAGE_QUALITY;

/**
 * Whether product images get an inset shadow when nothing is configured.
 *
 * Derived from the legacy app config flag rather than hardcoded: that flag is inverted, and its
 * default differs per theme - gmd hides the shadow, ios11 shows it - so a fixed value here would
 * flip the shadow for one of them.
 *
 * Safe to read once at module scope for the same reason as DEFAULT_IMAGE_QUALITY: the app config is
 * inlined into the bundle at build time.
 */
export const DEFAULT_SHOW_INNER_SHADOW =
  !(appConfig as { hideProductImageShadow?: boolean }).hideProductImageShadow;

/**
 * Fill color used when no valid one is configured. Already in Thumbor's expected format - a
 * hexadecimal RGB expression without the leading "#".
 */
export const DEFAULT_IMAGE_FILL_COLOR = 'FFFFFF';

/**
 * Whether transparent areas of the source image are filled too, when nothing is configured.
 * Matches what the legacy "FFFFFF,1" value expressed.
 */
export const DEFAULT_IMAGE_FILL_TRANSPARENT = true;
