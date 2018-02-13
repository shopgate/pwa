/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { css } from 'glamor';
import classNames from 'classnames';
import colors from 'Styles/colors';

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
 * The styles for the hint text.
 */
const hint = css({
  position: 'absolute',
  pointerEvents: 'none',
  bottom: 12,
  color: colors.shade4,
  willChange: 'transform',
  transition: `opacity ${easing}`,
  ...ellipsisLine,
}).toString();

/**
 * The styles for the invisible hint text.
 */
const hintInactive = css({
  opacity: 0,
}).toString();

/**
 * Gets the style classes for the underline element.
 * @param {boolean} visible Whether the hint is visible.
 * @return {string} The style classes.
 */
const hintStyles = (visible = false) => (
  classNames(
    hint,
    {
      [hintInactive]: !visible,
    }
  )
);

export default {
  hintStyles,
};
