import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

/**
 * Returns the styling based on the container height.
 * @param {number} height The maximum height for the container.
 * @returns {string}
 */
const container = height => css({
  position: 'relative',
  maxHeight: height,
  overflow: 'hidden',
  marginBottom: variables.gap.small,
}).toString();

const layout = css({
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
  padding: '8px 5px',
  overflow: 'hidden',
}).toString();

const moreButtonWrapper = css({
  position: 'absolute',
  right: 0,
  bottom: 6,
  marginLeft: 'auto',
}).toString();

const moreButtonBase = {
  marginLeft: 'auto',
  outline: 0,
  padding: 9,
  fontSize: '0.8rem',
  fontWeight: 500,
  textTransform: 'uppercase',
};

const moreButton = css({
  ...moreButtonBase,
}).toString();

const moreButtonInverted = css({
  ...moreButtonBase,
}).toString();

export default {
  container,
  layout,
  moreButtonWrapper,
  moreButton,
  moreButtonInverted,
};
