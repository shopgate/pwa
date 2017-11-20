/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

/**
 * Variables for the text field styles.
 */

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * The style object for a one line text element with an ellipsis on overflow.
 */
const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

/**
 * The styles for the container element.
 */
const container = css({
  position: 'relative',
  height: 72,
  width: '100%',
}).toString();

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
 * The styles for the underline wrapper element.
 */
const underlineWrapper = css({
  position: 'absolute',
  width: '100%',
  borderBottom: `1px solid ${colors.shade5}`,
  bottom: 10,
}).toString();

/**
 * The styles for the underline element.
 * @param {boolean} focused Whether the input field is focused.
 * @param {boolean} error Whether the input field shows an error message.
 * @return {string} The style class.
 */
const underline = css({
  position: 'relative',
  width: '100%',
  top: 1,
  borderBottomWidth: 2,
  borderBottomStyle: 'solid',
  willChange: 'transform',
  transition: `transform ${easing}`,
}).toString();

/**
 * The styles for the input field.
 */
const input = css({
  position: 'absolute',
  width: '100%',
  top: 38,
  outline: 0,
  padding: 0,
}).toString();

/**
 * The styles for the error label.
 */
const labelError = css({
  color: colors.error,
}).toString();

/**
 * The styles for the regular label.
 */
const labelRegular = css({
  color: colors.shade4,
}).toString();

/**
 * The styles for the focused label.
 */
const labelFocus = css({
  color: colors.primary,
}).toString();

/**
 * The styles for the floating label.
 */
const labelFloating = css({
  transform: 'translate3d(0, -22px, 0) scale3d(0.75, 0.75, 0.75)',
}).toString();

const label = css({
  position: 'absolute',
  left: 0,
  top: 38,
  lineHeight: 1.375,
  pointerEvents: 'none',
  userSelect: 'none',
  transformOrigin: 'left top 0px',
  willChange: 'transform, color',
  transition: `transform ${easing}, color ${easing}`,
  ...ellipsisLine,
}).toString();

/**
 * The styles for the error message.
 */
const error = css({
  position: 'relative',
  bottom: 17,
  fontSize: '0.75rem',
  lineHeight: 1,
  color: colors.error,
  ...ellipsisLine,
}).toString();

export default {
  container,
  error,
  hint,
  hintInactive,
  input,
  label,
  labelError,
  labelRegular,
  labelFocus,
  labelFloating,
  underline,
  underlineWrapper,
};
