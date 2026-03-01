import Color from 'color';

type ColorType = 'hex' | 'rgb' | 'hsl' | 'array' | 'object';

type ColorInstance = InstanceType<typeof Color>;

/**
 * Determines if a value is a valid color string.
 * @param value The value to check.
 * @returns Whether the value is a valid color string or not.
 */
export const isColor = (value: unknown) => {
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
 * @param color The source color.
 * @param color2 The color to compare against the source color - usually a
 * dark text color.
 * @param [background='#fff'] Optional background color which is used for source colors
 * with alpha channel.
 * @returns Contrast value
 *
 * {@link https://www.w3.org/TR/WCAG20/#relativeluminancedef}
 */
export const getContrastRatio = (
  color: string,
  color2: string,
  background = '#fff'
) => {
  let source = Color(color);

  // @ts-expect-error - We are sure about the type here
  if (source.valpha < 1) {
    // Special handling for transparent colors -> simulate how the color would look on white bg
    // @ts-expect-error - We are sure about the type here
    source = source.mix(Color(background), 1 - source.valpha);
  }

  return source.contrast(Color(color2));
};

/**
 * Creates the return value for a color function - controlled by the type parameter
 * @param color The Color instance to convert.
 * @param type The type of return value to create.
 * @returns The return value
 */
const createReturnValue = (color: ColorInstance, type: ColorType) => {
  if (type === 'array') return color.array();

  // @ts-expect-error - We are sure about the type here
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
 * @param color The color to convert.
 * @param [returnType='hex'] The type of return value to create.
 * @returns The desired color value
 */
export const toHex = (
  color: ColorInstance,
  returnType: ColorType = 'hex'
) => createReturnValue(Color(color).rgb(), returnType);

/**
 * Converts a passed color to an RGB color
 * @param color The color to convert.
 * @param [returnType='rgb'] The type of return value to create.
 * @returns The desired color value
 */
export const toRgb = (
  color: ColorInstance,
  returnType: ColorType = 'rgb'
) => createReturnValue(Color(color).rgb(), returnType);

/**
 * Converts a passed color to an HSL color
 * @param color The color to convert.
 * @param [returnType='hsl'] The type of return value to create.
 * @returns The desired color value
 */
export const toHsl = (
  color: ColorInstance,
  returnType: ColorType = 'hsl'
) => createReturnValue(Color(color).hsl(), returnType);

/**
 * Adds hsl lightness to a color
 * @param color The color to modify.
 * @param value The hsl lightness value to add.
 * @param [type='hsl'] The type of return value to create.
 * @returns The desired color value
 */
export const addLightness = (
  color: ColorInstance,
  value: number,
  type: ColorType = 'hsl'
) => createReturnValue(Color(color).lightness(value), type);
