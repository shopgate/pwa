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
 * The styles for the placeholder text.
 */
const placeholder = css({
  position: 'absolute',
  pointerEvents: 'none',
  top: 24,
  color: themeConfig.colors.shade4,
  willChange: 'transform',
  transition: `opacity ${easing}`,
  ...ellipsisLine,
}).toString();

/**
 * The styles for the invisible hint text.
 */
const placeholderInactive = css({
  opacity: 0,
}).toString();

/**
 * Gets the style classes for the underline element.
 * @param {boolean} visible Whether the hint is visible.
 * @return {string} The style classes.
 */
const placeholderStyles = (visible = false) => (
  classNames(
    placeholder,
    {
      [placeholderInactive]: !visible,
    }
  )
);

export default {
  placeholderStyles,
};
