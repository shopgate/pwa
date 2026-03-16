import merge from 'lodash/merge';
import isPlainObject from 'lodash/isPlainObject';
import {
  isColor,
  toHsl,
  lighten,
  darken,
  getContrastRatio,
} from '../utils';
import type { AugmentedPaletteColor, Palette } from './createPalette.types';
import { paletteSchema } from './createPalette.types';
import type { ColorSchemeName, ThemeOptions } from '.';

type PaletteOptions = ThemeOptions['palette'];

export type { Palette, PaletteOptions, PaletteColorsWithMain } from './createPalette.types';

const defaultTextLight = {
  primary: '#202020',
  secondary: '#575757',
  disabled: '#ACACAC',
};
const defaultTextDark = {
  primary: '#fff',
  secondary: '#a8a8a8',
  disabled: '#535353',
};

type GetContrastTextOptions = {
  /**
   * Background color to be checked
   */
  background: string;
  /**
   * Threshold for the contrast check
   */
  threshold: number;
  /**
   * Text color for light background
   */
  textContrastColorLight?: string;
  /**
   * Text color for dark backgrounds
   */
  textContrastColorDark?: string;
}

/**
 * Retrieves a text color that matches a passed background color.
 * @param options The options for getting the contrast text color.
 * @returns The matching contrast text color
 */
const getContrastText = (options: GetContrastTextOptions): string => {
  const {
    background,
    threshold,
    textContrastColorLight = defaultTextLight.primary,
    textContrastColorDark = defaultTextDark.primary,
  } = options ?? {};

  if (!isColor(background)) {
    return textContrastColorLight;
  }

  const contrastValue = getContrastRatio(background, textContrastColorDark, '#fff');

  return contrastValue >= threshold ? textContrastColorDark : textContrastColorLight;
};

type AddSubColorOptions = {
  /**
   * The color intent to augment.
   */
  intent: AugmentedPaletteColor;
  /**
   * The direction of the variant to add ('light' or 'dark').
   */
  direction: ColorSchemeName;
  /**
   * The tonal offset to use when calculating the variant color.
   */
  tonalOffset: number;
};

/**
 * Adds a light or dark variant to a color intent if not already provided.
 * @param options The options for adding the sub color.
 * @returns The augmented color intent with the new variant added if it was
 * missing.
 */
const addSubColor = (options: AddSubColorOptions): AugmentedPaletteColor => {
  const {
    intent,
    direction,
    tonalOffset,
  } = options ?? {};

  const tonalOffsetLight = tonalOffset;
  const tonalOffsetDark = tonalOffset * 1.5;

  const result = { ...intent };

  if (!intent[direction]) {
    if (direction === 'light') {
      // @ts-expect-error - We are sure about the type here
      result.light = lighten(intent.main, tonalOffsetLight) as string;
    } else if (direction === 'dark') {
      // @ts-expect-error - We are sure about the type here
      result.dark = darken(intent.main, tonalOffsetDark) as string;
    }
  }

  return result;
};

type AugmentColorOptions = {
  /**
   * The color object to augment.
   */
  color: AugmentedPaletteColor;
  /**
   * The tonal offset to use when calculating light and dark variants. Defaults to 0.2.
   */
  tonalOffset: number;
  /**
   * The contrast threshold to use when calculating the contrast text color. Defaults to 3.
   */
  contrastThreshold: number;
  /**
   * Text color for light background
   */
  textContrastColorLight?: string;
  /**
   * Text color for dark backgrounds
   */
  textContrastColorDark?: string;
};

/**
 * Creates an augmented color object with "main", "dark" and "light" color + contrast text helper
 * @param options The options for augmenting the color.
 * @returns The augmented color object.
 */
const augmentColor = (options: AugmentColorOptions): AugmentedPaletteColor | unknown => {
  const {
    color,
    tonalOffset = 0.2,
    contrastThreshold = 3,
    textContrastColorLight,
    textContrastColorDark,
  } = options ?? {};

  if (!color?.main || !isColor(color.main)) {
    return color;
  }

  let result = { ...color };

  result = addSubColor({
    intent: result,
    direction: 'dark',
    tonalOffset,
  });

  result = addSubColor({
    intent: result,
    direction: 'light',
    tonalOffset,
  });

  if (!result.contrastText) {
    result.contrastText = getContrastText({
      background: result.main,
      threshold: contrastThreshold,
      textContrastColorLight,
      textContrastColorDark,
    });
  }

  return result;
};

/**
 * Recursively transforms all color values in the palette using the provided transform function.
 * @param palette The palette to transform.
 * @param transformFn The function to apply to each color value in the palette.
 * @returns The transformed palette
 */
const transformPalette = (
  palette: PaletteOptions,
  transformFn: typeof toHsl
): Palette => {
  // @ts-expect-error - We are sure about the type here
  function recurse(obj) {
    return Object.fromEntries(
      // @ts-expect-error - Object.entries is hard to type
      Object.entries(obj).map(([key, value]) => {
        if (isPlainObject(value)) {
          return [key, recurse(value)];
        }

        if (isColor(value)) {
          // @ts-expect-error - We are sure about the type here
          return [key, transformFn(value)];
        }

        return [key, value];
      })
    );
  }

  return recurse(palette);
};

type ExtendPaletteOptions = {
  /**
   * The palette to extend.
   */
  palette: PaletteOptions;
  /**
   * The tonal offset to use when calculating light and dark variants if they are not provided.
   */
  tonalOffset: number;
  /**
   * The contrast threshold to use when calculating the contrast text color if it is not provided.
   */
  contrastThreshold: number;
};

/**
 * Unifies color values in the palette to HSL and adds light/dark variants and contrast text
 * where missing.
 * @param options The options for extending the palette.
 * @returns The extended palette.
 */
export const extendPalette = (options: ExtendPaletteOptions): PaletteOptions => {
  const {
    palette,
    tonalOffset,
    contrastThreshold,
  } = options ?? {};

  if (!isPlainObject(palette)) {
    return palette;
  }

  // Convert all colors to HSL first to ensure consistent color manipulation
  const hslPalette = transformPalette(palette, toHsl);

  // Augment the palette with light/dark variants and contrast text
  const augmentedPalette = Object.entries(hslPalette)
    .reduce((acc, [key, value]) => {
      // @ts-expect-error - We are sure about the type here
      acc[key] = augmentColor({
        color: value,
        tonalOffset,
        contrastThreshold,
      });
      return acc;
    }, {}) as PaletteOptions;

  return augmentedPalette;
};

/**
 * Creates a palette object for the theme.
 * @param inputPalette The input palette options.
 * @returns The palette object.
 */
const createPalette = (inputPalette: PaletteOptions): Palette => {
  const {
    tonalOffset = 0.2,
    contrastThreshold = 3,
    ...paletteOptions
  } = inputPalette ?? {};

  const mergedPalette = extendPalette({
    palette: merge(paletteSchema, paletteOptions),
    tonalOffset,
    contrastThreshold,
  }) as Palette;

  return mergedPalette;
};

export default createPalette;
