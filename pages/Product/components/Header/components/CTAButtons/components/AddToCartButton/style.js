/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import spring from 'css-spring';
import colors from 'Styles/colors';

const options = {
  stiffness: 381.47,
  damping: 15,
};

/**
 * Keyframe animations to create spring animation.
 * spring(..) automatically calculates all steps for the keyframe animation.
 */
const springFromTopKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, 300%, 0)' },
  { transform: 'translate3d(0, -50%, 0)' },
  options
));

const springFromBottomKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, -300%, 0)' },
  { transform: 'translate3d(0, -50%, 0)' },
  options
));

const springToTopKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, -50%, 0)' },
  { transform: 'translate3d(0, 300%, 0)' },
  options
));

const springToBottomKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, -50%, 0)' },
  { transform: 'translate3d(0, -300%, 0)' },
  options
));

const springFromBottom = css({
  animation: `${springFromBottomKeyframes} 600ms`,
}).toString();

const springFromTop = css({
  animation: `${springFromTopKeyframes} 600ms`,
}).toString();

const springToTop = css({
  animation: `${springToTopKeyframes} 600ms`,
}).toString();

const springToBottom = css({
  animation: `${springToBottomKeyframes} 600ms`,
}).toString();

/**
 * Circular button and container for the icons.
 */
const button = css({
  transition: 'background 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  borderRadius: '50%',
  width: 56,
  height: 56,
  position: 'relative',
  fontSize: '1.5rem',
  outline: 0,
  boxShadow: '0 8px 13px rgba(0, 0, 0, 0.2)',
  zIndex: 2, // Prevents the icons to be visible outside of the circle
  overflow: 'hidden',
}).toString();

/**
 * Styling that is applied to the button when cart icon is shown.
 */
const buttonReady = css({
  background: colors.primary,
  color: colors.primaryContrast,
}).toString();

/**
 * Styling that is applied to the button when checkmark is shown.
 */
const buttonSuccess = css({
  background: colors.primaryContrast,
  color: colors.primary,
}).toString();

/**
 * Basic icon style that is always applied to all icons.
 */
const icon = css({
  transition: 'opacity 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  opacity: 1,
  position: 'absolute',
  left: 0,
  right: 0,
  height: 24,
  width: 24,
  top: '50%',
  margin: 'auto',
}).toString();

/**
 * Icon style that is applied only to the spinner icon.
 */
const spinnerIcon = css({
  transform: 'translate3d(0, -50%, 0)',
}).toString();

export default {
  button,
  buttonReady,
  buttonSuccess,
  icon,
  spinnerIcon,
  springFromBottom,
  springFromTop,
  springToBottom,
  springToTop,
};
