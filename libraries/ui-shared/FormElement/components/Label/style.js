import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The style object for a one line text element with an ellipsis on overflow.
 */
const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * The styles for the error label.
 */
const labelError = css({
  color: themeConfig.colors.error,
}).toString();

/**
 * Regular label is hidden, because placeholder is visible
 */
const labelRegular = css({
  opacity: 0,
}).toString();

/**
 * The styles for the focused label.
 */
const labelFocus = css({
  color: themeConfig.colors.focus,
}).toString();

/**
 * The styles for the floating label.
 */
const labelFloating = css({
  transform: 'translate3d(0, -22px, 0) scale3d(0.75, 0.75, 0.75)',
  opacity: 1,
}).toString();

/**
 * The basic styles for the label.
 * @type {string}
 */
const label = css({
  position: 'absolute',
  left: 0,
  top: 24,
  lineHeight: '19px',
  pointerEvents: 'none',
  userSelect: 'none',
  color: themeConfig.colors.shade12,
  transformOrigin: 'left top 0px',
  willChange: 'transform, color',
  overflow: 'visible',
  transition: `transform ${easing}, color ${easing}`,
  ...ellipsisLine,
}).toString();

/**
 * Gets the style classes for the label.
 * @param {boolean} focused Whether the input field is focused.
 * @param {boolean} floating Whether the label is floating.
 * @param {boolean} error Whether the input field shows an error message.
 * @return {string} The style classes.
 */
const labelStyles = (focused = false, floating = false, error = false) => (
  classNames(
    label,
    {
      [labelFloating]: floating,
      [labelRegular]: !focused,
      [labelFocus]: !error && focused,
      [labelError]: error && focused,
    }
  )
);

export default {
  labelStyles,
};
