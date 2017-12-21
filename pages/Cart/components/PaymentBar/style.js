/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const duration = 300;
const delay = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const container = css({
  padding: `${variables.gap.big}px ${variables.gap.small}px`,
  paddingBottom: [
    `${variables.gap.big}px`,
    `calc(${variables.gap.big}px + constant(safe-area-inset-bottom))`,
    `calc(${variables.gap.big}px + env(safe-area-inset-bottom))`,
  ],
  lineHeight: 1.45,
}).toString();

const column = css({
  padding: `0 ${variables.gap.small}px`,
}).toString();

const labelColumn = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
}).toString();

const costsColumn = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}).toString();

const buttonColumn = costsColumn;

const checkoutButton = css({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 1,
}).toString();

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
  container,
  column,
  labelColumn,
  costsColumn,
  buttonColumn,
  checkoutButton,
  animation,
};
