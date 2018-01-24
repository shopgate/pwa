/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const duration = 300;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const container = css({
  bottom: 0,
  background: colors.light,
  width: '100%',
  color: colors.dark,
}).toString();

const shadow = css({
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
}).toString();

const content = css({
  maxHeight: `calc(100vh - ${variables.navigator.height}px)`, // 56px (Sheet Header)
  overflowY: 'scroll',
  WebkitOverflowScrolling: 'touch',
}).toString();

const slideInSheetDrawer = css.keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const slideOutSheetDrawer = css.keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const drawerAnimation = {
  in: css({
    animation: `${slideInSheetDrawer} ${duration}ms 1 both ${easing}`,
  }).toString(),
  out: css({
    animation: `${slideOutSheetDrawer} ${duration}ms 1 both ${easing}`,
  }).toString(),
};

export default {
  container,
  shadow,
  content,
  drawerAnimation,
};
