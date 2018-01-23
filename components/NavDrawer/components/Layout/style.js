/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const container = css({
  width: '100%',
  height: '100vh',
  maxWidth: '67vw',
  transition: `transform ${duration}ms ${easing}`,
}).toString();

const content = css({
  height: '100%',
  overflowY: 'scroll',
  color: colors.dark,
  background: colors.light,
  WebkitOverflowScrolling: 'touch',
}).toString();

const drawerAnimation = {
  in: css({
    transform: 'translate3d(0, 0, 0)',
  }).toString(),
  out: css({
    transform: 'translate3d(-100%, 0, 0)',
  }).toString(),
};

export default {
  container,
  content,
  drawerAnimation,
};
