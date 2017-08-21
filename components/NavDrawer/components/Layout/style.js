/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const container = cxs({
  width: '100%',
  height: '100vh',
  maxWidth: '67vw',
  transition: `transform ${duration}ms ${easing}`,
});

const content = cxs({
  height: '100%',
  overflowY: 'scroll',
  color: colors.dark,
  background: colors.light,
  WebkitOverflowScrolling: 'touch',
});

const drawerAnimation = {
  in: cxs({
    transform: 'translate3d(0, 0, 0)',
  }),
  out: cxs({
    transform: 'translate3d(-100%, 0, 0)',
  }),
};

export default {
  container,
  content,
  drawerAnimation,
};
