import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * @param {string} direction flex direction
 * @returns {*}
 */
const container = direction => css({
  display: 'flex',
  flexDirection: direction,
}).toString();

const label = css({
  fontSize: '0.8rem',
  paddingBottom: themeConfig.variables.gap.small,
  color: themeConfig.colors.shade12,
}).toString();

/**
 * Adds an additional gap at the top for floating labels.
 * @type {string}
 */
export const formElement = css({
  paddingTop: themeConfig.variables.gap.big * 1.5,
}).toString();

export default {
  container,
  label,
};
