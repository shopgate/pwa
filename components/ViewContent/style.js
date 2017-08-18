/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import { light } from 'Styles/colors';
import { navigator } from 'Styles/variables';

/**
 * Creates the container style.
 * @param {boolean} hasNavigator Whether to add the top offset when the navigator is visible.
 * @return {string} The container style class.
 */
const container = (hasNavigator = true) => cxs({
  background: light,
  overflow: 'auto',
  overflowScrolling: 'touch',
  WebkitOverflowScrolling: 'touch',
  width: '100%',
  position: 'absolute',
  top: hasNavigator ? navigator.height : 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  ':before': {
    position: 'fixed',
    display: 'block',
    top: 0,
    width: '100%',
    height: hasNavigator ? navigator.height : 0,
    zIndex: 3,
    content: '""',
    transition: 'box-shadow 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
});

const containerShaded = cxs({
  ':before': {
    boxShadow: navigator.shadow,
  },
});

export default {
  container,
  containerShaded,
};
