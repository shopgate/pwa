/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = cxs({
  position: 'absolute',
  top: 0,
  left: 0,
  background: colors.light,
  width: '100%',
  height: '100%',
  zIndex: 1,
});

/**
 * Creates the content style.
 * @param {boolean} hasNavigator Whether to add the top offset when the navigator is visible.
 * @return {string} The content style class.
 */
const content = (hasNavigator = true) => cxs({
  background: colors.light,
  overflow: 'auto',
  overflowScrolling: 'touch',
  WebkitOverflowScrolling: 'touch',
  width: '100%',
  position: 'absolute',
  top: hasNavigator ? variables.navigator.height : 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  ':before': {
    position: 'fixed',
    display: 'block',
    top: 0,
    width: '100%',
    height: hasNavigator ? variables.navigator.height : 0,
    zIndex: 3,
    content: '""',
    transition: 'box-shadow 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
});

const contentShaded = cxs({
  ':before': {
    boxShadow: variables.navigator.shadow,
  },
});

export default {
  container,
  content,
  contentShaded,
};
