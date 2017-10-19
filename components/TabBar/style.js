/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const backgroundColor = 'rgba(249, 249, 249, 0.85)';

export default css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: variables.tabBar.height,
  zIndex: 1,
  alignItems: 'center',
  justifyContent: 'space-around',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  ':before': {
    ...variables.blur,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    content: '""',
    background: backgroundColor,
    zIndex: -1,
  },
}).toString();
