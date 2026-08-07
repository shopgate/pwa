// Share of the shadow color each of the three layers is drawn with, in percent.
const shadowKeyUmbraPercent = 20;
const shadowKeyPenumbraPercent = 14;
const shadowAmbientShadowPercent = 12;

/**
 * The elevations the admin offers. Offset, blur and spread are not configurable — a shop picks
 * one of these presets so the surfaces stay visually consistent, and only the color is free.
 */
export type ShadowSize = 'none' | 'low' | 'medium' | 'strong';

/**
 * Elevation from the scale below used for each shadow size the admin offers. Keeping the mapping
 * next to the scale means a size never introduces geometry of its own.
 */
const SHADOW_SIZE_ELEVATIONS: Record<ShadowSize, number> = {
  none: 0,
  low: 2,
  medium: 4,
  strong: 8,
};

// Offset-x, offset-y, blur and spread of the three layers that make up one elevation, starting at
// elevation 1 (elevation 0 draws no shadow at all).
// Values from https://github.com/material-components/material-components-web/blob/be8747f94574669cb5e7add1a7c54fa41a89cec7/packages/mdc-elevation/_variables.scss
const elevationGeometries: number[][] = [
  [0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0],
  [0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0],
  [0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0],
  [0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0],
  [0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0],
  [0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0],
  [0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1],
  [0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2],
  [0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2],
  [0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3],
  [0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3],
  [0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4],
  [0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4],
  [0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4],
  [0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5],
  [0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5],
  [0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5],
  [0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6],
  [0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6],
  [0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7],
  [0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7],
  [0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7],
  [0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8],
  [0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8],
];

/**
 * Builds one elevation from its geometry.
 * @param px The twelve lengths of the elevation's three layers.
 * @param renderColor Renders the color of a layer from the share of the shadow color it is drawn
 * with, in percent.
 * @returns A box-shadow value.
 */
function createShadow(px: number[], renderColor: (percent: number)=> string): string {
  const layer = (offset: number, percent: number) => (
    `${px[offset]}px ${px[offset + 1]}px ${px[offset + 2]}px ${px[offset + 3]}px ` +
    `${renderColor(percent)}`
  );

  return [
    layer(0, shadowKeyUmbraPercent),
    layer(4, shadowKeyPenumbraPercent),
    layer(8, shadowAmbientShadowPercent),
  ].join(',');
}

export const SHADOW_COLOR_VAR = '--sg-palette-shadow';

const shadows = [
  'none',
  ...elevationGeometries.map(geometry => createShadow(
    geometry,
    percent => `rgb(from var(${SHADOW_COLOR_VAR}) r g b / ${percent / 100})`
  )),
] as const;

export type Shadows = typeof shadows

/**
 * The finished shadow for each size the admin offers, for a single `theme.shadowSizes[size]` lookup.
 */
export const shadowSizes = Object.fromEntries(
  Object.entries(SHADOW_SIZE_ELEVATIONS).map(([size, elevation]) => [size, shadows[elevation]])
) as Record<ShadowSize, string>;

export default shadows;
