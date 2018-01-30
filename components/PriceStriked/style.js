/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const basic = css({
  color: colors.shade3,
  whiteSpace: 'nowrap',
  '& span': {
    position: 'relative',
    ':before': { // The strike-through effect is achieved by using the :before pseudo-class.
      borderColor: 'currentColor',
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: '50%',
    },
  },
}).toString();

/**
 * Returns a class for the rotated strike-through line.
 * @param {number} angle The calculated angle for the strike-through line.
 * @returns {string} Classname
 */
const getAngleStyle = angle => css({
  '& span': {
    ':before': {
      borderTop: '1px solid',
      transform: `rotate(-${angle}deg)`,
    },
  },
}).toString();

export default {
  basic,
  getAngleStyle,
};
