import merge from 'lodash/merge';
import isPlainObject from 'lodash/isPlainObject';
import { getCSSCustomProp } from '../../helpers/cssCustomProperties';
import {
  isColor,
  toHsl,
  addLightness,
  getContrastRatio,
} from '../utils';

const grey = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161',
};

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

/**
 * @typedef {Object} AugmentedPaletteColor
 * @property {string} main The main color value.
 * @property {string} [light] The light variant of the color.
 * @property {string} [dark] The dark variant of the color.
 * @property {string} [contrastText] The text color that contrasts with the main color.
 */

/**
 * Retrieves a text color that matches a passed background color.
 * @param {Object} options The options for getting the contrast text color.
 * @param {string} options.background Background color to be checked
 * @param {number} options.threshold Threshold for the contrast check
 * @param {string} options.textColorLight Text color for light background
 * @param {string} options.textColorDark Text color for dark backgrounds
 * @returns {string} The matching contrast text color
 */
const getContrastText = ({
  background,
  threshold,
  textColorLight = defaultTextLight.primary,
  textColorDark = defaultTextDark.primary,
}) => {
  if (!isColor(background)) {
    return textColorLight;
  }

  const contrastValue = getContrastRatio(background, textColorDark, '#fff');

  return contrastValue >= threshold ? textColorDark : textColorLight;
};

/**
 * Adds a light or dark variant to a color intent if not already provided.
 * @param {Object} options The options for adding the sub color.
 * @param {AugmentedPaletteColor} options.intent The color intent to augment.
 * @param {string} options.direction The direction of the variant to add ('light' or 'dark').
 * @param {number} options.tonalOffset The tonal offset to use when calculating the variant color.
 * @returns {AugmentedPaletteColor} The augmented color intent with the new variant added if it was
 * missing.
 */
const addSubColor = ({ intent, direction, tonalOffset }) => {
  const tonalOffsetLight = tonalOffset;
  const tonalOffsetDark = tonalOffset * 1.5;

  const result = { ...intent };

  if (!intent[direction]) {
    const [, , light] = toHsl(intent.main, 'array');

    if (direction === 'light') {
      result.light = addLightness(intent.main, light + (100 - light) * tonalOffsetLight);
    } else if (direction === 'dark') {
      result.dark = addLightness(intent.main, light * (1 - tonalOffsetDark));
    }
  }

  return result;
};

/**
 * Creates an augmented color object with "main", "dark" and "light" color + contrast text helper
 * @param {Object} options The options for augmenting the color.
 * @param {AugmentedPaletteColor} options.color The color object to augment.
 * @param {number} [options.tonalOffset=0.2] The tonal offset to use when calculating light and dark
 * variants.
 * @param {number} [options.contrastThreshold=3] The contrast threshold to use when calculating the
 * contrast text color.
 * @returns {AugmentedPaletteColor} The augmented color object.
 */
const augmentColor = ({
  color,
  tonalOffset = 0.2,
  contrastThreshold = 3,
}) => {
  if (!color?.main || !isColor(color.main)) {
    return color;
  }

  /** @type {AugmentedPaletteColor} */
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
    });
  }

  return result;
};

/**
 * Recursively transforms all color values in the palette using the provided transform function.
 * @param {Object} palette The palette to transform.
 * @param {Function} transformFn The function to apply to each color value in the palette.
 * @returns {Object} The transformed palette
 */
const transformPalette = (palette, transformFn) => {
  // eslint-disable-next-line require-jsdoc
  function recurse(obj) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (isPlainObject(value)) {
          return [key, recurse(value)];
        }

        if (isColor(value)) {
          return [key, transformFn(value)];
        }

        return [key, value];
      })
    );
  }

  return recurse(palette);
};

/**
 * Unifies color values in the palette to HSL and adds light/dark variants and contrast text
 * where missing.
 * @param {Object} options The options for extending the palette.
 * @param {Object} options.palette The palette to extend.
 * @param {number} [options.tonalOffset] The tonal offset to use when calculating light and dark
 * variants.
 * @param {number} [options.contrastThreshold] The contrast threshold to use when calculating the
 * contrast text color.
 * @returns {Object} The extended palette.
 */
export const extendPalette = ({
  palette,
  tonalOffset,
  contrastThreshold,
}) => {
  if (!isPlainObject(palette)) {
    return palette;
  }

  // Convert all colors to HSL first to ensure consistent color manipulation
  const hslPalette = transformPalette(palette, toHsl);

  // Augment the palette with light/dark variants and contrast text
  const augmentedPalette = Object.entries(hslPalette)
    .reduce((acc, [key, value]) => {
      acc[key] = augmentColor({
        color: value,
        tonalOffset,
        contrastThreshold,
      });
      return acc;
    }, {});

  return augmentedPalette;
};

/**
 * Creates a palette object for the theme.
 * @param {Object} inputPalette The input palette options.
 * @returns {Object} The palette object.
 */
const createPalette = (inputPalette) => {
  const {
    tonalOffset = 0.2,
    contrastThreshold = 3,
    ...paletteOptions
  } = inputPalette;

  const palette = {
    primary: {
      main: '',
      contrastText: '',
    },
    secondary: {
      main: '',
      contrastText: '',
    },
    error: {
      main: '',
      contrastText: '',
    },
    warning: {
      main: '',
      contrastText: '',
    },
    success: {
      main: '',
      contrastText: '',
    },
    background: {
      default: '',
    },
    text: {
      primary: '',
      secondary: '',
      tertiary: '',
    },
  };

  const mergedPalette = extendPalette({
    palette: merge(palette, paletteOptions),
    tonalOffset,
    contrastThreshold,
  });

  /**
   * @param {string} background The color to get the contrast text color for.
   * @returns {string}
   */
  const getContrastTextFn = (background) => {
    let backgroundColor = background;

    if ((background ?? '').startsWith('var(')) {
      backgroundColor = getCSSCustomProp(background.replace(/^var\((--.+)\)$/, '$1'));
    }

    return getContrastText({
      background: backgroundColor,
      threshold: contrastThreshold,
    });
  };

  return {
    ...mergedPalette,
    grey,
    getContrastText: getContrastTextFn,
  };
};

export default createPalette;
