import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const favItemTransitionDuration = 500;

const row = css({
  display: 'flex',
  /** Row is DOM reversed for a11y navigation */
  flexDirection: 'row-reverse',
  padding: variables.gap.big,
  justifyContent: 'space-between',
}).toString();

const leftColumn = css({
  minWidth: 126,
  maxWidth: 170,
  width: '19%',
}).toString();

const rightColumn = css({
  paddingLeft: variables.gap.big,
  // Makes the bottom always aligned to bottom of the image.
  paddingBottom: variables.gap.big,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}).toString();

/**
 * Styling for the wrapping div
 * @type {{overflow: string}}
 */
const itemWrapper = css({
  overflow: 'hidden',
}).toString();

const defaultTransitionStyle = {
  position: 'relative',
  zIndex: 1,
  transition: `margin-top ${favItemTransitionDuration}ms`,
};

/**
 * Creates an object with style attributes to enable a cart item transition.
 * @param {string} state A state of the react-transition-group/Transition component.
 * @param {boolean} visible Is element visible.
 * @param {number} height Height of the element.
 * @return {Object}
 */
const getFavItemTransitionStyle = (state, visible, height) => (
  css({
    ...defaultTransitionStyle,
    ...!visible && {
      zIndex: 0,
      marginTop: `-${height}`,
    },
  }).toString()
);

export default {
  leftColumn,
  rightColumn,
  row,
  itemWrapper,
  favItemTransitionDuration,
  getFavItemTransitionStyle,
};
