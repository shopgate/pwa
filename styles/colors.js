import Color from 'color';
import { isObject } from '@shopgate/pwa-common/helpers/validation';
import { colors as customColors } from '../config/app';

let overrides = {};

if (isObject(customColors)) {
  overrides = {
    ...customColors,
  };
} else if (typeof customColors === 'string') {
  // TODO remove when SGXS-1223 is done and the config service delivers parsed JSON strings.
  overrides = {
    ...JSON.parse(customColors),
  };
}

const colors = {
  background: '#f8f8f8',
  light: '#fff',
  dark: '#000',
  accent: '#5ccee3',
  placeholder: '#f2f2f2',
  primary: '#fa5400',
  darkGray: '#eaeaea',
  shade3: '#9a9a9a',
  shade4: '#b5b5b5',
  shade5: '#ccc',
  shade6: '#656565',
  shade7: '#eaeaea',
  shade8: '#f7f7f7',
  shade9: '#8d8d8d',
  shade10: '#f4f4f4',
  shade11: '#747474',
  success: '#35cc29',
  warning: '#ff9300',
  error: '#ff0000',
  ...overrides,
};

/**
 * Calculates a contrast color for a given background color.
 * The color will either be black or white depending on the perceived
 * luminosity of the background color.
 * @param {string} bgColor The background color.
 * @returns {string} The contrast color.
 */
const getContrastColor = (bgColor) => {
  // We set a rather high cutoff to prefer light text if possible.
  const cutoff = 0.74;

  // Calculate the perceived luminosity (relative brightness) of the color.
  const perceivedLuminosity = Color(bgColor).luminosity();

  return perceivedLuminosity >= cutoff ? colors.dark : colors.light;
};

/**
 * Gets the default focus color. This usually is the themes primary color.
 * However, if this color is too bright, the result of ths method
 * will fall back to the accent color.
 * @return {string} The color.
 */
const getFocusColor = () => {
  if (Color(colors.primary).luminosity() >= 0.8) {
    return colors.accent;
  }
  return colors.primary;
};

// Define some additional computed colors.
colors.primaryContrast = getContrastColor(colors.primary);
colors.accentContrast = getContrastColor(colors.accent);
colors.focus = getFocusColor();

export default colors;
