import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/engage';

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
  ...(hasNewServices() ? {
    backgroundColor: inverted ? 'var(--color-primary)' : 'var(--color-primary-contrast)',
    color: inverted ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
  } : {
    backgroundColor: inverted ? 'var(--color-secondary)' : 'var(--color-secondary-contrast)',
    color: inverted ? 'var(--color-secondary-contrast)' : 'var(--color-secondary)',
    '--color-text-high-emphasis': inverted ? 'var(--color-secondary-contrast)' : 'var(--color-secondary)',
  }),

}).toString();

const removeButton = css({
  flexShrink: 0,
  padding: 0,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: '0 5px',
    fontSize: '1.125rem',
  },
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
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    padding: '6px 8px 6px 0',
  },
}).toString();

export default {
  chip,
  removeButton,
  name,
};
