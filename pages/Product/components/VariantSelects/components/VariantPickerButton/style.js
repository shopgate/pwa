/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import Color from 'color';

const shakeButton = css.keyframes({
  '0%': {
    transform: 'translate3d(0, 0, 0)',
  },
  '25%': {
    transform: 'translate3d(-4px, 0, 0)',
  },
  '50%': {
    transform: 'translate3d(4px, 0, 0)',
  },
  '75%': {
    transform: 'translate3d(-4px, 0, 0)',
  },
  '100%': {
    transform: 'translate3d(4px, 0, 0)',
  },
});

const pickerButton = css({
  transition: 'background 0.2s linear, color 0.2s linear',
}).toString();

const pickerButtonHighlighted = css({
  transformOrigin: '50% 50%',
  animation: `${shakeButton} 0.30s linear`,
  backgroundColor: Color(colors.primary).alpha(0.29).string(),
}).toString();

export default {
  pickerButton,
  pickerButtonHighlighted,
};
