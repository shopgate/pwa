import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const buttonPadding = `0 ${themeConfig.variables.gap.big}px 0`;

/**
 * Creates the button style.
 * @param {string} text The text color.
 * @param {string|null} background The fill color.
 * @return {Object} The button style.
 */
const button = (text, background) => ({
  position: 'relative',
  display: 'inline-block',
  outline: 0,
  color: text,
  backgroundColor: background,
  minWidth: 64,
  ...themeConfig.variables.buttonBase,
});

/**
 * The basic content wrapper styles.
 */
const contentWrapper = css({
  padding: buttonPadding,
}).toString();

/**
 * Creates the button styles object.
 * @param {string} textColor The text color.
 * @param {string|null} fillColor The fill color.
 * @return {Object} The styles object.
 */
const createButtonStyles = (textColor, fillColor) => {
  const buttonStyle = {
    ...button(
      textColor,
      fillColor
    ),
  };

  const contentStyle = {
    padding: buttonPadding,
    color: buttonStyle.color,
  };

  return {
    button: css(buttonStyle).toString(),
    content: css(contentStyle).toString(),
  };
};

/**
 * Creates a plain button style object without any styling.
 * @return {Object}
 */
const plain = () => ({
  button: css({
    padding: 0,
    outline: 0,
    border: 0,
    textAlign: 'left',
  }).toString(),
  content: '',
});

/**
 * The regular flat button style.
 * @param {boolean} disabled Whether this button is disabled.
 * @return {Object} An object of style definitions.
 */
const regular = (disabled) => {
  if (disabled) {
    // Flat disabled button style.
    return createButtonStyles(colors.shade4, null);
  }

  // Flat enabled button style.
  return createButtonStyles(colors.dark, null);
};

/**
 * The primary button style.
 * @param {boolean} disabled Whether this button is disabled.
 * @param {boolean} flat Whether this button should be rendered flat.
 * @return {Object} An object of style definitions.
 */
const primary = (disabled, flat) => {
  if (!flat) {
    if (disabled) {
      // Regular disabled button style.
      return createButtonStyles(colors.shade4, colors.shade7);
    }

    // Regular enabled button style.
    return createButtonStyles(`var(--color-secondary-contrast, ${colors.accentContrast})`, `var(--color-secondary, ${colors.accent})`);
  }

  if (disabled) {
    // Flat disabled button style.
    return createButtonStyles(colors.shade4, null);
  }

  // Flat enabled button style.
  return createButtonStyles(`var(--color-secondary, ${colors.accent})`, null);
};

/**
 * The secondary button style.
 * @param {boolean} disabled Whether this button is disabled.
 * @param {boolean} flat Whether this button should be rendered flat.
 * @return {Object} An object of style definitions.
 */
const secondary = (disabled, flat) => {
  if (!flat) {
    if (disabled) {
      // Regular disabled button style.
      return createButtonStyles(colors.shade4, colors.shade7);
    }

    // Regular enabled button style.
    return createButtonStyles(`var(--color-primary-contrast, ${colors.primaryContrast})`, `var(--color-primary, ${colors.primary})`);
  }

  if (disabled) {
    // Flat disabled button style.
    return createButtonStyles(colors.shade4, null);
  }

  // Flat enabled button style.
  return createButtonStyles(`var(--color-primary, ${colors.primary})`, null);
};

export default {
  plain,
  regular,
  primary,
  secondary,
  contentWrapper,
};
