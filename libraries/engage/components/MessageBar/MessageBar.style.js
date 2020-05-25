import { css } from 'glamor';
import Color from 'color';
import { responsiveMediaQuery, getCSSCustomProp } from '@shopgate/engage/styles';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const containerBase = {
  background: themeColors.background,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  overflow: 'hidden',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    fontWeight: 'normal',
    border: 'none',
    borderRadius: 'inherit',
    margin: themeVariables.gap.big,
    boxShadow: 'none',
    background: 'none',
  },
};

export const container = css(containerBase).toString();

export const containerRaised = css(containerBase, {
  borderRadius: '0 0 5px 5px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  zIndex: 10,
}).toString();

const messageBase = {
  padding: `${themeVariables.gap.big}px ${themeVariables.gap.big}px`,
  fontSize: '0.875rem',
  lineHeight: 1.3,
  fontWeight: 500,
  ':not(:last-child)': {
    marginBottom: themeVariables.gap.small * 0.5,
  },
  ' > svg': {
    fontSize: '1.5rem !important',
  },
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: `${themeVariables.gap.small * 1.5}px ${themeVariables.gap.big}px`,
    fontWeight: 'normal',
    border: '1px solid',
    borderRadius: 4,
    ':not(:last-child)': {
      marginBottom: themeVariables.gap.small,
    },
  },
};

/**
 * @param {string|Object} sourceColor The source color.
 * @param {string} [textColor] AN optional text color.
 * @returns {Object}
 */
const getMessageColors = (sourceColor, textColor) => {
  const background = Color(sourceColor).fade(0.9);
  const color = textColor || 'var(--color-text-height-emphasis)';
  const borderColor = sourceColor;

  return {
    background,
    color,
    borderColor,
  };
};

/**
 * @returns {string}
 */
export const info = () => css(messageBase, {
  background: `var(--color-secondary, ${themeColors.accent})`,
  color: `var(--color-secondary-contrast, ${themeColors.accentContrast})`,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    ...getMessageColors(getCSSCustomProp('--color-secondary')),
    ' > svg': {
      color: 'var(--color-secondary)',
    },
  },
}).toString();

/**
 * @returns {string}
 */
export const error = () => css(messageBase, {
  background: themeColors.error,
  color: themeColors.light,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    ...getMessageColors(themeColors.error),
    ' > svg': {
      color: themeColors.error,
    },
  },
}).toString();

/**
 * @returns {string}
 */
export const warning = () => css(messageBase, {
  background: themeColors.warning,
  color: themeColors.light,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    ...getMessageColors(themeColors.warning),
    ' > svg': {
      color: themeColors.warning,
    },
  },
}).toString();

export const srOnly = css({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const withIcon = css({
  display: 'flex',
  minWidth: '100%',
  alignItems: 'center',
}).toString();

export const icon = css({
  flexGrow: 0,
  flexShrink: 0,
}).toString();

export const messageToIcon = css({
  flexGrow: 1,
  paddingLeft: themeVariables.gap.big,
});
