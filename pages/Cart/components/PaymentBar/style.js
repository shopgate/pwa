/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const duration = 300;
const delay = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const slideInCartPaymentBarDrawer = css.keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
}).toString();

const animation = {
  in: css({
    animationName: slideInCartPaymentBarDrawer,
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationTimingFunction: easing,
    animationDirection: 'normal',
    animationFillMode: 'both',
    animationIterationCount: 1,
  }).toString(),
  out: css({
    display: 'none',
  }).toString(),
};

export default {
  animation,
};
