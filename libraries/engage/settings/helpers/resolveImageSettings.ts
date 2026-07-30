// Imported via its module path rather than the "core" barrel, since that barrel pulls in
// getFullImageSource which reads these settings back, and would create a circular import.
import { getThemeSettings } from '@shopgate/engage/core/config/getThemeSettings';
import type {
  AspectRatio,
  ImageResolution,
  ImageSettings,
  ProductImageContext,
} from '../types/appSettings';
import {
  DEFAULT_IMAGE_FILL_COLOR,
  DEFAULT_IMAGE_FILL_TRANSPARENT,
  LEGACY_IMAGE_SETTINGS_KEY,
  MAX_IMAGE_DIMENSION,
  PRODUCT_IMAGE_BASE_WIDTHS,
} from '../constants/imageSettings';
import { toThumborColor } from './toThumborColor';

/**
 * The shape of the legacy AppImages theme settings. Every field is optional - the key is absent
 * entirely in most shops, and undefined in every jest run, since the test theme config mock has no
 * settings at all.
 */
interface LegacyImageSettings {
  /**
   * Compression quality, 0 to 100.
   */
  quality?: number;
  /**
   * Color and transparency flag packed into one string, e.g. "FFFFFF,1".
   */
  fillColor?: string;
  /**
   * Explicit resolutions for the product detail page, ordered ascending.
   */
  HeroImage?: ImageResolution[];
  /**
   * Explicit resolutions for the fullscreen gallery, ordered ascending.
   */
  GalleryImage?: ImageResolution[];
  /**
   * Explicit resolutions for grid, slider, list and row tiles, ordered ascending.
   */
  ListImage?: ImageResolution[];
}

/**
 * Maps a product image context onto the legacy AppImages key that configured it.
 */
const LEGACY_RESOLUTION_KEYS: Record<ProductImageContext, keyof LegacyImageSettings> = {
  pdp: 'HeroImage',
  gallery: 'GalleryImage',
  list: 'ListImage',
};

/**
 * The ratio the legacy resolutions are assumed to have when they are not configured at all - the
 * built-in base widths then produce exactly the resolutions the legacy defaults shipped with.
 */
const DEFAULT_RATIO: AspectRatio = {
  width: 1,
  height: 1,
};

const PRODUCT_IMAGE_CONTEXTS = Object.keys(PRODUCT_IMAGE_BASE_WIDTHS) as ProductImageContext[];

/**
 * The resolved settings for one product image context: the resolution ladder to request from the
 * image service, and the aspect ratio to apply to the rendered element.
 *
 * ratio is null while the legacy settings are in effect, because those configure explicit
 * dimensions rather than a ratio - consumers then let the Image component derive the ratio from
 * the largest resolution, exactly as before.
 */
export interface ResolvedProductImageContext {
  /**
   * The ladder to request, ordered ascending. The last entry is the displayed image, the second
   * to last a low resolution preview.
   */
  resolutions: ImageResolution[];
  /**
   * Width and height parts to apply to the rendered element. Null leaves the Image component to
   * derive one from the largest resolution.
   */
  ratio: [number, number] | null;
}

/**
 * The resolved settings for every product image context, keyed by context.
 */
export type ResolvedProductImageSettings =
  Record<ProductImageContext, ResolvedProductImageContext>;

/**
 * What getFullImageSource needs to build an image url.
 *
 * The color and the transparency flag stay separate rather than being joined into one token,
 * because the image sources spell them differently.
 */
export interface ResolvedImageServiceSettings {
  /**
   * Compression quality, 0 to 100.
   */
  quality: number;
  /**
   * A hash free hex, or one of the image service's own keywords.
   */
  fillColor: string;
  /**
   * Whether transparent areas of the source image are filled too. Not every image source supports
   * this, so it is kept apart from the color rather than encoded into it.
   */
  fillTransparent: boolean;
}

/**
 * Reads the legacy AppImages settings from the theme configuration.
 * @returns The legacy settings, or an empty object when they are not configured.
 */
const getLegacyImageSettings = (): LegacyImageSettings =>
  (getThemeSettings(LEGACY_IMAGE_SETTINGS_KEY) as LegacyImageSettings) ?? {};

/**
 * Whether a ratio part can be calculated with.
 * @param value The value to check.
 * @returns Whether it is usable.
 */
const isUsableRatioPart = (value?: number): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

/**
 * Substitutes a ratio that cannot be calculated with. Anything reading a configured ratio goes
 * through here first - a source may send a half typed value, or none at all.
 * @param ratio The configured ratio.
 * @returns The ratio, or the default when it is unusable.
 */
const toUsableRatio = (ratio?: AspectRatio | null): AspectRatio => {
  if (!ratio || !isUsableRatioPart(ratio.width) || !isUsableRatioPart(ratio.height)) {
    return DEFAULT_RATIO;
  }

  return ratio;
};

/**
 * Derives a resolution ladder from a context's base widths and an aspect ratio.
 * @param context The product image context.
 * @param ratio The aspect ratio to apply, already passed through toUsableRatio.
 * @returns The resolutions, ordered ascending.
 */
const deriveResolutions = (
  context: ProductImageContext,
  ratio: AspectRatio
): ImageResolution[] => (
  PRODUCT_IMAGE_BASE_WIDTHS[context].map((baseWidth) => {
    const height = Math.round((baseWidth * ratio.height) / ratio.width);

    if (height <= MAX_IMAGE_DIMENSION) {
      return {
        width: baseWidth,
        height,
      };
    }

    // Scaled down as a whole rather than capping the height alone, so the requested image keeps the
    // shape the layout reserves for it.
    return {
      width: Math.max(1, Math.round((baseWidth * MAX_IMAGE_DIMENSION) / height)),
      height: MAX_IMAGE_DIMENSION,
    };
  })
);

/**
 * Resolves the settings for every product image context.
 *
 * Precedence:
 * - Once the app settings are hydrated from a source (admin sync / jsonp), they are authoritative.
 *   The single configured ratio applies to every context unless that context overrides it - the
 *   overrides are not written by any source yet, but honoring them here means per context
 *   configuration can later be rolled out from the admin without a PWA release.
 * - Before hydration the legacy AppImages resolutions are passed through as-is, with a null ratio.
 *   They already carry their own implied proportions, so reverse engineering a ratio from them
 *   would only introduce rounding - passing them through unchanged keeps the pre-hydration path
 *   identical to the legacy behavior.
 * @param areAppSettingsHydrated Whether the app settings arrived from a source.
 * @param imageSettings The image settings from the store.
 * @returns The resolved settings, keyed by context.
 */
export const resolveProductImageSettings = (
  areAppSettingsHydrated: boolean,
  imageSettings: ImageSettings
): ResolvedProductImageSettings => {
  const legacy = areAppSettingsHydrated ? null : getLegacyImageSettings();

  return PRODUCT_IMAGE_CONTEXTS.reduce((resolved, context) => {
    if (legacy) {
      const legacyResolutions = legacy[LEGACY_RESOLUTION_KEYS[context]] as
        ImageResolution[] | undefined;

      return {
        ...resolved,
        [context]: {
          resolutions: legacyResolutions?.length
            ? legacyResolutions
            : deriveResolutions(context, DEFAULT_RATIO),
          ratio: null,
        },
      };
    }

    const product = imageSettings?.product;

    // Resolved once and used for both, so the tuple cannot disagree with the resolutions it is
    // rendered against.
    const ratio = toUsableRatio(product?.[context]?.ratio ?? product?.ratio);

    return {
      ...resolved,
      [context]: {
        resolutions: deriveResolutions(context, ratio),
        ratio: [ratio.width, ratio.height] as [number, number],
      },
    };
  }, {} as ResolvedProductImageSettings);
};

/**
 * Resolves the quality and fill that image urls are built with.
 * @param areAppSettingsHydrated Whether the app settings arrived from a source.
 * @param imageSettings The image settings from the store.
 * @returns The image service settings.
 */
export const resolveImageServiceSettings = (
  areAppSettingsHydrated: boolean,
  imageSettings: ImageSettings
): ResolvedImageServiceSettings => {
  let color: string;
  let fillTransparent: boolean;

  if (areAppSettingsHydrated) {
    ({ fillColor: color, fillTransparent } = imageSettings);
  } else {
    // The legacy value packs both parts into one string, e.g. "FFFFFF,1". Its color is normalized
    // like a configured one - theme configurations carry values the image service will not take.
    const { fillColor: legacyFillColor = '' } = getLegacyImageSettings();
    const [legacyColor, legacyFillTransparent] = legacyFillColor.split(',');

    color = legacyColor ? toThumborColor(legacyColor) : DEFAULT_IMAGE_FILL_COLOR;
    fillTransparent = legacyFillTransparent === undefined
      ? DEFAULT_IMAGE_FILL_TRANSPARENT
      : legacyFillTransparent.trim() === '1';
  }

  return {
    // No hydration branch, unlike the fill: the unhydrated slice already holds the legacy quality.
    quality: imageSettings.quality,
    fillColor: color,
    fillTransparent,
  };
};
