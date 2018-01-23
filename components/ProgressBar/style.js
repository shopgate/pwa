/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import Color from 'color';
import colors from 'Styles/colors';

const progressBarHeight = 4;
const progressBarBackground = Color(colors.accent).lighten(0.4);

const wrapper = css({
  background: progressBarBackground.string(),
  position: 'relative',
  width: '100%',
  height: progressBarHeight,
  overflow: 'hidden',
  transition: 'transform .3s linear',
}).toString();

const innerElement = css({
  transition: 'width .3s linear',
  ':before': {
    content: '""',
    position: 'absolute',
    background: colors.accent,
    top: 0,
    left: 0,
    bottom: 0,
    willChange: 'left, right',
  },
  ':after': {
    content: '""',
    position: 'absolute',
    background: colors.accent,
    top: 0,
    left: 0,
    bottom: 0,
    willChange: 'left, right',
  },
}).toString();

const indeterminateLong = css.keyframes({
  '0%': {
    left: '-35%',
    right: '100%',
  },
  '60%': {
    left: '100%',
    right: '-90%',
  },
  '100%': {
    left: '100%',
    right: '-90%',
  },
});

const indeterminateShort = css.keyframes({
  '0%': {
    left: '-200%',
    right: '100%',
  },
  '60%': {
    left: '107%',
    right: '-8%',
  },
  '100%': {
    left: '107%',
    right: '-8%',
  },
});

const animating = css({
  ':before': {
    animation: `${indeterminateLong} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`,
  },
  ':after': {
    animation: `${indeterminateShort} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite`,
    animationDelay: '1.15s',
  },
}).toString();

export default {
  wrapper,
  innerElement,
  animating,
};
