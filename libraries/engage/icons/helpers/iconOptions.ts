import type { IconDefinition } from '../types';

/**
 * Checks whether a value is a usable stroke width: a finite number above 0.
 * @param value The value.
 * @returns Whether the value is a usable stroke width.
 */
export const isValidStrokeWidth = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value) && value > 0
);

/**
 * Picks the render options of an icon definition and drops values of the wrong type.
 * @param definition The icon definition.
 * @returns The options `keepColors`, `scale` and `strokeWidth`.
 */
export const pickIconOptions = (
  definition: Partial<IconDefinition>
): Omit<IconDefinition, 'svg'> => ({
  keepColors: definition.keepColors === true,
  ...(typeof definition.scale === 'number' ? { scale: definition.scale } : {}),
  ...(isValidStrokeWidth(definition.strokeWidth) ? { strokeWidth: definition.strokeWidth } : {}),
});
