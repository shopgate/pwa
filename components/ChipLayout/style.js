import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

/**
 * Returns the styling based on the container height.
 * @param {number} height The maximum height for the container.
 * @returns {string}
 */
const container = height => cxs({
  position: 'relative',
  maxHeight: height,
  overflow: 'hidden',
  marginBottom: variables.gap.small,
});

const layout = cxs({
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
  padding: '7px 5px',
  overflow: 'hidden',
});

const moreButtonWrapper = cxs({
  position: 'absolute',
  right: 0,
  bottom: variables.gap.small * 0.5,
  marginLeft: 'auto',
  marginRight: variables.gap.small,
});

const moreButtonBase = {
  marginLeft: 'auto',
  outline: 0,
  padding: 9,
  fontSize: '0.8rem',
  fontWeight: 500,
  textTransform: 'uppercase',
};

const moreButton = cxs({
  ...moreButtonBase,
  color: colors.light,
});

const moreButtonInverted = cxs({
  ...moreButtonBase,
  color: colors.accent,
});

export default {
  container,
  layout,
  moreButtonWrapper,
  moreButton,
  moreButtonInverted,
};
