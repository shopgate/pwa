/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  position: 'absolute',
  top: 0,
  left: 0,
  background: colors.light,
  width: '100%',
  height: '100%',
  zIndex: 1,
}).toString();

/**
 * Creates the content style.
 * @param {boolean} hasNavigator Whether to add the top offset when the navigator is visible.
 * @param {boolean} hasTabBar Whether to add the bottom offset when the tab bar is visible.
 * @param {boolean} isFullscreen Whether remove all offsets,
 *                  so that it's really fullscreen (including the notch).
 * @param {number} keyboardHeight The space that is taken by the keyboard.
 * @return {string} The content style class.
 */
const content = (hasNavigator = true, hasTabBar = true, isFullscreen = false, keyboardHeight = 0) => {
  const navHeight = hasNavigator ? variables.navigator.height : 0;
  const navAndStatusBarHeight = [
    `${navHeight + variables.statusBar.height}px`,
    `calc(${navHeight}px + var(--safe-area-inset-top))`,
  ];

  const marginBottom = hasTabBar ? [
    `${variables.tabBar.height + keyboardHeight}px`,
    `calc(${variables.tabBar.height + keyboardHeight}px + var(--safe-area-inset-bottom))`,
  ] : keyboardHeight;

  return css({
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    position: 'absolute',
    top: isFullscreen ? 0 : navAndStatusBarHeight,
    marginBottom,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    ':before': {
      position: 'fixed',
      display: 'block',
      top: 0,
      width: '100%',
      height: navAndStatusBarHeight,
      zIndex: 3,
      content: '""',
      transition: 'box-shadow 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
  }).toString();
};

const contentShaded = css({
  ':before': {
    boxShadow: variables.navigator.shadow,
  },
}).toString();

export default {
  container,
  content,
  contentShaded,
};
