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
  color: `var(--color-text-medium-emphasis, ${themeConfig.colors.shade6})`,
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
 * Additional left spacing when a left element is present
 */
const leftOffset = css({
  left: 'var(--form-element-left-offset, 26px)',
  width: 'calc(100% - var(--form-element-left-offset, 26px))',
}).toString();

/**
 * Gets the style classes for the underline element.
 * @param {boolean} visible Whether the hint is visible.
 * @param {boolean} hasLeftElement - Whether a left element is present.
 * @return {string} The style classes.
 */
const placeholderStyles = (visible = false, hasLeftElement = false) => (
  classNames(
    placeholder,
    {
      [placeholderInactive]: !visible,
      [leftOffset]: hasLeftElement,
    }
  )
);

export default {
  placeholderStyles,
};
