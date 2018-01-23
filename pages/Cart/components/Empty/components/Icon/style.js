/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const leaveKeyframes = css.keyframes({
  '0%': {
    transform: 'translate3d(0, -15%, 0) rotate(-7deg)',
  },
  '100%': {
    transform: 'translate3d(0, 15%, 0) rotate(7deg)',
  },
}).toString();

const basketKeyframes = css.keyframes({
  '0%': {
    transform: 'translate3d(0, -5%, 0) rotate(-1deg)',
  },
  '100%': {
    transform: 'translate3d(0, 3%, 0) rotate(1deg)',
  },
}).toString();

const shadowKeyframes = css.keyframes({
  '0%': {
    transform: 'scale(.95, .75)',
  },
  '100%': {
    transform: 'scale(1, 1)',
  },
});

const leaveBase = {
  fill: colors.primary,
  transformOrigin: 'center',
  animation: `${leaveKeyframes} linear 0s alternate infinite`,
};

const basketBase = {
  fill: colors.accent,
};

const background = css({
  fill: colors.light,
}).toString();

const shadow = css({
  fill: colors.shade10,
  transformOrigin: 'center',
  animation: `${shadowKeyframes} 500ms linear 0s alternate infinite`,
}).toString();

const leave1 = css({
  ...leaveBase,
  animationDuration: '1000ms',
}).toString();

const leave2 = css({
  ...leaveBase,
  animationDuration: '950ms',
}).toString();

const leave3 = css({
  ...leaveBase,
  animationDuration: '900ms',
}).toString();

const leave4 = css({
  ...leaveBase,
  animationDuration: '850ms',
}).toString();

const leave5 = css({
  ...leaveBase,
  animationDuration: '750ms',
}).toString();

const leave6 = css({
  ...leaveBase,
  animationDuration: '950ms',
}).toString();

const basket = css({
  ...basketBase,
}).toString();

const handle = css({
  ...basketBase,
}).toString();

const basketAnimation = css({
  transformOrigin: 'center center',
  animation: `${basketKeyframes} 500ms linear 0s alternate infinit`,
}).toString();

export default {
  background,
  shadow,
  leave1,
  leave2,
  leave3,
  leave4,
  leave5,
  leave6,
  basket,
  handle,
  basketAnimation,
};
