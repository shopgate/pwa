import Color from 'color';

/**
 * @typedef {'hex' | 'rgb' | 'hsl' | 'array' | 'object'} ColorType
 */

/**
 * @typedef {InstanceType<typeof Color>} ColorInstance
 */

/**
 * Determines if a value is a valid color string.
 * @param {*} value The value to check.
 * @returns {boolean}
 */
export const isColor = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    Color(value);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Calculates the contrast ratio between two colors
 * @param {string|ColorInstance} color The source color.
 * @param {string|ColorInstance} color2 The color to compare against the source color - usually a
 * dark text color.
 * @param {string} [background='#fff'] Optional background color which is used for source colors
 * with alpha channel.
 * @returns {number} Contrast value
 *
 * @link https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export const getContrastRatio = (
  color,
  color2,
  background = '#fff'
) => {
  let source = Color(color);

  if (source.valpha < 1) {
    // Special handling for transparent colors -> simulate how the color would look on white bg
    source = source.mix(Color(background), 1 - source.valpha);
  }

  return source.contrast(Color(color2));
};

/**
 * Creates the return value for a color function - controlled by the type parameter
 * @param {string|ColorInstance} color The Color instance to convert.
 * @param {ColorType} type The type of return value to create.
 * @returns {string} The return value
 */
const createReturnValue = (color, type) => {
  if (type === 'array') return color.array();

  // @ts-ignore-error
  const hasAlpha = color.valpha < 1;

  if (type === 'hex') {
    return hasAlpha ? color.hexa() : color.hex();
  }

  if (type === 'rgb') {
    return color.rgb().toString();
  }

  if (type === 'hsl') {
    return color.hsl().toString();
  }

  return color;
};

/**
 * Converts a passed color to a hex(a) color
 * @param {string|ColorInstance} color The color to convert.
 * @param {ColorType} [returnType='hex'] The type of return value to create.
 * @returns {string} The desired color value
 */
export const toHex = (
  color,
  returnType = 'hex'
) => createReturnValue(Color(color).rgb(), returnType);

/**
 * Converts a passed color to an RGB color
 * @param {string|ColorInstance} color The color to convert.
 * @param {ColorType} [returnType='rgb'] The type of return value to create.
 * @returns {string} The desired color value
 */
export const toRgb = (
  color,
  returnType = 'rgb'
) => createReturnValue(Color(color).rgb(), returnType);

/**
 * Converts a passed color to an HSL color
 * @param {string|ColorInstance} color The color to convert.
 * @param {ColorType} [returnType='hsl'] The type of return value to create.
 * @returns {string} The desired color value
 */
export const toHsl = (
  color,
  returnType = 'hsl'
) => createReturnValue(Color(color).hsl(), returnType);

/**
 * Adds hsl lightness to a color
 * @param {string|ColorInstance} color The color to modify.
 * @param {number} value The hsl lightness value to add.
 * @param {ColorType} [type='hsl'] The type of return value to create.
 * @returns {string} The desired color value
 */
export const addLightness = (
  color,
  value,
  type = 'hsl'
) => createReturnValue(Color(color).lightness(value), type);
