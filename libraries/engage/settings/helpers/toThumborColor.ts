import Color from 'color';
import { logger } from '@shopgate/pwa-core/helpers';
// Imported via its module path rather than the "styles" barrel, since that barrel pulls in the
// ThemeProvider and would create a circular import.
import { isColor } from '@shopgate/engage/styles/theme/utils/color';
import { DEFAULT_IMAGE_FILL_COLOR } from '../constants/imageSettings';

/**
 * Values Thumbor's fill filter accepts that are not CSS colors, so they have to bypass the color
 * parser and be passed through untouched.
 * @see https://thumbor.readthedocs.io/en/latest/filling.html
 */
const THUMBOR_COLOR_KEYWORDS = ['auto', 'blur', 'transparent'];

/**
 * A hexadecimal color without the leading "#" - the format the image service itself expects, and
 * therefore what the legacy AppImages config stores. It is not a valid CSS color, so it has to be
 * recognized before the color parser sees it.
 */
const BARE_HEX_PATTERN = /^([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;

/**
 * Converts a color into the format Thumbor's fill filter expects - a hexadecimal RGB expression
 * without the leading "#", or one of its own keywords.
 *
 * Any alpha channel on the input is dropped: Thumbor's fill color cannot carry one, and Color.hex()
 * returns the opaque six digit form. Transparency is only expressible by configuring the
 * "transparent" keyword explicitly.
 *
 * Everything else is canonicalized to hex rather than passing HTML color names through, so that
 * "white", "#fff" and "rgb(255, 255, 255)" all produce the same url and share a CDN cache entry.
 * @param value The color to convert.
 * @returns The Thumbor color token.
 */
export const toThumborColor = (value: string): string => {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  if (THUMBOR_COLOR_KEYWORDS.includes(trimmed.toLowerCase())) {
    return trimmed.toLowerCase();
  }

  // A bare hex is what the image service and the legacy config use, but not something the color
  // parser recognizes, so it gets its "#" back before parsing.
  const parsable = BARE_HEX_PATTERN.test(trimmed) ? `#${trimmed}` : trimmed;

  if (!isColor(parsable)) {
    logger.warn(`Invalid image fill color "${value}", falling back to ${DEFAULT_IMAGE_FILL_COLOR}`);
    return DEFAULT_IMAGE_FILL_COLOR;
  }

  return Color(parsable).hex().replace('#', '').toUpperCase();
};
