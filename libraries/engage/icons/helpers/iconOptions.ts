import type { IconDefinition } from '../types';

/**
 * Checks whether a value is a finite number above 0.
 * @param value The value.
 * @returns Whether the value is a finite number above 0.
 */
const isPositiveNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value) && value > 0
);

/**
 * Checks whether a value is a usable stroke width: a finite number above 0.
 * @param value The value.
 * @returns Whether the value is a usable stroke width.
 */
export const isValidStrokeWidth = isPositiveNumber;

export const MIN_SCALE = 0.5;

export const MAX_SCALE = 2;

/**
 * Checks whether a value is a usable scale: a finite number above 0. `clampScale` limits its range.
 * @param value The value.
 * @returns Whether the value is a usable scale.
 */
export const isValidScale = isPositiveNumber;

/**
 * Limits a scale to the range from `MIN_SCALE` to `MAX_SCALE` that icons are drawn at.
 * @param scale The scale.
 * @returns The scale the icon is drawn at.
 */
export const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

/**
 * Picks the render options of an icon definition and drops values of the wrong type.
 * @param definition The icon definition.
 * @returns The options `keepColors`, `scale` and `strokeWidth`.
 */
export const pickIconOptions = (
  definition: Partial<IconDefinition>
): Omit<IconDefinition, 'svg'> => ({
  keepColors: definition.keepColors === true,
  ...(isValidScale(definition.scale) ? { scale: definition.scale } : {}),
  ...(isValidStrokeWidth(definition.strokeWidth) ? { strokeWidth: definition.strokeWidth } : {}),
});
