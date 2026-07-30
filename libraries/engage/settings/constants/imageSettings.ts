// Imported via its module path rather than the "core" barrel, since that barrel pulls in
// getFullImageSource which reads these settings back, and would create a circular import.
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
 * The key the legacy image settings live under in the theme configuration.
 */
export const LEGACY_IMAGE_SETTINGS_KEY = 'AppImages';

/**
 * Compression quality used when the theme configuration does not provide one.
 */
const FALLBACK_IMAGE_QUALITY = 75;

/**
 * The compression quality passed to the image service.
 *
 * The theme configuration is the only way to configure this - it is deliberately absent from the
 * appSettings schema, so it stays out of the public API until there is a concept for configuring
 * it properly.
 *
 * Safe to read once at module scope: the theme config is inlined into the bundle at build time,
 * the app settings never carry a quality, and ThemeConfigResolver only rewrites "$." string
 * references - a numeric value passes through it unchanged.
 */
export const IMAGE_QUALITY: number = (
  (getThemeSettings(LEGACY_IMAGE_SETTINGS_KEY) ?? {}) as { quality?: number }
).quality ?? FALLBACK_IMAGE_QUALITY;

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
