import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * Gets a basic style object for the chip layout.
 * @param {boolean} hasRemoveButton Whether this chip has a remove button.
 * @returns {Object} The style object.
 */
const chipBase = (hasRemoveButton = true) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 26,
  outline: 0,
  height: 26,
  paddingRight: themeConfig.variables.gap.small,
  paddingLeft: themeConfig.variables.gap.small * (hasRemoveButton ? 0.5 : 1),
  marginRight: 5,
  marginTop: 4,
  marginBottom: 4,
  minWidth: 0,
});

/**
 * Gets a style class for the chip layout.
 * @param {boolean} hasRemoveButton Whether this chip has a remove button.
 * @param {boolean} inverted Whether the colors of the chip are inverted.
 * @returns {string} The style class name.
 */
const chip = (hasRemoveButton = true, inverted = false) => css({
  ...chipBase(hasRemoveButton),
  backgroundColor: (inverted ? `var(--color-secondary, ${themeConfig.accent})` : `var(--color-secondary-contrast, ${themeConfig.accentContrast})`),
  color: (inverted ? `var(--color-secondary-contrast, ${themeConfig.accentContrast})` : `var(--color-secondary, ${themeConfig.accent})`),
}).toString();

const removeButton = css({
  flexShrink: 0,
  padding: 0,
}).toString();

const name = css({
  paddingLeft: (themeConfig.variables.gap.small * 0.5),
  paddingRight: (themeConfig.variables.gap.small * 0.5),
  paddingTop: 3,
  paddingBottom: 3,
  fontSize: 12,
  fontWeight: 500,
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'block',
  lineHeight: '1',
  color: 'inherit',
}).toString();

export default {
  chip,
  removeButton,
  name,
};
