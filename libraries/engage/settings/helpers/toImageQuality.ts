import { logger } from '@shopgate/pwa-core/helpers';
import { DEFAULT_IMAGE_QUALITY } from '../constants/imageSettings';

/**
 * The range the image service accepts.
 */
const MIN_IMAGE_QUALITY = 1;
const MAX_IMAGE_QUALITY = 100;

/**
 * Coerces a configured value into a number.
 * @param value The configured value.
 * @returns The number, or NaN when the value does not express one.
 */
const toNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }

  // Emptiness is handled here rather than left to Number(), which would read both "" and null as a
  // perfectly valid zero.
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }

  return NaN;
};

/**
 * Converts a configured value into a compression quality the image service accepts.
 * @param value The value to convert.
 * @returns A whole number between 1 and 100.
 */
export const toImageQuality = (value: unknown): number => {
  const quality = toNumber(value);

  if (!Number.isFinite(quality)) {
    logger.warn(`Invalid image quality "${value}", falling back to ${DEFAULT_IMAGE_QUALITY}`);
    return DEFAULT_IMAGE_QUALITY;
  }

  // Out of range numbers are clamped rather than rejected, so a value that is still being typed
  // degrades into the nearest usable one instead of jumping back to the default. Zero is included
  // in that - the service takes it, but the images it returns are unusable.
  return Math.min(Math.max(Math.round(quality), MIN_IMAGE_QUALITY), MAX_IMAGE_QUALITY);
};
