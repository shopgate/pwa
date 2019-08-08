import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The styles for the container element.
 */
const formElement = css({
  position: 'relative',
  paddingBottom: themeConfig.variables.gap.big,
  width: '100%',
}).toString();

/**
 * Adds an additional gap at the top for floating labels.
 * @type {string}
 */
const labelReservedSpace = css({
  paddingTop: themeConfig.variables.gap.big * 1.5,
}).toString();

export default {
  formElement,
  labelReservedSpace,
};
