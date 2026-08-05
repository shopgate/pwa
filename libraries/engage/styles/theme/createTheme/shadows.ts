// Share of the shadow color each of the three layers is drawn with, in percent.
const shadowKeyUmbraPercent = 20;
const shadowKeyPenumbraPercent = 14;
const shadowAmbientShadowPercent = 12;

export const DEFAULT_SHADOW_COLOR = '#000000';

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
 * Renders a hex color at a share of its opacity as plain `rgba()`.
 * @param color The color to render.
 * @param percent The share of the color to render it with.
 * @returns The `rgba()` color, or null when the color is not a hex color.
 */
const toRgba = (color: string, percent: number): string | null => {
  const hex = color.trim();
  // `#abc` is shorthand for `#aabbcc`.
  const isShorthand = hex.length === 4;

  if (!hex.startsWith('#') || (!isShorthand && hex.length !== 7)) {
    return null;
  }

  // `Number('0x…')` is NaN unless every digit is a hex digit, so it validates while it parses.
  const channels = [0, 1, 2].map(channel => Number(`0x${isShorthand
    ? hex.charAt(channel + 1).repeat(2)
    : hex.slice(1 + (channel * 2), 3 + (channel * 2))}`));

  if (channels.some(Number.isNaN)) {
    return null;
  }

  return `rgba(${channels.join(',')},${percent / 100})`;
};

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

/**
 * Builds the box-shadow declaration for one of the sizes the admin offers, drawn in `color`.
 *
 * Built here rather than recoloring `theme.shadows[…]` through a custom property: the theme exposes
 * its scale as `var(--sg-shadows-N)`, which resolves on `:root`, so a per-surface color never
 * reaches it. A complete declaration keeps the color at the use site.
 * @param size The configured shadow size.
 * @param color The configured shadow color.
 * @returns A box-shadow value, `none` for the `none` size.
 */
export const createShadowForSize = (size: ShadowSize, color: string): string => {
  const geometry = elevationGeometries[(SHADOW_SIZE_ELEVATIONS[size] ?? 0) - 1];

  if (!geometry) {
    return 'none';
  }

  return createShadow(geometry, (percent) => {
    const rgba = toRgba(color || DEFAULT_SHADOW_COLOR, percent);

    // `color-mix` only for the colors that are not hex — it is not supported across the whole
    // browserslist range, and an unsupported value invalidates the whole declaration.
    return rgba ?? `color-mix(in srgb, ${color} ${percent}%, transparent)`;
  });
};

// The scale exposed on the theme. Its entries end up as `var(--sg-shadows-N)` declarations on
// `:root`, so they cannot carry a per-surface color — see `createShadowForSize` for the surfaces
// the admin makes configurable.
const shadows = [
  'none',
  ...elevationGeometries.map(geometry => createShadow(
    geometry,
    percent => `rgba(0,0,0,${percent / 100})`
  )),
] as const;

export type Shadows = typeof shadows

export default shadows;
