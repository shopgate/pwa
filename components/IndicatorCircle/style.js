/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const rotate = css.keyframes({
  '100%': { transform: 'rotate(360deg)' },
});

const spinner = css({
  animation: `${rotate} 1.6s linear infinite`,
  margin: 'auto',
  transformOrigin: 'center center',
  maxWidth: '100%',
  maxHeight: '100%',
}).toString();

const dash = css.keyframes({
  '0%': {
    strokeDasharray: '1, 200',
    strokeDashoffset: '0',
  },
  '50%': {
    strokeDasharray: '89, 200',
    strokeDashoffset: '-35px',
  },
  '100%': {
    strokeDasharray: '89, 200',
    strokeDashoffset: '-124px',
  },
});

/**
 * Styles for the rotating circle.
 * @param {string} color The color of the circle. Default color is "accent".
 * @param {string} strokeWidth The stroke width of the circle.
 * @return {string} CSS class name.
 */
const circle = (color, strokeWidth) => css({
  animation: `${dash} 1.2s ease-in-out infinite`,
  fill: 'none',
  stroke: color,
  strokeDasharray: '1, 200',
  strokeDashoffset: 0,
  strokeLinecap: 'round',
  strokeMiterlimit: 10,
  strokeWidth,
}).toString();

export default {
  spinner,
  circle,
};
