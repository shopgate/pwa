/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import spring from 'css-spring';
import variables from 'Styles/variables';

const container = css({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
});

const check = css({
  fontSize: '1.2rem',
  paddingRight: variables.gap.small,
});

const options = {
  stiffness: 381.47,
  damping: 15,
};

const moveInFromBottom = css.keyframes(spring(
  { transform: 'translate3d(0, 300%, 0)' },
  { transform: 'translate3d(0, 0, 0)' },
  options
));

const moveOutToTop = css.keyframes(spring(
  { transform: 'translate3d(0, 0, 0)' },
  { transform: 'translate3d(0, -300%, 0)' },
  options
));

const animateIn = css({
  transform: 'translate3d(0, 300%, 0)',
  animation: `${moveInFromBottom} 300ms`,
});

const animateOut = css({
  animation: `${moveOutToTop} 300ms`,
});

export default {
  container,
  check,
  animateIn,
  animateOut,
};
